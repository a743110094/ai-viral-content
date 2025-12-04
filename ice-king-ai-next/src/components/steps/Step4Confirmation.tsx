'use client';

import React from 'react';
import { Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { ContentInputs, PLATFORM_CONFIGS } from '@/types/content';

interface Step4ConfirmationProps {
  data?: Partial<ContentInputs>;
  onDataChange?: (data: Partial<ContentInputs>) => void;
  isValidating?: boolean;
}

const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({ 
  data = {}, 
  onDataChange = () => {}, 
  isValidating = false 
}) => {
  // 计算预计生成时间
  const estimatedTime = data.selectedPlatforms ? data.selectedPlatforms.length * 3 : 12;

  // 获取风格名称
  const getToneName = (tone: string) => {
    const toneMap: Record<string, string> = {
      'Professional': '专业权威',
      'Humorous': '幽默风趣',
      'Luxury': '高端奢华',
      'Inspiring': '励志激励',
      'Aggressive Marketing': '强势营销',
      'Friendly Mentor': '亲切导师'
    };
    return toneMap[tone] || tone;
  };

  // 获取目标名称
  const getGoalName = (goal: string) => {
    const goalMap: Record<string, string> = {
      'Grow Followers': '涨粉引流',
      'Drive Affiliate Clicks': '推广点击',
      'Sell Product': '产品销售',
      'Build Brand Awareness': '品牌曝光'
    };
    return goalMap[goal] || goal;
  };



  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      {/* 页面标题 - 美观的两行布局 */}
      <div className="flex items-start gap-5 mb-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-green-400 to-blue-500 rounded-xl shadow-2xl shadow-green-500/30 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <span className="text-2xl filter drop-shadow-sm">✅</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          </div>
        </div>
        <div className="flex-1 pt-1">
          <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
            配置确认
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            请确认以下信息，AI将为你生成全平台爆款内容
          </p>
        </div>
      </div>

      {/* 功能区域分割线 */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-slate-900 px-3">
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 增加呼吸感 */}
      <div className="space-y-6 flex-1">
        {/* 平台选择确认 */}
        {data.selectedPlatforms && data.selectedPlatforms.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-400" />
              生成平台
            </h3>
            
            <div className="grid grid-cols-4 gap-3">
              {data.selectedPlatforms.map((platform) => {
                const config = PLATFORM_CONFIGS[platform];
                const platformBrands = {
                  wechat: { logo: '💬', color: 'text-green-400' },
                  weibo: { logo: '📱', color: 'text-red-400' },
                  xiaohongshu: { logo: '📖', color: 'text-pink-400' },
                  douyin: { logo: '🎵', color: 'text-gray-400' },
                  pinterest: { logo: '📌', color: 'text-red-400' },
                  instagram: { logo: '📷', color: 'text-purple-400' },
                  twitter: { logo: '🐦', color: 'text-blue-400' },
                  youtube: { logo: '📺', color: 'text-red-500' }
                };
                const brand = platformBrands[platform as keyof typeof platformBrands] || platformBrands.wechat;
                
                return (
                  <div key={platform} className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                    <span className={`text-lg ${brand.color}`}>{brand.logo}</span>
                    <span className="text-white text-base font-medium">{config.displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 生成内容预览 */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-400/30">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            AI将为你生成以下内容
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-400 font-bold text-base">5</span>
              </div>
              <div>
                <p className="text-white font-medium text-base mb-1">开篇钩子</p>
                <p className="text-slate-400 text-sm">5个吸引人的开场白</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold text-base">主</span>
              </div>
              <div>
                <p className="text-white font-medium text-base mb-1">主要内容</p>
                <p className="text-slate-400 text-sm">平台优化的核心内容</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-base">15</span>
              </div>
              <div>
                <p className="text-white font-medium text-base mb-1">话题标签</p>
                <p className="text-slate-400 text-sm">15个热门标签</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 font-bold text-base">5</span>
              </div>
              <div>
                <p className="text-white font-medium text-base mb-1">视觉提示</p>
                <p className="text-slate-400 text-sm">5个AI生图提示词</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-orange-400 font-bold text-base">3</span>
              </div>
              <div>
                <p className="text-white font-medium text-base mb-1">A/B测试标题</p>
                <p className="text-slate-400 text-sm">3个测试版本</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold text-base">AI</span>
              </div>
              <div>
                <p className="text-white font-medium text-base mb-1">质量评分</p>
                <p className="text-slate-400 text-sm">AI质量评估</p>
              </div>
            </div>
          </div>
        </div>

        {/* 预计生成时间 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium text-lg">预计生成时间</p>
                <p className="text-slate-400 text-base">AI正在准备为你创作内容</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-400">{estimatedTime}秒</p>
              <p className="text-slate-400 text-base">完成生成</p>
            </div>
          </div>
        </div>
      </div>

      {/* 准备就绪提示 - 紧凑设计 */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-400/30 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1 text-lg">一切准备就绪！</h3>
            <p className="text-slate-300 mb-2 text-sm">
              AI将为你生成高质量的全平台内容，每个平台都会根据特性进行优化。
            </p>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <ArrowRight className="w-4 h-4" />
              <span>点击"生成内容"开始创作</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Confirmation;