
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { addDays } from 'date-fns';

interface CarouselCard {
  id: string;
  emoji: string;
  title: string;
  content: string;
  animationUrl?: string;
}

const carouselCards: CarouselCard[] = [
  {
    id: 'intro',
    emoji: '🌸',
    title: 'Welcome to Your Period Journey',
    content: "Your period is a natural and healthy part of growing up. Let's learn about what to expect and how to take care of yourself during this time."
  },
  {
    id: 'cycle',
    emoji: '📅',
    title: 'Understanding Your Cycle',
    content: "A menstrual cycle typically lasts 21-35 days. Your period is just one part of this cycle, usually lasting 3-7 days."
  },
  {
    id: 'products',
    emoji: '🎀',
    title: 'Period Products',
    content: "There are many options for managing your period: pads, tampons, and menstrual cups. We'll help you find what works best for you."
  }
  // More cards can be added here
];

export function PeriodCarousel() {
  const { toast } = useToast();
  
  const handleCompletedCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('education_progress')
        .upsert({
          content_id: cardId,
          completed: true,
          next_available_at: addDays(new Date(), 2),
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Progress Saved!",
        description: "Next tip will be available in 2 days",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your progress",
        variant: "destructive",
      });
    }
  };

  return (
    <Carousel className="w-full max-w-xl mx-auto">
      <CarouselContent>
        {carouselCards.map((card) => (
          <CarouselItem key={card.id}>
            <Card className="p-6">
              <CardHeader>
                <div className="text-4xl mb-2">{card.emoji}</div>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{card.content}</p>
                {card.animationUrl && (
                  <div className="mt-4 aspect-video bg-gray-100 rounded-lg">
                    {/* Animation placeholder - will be implemented later */}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleCompletedCard(card.id)}
                  className="w-full"
                  variant="outline"
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Got it—next tip in 2 days
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
