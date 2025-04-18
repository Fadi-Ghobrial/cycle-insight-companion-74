
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ArticleCategory } from '@/types';
import ArticleCard from '@/components/learn/ArticleCard';
import { articlesByCategory } from '@/data/learn-content';

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

  // Get articles for this category
  const categoryArticles = articlesByCategory[categoryEnum] || [];
  
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
        
        {categoryArticles.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No articles available in this category yet.</p>
              <Link to="/learn" className="mt-4 inline-block">
                <Button variant="outline" className="text-cycle-primary border-cycle-primary hover:bg-cycle-primary hover:text-white">
                  Browse other categories
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {categoryArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LearnCategory;
