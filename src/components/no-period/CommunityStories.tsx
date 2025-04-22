
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock stories data - in a real app, this would come from an API
const mockStories = [
  "I found that low-dose HRT worked best for my symptoms.",
  "Post-surgery recovery took 6 weeks, but I'm feeling much better now.",
  "Sharing my journey with others helped me process the emotional aspects.",
];

export const CommunityStories = () => {
  const { toast } = useToast();
  const [showStory, setShowStory] = useState(false);
  const [currentStory, setCurrentStory] = useState("");

  const handleStoryRequest = () => {
    // Get a random story from our mock data
    const randomStory = mockStories[Math.floor(Math.random() * mockStories.length)];
    setCurrentStory(randomStory);
    setShowStory(true);
    
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
        
        {showStory && (
          <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm italic border-l-2 border-purple-300">
            "{currentStory}"
          </div>
        )}
        
        <Button onClick={handleStoryRequest} className="w-full">
          {showStory ? "Read Another Story" : "View Stories"}
        </Button>
      </CardContent>
    </Card>
  );
};
