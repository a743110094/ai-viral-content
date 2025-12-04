'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle } from 'lucide-react';
import { ContentInputs, PlatformType, PLATFORM_CONFIGS, DEFAULT_SELECTED_PLATFORMS } from '@/types/content';

interface Step3PlatformStyleProps {
  data?: Partial<ContentInputs>;
  onDataChange?: (data: Partial<ContentInputs>) => void;
  isValidating?: boolean;
}

const Step3PlatformStyle: React.FC<Step3PlatformStyleProps> = ({ 
  data = {}, 
  onDataChange = () => {}, 
  isValidating = false 
}) => {
  const [errors, setErrors] = React.useState<{ selectedPlatforms?: string }>({});
  const [recommendedPlatforms, setRecommendedPlatforms] = useState<PlatformType[]>([]);

  // 根据领域智能推荐平台
  useEffect(() => {
    if (data.niche) {
      const recommendations = getPlatformRecommendations(data.niche);
      setRecommendedPlatforms(recommendations);
      
      // 如果有推荐且用户还没选择平台，自动选择推荐平台
      if (recommendations.length > 0 && (!data.selectedPlatforms || data.selectedPlatforms.length === 0)) {
        onDataChange({ ...data, selectedPlatforms: recommendations });
      }
    }
  }, [data.niche]);

  const validate = () => {
    const newErrors: { selectedPlatforms?: string } = {};
    
    if (!data.selectedPlatforms || data.selectedPlatforms.length === 0) {
      newErrors.selectedPlatforms = '请至少选择一个平台';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlatformToggle = (platform: PlatformType) => {
    const currentPlatforms = data.selectedPlatforms || [];
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter(p => p !== platform)
      : [...currentPlatforms, platform];
    
    onDataChange({ ...data, selectedPlatforms: newPlatforms });
    
    if (errors.selectedPlatforms && newPlatforms.length > 0) {
      setErrors(prev => ({ ...prev, selectedPlatforms: undefined }));
    }
  };

  const handleSelectAllChinese = () => {
    onDataChange({ ...data, selectedPlatforms: ['wechat', 'weibo', 'xiaohongshu', 'douyin'] });
  };

  const handleSelectAllGlobal = () => {
    onDataChange({ ...data, selectedPlatforms: ['pinterest', 'instagram', 'twitter', 'youtube'] });
  };

  const handleSelectAll = () => {
    onDataChange({ ...data, selectedPlatforms: Object.keys(PLATFORM_CONFIGS) as PlatformType[] });
  };

  const handleToneChange = (tone: ContentInputs['tone']) => {
    onDataChange({ ...data, tone });
  };

  const handleMainGoalChange = (mainGoal: ContentInputs['mainGoal']) => {
    onDataChange({ ...data, mainGoal });
  };

  const handleProductLinkChange = (productLink: string) => {
    onDataChange({ ...data, productLink });
  };

  // 智能推荐平台
  const getPlatformRecommendations = (niche: string): PlatformType[] => {
    const nicheLower = niche.toLowerCase();
    const recommendations: PlatformType[] = [];

    // 根据关键词推荐平台
    if (nicheLower.includes('美妆') || nicheLower.includes('时尚') || nicheLower.includes('护肤')) {
      recommendations.push('xiaohongshu', 'instagram', 'pinterest');
    }
    if (nicheLower.includes('健身') || nicheLower.includes('运动') || nicheLower.includes('健康')) {
      recommendations.push('instagram', 'douyin', 'youtube');
    }
    if (nicheLower.includes('教育') || nicheLower.includes('学习') || nicheLower.includes('知识')) {
      recommendations.push('wechat', 'youtube', 'xiaohongshu');
    }
    if (nicheLower.includes('科技') || nicheLower.includes('互联网') || nicheLower.includes('编程')) {
      recommendations.push('twitter', 'weibo', 'youtube');
    }
    if (nicheLower.includes('美食') || nicheLower.includes('烹饪') || nicheLower.includes('餐饮')) {
      recommendations.push('douyin', 'xiaohongshu', 'instagram');
    }
    if (nicheLower.includes('母婴') || nicheLower.includes('育儿') || nicheLower.includes('儿童')) {
      recommendations.push('xiaohongshu', 'wechat', 'pinterest');
    }

    // 如果没有匹配到特定领域，返回默认推荐
    if (recommendations.length === 0) {
      return DEFAULT_SELECTED_PLATFORMS;
    }

    // 去重并返回
    return Array.from(new Set(recommendations));
  };

  // 获取平台推荐原因
  const getPlatformRecommendationReason = (platform: PlatformType): string => {
    const reasons: Record<PlatformType, string> = {
      wechat: '适合深度内容和私域运营',
      weibo: '适合热点传播和话题营销',
      xiaohongshu: '适合种草式产品推荐',
      douyin: '适合短视频和娱乐内容',
      pinterest: '适合视觉导向的生活方式内容',
      instagram: '适合个人品牌和视觉营销',
      twitter: '适合观点分享和实时互动',
      youtube: '适合长视频和教程内容'
    };
    return reasons[platform] || '综合推荐';
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      {/* 页面标题 - 美观的两行布局 */}
      <div className="flex items-start gap-5 mb-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-cyan-400 to-blue-500 rounded-xl shadow-2xl shadow-cyan-500/30 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <span className="text-2xl filter drop-shadow-sm">📱</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          </div>
        </div>
        <div className="flex-1 pt-1">
          <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
            选择平台和风格
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            选择适合的内容发布平台，配置文案风格和营销目标
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
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 增加呼吸感 */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl flex-1 overflow-y-auto">
        {/* 基本配置区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-lg font-medium text-blue-200 mb-3">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                文案风格/调性
              </span>
            </label>
            <select
              value={data.tone || 'Professional'}
              onChange={(e) => handleToneChange(e.target.value as ContentInputs['tone'])}
              className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-base"
              disabled={isValidating}
            >
              <option value="Professional">专业权威</option>
              <option value="Humorous">幽默风趣</option>
              <option value="Luxury">高端奢华</option>
              <option value="Inspiring">励志激励</option>
              <option value="Aggressive Marketing">强势营销</option>
              <option value="Friendly Mentor">亲切导师</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-blue-200 mb-3">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                主要目标
              </span>
            </label>
            <select
              value={data.mainGoal || 'Grow Followers'}
              onChange={(e) => handleMainGoalChange(e.target.value as ContentInputs['mainGoal'])}
              className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-base"
              disabled={isValidating}
            >
              <option value="Grow Followers">涨粉引流</option>
              <option value="Drive Affiliate Clicks">推广点击</option>
              <option value="Sell Product">产品销售</option>
              <option value="Build Brand Awareness">品牌曝光</option>
            </select>
          </div>
        </div>

        {/* 产品/推广链接 */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-blue-200 mb-3">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              产品/推广链接
              <span className="text-sm text-slate-400 font-normal ml-3">可选填，用于内容中插入链接</span>
            </span>
          </label>
          <input
            type="url"
            value={data.productLink || ''}
            onChange={(e) => handleProductLinkChange(e.target.value)}
            placeholder="https://你的产品链接.com"
            className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-base"
            disabled={isValidating}
          />
        </div>

        {/* 平台选择 */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-green-400" />
            <label className="text-xl font-semibold text-white">
              选择内容创作平台 *
              <span className="text-sm text-slate-400 font-normal ml-3">🤖 AI会根据领域智能推荐</span>
            </label>
          </div>

          {/* 批量选择按钮 */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              type="button"
              onClick={handleSelectAllChinese}
              className="px-3 py-2 bg-green-500/10 border border-green-400/30 text-green-300 rounded text-sm hover:bg-green-500/20 hover:border-green-400/50 transition-all"
              disabled={isValidating}
            >
              🇨🇳 中国
            </button>
            <button
              type="button"
              onClick={handleSelectAllGlobal}
              className="px-3 py-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 rounded text-sm hover:bg-blue-500/20 hover:border-blue-400/50 transition-all"
              disabled={isValidating}
            >
              🌍 国际
            </button>
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3 py-2 bg-purple-500/10 border border-purple-400/30 text-purple-300 rounded text-sm hover:bg-purple-500/20 hover:border-purple-400/50 transition-all"
              disabled={isValidating}
            >
              🌟 全选
            </button>
          </div>

          {/* 平台网格 - 响应式布局，100px最小宽度 */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 mb-4">
            {Object.entries(PLATFORM_CONFIGS).map(([platform, config]) => {
              const isSelected = data.selectedPlatforms?.includes(platform as PlatformType);
              const isRecommended = recommendedPlatforms.includes(platform as PlatformType);
              
              // 为每个平台定义品牌Logo和颜色
              const platformBrands = {
                wechat: {
                  logo: '💬',
                  brandColor: 'bg-green-500',
                  textColor: 'text-green-300',
                  bgColor: 'bg-green-500/10',
                  borderColor: 'border-green-400/30',
                  hoverBg: 'hover:bg-green-500/15'
                },
                weibo: {
                  logo: '📱',
                  brandColor: 'bg-red-500',
                  textColor: 'text-red-300',
                  bgColor: 'bg-red-500/10',
                  borderColor: 'border-red-400/30',
                  hoverBg: 'hover:bg-red-500/15'
                },
                xiaohongshu: {
                  logo: '📖',
                  brandColor: 'bg-pink-500',
                  textColor: 'text-pink-300',
                  bgColor: 'bg-pink-500/10',
                  borderColor: 'border-pink-400/30',
                  hoverBg: 'hover:bg-pink-500/15'
                },
                douyin: {
                  logo: '🎵',
                  brandColor: 'bg-black',
                  textColor: 'text-gray-300',
                  bgColor: 'bg-gray-500/10',
                  borderColor: 'border-gray-400/30',
                  hoverBg: 'hover:bg-gray-500/15'
                },
                pinterest: {
                  logo: '📌',
                  brandColor: 'bg-red-600',
                  textColor: 'text-red-300',
                  bgColor: 'bg-red-500/10',
                  borderColor: 'border-red-400/30',
                  hoverBg: 'hover:bg-red-500/15'
                },
                instagram: {
                  logo: '📷',
                  brandColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
                  textColor: 'text-purple-300',
                  bgColor: 'bg-purple-500/10',
                  borderColor: 'border-purple-400/30',
                  hoverBg: 'hover:bg-purple-500/15'
                },
                twitter: {
                  logo: '🐦',
                  brandColor: 'bg-blue-500',
                  textColor: 'text-blue-300',
                  bgColor: 'bg-blue-500/10',
                  borderColor: 'border-blue-400/30',
                  hoverBg: 'hover:bg-blue-500/15'
                },
                youtube: {
                  logo: '📺',
                  brandColor: 'bg-red-600',
                  textColor: 'text-red-300',
                  bgColor: 'bg-red-500/10',
                  borderColor: 'border-red-400/30',
                  hoverBg: 'hover:bg-red-500/15'
                }
              };

              const brand = platformBrands[platform as keyof typeof platformBrands] || platformBrands.wechat;
              
              return (
                <div
                  key={platform}
                  onClick={() => !isValidating && handlePlatformToggle(platform as PlatformType)}
                  className={`relative group cursor-pointer transition-all duration-200 ${
                    isSelected ? 'z-10' : 'hover:z-5'
                  } ${isValidating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`
                    ${brand.bgColor} ${brand.hoverBg} backdrop-blur-sm
                    ${brand.borderColor} hover:border-opacity-60
                    border-2 rounded-lg p-2 text-center shadow-md
                    transition-all duration-200 group-hover:shadow-lg
                    ${isSelected ? 'border-yellow-400 shadow-yellow-400/40 shadow-2xl bg-yellow-400/5' : ''}
                    ${isRecommended && !isSelected ? 'border-blue-400/50' : ''}
                  `}>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-yellow-900 text-xs font-bold">✓</span>
                      </div>
                    )}
                    
                    {isRecommended && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-blue-900 text-xs font-bold">!</span>
                      </div>
                    )}

                    {/* 平台Logo */}
                    <div className={`w-5 h-5 ${brand.brandColor} rounded flex items-center justify-center text-white text-sm mb-1 mx-auto`}>
                      {brand.logo}
                    </div>

                    {/* 平台名称 */}
                    <h3 className={`font-semibold text-xs mb-1 ${brand.textColor}`}>
                      {config.displayName}
                    </h3>

                    {/* 简短描述 */}
                    <p className="text-[10px] text-slate-400 opacity-90 leading-tight">
                      {config.description.split('，')[0]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {errors.selectedPlatforms && (
            <p className="text-red-400 text-base mb-3">{errors.selectedPlatforms}</p>
          )}

          {/* 已选平台统计 */}
          <div className="p-3 bg-slate-800/70 backdrop-blur-sm rounded-lg border border-slate-600 mb-3">
            <p className="text-base text-slate-300">
              <span className="font-medium text-white">已选择 {data.selectedPlatforms?.length || 0} 个平台：</span>
              <span className="ml-2">
                {data.selectedPlatforms?.map(platform =>
                  PLATFORM_CONFIGS[platform].displayName
                ).join('、') || '请选择平台'}
              </span>
            </p>
          </div>

          {/* 智能推荐提示 */}
          {recommendedPlatforms.length > 0 && (
            <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/30">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-white font-medium mb-1 text-base">💡 智能推荐</p>
                  <p className="text-slate-300 text-sm">
                    基于你的领域，我们推荐：{recommendedPlatforms.map(p => PLATFORM_CONFIGS[p].displayName).join('、')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3PlatformStyle;