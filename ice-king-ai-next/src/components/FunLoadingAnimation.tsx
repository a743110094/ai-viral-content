'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Zap } from 'lucide-react';

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

  // 简约的加载步骤
  const loadingSteps = {
    generate: [
      { icon: Brain, text: 'AI思考中', color: 'from-purple-400 to-pink-400' },
      { icon: Zap, text: '内容生成', color: 'from-blue-400 to-cyan-400' },
      { icon: Sparkles, text: '文案优化', color: 'from-yellow-400 to-orange-400' }
    ],
    analyze: [
      { icon: Brain, text: '深度分析', color: 'from-purple-400 to-pink-400' },
      { icon: Sparkles, text: '洞察提取', color: 'from-blue-400 to-cyan-400' }
    ]
  };

  const steps = loadingSteps[type];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2500); // 减慢节奏，2.5秒切换一步

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 600); // 减慢点号动画

    return () => clearInterval(dotsInterval);
  }, []);

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* 简约背景元素 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* 主要内容 */}
      <div className="text-center z-10 max-w-lg mx-auto px-6">
        {/* 主标题区域 - 呼吸动画 */}
        <div className="breathing-animation mb-12">
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
              正在创作
            </h2>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full blur-xl opacity-50"></div>
          </div>
          <p className="text-lg text-slate-300 font-light">
            {type === 'generate' ? 'AI为您生成精彩内容' : 'AI正在深度分析'}
          </p>
        </div>

        {/* 主要动画卡片 */}
        <div className="breathing-card">
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* 中心图标 - 呼吸动画 */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${currentStepData.color} flex items-center justify-center shadow-lg breathing-icon`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className={`absolute -inset-2 bg-gradient-to-r ${currentStepData.color} rounded-2xl blur-lg opacity-30 breathing-glow`}></div>
              </div>
            </div>

            {/* 步骤文字 */}
            <div className="text-center">
              <h3 className="text-xl font-medium text-white mb-3">
                {currentStepData.text}{dots}
              </h3>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${currentStepData.color} rounded-full transition-all duration-1000`}
                  style={{ 
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                ></div>
              </div>
            </div>

            {/* 步骤指示器 */}
            <div className="flex justify-center gap-3 mt-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index <= currentStep 
                      ? `bg-gradient-to-r ${step.color} shadow-lg` 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 简约底部文字 */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-light">
            专业AI引擎为您精心创作
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes breathing {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.9;
          }
        }
        
        @keyframes breathing-card {
          0%, 100% {
            transform: scale(1) translateY(0);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          50% {
            transform: scale(1.01) translateY(-2px);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
          }
        }
        
        @keyframes breathing-icon {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05) rotate(2deg);
            filter: brightness(1.1);
          }
        }
        
        @keyframes breathing-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }

        .breathing-animation {
          animation: breathing 4s ease-in-out infinite;
        }
        
        .breathing-card {
          animation: breathing-card 3s ease-in-out infinite;
        }
        
        .breathing-icon {
          animation: breathing-icon 2.5s ease-in-out infinite;
        }
        
        .breathing-glow {
          animation: breathing-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FunLoadingAnimation;