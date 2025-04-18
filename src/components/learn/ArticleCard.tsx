
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, CheckCircle } from 'lucide-react';
import { Article } from '@/types';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{article.title}</CardTitle>
          {article.vetted && (
            <Badge variant="outline" className="text-green-600 flex items-center gap-1">
              <CheckCircle size={12} />
              Clinically Verified
            </Badge>
          )}
        </div>
        <CardDescription>{article.summary}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {article.readTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            Updated: {new Date(article.lastUpdated).toLocaleDateString()}
          </span>
        </div>
        <Link to={`/learn/article/${article.id}`}>
          <Button variant="outline" className="text-cycle-primary border-cycle-primary hover:bg-cycle-primary hover:text-white">
            Read Article
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
