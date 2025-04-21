
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  description?: string;
  recommended: boolean;
  checked: boolean;
  targetPartner: 'all' | 'female' | 'male';
}

export const PreconceptionChecklist: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  // Initial checklist items
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    // Health Tests & Screenings
    {
      id: '1',
      category: 'health-screening',
      label: 'Preconception checkup',
      description: 'Schedule a preconception visit with your healthcare provider to review health history and medications.',
      recommended: true,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '2',
      category: 'health-screening',
      label: 'Genetic carrier screening',
      description: 'Consider testing for genetic conditions that could be passed to your child.',
      recommended: true,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '3',
      category: 'health-screening',
      label: 'STI testing',
      description: 'Get tested for sexually transmitted infections that could affect fertility or pregnancy.',
      recommended: true,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '4',
      category: 'health-screening',
      label: 'Pap smear',
      description: 'Make sure you\'re up-to-date on cervical cancer screening.',
      recommended: true,
      checked: false,
      targetPartner: 'female'
    },
    {
      id: '5',
      category: 'health-screening',
      label: 'Sperm analysis',
      description: 'Consider a semen analysis to check sperm count, motility, and morphology.',
      recommended: false,
      checked: false,
      targetPartner: 'male'
    },
    
    // Medications & Supplements
    {
      id: '6',
      category: 'medications',
      label: 'Start prenatal vitamins',
      description: 'Begin taking prenatal vitamins with folate 3 months before trying to conceive.',
      recommended: true,
      checked: false,
      targetPartner: 'female'
    },
    {
      id: '7',
      category: 'medications',
      label: 'Take multivitamin with zinc and selenium',
      description: 'These nutrients support sperm production and quality.',
      recommended: true,
      checked: false,
      targetPartner: 'male'
    },
    {
      id: '8',
      category: 'medications',
      label: 'Medication review',
      description: 'Review all prescription and over-the-counter medications with your doctor for pregnancy safety.',
      recommended: true,
      checked: false,
      targetPartner: 'female'
    },
    
    // Lifestyle Changes
    {
      id: '9',
      category: 'lifestyle',
      label: 'Quit smoking',
      description: 'Smoking reduces fertility in both partners and increases pregnancy risks.',
      recommended: true,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '10',
      category: 'lifestyle',
      label: 'Limit alcohol',
      description: 'Reduce or eliminate alcohol consumption to improve fertility outcomes.',
      recommended: true,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '11',
      category: 'lifestyle',
      label: 'Reduce caffeine',
      description: 'Limit to 200mg (1-2 cups of coffee) per day or less.',
      recommended: true,
      checked: false,
      targetPartner: 'female'
    },
    {
      id: '12',
      category: 'lifestyle',
      label: 'Achieve healthy weight',
      description: 'Work toward a BMI between 18.5-24.9 for optimal fertility.',
      recommended: true,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '13',
      category: 'lifestyle',
      label: 'Start moderate exercise routine',
      description: 'Aim for 150 minutes of moderate activity per week.',
      recommended: false,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '14',
      category: 'lifestyle',
      label: 'Avoid environmental toxins',
      description: 'Reduce exposure to pesticides, BPA, phthalates, and lead.',
      recommended: true,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '15',
      category: 'lifestyle',
      label: 'Limit heat exposure',
      description: 'Avoid hot tubs, saunas and keeping laptops on lap for extended periods.',
      recommended: false,
      checked: false,
      targetPartner: 'male'
    },
    
    // Vaccinations
    {
      id: '16',
      category: 'vaccinations',
      label: 'Get COVID-19 vaccine',
      description: 'COVID-19 during pregnancy increases risks for severe outcomes.',
      recommended: true,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '17',
      category: 'vaccinations',
      label: 'Check MMR immunity',
      description: 'Confirm immunity to rubella (German measles) before pregnancy.',
      recommended: true,
      checked: false,
      targetPartner: 'female'
    },
    {
      id: '18',
      category: 'vaccinations',
      label: 'Get Tdap vaccine',
      description: 'Ensure you\'re protected against tetanus, diphtheria and pertussis.',
      recommended: false,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '19',
      category: 'vaccinations',
      label: 'Get flu shot',
      description: 'Especially important if trying during flu season.',
      recommended: false,
      checked: false,
      targetPartner: 'all'
    },
    
    // Planning & Preparation
    {
      id: '20',
      category: 'planning',
      label: 'Track menstrual cycles',
      description: 'Use fertility tracking to identify ovulation patterns.',
      recommended: true,
      checked: false,
      targetPartner: 'female'
    },
    {
      id: '21',
      category: 'planning',
      label: 'Check health insurance coverage',
      description: 'Review what pregnancy and fertility benefits are included.',
      recommended: false,
      checked: false,
      targetPartner: 'all'
    },
    {
      id: '22',
      category: 'planning',
      label: 'Research parental leave options',
      description: 'Understand your workplace policies and benefits.',
      recommended: false,
      checked: false,
      targetPartner: 'all'
    }
  ]);

  // Filter items based on active tab
  const filteredItems = checklistItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'female') return item.targetPartner === 'female' || item.targetPartner === 'all';
    if (activeTab === 'male') return item.targetPartner === 'male' || item.targetPartner === 'all';
    return true;
  });

  // Group items by category
  const groupedItems: Record<string, ChecklistItem[]> = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Calculate progress
  const calculateProgress = () => {
    const eligibleItems = checklistItems.filter(item => 
      (activeTab === 'all' || 
       (activeTab === 'female' && (item.targetPartner === 'female' || item.targetPartner === 'all')) ||
       (activeTab === 'male' && (item.targetPartner === 'male' || item.targetPartner === 'all')))
    );
    
    const checkedCount = eligibleItems.filter(item => item.checked).length;
    return Math.round((checkedCount / eligibleItems.length) * 100);
  };

  // Toggle item checked status
  const toggleItem = (id: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
    
    // Show toast for recommended items only
    const item = checklistItems.find(i => i.id === id);
    if (item && !item.checked && item.recommended) {
      toast({
        title: "Important item completed!",
        description: `You've completed "${item.label}" - a recommended preconception step.`
      });
    }
  };

  // Reset checklist
  const resetChecklist = () => {
    setChecklistItems(prev => prev.map(item => ({ ...item, checked: false })));
    toast({
      title: "Checklist Reset",
      description: "All items have been unchecked."
    });
  };

  // Get category title
  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'health-screening': return 'Health Tests & Screenings';
      case 'medications': return 'Medications & Supplements';
      case 'lifestyle': return 'Lifestyle Changes';
      case 'vaccinations': return 'Vaccinations';
      case 'planning': return 'Planning & Preparation';
      default: return category;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preconception Checklist</CardTitle>
        <CardDescription>
          Track important pre-pregnancy preparations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall progress</span>
              <span className="font-medium">{calculateProgress()}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
          
          {/* Partner filter */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="female">For Women</TabsTrigger>
              <TabsTrigger value="male">For Men</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Checklist items by category */}
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-medium text-lg">{getCategoryTitle(category)}</h3>
                
                <div className="space-y-2">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className={`flex items-start space-x-2 p-3 rounded-lg border ${
                        item.checked ? 'bg-green-50 border-green-200' : 
                        item.recommended ? 'border-amber-200' : 'border-gray-200'
                      }`}
                    >
                      <Checkbox 
                        id={`item-${item.id}`} 
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <label 
                          htmlFor={`item-${item.id}`}
                          className="font-medium text-sm cursor-pointer"
                        >
                          {item.label}
                          {item.recommended && (
                            <span className="ml-2 text-xs text-amber-600 font-normal">Recommended</span>
                          )}
                        </label>
                        {item.description && (
                          <p className="text-xs text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Recommendations */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Personalized Recommendations</h4>
              <p className="text-sm">
                Focus on the recommended items first, especially prenatal vitamins 
                (for women) and lifestyle changes for both partners. Start these 
                changes 3 months before trying to conceive for optimal results.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetChecklist}>
          Reset Checklist
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            toast({
              title: "Checklist Exported",
              description: "Your preconception checklist has been exported to PDF."
            });
          }}
        >
          Export to PDF
        </Button>
      </CardFooter>
    </Card>
  );
};
