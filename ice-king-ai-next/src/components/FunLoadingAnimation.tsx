'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Brain, Target, TrendingUp, Sparkles, Cpu } from 'lucide-react';

interface FunLoadingAnimationProps {
  type?: 'generate' | 'analyze';
  className?: string;
}

const FunLoadingAnimation: React.FC<FunLoadingAnimationProps> = ({ 
  type = 'generate',
  className = '' 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  // 动态加载步骤
  const loadingSteps = {
    generate: [
      { icon: Brain, text: '🧠 AI大脑思考中...', color: 'text-purple-400' },
      { icon: Target, text: '🎯 分析目标受众...', color: 'text-cyan-400' },
      { icon: Zap, text: '⚡ 生成爆款钩子...', color: 'text-yellow-400' },
      { icon: TrendingUp, text: '📈 优化内容策略...', color: 'text-green-400' },
      { icon: Sparkles, text: '✨ 精心打磨文案...', color: 'text-pink-400' },
      { icon: Cpu, text: '🚀 即将完成...', color: 'text-blue-400' }
    ],
    analyze: [
      { icon: Brain, text: '🔍 深度分析中...', color: 'text-purple-400' },
      { icon: Target, text: '🎯 识别受众画像...', color: 'text-cyan-400' },
      { icon: TrendingUp, text: '📊 提取关键洞察...', color: 'text-green-400' },
      { icon: Sparkles, text: '✨ 生成分析报告...', color: 'text-pink-400' }
    ]
  };

  const steps = loadingSteps[type];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1500); // 每1.5秒切换一步

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500); // 每0.5秒添加一个点

    return () => clearInterval(dotsInterval);
  }, []);

  // 平台图标动画
  const platformIcons = [
    { name: '微信', emoji: '💬', delay: '0ms' },
    { name: '微博', emoji: '📱', delay: '200ms' },
    { name: '小红书', emoji: '📖', delay: '400ms' },
    { name: '抖音', emoji: '🎵', delay: '600ms' },
    { name: 'Instagram', emoji: '📷', delay: '800ms' },
    { name: 'Twitter', emoji: '🐦', delay: '1000ms' },
    { name: 'Pinterest', emoji: '📌', delay: '1200ms' },
    { name: 'YouTube', emoji: '📺', delay: '1400ms' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* 背景粒子动画 */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto px-4">
        {/* 主标题 */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 golden-glow-headline">
            {type === 'generate' ? '🚀' : '🔍'} 正在为您创作
          </h2>
          <p className="text-xl text-blue-200">
            {type === 'generate' ? '专业级爆款内容' : '深度分析报告'}
          </p>
        </div>

        {/* 动态进度卡片 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8 golden-feature-card">
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 ${
                    isActive 
                      ? `${step.color} bg-slate-700/50 scale-110 shadow-lg` 
                      : isPast
                      ? 'text-slate-400 bg-slate-700/30'
                      : 'text-slate-500 bg-slate-700/20'
                  }`}
                >
                  <IconComponent 
                    className={`w-4 h-4 transition-all duration-500 ${
                      isActive ? 'animate-bounce' : ''
                    }`} 
                  />
                  <span className="text-sm font-medium hidden md:inline">
                    {step.text}{dots}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 当前步骤的详细描述 */}
          <div className="text-center">
            <p className={`text-lg font-semibold ${steps[currentStep].color} mb-2`}>
              {steps[currentStep].text}{dots}
            </p>
            <p className="text-slate-400 text-sm">
              请稍候片刻，好的内容需要时间打磨 ✨
            </p>
          </div>
        </div>

        {/* 平台图标展示 */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            🎯 正在为以下平台优化内容：
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {platformIcons.map((platform, index) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full border border-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: platform.delay,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <span className="text-lg">{platform.emoji}</span>
                <span className="text-slate-300 text-sm font-medium">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部激励文字 */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            💡 专业的AI内容引擎正在为您精心创作每一个细节
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-yellow-300 text-sm font-medium">
              即将为您呈现惊艳的爆款内容
            </span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes goldenGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.3);
          }
        }
        
        .golden-glow-headline {
          animation: goldenGlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FunLoadingAnimation;