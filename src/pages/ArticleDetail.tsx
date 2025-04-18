
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Calendar, Clock, CheckCircle, BookOpen } from 'lucide-react';
import Citation from '@/components/learn/Citation';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { articles, citations } from '@/data/learn-content';

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  
  // Find the specific article
  const article = articles.find(a => a.id === articleId);
  
  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <h1>Article not found</h1>
          <Link to="/learn" className="text-cycle-primary hover:underline">
            Return to Learn
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <Link to={`/learn/${article.category}`} className="inline-flex items-center text-cycle-primary hover:underline mb-4">
          <ChevronLeft size={16} className="mr-1" />
          Back to articles
        </Link>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-cycle-primary">{article.title}</h1>
              
              {article.vetted && (
                <Badge variant="outline" className="text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Clinically Verified
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {article.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Last updated: {new Date(article.lastUpdated).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                Author: {article.author}
              </span>
            </div>
            
            <Separator className="my-6" />
            
            <div className="prose max-w-none">
              <p className="text-lg font-medium mb-4">{article.summary}</p>
              
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
              
              {article.sources && article.sources.length > 0 && (
                <>
                  <Separator className="my-6" />
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="references">
                      <AccordionTrigger>References & Citations</AccordionTrigger>
                      <AccordionContent>
                        <ScrollArea className="h-64 w-full rounded-md border p-4">
                          <ol className="list-decimal pl-5 space-y-2">
                            {article.sources.map((sourceId) => {
                              const source = citations.find(c => c.id === sourceId);
                              return source ? (
                                <li key={sourceId} className="text-sm">
                                  <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-cycle-primary"
                                  >
                                    {source.title}
                                  </a>
                                  <p className="text-gray-500">{source.source}, {source.date}</p>
                                </li>
                              ) : <li key={sourceId}>Reference not found</li>;
                            })}
                          </ol>
                        </ScrollArea>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg mt-8">
                <h3 className="text-lg font-medium mb-2">Content Quality Assurance</h3>
                <p className="text-sm text-gray-600">
                  This article follows evidence-based guidelines and has been reviewed by healthcare professionals. 
                  Our content is updated regularly based on the latest research and clinical practice guidelines.
                </p>
                <p className="text-sm font-medium mt-2">
                  Next scheduled review: {new Date(new Date(article.lastUpdated).setFullYear(new Date(article.lastUpdated).getFullYear() + 1)).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ArticleDetail;
