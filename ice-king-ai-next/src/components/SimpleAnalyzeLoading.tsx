import React from 'react';
import { Loader2 } from 'lucide-react';

interface SimpleAnalyzeLoadingProps {
  className?: string;
}

const SimpleAnalyzeLoading: React.FC<SimpleAnalyzeLoadingProps> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Loader2 className="w-3 h-3 animate-spin" />
      <span>分析中...</span>
    </div>
  );
};

export default SimpleAnalyzeLoading;