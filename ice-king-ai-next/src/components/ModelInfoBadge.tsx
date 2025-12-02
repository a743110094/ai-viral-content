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
  displayText = `基于 ${modelName} `,
  showBadge = true,
  className = ''
}) => {
  // 如果不显示badge，返回null
  if (!showBadge) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-3 mx-8 bg-blue-500/10 border border-blue-400/30 rounded-full px-6 py-3 mb-8 golden-border-glow ${className}`}>
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
      <Cpu className="w-5 h-5 text-blue-400 golden-icon-glow" />
      <span className="text-blue-300 text-base font-medium">{displayText}</span>
    </div>
  );
};

export default ModelInfoBadge;