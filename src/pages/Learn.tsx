
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Book, Brain, Drop, Heart, Leaf, ShieldCheck } from 'lucide-react';
import { ArticleCategory } from '@/types';

const LearnPage: React.FC = () => {
  const categoryInfo = {
    [ArticleCategory.BASICS]: {
      icon: Drop,
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

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Learn About Your Cycle</h1>
        
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
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Featured Articles</CardTitle>
              <CardDescription>
                Science-backed articles reviewed by healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* Placeholder for featured articles - to be integrated with real data */}
                <article className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Basics</Badge>
                    <Badge variant="outline" className="text-green-600">
                      Clinically Verified
                    </Badge>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Understanding Your Menstrual Cycle Phases</h3>
                  <p className="text-gray-600">
                    A comprehensive guide to the four phases of your menstrual cycle and what to expect during each one.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span>5 min read</span>
                    <span>Last updated: April 2025</span>
                  </div>
                </article>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LearnPage;
