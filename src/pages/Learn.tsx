
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Book, Brain, Heart, Leaf, ShieldCheck, Droplets, 
  Clock, Calendar, CheckCircle, Sparkles, BabyIcon,
  FlameIcon, ThermometerIcon, SunIcon, MoonIcon
} from 'lucide-react';
import { ArticleCategory, LifeStage } from '@/types';
import { articlesByCategory, featuredArticles } from '@/data/learn-content';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';

const LearnPage: React.FC = () => {
  const { currentLifeStage, changeLifeStage } = useAppStore();
  const { toast } = useToast();
  const [lifecycleTab, setLifecycleTab] = useState<string>(currentLifeStage);

  const categoryInfo = {
    [ArticleCategory.BASICS]: {
      icon: Droplets,
      title: "Menstrual Basics",
      description: "Foundation knowledge about periods and the menstrual cycle",
      color: "text-pink-500"
    },
    [ArticleCategory.HEALTH]: {
      icon: Heart,
      title: "Menstrual Health",
      description: "Understanding your menstrual health and common concerns",
      color: "text-red-500"
    },
    [ArticleCategory.SYMPTOMS]: {
      icon: ShieldCheck,
      title: "Symptoms & Conditions",
      description: "Common symptoms and medical conditions",
      color: "text-purple-500"
    },
    [ArticleCategory.WELLNESS]: {
      icon: Leaf,
      title: "Wellness & Lifestyle",
      description: "Tips for a healthy lifestyle during your cycle",
      color: "text-green-500"
    },
    [ArticleCategory.MYTHS]: {
      icon: Brain,
      title: "Myths & Facts",
      description: "Debunking common misconceptions",
      color: "text-blue-500"
    },
    [ArticleCategory.SCIENCE]: {
      icon: Book,
      title: "Science & Research",
      description: "Latest research and scientific understanding",
      color: "text-indigo-500"
    }
  };

  const lifeStageInfo = {
    [LifeStage.FIRST_PERIOD]: {
      icon: Sparkles,
      title: "First Period",
      description: "Information for those new to menstruation",
      color: "bg-pink-100 text-pink-800"
    },
    [LifeStage.STANDARD]: {
      icon: Calendar,
      title: "Regular Cycles",
      description: "Understanding your normal menstrual cycle",
      color: "bg-blue-100 text-blue-800"
    },
    [LifeStage.TTC]: {
      icon: BabyIcon,
      title: "Trying to Conceive",
      description: "Optimize your chances of conception",
      color: "bg-green-100 text-green-800"
    },
    [LifeStage.PREGNANCY]: {
      icon: Heart,
      title: "Pregnancy",
      description: "Week-by-week guidance during pregnancy",
      color: "bg-purple-100 text-purple-800"
    },
    [LifeStage.PERIMENOPAUSE]: {
      icon: FlameIcon,
      title: "Perimenopause",
      description: "Navigating the transition to menopause",
      color: "bg-orange-100 text-orange-800"
    },
    [LifeStage.NO_PERIOD]: {
      icon: ThermometerIcon,
      title: "No Period / HRT",
      description: "Support for those without menstruation",
      color: "bg-gray-100 text-gray-800"
    }
  };

  // Filter featured articles based on life stage
  const filteredArticles = featuredArticles.filter(article => 
    !article.lifeStages || 
    article.lifeStages.includes(currentLifeStage as LifeStage)
  );

  const handleLifeStageChange = (stage: string) => {
    setLifecycleTab(stage);
    
    // Only change if different from current
    if (stage !== currentLifeStage) {
      changeLifeStage(stage as LifeStage, "User changed from Learn page");
      
      toast({
        title: "Life Stage Updated",
        description: `Your app experience is now optimized for ${lifeStageInfo[stage as LifeStage].title}`,
        duration: 3000,
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Learn About Your Cycle</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Your Life Stage</CardTitle>
            <CardDescription>
              Customize your experience based on your current life stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={lifecycleTab} onValueChange={handleLifeStageChange} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                {Object.entries(lifeStageInfo).map(([stage, info]) => (
                  <TabsTrigger key={stage} value={stage} className="flex flex-col items-center py-2">
                    <info.icon size={18} className="mb-1" />
                    <span className="text-xs">{info.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(lifeStageInfo).map(([stage, info]) => (
                <TabsContent key={stage} value={stage} className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${info.color.replace('text-', 'bg-').replace('800', '100')}`}>
                      <info.icon size={24} className={info.color.replace('bg-', 'text-')} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{info.title}</h3>
                      <p className="text-gray-600">{info.description}</p>
                      
                      <div className="mt-4">
                        <Badge className={info.color}>
                          {stage === currentLifeStage ? 'Your Current Life Stage' : 'Click to Switch'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categoryInfo).map(([category, info]) => (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <info.icon className={info.color} size={24} />
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </div>
                <CardDescription>{info.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`/learn/${category}`}
                  className="inline-block bg-cycle-primary text-white px-4 py-2 rounded-md hover:bg-cycle-secondary transition-colors"
                >
                  Explore Articles
                </Link>
                <div className="mt-2 text-xs text-gray-500">
                  {articlesByCategory[category as ArticleCategory]?.length || 0} articles
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {currentLifeStage === LifeStage.STANDARD 
                  ? "Featured Articles" 
                  : `Articles for ${lifeStageInfo[currentLifeStage as LifeStage].title}`}
              </CardTitle>
              <CardDescription>
                Science-backed articles reviewed by healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredArticles.map(article => (
                  <article key={article.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {categoryInfo[article.category]?.title || 'Article'}
                      </Badge>
                      {article.vetted && (
                        <Badge variant="outline" className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={10} />
                          Clinically Verified
                        </Badge>
                      )}
                      {article.lifeStages && article.lifeStages.length > 0 && (
                        <Badge 
                          className={lifeStageInfo[article.lifeStages[0] as LifeStage]?.color || "bg-gray-100 text-gray-800"}
                        >
                          {lifeStageInfo[article.lifeStages[0] as LifeStage]?.title || "General"}
                        </Badge>
                      )}
                    </div>
                    <Link to={`/learn/article/${article.id}`}>
                      <h3 className="text-lg font-medium mb-2 hover:text-cycle-primary">{article.title}</h3>
                    </Link>
                    <p className="text-gray-600">
                      {article.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={14} /> {article.readTime} min read</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> Updated: {new Date(article.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <Link to={`/learn/article/${article.id}`}>
                        <Button variant="outline" size="sm" className="text-cycle-primary border-cycle-primary hover:bg-cycle-primary hover:text-white">
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Our Content Standards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Evidence-Based Information</h3>
              <p className="text-gray-600">
                All content is based on clinical practice guidelines, systematic reviews, and peer-reviewed research to ensure accuracy and reliability.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Clinical Review</h3>
              <p className="text-gray-600">
                Articles marked as "Clinically Verified" have been reviewed by healthcare professionals specializing in women's health.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Regular Updates</h3>
              <p className="text-gray-600">
                We review our content at least annually to ensure it reflects the latest medical understanding and guidelines.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Transparent Sources</h3>
              <p className="text-gray-600">
                Every article includes references to its sources, allowing you to verify information and learn more if desired.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnPage;
