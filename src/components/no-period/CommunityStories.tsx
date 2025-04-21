
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CommunityStories = () => {
  const { toast } = useToast();

  const handleStoryRequest = () => {
    toast({
      title: "Community Stories",
      description: "Connect with others on similar journeys.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Stories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Read and share experiences with others on similar journeys.
        </p>
        <Button onClick={handleStoryRequest} className="w-full">
          View Stories
        </Button>
      </CardContent>
    </Card>
  );
};
