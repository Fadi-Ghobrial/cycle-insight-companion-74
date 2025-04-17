
import React, { useState } from 'react';
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

// Apple Health integration
import { connectToAppleHealth } from '@/lib/healthkit';
// Samsung Health integration
import { connectToSamsungHealth } from '@/lib/samsunghealth';
// IoT integration
import { checkIoTConnectivity, sendTestNotification } from '@/lib/iot';

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
  
  // Connect to health platforms
  const handleHealthConnect = async (platform: 'apple_health' | 'samsung_health') => {
    setIsConnectingHealth(true);
    
    try {
      let connected = false;
      let source: HealthDataSource;
      
      if (platform === 'apple_health') {
        connected = await connectToAppleHealth();
        source = {
          id: crypto.randomUUID(),
          type: 'apple_health',
          connected,
          lastSynced: connected ? new Date() : undefined
        };
      } else {
        connected = await connectToSamsungHealth();
        source = {
          id: crypto.randomUUID(),
          type: 'samsung_health',
          connected,
          lastSynced: connected ? new Date() : undefined
        };
      }
      
      if (connected) {
        connectHealthSource(source);
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
  const handleHealthDisconnect = (sourceId: string) => {
    disconnectHealthSource(sourceId);
    toast({
      title: "Disconnected",
      description: "Health platform disconnected successfully."
    });
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
                <CardTitle>Health Platform Integration</CardTitle>
                <CardDescription>
                  Connect to health platforms to sync your health data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Apple Health */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black rounded-full text-white">
                        <AppleIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Apple Health</h3>
                        <p className="text-sm text-gray-500">
                          Sync cycle data with Apple Health
                        </p>
                      </div>
                    </div>
                    
                    {healthSources.find(s => s.type === 'apple_health' && s.connected) ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <CheckIcon size={12} />
                          Connected
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const source = healthSources.find(s => s.type === 'apple_health');
                            if (source) handleHealthDisconnect(source.id);
                          }}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline"
                        disabled={isConnectingHealth}
                        onClick={() => handleHealthConnect('apple_health')}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Samsung Health */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-full text-white">
                        <SmartphoneIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Samsung Health</h3>
                        <p className="text-sm text-gray-500">
                          Sync cycle data with Samsung Health
                        </p>
                      </div>
                    </div>
                    
                    {healthSources.find(s => s.type === 'samsung_health' && s.connected) ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <CheckIcon size={12} />
                          Connected
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const source = healthSources.find(s => s.type === 'samsung_health');
                            if (source) handleHealthDisconnect(source.id);
                          }}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline"
                        disabled={isConnectingHealth}
                        onClick={() => handleHealthConnect('samsung_health')}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    Connecting to health platforms allows CycleInsight to sync your cycle data and
                    access relevant health metrics like sleep, activity, and heart rate to improve
                    cycle predictions.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Permissions</CardTitle>
                <CardDescription>
                  Manage what data is shared with health platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Period Data</span>
                      <p className="text-sm text-gray-500">
                        Share period dates with health platforms
                      </p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Symptoms</span>
                      <p className="text-sm text-gray-500">
                        Share symptom data with health platforms
                      </p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Cycle Predictions</span>
                      <p className="text-sm text-gray-500">
                        Share cycle predictions with health platforms
                      </p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* IoT Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>IoT-Enabled Reminders</CardTitle>
                    <CardDescription>
                      Set up reminders on your smart home devices
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsAddReminderOpen(true)}
                    className="bg-cycle-primary hover:bg-cycle-secondary"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Reminder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {reminders.length > 0 ? (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <div key={reminder.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full text-white ${
                              reminder.type === 'smart_mirror' ? 'bg-cyan-600' :
                              reminder.type === 'smart_light' ? 'bg-yellow-500' :
                              'bg-gray-600'
                            }`}>
                              {reminder.type === 'smart_mirror' ? <WatchIcon size={20} /> : 
                               reminder.type === 'smart_light' ? <Clock size={20} /> :
                               <PhoneIcon size={20} />}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{reminder.message}</h3>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <span>
                                  {format(new Date(reminder.triggerTime), 'h:mm a')}
                                </span>
                                {reminder.repeat && (
                                  <Badge variant="outline" className="text-xs">Repeat Daily</Badge>
                                )}
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
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this reminder?")) {
                                  deleteReminder(reminder.id);
                                  toast({
                                    title: "Reminder deleted",
                                    description: "Your reminder has been deleted."
                                  });
                                }
                              }}
                            >
                              <Trash2Icon className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">
                      No IoT reminders set up yet.
                    </p>
                    <Button 
                      onClick={() => setIsAddReminderOpen(true)}
                      className="bg-cycle-primary hover:bg-cycle-secondary"
                    >
                      Create First Reminder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connected IoT Devices</CardTitle>
                <CardDescription>
                  Configure your smart home devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-600 rounded-full text-white">
                          <WatchIcon size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium">Smart Mirror</h3>
                          <p className="text-sm text-gray-500">
                            Display cycle information on your mirror
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => testIoTConnectivity('smart_mirror')}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500 rounded-full text-white">
                          <Clock size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium">Smart Lighting</h3>
                          <p className="text-sm text-gray-500">
                            Color cues for cycle phases
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => testIoTConnectivity('smart_light')}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-600 rounded-full text-white">
                          <PhoneIcon size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium">Smart Scale</h3>
                          <p className="text-sm text-gray-500">
                            Track weight changes throughout cycle
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline"
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Add Reminder Dialog */}
        <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add IoT Reminder</DialogTitle>
              <DialogDescription>
                Create a new reminder for your smart home devices
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type</Label>
                <select
                  id="device-type"
                  className="w-full p-2 border rounded-md"
                  value={reminderInput.type}
                  onChange={(e) => setReminderInput({...reminderInput, type: e.target.value})}
                >
                  <option value="smart_mirror">Smart Mirror</option>
                  <option value="smart_light">Smart Light</option>
                  <option value="mobile">Mobile Phone</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Reminder Message</Label>
                <Input
                  id="message"
                  placeholder="Enter reminder message"
                  value={reminderInput.message}
                  onChange={(e) => setReminderInput({...reminderInput, message: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={reminderInput.time}
                  onChange={(e) => setReminderInput({...reminderInput, time: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="repeat"
                  checked={reminderInput.repeat}
                  onCheckedChange={(checked) => setReminderInput({...reminderInput, repeat: checked})}
                />
                <Label htmlFor="repeat">Repeat Daily</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={reminderInput.enabled}
                  onCheckedChange={(checked) => setReminderInput({...reminderInput, enabled: checked})}
                />
                <Label htmlFor="enabled">Enable Reminder</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddReminderOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddReminder}
                disabled={!reminderInput.message}
                className="bg-cycle-primary hover:bg-cycle-secondary"
              >
                Add Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Settings;
