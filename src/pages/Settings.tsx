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
      message: reminderInput.message,
      triggerTime,
      repeat: reminderInput.repeat,
      repeatInterval: 'daily',
      enabled: reminderInput.enabled,
      userId: 'test-user' // Add userId to fix type error
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
