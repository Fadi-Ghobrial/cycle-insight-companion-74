
import { supabase } from "@/integrations/supabase/client";
import { connectToAppleHealth, fetchHealthData } from "@/lib/healthkit";
import { connectToSamsungHealth, fetchSamsungHealthData } from "@/lib/samsunghealth";
import { HealthDataSource } from "@/types";

export interface HealthConnection {
  id: string;
  app_type: 'apple_health' | 'samsung_health';
  enabled: boolean;
  last_sync_at: Date | null;
  sync_settings: Record<string, any>;
}

export async function getHealthConnections(): Promise<HealthConnection[]> {
  const { data, error } = await supabase
    .from('health_app_connections')
    .select('*');

  if (error) {
    console.error('Error fetching health connections:', error);
    throw error;
  }

  return data;
}

export async function connectHealthApp(appType: 'apple_health' | 'samsung_health'): Promise<boolean> {
  try {
    let connected = false;
    
    if (appType === 'apple_health') {
      connected = await connectToAppleHealth();
    } else {
      connected = await connectToSamsungHealth();
    }

    if (connected) {
      const { error } = await supabase
        .from('health_app_connections')
        .upsert({
          app_type: appType,
          enabled: true,
          last_sync_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    return connected;
  } catch (error) {
    console.error(`Error connecting to ${appType}:`, error);
    return false;
  }
}

export async function syncHealthData(source: HealthDataSource): Promise<boolean> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Sync last 30 days
    const endDate = new Date();
    
    const fetchFunction = source.type === 'apple_health' ? fetchHealthData : fetchSamsungHealthData;
    const healthData = await fetchFunction('menstrual_data', startDate, endDate);

    if (healthData.length > 0) {
      const { error } = await supabase
        .from('health_data_records')
        .insert(
          healthData.map(data => ({
            source: source.type,
            data_type: 'menstrual_data',
            value: data,
            recorded_at: data.date,
          }))
        );

      if (error) throw error;

      // Update last sync timestamp
      await supabase
        .from('health_app_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('app_type', source.type);
    }

    return true;
  } catch (error) {
    console.error('Error syncing health data:', error);
    return false;
  }
}

export async function disconnectHealthApp(sourceId: string): Promise<void> {
  const { error } = await supabase
    .from('health_app_connections')
    .delete()
    .eq('id', sourceId);

  if (error) {
    console.error('Error disconnecting health app:', error);
    throw error;
  }
}

export async function getHealthData(startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from('health_data_records')
    .select('*')
    .gte('recorded_at', startDate.toISOString())
    .lte('recorded_at', endDate.toISOString())
    .order('recorded_at', { ascending: true });

  if (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }

  return data;
}
