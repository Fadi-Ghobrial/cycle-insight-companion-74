
import React, { useState } from 'react';
import { Bell, Calendar, BellRing, BellOff, Clock, CalendarArrowDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { scheduleReminder } from '@/services/notificationService';

const PeriodReminderSettings: React.FC = () => {
  const { reminders, updateReminder, deleteReminder, cycles, currentCycleId } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);
  const predictions = currentCycle?.predictions;
  
  // Filter for period-related reminders
  const periodReminders = reminders.filter(reminder => 
    reminder.type === 'period' && reminder.isActive
  );
  
  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    
    // Update all period reminders
    periodReminders.forEach(reminder => {
      updateReminder(reminder.id, { isActive: newState });
    });
    
    toast({
      title: newState ? "Notifications enabled" : "Notifications disabled",
      description: newState 
        ? "You will receive period reminders" 
        : "You won't receive period reminders",
    });
  };
  
  const handleAddStandardReminders = () => {
    if (!predictions) {
      toast({
      title: "Cannot create reminders",
      description: "Not enough data to predict your cycle",
      variant: "destructive"
    });
      return;
    }
    
    const nextPeriodStart = new Date(predictions.nextPeriodStart);
    
    // 2 days before period
    scheduleReminder({
      title: "Period Starting Soon",
      message: `Your period is expected to start in 2 days (${format(nextPeriodStart, 'MMM dd')})`,
      triggerTime: addDays(nextPeriodStart, -2),
      type: "period",
      isRead: false,
      isActive: true
    });
    
    // day of period
    scheduleReminder({
      title: "Period Starting Today",
      message: `Your period is expected to start today (${format(nextPeriodStart, 'MMM dd')})`,
      triggerTime: nextPeriodStart,
      type: "period",
      isRead: false,
      isActive: true
    });
    
    // PMS phase beginning (7 days before)
    scheduleReminder({
      title: "PMS Phase Beginning",
      message: "Your PMS phase is expected to begin today",
      triggerTime: addDays(nextPeriodStart, -7),
      type: "period",
      isRead: false,
      isActive: true
    });
    
    toast({
      title: "Reminders created",
      description: "Standard period reminders have been created",
    });
  };
  
  const handleClearAllReminders = () => {
    periodReminders.forEach(reminder => {
      deleteReminder(reminder.id);
    });
    
    toast({
      title: "Reminders cleared",
      description: "All period reminders have been removed",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BellRing className="h-5 w-5 mr-2 text-cycle-primary" />
          Period Reminders
        </CardTitle>
        <CardDescription>
          Set up notifications for your cycle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium">Enable notifications</div>
            <div className="text-sm text-muted-foreground">
              Receive reminders about your upcoming period
            </div>
          </div>
          <Switch 
            checked={notificationsEnabled}
            onCheckedChange={handleToggleNotifications}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Active Reminders</h4>
          
          {periodReminders.length === 0 ? (
            <div className="text-sm text-gray-500 py-2">
              No period reminders set
            </div>
          ) : (
            <div className="space-y-2">
              {periodReminders.map(reminder => (
                <div 
                  key={reminder.id} 
                  className="flex justify-between items-center p-2 rounded-md border border-gray-100 bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-sm">{reminder.title}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(reminder.triggerTime), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <BellOff className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleAddStandardReminders}
          >
            <Bell className="h-4 w-4 mr-1" />
            Add Standard Reminders
          </Button>
          {periodReminders.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={handleClearAllReminders}
            >
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodReminderSettings;
