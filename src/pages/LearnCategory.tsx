
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ArticleCategory } from '@/types';

const LearnCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  // Convert category string to corresponding enum value
  const categoryEnum = category as ArticleCategory;
  
  // Map category names to display titles
  const categoryDisplayNames = {
    [ArticleCategory.BASICS]: "Menstrual Basics",
    [ArticleCategory.HEALTH]: "Menstrual Health",
    [ArticleCategory.SYMPTOMS]: "Symptoms & Conditions",
    [ArticleCategory.WELLNESS]: "Wellness & Lifestyle",
    [ArticleCategory.MYTHS]: "Myths & Facts",
    [ArticleCategory.SCIENCE]: "Science & Research"
  };
  
  // Placeholder articles - would be fetched from a database in a real app
  const placeholderArticles = [
    {
      id: '1',
      title: 'Understanding Your Menstrual Cycle Phases',
      summary: 'A comprehensive guide to the four phases of your menstrual cycle and what to expect during each one.',
      readTime: 5,
      lastUpdated: new Date('2025-04-01'),
      vetted: true
    },
    {
      id: '2',
      title: 'How Diet Affects Your Period',
      summary: 'Learn about the connection between nutrition and menstrual health, including foods that can help alleviate symptoms.',
      readTime: 7,
      lastUpdated: new Date('2025-03-15'),
      vetted: true
    },
    {
      id: '3',
      title: 'Managing PMS Symptoms Naturally',
      summary: 'Natural approaches to managing premenstrual syndrome symptoms without medication.',
      readTime: 4,
      lastUpdated: new Date('2025-02-28'),
      vetted: false
    },
  ];
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <Link to="/learn" className="inline-flex items-center text-cycle-primary hover:underline mb-4">
          <ChevronLeft size={16} className="mr-1" />
          Back to categories
        </Link>
        
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">
          {categoryDisplayNames[categoryEnum] || 'Articles'}
        </h1>
        
        <div className="grid gap-6">
          {placeholderArticles.map(article => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  {article.vetted && (
                    <Badge variant="outline" className="text-green-600">
                      Clinically Verified
                    </Badge>
                  )}
                </div>
                <CardDescription>{article.summary}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center pt-0">
                <div className="text-sm text-gray-500">
                  {article.readTime} min read • Last updated: {article.lastUpdated.toLocaleDateString()}
                </div>
                <Button variant="outline" className="text-cycle-primary border-cycle-primary hover:bg-cycle-primary hover:text-white">
                  Read Article
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default LearnCategory;
