
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const ParentGuardianShare = () => {
  const { toast } = useToast();
  const [guardianEmail, setGuardianEmail] = React.useState('');
  const [passcode, setPasscode] = React.useState('');
  const [isShareEnabled, setIsShareEnabled] = React.useState(false);

  const handleShareToggle = (passcode: string) => {
    // In a real implementation, this would verify the passcode and handle encryption
    if (passcode === '1234') { // Demo passcode
      setIsShareEnabled(true);
      toast({
        title: "Share Access Enabled",
        description: "You can now share cycle data with a guardian",
      });
    } else {
      toast({
        title: "Invalid Passcode",
        description: "Please check your passcode and try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (!guardianEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a guardian's email address",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would generate and send the PDF
    toast({
      title: "Digest Shared",
      description: `A secure PDF digest has been sent to ${guardianEmail}`,
    });
    setGuardianEmail('');
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
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-500">Requires passcode to enable sharing</span>
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
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">Sharing is enabled</span>
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
                >
                  Send Secure Digest
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
