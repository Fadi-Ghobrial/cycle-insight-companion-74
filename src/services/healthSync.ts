
import { supabase } from "@/integrations/supabase/client";
import { connectToAppleHealth, fetchHealthData } from "@/lib/healthkit";
import { connectToSamsungHealth, fetchSamsungHealthData } from "@/lib/samsunghealth";
import { HealthDataSource } from "@/types";
import { Json } from "@/integrations/supabase/types";

export interface HealthConnection {
  id: string;
  app_type: 'apple_health' | 'samsung_health';
  enabled: boolean;
  last_sync_at: Date | null;
  sync_settings: Json; // Changed from Record<string, any> to Json
  user_id: string;
}

export async function getHealthConnections(): Promise<HealthConnection[]> {
  const { data, error } = await supabase
    .from('health_app_connections')
    .select('*');

  if (error) {
    console.error('Error fetching health connections:', error);
    throw error;
  }

  // Cast the data to ensure type compatibility
  return data.map(connection => ({
    ...connection,
    app_type: connection.app_type as 'apple_health' | 'samsung_health',
    last_sync_at: connection.last_sync_at ? new Date(connection.last_sync_at) : null
  }));
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
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      const { error } = await supabase
        .from('health_app_connections')
        .upsert({
          app_type: appType,
          enabled: true,
          last_sync_at: new Date().toISOString(),
          user_id: user.id
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
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      const records = healthData.map(data => ({
        source: source.type,
        data_type: 'menstrual_data',
        value: data as Json,
        recorded_at: data.date,
        user_id: user.id
      }));

      const { error } = await supabase
        .from('health_data_records')
        .insert(records);

      if (error) throw error;

      // Update last sync timestamp
      await supabase
        .from('health_app_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('app_type', source.type)
        .eq('user_id', user.id);
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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('No authenticated user found');
    return [];
  }
  
  const { data, error } = await supabase
    .from('health_data_records')
    .select('*')
    .eq('user_id', user.id)
    .gte('recorded_at', startDate.toISOString())
    .lte('recorded_at', endDate.toISOString())
    .order('recorded_at', { ascending: true });

  if (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }

  return data;
}
