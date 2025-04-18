import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Book, Brain, Heart, Leaf, ShieldCheck, Droplets, 
  Clock, Calendar, CheckCircle
} from 'lucide-react';
import { ArticleCategory, LifeStage } from '@/types';
import { articlesByCategory, featuredArticles } from '@/data/learn-content';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

const LearnPage: React.FC = () => {
  const { currentLifeStage } = useAppStore();

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

  // Filter featured articles based on life stage
  const filteredArticles = featuredArticles.filter(article => 
    !article.lifeStages || 
    article.lifeStages.includes(currentLifeStage as LifeStage)
  );

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
                  : `Articles for articles`}
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
                          className={"bg-gray-100 text-gray-800"}
                        >
                           General
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
