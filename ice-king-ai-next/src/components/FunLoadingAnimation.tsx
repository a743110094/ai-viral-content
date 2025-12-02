'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Brain, Target, TrendingUp } from 'lucide-react';

interface FunLoadingAnimationProps {
  type: 'generate' | 'analyze';
  className?: string;
}

const FunLoadingAnimation: React.FC<FunLoadingAnimationProps> = ({ type, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  const generateSteps = [
    { icon: Brain, text: '分析您的需求...', color: 'text-purple-400' },
    { icon: Target, text: '匹配目标受众...', color: 'text-cyan-400' },
    { icon: TrendingUp, text: '生成创意钩子...', color: 'text-green-400' },
    { icon: Sparkles, text: '优化内容文案...', color: 'text-yellow-400' },
    { icon: Zap, text: '完善平台适配...', color: 'text-orange-400' },
  ];

  const analyzeSteps = [
    { icon: Brain, text: '深度分析中...', color: 'text-purple-400' },
    { icon: Target, text: '匹配用户画像...', color: 'text-cyan-400' },
    { icon: TrendingUp, text: '优化分析结果...', color: 'text-green-400' },
  ];

  const steps = type === 'generate' ? generateSteps : analyzeSteps;

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1200);

    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotsInterval);
    };
  }, [steps.length]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 动态图标 */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <CurrentIcon className={`w-4 h-4 ${steps[currentStep].color} opacity-75`} />
        </div>
        <CurrentIcon className={`w-4 h-4 ${steps[currentStep].color} animate-bounce relative z-10`} />
      </div>

      {/* 动态文本 */}
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${steps[currentStep].color} transition-colors duration-500`}>
          {steps[currentStep].text}{dots}
        </span>
        
        {/* 进度条 */}
        <div className="w-24 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r transition-all duration-500 ${
              currentStep === 0 ? 'from-purple-400 to-purple-600' :
              currentStep === 1 ? 'from-cyan-400 to-cyan-600' :
              currentStep === 2 ? 'from-green-400 to-green-600' :
              currentStep === 3 ? 'from-yellow-400 to-yellow-600' :
              'from-orange-400 to-orange-600'
            }`}
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              transition: 'width 0.8s ease-in-out'
            }}
          />
        </div>
      </div>

      {/* 装饰性粒子 */}
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full animate-pulse ${
              currentStep === i ? steps[i].color : 'bg-slate-600'
            }`}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FunLoadingAnimation;