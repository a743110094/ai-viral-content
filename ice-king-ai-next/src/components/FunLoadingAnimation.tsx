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
    }, 6000); // 大幅减慢节奏，6秒切换一步

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 1200); // 进一步减慢点号动画，配合更慢的步骤切换

    return () => clearInterval(dotsInterval);
  }, []);

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* 精致的背景元素 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl subtle-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/8 to-cyan-500/8 rounded-full blur-3xl subtle-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl subtle-float" style={{ animationDelay: '6s' }}></div>
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
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl subtle-border-glow">
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
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
                <div 
                  className={`h-full bg-gradient-to-r ${currentStepData.color} rounded-full transition-all duration-2000 ease-out`}
                  style={{ 
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                    animation: 'shimmer 4s ease-in-out infinite'
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
            transform: scale(1.015);
            opacity: 0.95;
          }
        }
        
        @keyframes breathing-card {
          0%, 100% {
            transform: scale(1) translateY(0);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          }
          50% {
            transform: scale(1.005) translateY(-1px);
            box-shadow: 0 35px 70px rgba(0, 0, 0, 0.35);
          }
        }
        
        @keyframes breathing-icon {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: brightness(1) saturate(1);
          }
          50% {
            transform: scale(1.02) rotate(1deg);
            filter: brightness(1.05) saturate(1.1);
          }
        }
        
        @keyframes breathing-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.35;
          }
        }
        
        @keyframes subtle-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.15;
          }
          33% {
            transform: translateY(-10px) scale(1.02);
            opacity: 0.2;
          }
          66% {
            transform: translateY(5px) scale(0.98);
            opacity: 0.1;
          }
        }
        
        @keyframes shimmer {
          0%, 100% {
            filter: brightness(1) saturate(1);
          }
          50% {
            filter: brightness(1.1) saturate(1.2);
          }
        }
        
        @keyframes subtle-border-glow {
          0%, 100% {
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          }
          50% {
            border-color: rgba(255, 255, 255, 0.15);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 0 20px rgba(255, 255, 255, 0.05);
          }
        }

        .breathing-animation {
          animation: breathing 8s ease-in-out infinite;
        }
        
        .breathing-card {
          animation: breathing-card 6s ease-in-out infinite;
        }
        
        .breathing-icon {
          animation: breathing-icon 5s ease-in-out infinite;
        }
        
        .breathing-glow {
          animation: breathing-glow 7s ease-in-out infinite;
        }
        
        .subtle-float {
          animation: subtle-float 12s ease-in-out infinite;
        }
        
        .subtle-border-glow {
          animation: subtle-border-glow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FunLoadingAnimation;