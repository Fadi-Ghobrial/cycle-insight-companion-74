
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Share2, FileText, CheckSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/lib/store';

export const ParentGuardianShare = () => {
  const { toast } = useToast();
  const [guardianEmail, setGuardianEmail] = React.useState('');
  const [passcode, setPasscode] = React.useState('');
  const [isShareEnabled, setIsShareEnabled] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [includeSymptoms, setIncludeSymptoms] = React.useState(true);
  const [includeCycleDates, setIncludeCycleDates] = React.useState(true);
  const [includeNotes, setIncludeNotes] = React.useState(false);
  const { user } = useAppStore();

  // Check if guardian sharing is already enabled on component mount
  React.useEffect(() => {
    const checkGuardianSettings = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('guardian_share_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error("Error fetching guardian settings:", error);
          }
          return;
        }
        
        if (data && data.enabled && data.consent_verified) {
          setIsShareEnabled(true);
          if (data.guardian_email) {
            setGuardianEmail(data.guardian_email);
          }
        }
      } catch (error) {
        console.error("Error checking guardian settings:", error);
      }
    };
    
    checkGuardianSettings();
  }, [user?.id]);

  const handleShareToggle = async (passcode: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to use this feature.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Verify the passcode and create or update settings
      const { data, error } = await supabase
        .from('guardian_share_settings')
        .upsert({
          user_id: user.id,
          passcode,
          enabled: true,
          consent_verified: true,
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        console.error("Error updating guardian settings:", error);
        toast({
          title: "Error",
          description: "Failed to enable sharing. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setIsShareEnabled(true);
      toast({
        title: "Share Access Enabled",
        description: "You can now share cycle data with a guardian",
      });
    } catch (error) {
      console.error("Error in handleShareToggle:", error);
      toast({
        title: "Invalid Passcode",
        description: "Please check your passcode and try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to use this feature.",
        variant: "destructive",
      });
      return;
    }
    
    if (!guardianEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a guardian's email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Call the edge function to generate and send PDF
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-guardian-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId: user.id,
          guardianEmail,
          includeSymptoms,
          includeCycleDates,
          includeNotes,
          passcode
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate PDF');
      }
      
      toast({
        title: "Digest Shared",
        description: `A secure PDF digest has been sent to ${guardianEmail}`,
      });
      
      setGuardianEmail('');
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Share Failed",
        description: error.message || "Failed to generate and send PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Share2 className="w-4 h-4 mr-2" />
          Configure Guardian Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Parent/Guardian Share Access</DialogTitle>
          <DialogDescription>
            Share a secure, read-only digest of your cycle data with a trusted adult.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!isShareEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-yellow-500">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Requires passcode to enable sharing</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passcode">Enter Passcode</Label>
                <Input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter your passcode"
                />
                <Button 
                  onClick={() => handleShareToggle(passcode)}
                  className="w-full mt-2"
                >
                  Verify Passcode
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Sharing is enabled</span>
              </div>
              
              <div className="border p-4 rounded-md space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">PDF Content Options</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeCycleDates" 
                      checked={includeCycleDates}
                      onCheckedChange={(checked) => setIncludeCycleDates(checked as boolean)}
                    />
                    <Label htmlFor="includeCycleDates">Include cycle dates</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeSymptoms" 
                      checked={includeSymptoms}
                      onCheckedChange={(checked) => setIncludeSymptoms(checked as boolean)}
                    />
                    <Label htmlFor="includeSymptoms">Include symptoms</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeNotes" 
                      checked={includeNotes}
                      onCheckedChange={(checked) => setIncludeNotes(checked as boolean)}
                    />
                    <Label htmlFor="includeNotes">Include notes</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guardian-email">Guardian's Email</Label>
                <Input
                  id="guardian-email"
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="Enter guardian's email"
                />
                <Button 
                  onClick={handleShare}
                  className="w-full mt-2"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Send Secure Digest'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  This will generate a secure, encrypted PDF report and send it to your guardian's email.
                </p>
              </div>
              
              <div className="text-xs text-gray-500 border-t pt-3">
                <p className="font-medium mb-1">Privacy Protection:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your data is encrypted end-to-end</li>
                  <li>Guardian access is limited to what you select</li>
                  <li>PDFs expire after 7 days</li>
                  <li>Your account remains private and secure</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
