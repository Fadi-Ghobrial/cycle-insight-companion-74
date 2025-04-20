
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { IoTReminder, HealthDataSource } from '@/types';
import { format } from 'date-fns';
import { AppleIcon, Clock, PhoneIcon, WatchIcon, SmartphoneIcon, Trash2Icon, PlusIcon, CheckIcon, XIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  getHealthConnections, 
  connectHealthApp, 
  disconnectHealthApp, 
  syncHealthData,
  type HealthConnection 
} from '@/services/healthSync';

// Missing declarations for the IoT functions
const checkIoTConnectivity = async (deviceType: string): Promise<boolean> => {
  // Simulate connectivity check
  return new Promise(resolve => setTimeout(() => resolve(true), 1000));
};

const sendTestNotification = async (deviceType: string, message: string): Promise<boolean> => {
  // Simulate sending notification
  return new Promise(resolve => setTimeout(() => resolve(true), 1000));
};

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [isConnectingHealth, setIsConnectingHealth] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [reminderInput, setReminderInput] = useState({
    type: 'smart_mirror',
    message: '',
    time: '08:00',
    repeat: false,
    enabled: true
  });
  
  const { 
    healthSources, 
    connectHealthSource, 
    disconnectHealthSource,
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    reset,
    undo
  } = useAppStore();
  const [healthConnections, setHealthConnections] = useState<HealthConnection[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadHealthConnections();
  }, []);

  const loadHealthConnections = async () => {
    try {
      const connections = await getHealthConnections();
      setHealthConnections(connections);
    } catch (error) {
      console.error('Error loading health connections:', error);
      toast({
        title: "Error loading connections",
        description: "Could not load health app connections.",
        variant: "destructive"
      });
    }
  };
  
  // Connect to health platforms
  const handleHealthConnect = async (platform: 'apple_health' | 'samsung_health') => {
    setIsConnectingHealth(true);
    
    try {
      const connected = await connectHealthApp(platform);
      
      if (connected) {
        await loadHealthConnections();
        toast({
          title: "Connected successfully",
          description: `Connected to ${platform === 'apple_health' ? 'Apple Health' : 'Samsung Health'}`
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Could not connect to health platform. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "An error occurred while connecting to health platform.",
        variant: "destructive"
      });
    } finally {
      setIsConnectingHealth(false);
    }
  };
  
  // Disconnect from health platforms
  const handleHealthDisconnect = async (sourceId: string) => {
    try {
      await disconnectHealthApp(sourceId);
      await loadHealthConnections();
      toast({
        title: "Disconnected",
        description: "Health platform disconnected successfully."
      });
    } catch (error) {
      toast({
        title: "Error disconnecting",
        description: "Could not disconnect from health platform.",
        variant: "destructive"
      });
    }
  };

  // Sync health data
  const handleSyncData = async (connection: HealthConnection) => {
    setIsSyncing(true);
    try {
      const success = await syncHealthData({
        id: connection.id,
        type: connection.app_type,
        connected: connection.enabled,
        lastSynced: connection.last_sync_at
      });

      if (success) {
        await loadHealthConnections();
        toast({
          title: "Sync successful",
          description: "Health data synchronized successfully."
        });
      } else {
        toast({
          title: "Sync failed",
          description: "Could not sync health data. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Sync error",
        description: "An error occurred while syncing health data.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Add a new IoT reminder
  const handleAddReminder = () => {
    const [hours, minutes] = reminderInput.time.split(':').map(Number);
    const triggerTime = new Date();
    triggerTime.setHours(hours, minutes, 0, 0);
    
    addReminder({
      type: reminderInput.type,
      title: reminderInput.message, // Add title property
      message: reminderInput.message,
      triggerTime,
      repeat: reminderInput.repeat,
      repeatInterval: 'daily',
      enabled: reminderInput.enabled,
      userId: 'test-user',
      isRead: false, // Add isRead property
      isActive: true // Add isActive property
    });
    
    toast({
      title: "Reminder added",
      description: "Your new IoT reminder has been added."
    });
    
    setIsAddReminderOpen(false);
    setReminderInput({
      type: 'smart_mirror',
      message: '',
      time: '08:00',
      repeat: false,
      enabled: true
    });
  };
  
  // Toggle reminder enabled state
  const toggleReminderEnabled = (reminder: IoTReminder) => {
    updateReminder(reminder.id, { enabled: !reminder.enabled });
  };
  
  // Test IoT connectivity and send a test notification
  const testIoTConnectivity = async (reminderType: string) => {
    try {
      const isConnected = await checkIoTConnectivity(reminderType);
      
      if (isConnected) {
        const success = await sendTestNotification(reminderType, "This is a test notification from CycleInsight");
        
        if (success) {
          toast({
            title: "Test successful",
            description: "Test notification sent successfully."
          });
        } else {
          toast({
            title: "Test failed",
            description: "Could not send test notification.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Device not connected",
          description: "IoT device not found or not connected.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test error",
        description: "An error occurred while testing IoT connectivity.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>
          
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    disabled
                    value="test@example.com" 
                  />
                  <p className="text-xs text-gray-500">
                    This is your registered email address
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    value="Test User" 
                    onChange={() => {}} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-1">Notifications</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Period Reminders</span>
                      <p className="text-sm text-gray-500">
                        Get reminded before your predicted period
                      </p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-1">Data Management</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      onClick={undo}
                    >
                      Undo Last Action
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
                          reset();
                          toast({
                            title: "Data reset",
                            description: "All your cycle data has been reset."
                          });
                        }
                      }}
                    >
                      Reset All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Health Connections Tab */}
          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health App Connections</CardTitle>
                <CardDescription>Connect to health apps to sync your cycle data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {healthConnections.length > 0 ? (
                  <div className="space-y-4">
                    {healthConnections.map((connection) => (
                      <div key={connection.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {connection.app_type === 'apple_health' ? (
                              <AppleIcon className="h-5 w-5 text-gray-700" />
                            ) : (
                              <SmartphoneIcon className="h-5 w-5 text-gray-700" />
                            )}
                            <span className="font-medium">
                              {connection.app_type === 'apple_health' ? 'Apple Health' : 'Samsung Health'}
                            </span>
                            {connection.enabled && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Connected
                              </Badge>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500" 
                            onClick={() => handleHealthDisconnect(connection.id)}
                          >
                            <Trash2Icon className="h-4 w-4 mr-1" />
                            Disconnect
                          </Button>
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-3">
                          {connection.last_sync_at ? (
                            <span>Last synced: {format(new Date(connection.last_sync_at), 'MMM d, yyyy h:mm a')}</span>
                          ) : (
                            <span>Never synced</span>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={isSyncing}
                          onClick={() => handleSyncData(connection)}
                        >
                          {isSyncing ? 'Syncing...' : 'Sync Data Now'}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="mb-3 text-gray-500">No health apps connected</div>
                    <p className="text-sm text-gray-500 mb-4">
                      Connect your health apps to automatically sync your cycle data
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col gap-3 mt-4">
                  <Button 
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                    disabled={isConnectingHealth}
                    onClick={() => handleHealthConnect('apple_health')}
                  >
                    <AppleIcon className="h-5 w-5" />
                    {isConnectingHealth ? 'Connecting...' : 'Connect Apple Health'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                    disabled={isConnectingHealth}
                    onClick={() => handleHealthConnect('samsung_health')}
                  >
                    <SmartphoneIcon className="h-5 w-5" />
                    {isConnectingHealth ? 'Connecting...' : 'Connect Samsung Health'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>IoT Reminders</CardTitle>
                  <CardDescription>Manage your smart device reminders</CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsAddReminderOpen(true)}>
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Reminder
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                {reminders.length > 0 ? (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          {reminder.type === 'smart_mirror' ? (
                            <div className="bg-gray-100 p-2 rounded-full">
                              <PhoneIcon className="h-5 w-5 text-gray-700" />
                            </div>
                          ) : (
                            <div className="bg-gray-100 p-2 rounded-full">
                              <WatchIcon className="h-5 w-5 text-gray-700" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {reminder.message || "Reminder"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {reminder.triggerTime && format(reminder.triggerTime, 'h:mm a')}
                              {reminder.repeat && <span className="text-xs ml-2">(Daily)</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={reminder.enabled}
                            onCheckedChange={() => toggleReminderEnabled(reminder)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteReminder(reminder.id)}
                          >
                            <Trash2Icon className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="mb-2 text-gray-500">No reminders set</div>
                    <p className="text-sm text-gray-500">
                      Add reminders to send notifications to your IoT devices
                    </p>
                  </div>
                )}
                
                <div className="mt-6 border-t pt-4">
                  <p className="font-medium mb-3">Test Connectivity</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testIoTConnectivity('smart_mirror')}
                    >
                      Test Smart Mirror
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => testIoTConnectivity('smart_watch')}
                    >
                      Test Smart Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Reminder Dialog */}
      <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
            <DialogDescription>
              Create a new reminder for your IoT devices
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminder-type" className="col-span-4">Device Type</Label>
              <select
                id="reminder-type"
                className="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={reminderInput.type}
                onChange={(e) => setReminderInput({...reminderInput, type: e.target.value as 'smart_mirror' | 'smart_watch'})}
              >
                <option value="smart_mirror">Smart Mirror</option>
                <option value="smart_watch">Smart Watch</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminder-message" className="col-span-4">Message</Label>
              <Input
                id="reminder-message"
                className="col-span-4"
                value={reminderInput.message}
                onChange={(e) => setReminderInput({...reminderInput, message: e.target.value})}
                placeholder="Take your medication"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminder-time" className="col-span-4">Time</Label>
              <Input
                id="reminder-time"
                className="col-span-4"
                type="time"
                value={reminderInput.time}
                onChange={(e) => setReminderInput({...reminderInput, time: e.target.value})}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="reminder-repeat" className="flex-1">Repeat Daily</Label>
              <Switch
                id="reminder-repeat"
                checked={reminderInput.repeat}
                onCheckedChange={(checked) => setReminderInput({...reminderInput, repeat: checked})}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="reminder-enabled" className="flex-1">Enabled</Label>
              <Switch
                id="reminder-enabled"
                checked={reminderInput.enabled}
                onCheckedChange={(checked) => setReminderInput({...reminderInput, enabled: checked})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddReminderOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddReminder}>
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Settings;
