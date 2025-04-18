
import { App } from '@capacitor/app';
import { Storage } from '@capacitor/storage';
import { connectToAppleHealth, fetchHealthData, syncCycleData } from './healthkit';
import { connectToSamsungHealth, fetchSamsungHealthData, syncDataToSamsungHealth } from './samsunghealth';
import { supabase } from '@/integrations/supabase/client';
import { HealthDataSource } from '@/types';

// Check if the app is running on a mobile device
export const isMobileApp = (): boolean => {
  return window.location.href.includes('capacitor://') || 
         window.location.href.includes('ionic://');
};

// Check if the app is running on Android
export const isAndroid = (): boolean => {
  return /android/i.test(navigator.userAgent);
};

// Check if the app is running on iOS
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Determine the appropriate health service based on platform
export const getHealthService = (): 'apple_health' | 'samsung_health' | 'web' => {
  if (isIOS()) return 'apple_health';
  if (isAndroid()) return 'samsung_health';
  return 'web';
};

// Connect to platform-specific health service
export const connectToHealthService = async (): Promise<boolean> => {
  const platform = getHealthService();
  
  console.log(`Connecting to health service for platform: ${platform}`);
  
  if (platform === 'apple_health') {
    return await connectToAppleHealth();
  } else if (platform === 'samsung_health') {
    return await connectToSamsungHealth();
  } else {
    // For web, we'll use local storage sync instead
    await Storage.set({
      key: 'health_service_connected',
      value: 'true'
    });
    return true;
  }
};

// Synchronize data from the platform's health service to Supabase
export const syncFromHealthService = async (
  dataType: string, 
  startDate: Date, 
  endDate: Date
): Promise<boolean> => {
  try {
    const platform = getHealthService();
    let healthData;
    
    if (platform === 'apple_health') {
      healthData = await fetchHealthData(dataType, startDate, endDate);
    } else if (platform === 'samsung_health') {
      healthData = await fetchSamsungHealthData(dataType, startDate, endDate);
    } else {
      // On web, get data from Supabase directly
      return true;
    }
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    // Store the synced data in local storage for offline access
    await Storage.set({
      key: `health_data_${dataType}`,
      value: JSON.stringify(healthData)
    });
    
    // Sync to Supabase if we have an internet connection
    const records = healthData.map((data: any) => ({
      source: platform,
      data_type: dataType,
      value: data,
      recorded_at: data.date,
      user_id: user.id
    }));

    const { error } = await supabase
      .from('health_data_records')
      .insert(records);

    if (error) {
      console.error('Error syncing to Supabase:', error);
      return false;
    }
    
    // Update last sync timestamp
    await supabase
      .from('health_app_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('app_type', platform)
      .eq('user_id', user.id);
    
    return true;
  } catch (error) {
    console.error('Error during health data sync:', error);
    return false;
  }
};

// For future implementations:
// - Add background sync support
// - Add offline support with queue system
// - Add retry logic for failed syncs
