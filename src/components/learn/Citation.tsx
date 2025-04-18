
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CitationProps {
  id: string;
  source: string;
  url: string;
  title: string;
  date: string;
}

const Citation: React.FC<CitationProps> = ({ id, source, url, title, date }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <sup className="text-cycle-primary hover:text-cycle-secondary cursor-pointer">
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
              [{id}]
            </a>
          </sup>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-white p-2 shadow-lg rounded-md border">
          <div className="text-xs">
            <p className="font-semibold">{title}</p>
            <p>{source}, {date}</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cycle-primary flex items-center mt-1 text-xs gap-1 hover:underline"
            >
              <ExternalLink size={10} /> View source
            </a>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Citation;
