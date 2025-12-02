'use client';

import React from 'react';
import { Cpu } from 'lucide-react';

// 可配置的模型信息组件
interface ModelInfoBadgeProps {
  // 可以自定义模型名称
  modelName?: string;
  // 可以自定义显示文本
  displayText?: string;
  // 是否显示badge
  showBadge?: boolean;
  // 自定义样式类
  className?: string;
}

const ModelInfoBadge: React.FC<ModelInfoBadgeProps> = ({
  modelName = 'DeepSeek-V3.2-Speciale',
  displayText = `基于最新的 ${modelName} 模型实现`,
  showBadge = true,
  className = ''
}) => {
  // 如果不显示badge，返回null
  if (!showBadge) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-2 mx-8 bg-blue-500/10 border border-blue-400/30 rounded-full px-4 py-2 mb-8 ${className}`}>
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      <Cpu className="w-3 h-3 text-blue-400" />
      <span className="text-blue-300 text-sm font-medium">{displayText}</span>
    </div>
  );
};

export default ModelInfoBadge;