'use client';

import React, { useState } from 'react';
import { Brain, X } from 'lucide-react';
import { ContentInputs } from '@/types/content';
import SimpleAnalyzeLoading from '../SimpleAnalyzeLoading';

interface Step2AudienceSellingProps {
  data?: Partial<ContentInputs>;
  onDataChange?: (data: Partial<ContentInputs>) => void;
  isValidating?: boolean;
  allStepData?: Record<string, any>; // 接收所有步骤的数据
}

const Step2AudienceSelling: React.FC<Step2AudienceSellingProps> = ({ 
  data = {}, 
  onDataChange = () => {}, 
  isValidating = false,
  allStepData = {}
}) => {
  // 获取niche字段（从当前步骤数据或从第一步数据中获取）
  const getNiche = () => {
    return data.niche?.trim() || allStepData?.step1?.niche?.trim() || '';
  };
  const [errors, setErrors] = React.useState<{ targetAudience?: string; sellingPoints?: string }>({});
  const [isAnalyzingAudience, setIsAnalyzingAudience] = useState(false);
  const [isAnalyzingSellingPoints, setIsAnalyzingSellingPoints] = useState(false);

  const validate = () => {
    const newErrors: { targetAudience?: string; sellingPoints?: string } = {};
    
    if (!data.targetAudience?.trim()) {
      newErrors.targetAudience = '请输入目标受众';
    }
    
    if (!data.sellingPoints?.trim()) {
      newErrors.sellingPoints = '请输入产品卖点';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTargetAudienceChange = (value: string) => {
    onDataChange({ ...data, targetAudience: value });
    if (errors.targetAudience && value.trim()) {
      setErrors(prev => ({ ...prev, targetAudience: undefined }));
    }
  };

  const handleSellingPointsChange = (value: string) => {
    onDataChange({ ...data, sellingPoints: value });
    if (errors.sellingPoints && value.trim()) {
      setErrors(prev => ({ ...prev, sellingPoints: undefined }));
    }
  };

  const handleAnalyzeAudience = async () => {
    if (!getNiche()) {
      setErrors(prev => ({ ...prev, targetAudience: '请先填写领域/话题信息' }));
      return;
    }

    setIsAnalyzingAudience(true);
    try {
      console.log('正在分析目标受众...');
      
      const response = await fetch('/api/audience-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: getNiche(),
          topic: ''
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '分析失败');
      }

      const result = await response.json();
      
      if (!result.success || !result.data?.analysis) {
        throw new Error(result.error?.message || '分析失败');
      }

      // 自动填充目标受众字段
      onDataChange({ ...data, targetAudience: result.data.analysis });
      
      // 清除错误信息
      if (errors.targetAudience) {
        setErrors(prev => ({ ...prev, targetAudience: undefined }));
      }

      console.log('受众分析完成:', result.data.analysis);
      
    } catch (error) {
      console.error('受众分析错误:', error);
      alert(`受众分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsAnalyzingAudience(false);
    }
  };

  const handleAnalyzeSellingPoints = async () => {
    if (!getNiche()) {
      setErrors(prev => ({ ...prev, sellingPoints: '请先填写领域/话题信息' }));
      return;
    }

    setIsAnalyzingSellingPoints(true);
    try {
      console.log('正在分析产品卖点...');
      
      const response = await fetch('/api/selling-points-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: getNiche(),
          topic: ''
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '分析失败');
      }

      const result = await response.json();
      
      if (!result.success || !result.data?.analysis) {
        throw new Error(result.error?.message || '分析失败');
      }

      // 自动填充卖点字段
      onDataChange({ ...data, sellingPoints: result.data.analysis });
      
      // 清除错误信息
      if (errors.sellingPoints) {
        setErrors(prev => ({ ...prev, sellingPoints: undefined }));
      }

      console.log('卖点分析完成:', result.data.analysis);
      
    } catch (error) {
      console.error('卖点分析错误:', error);
      alert(`卖点分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsAnalyzingSellingPoints(false);
    }
  };

  // 目标受众示例
  const audienceExamples = [
    '25-35岁职场女性，关注个人成长',
    '大学生群体，对科技产品感兴趣',
    '中年父母，关注子女教育',
    '健身爱好者，追求健康生活方式'
  ];

  // 卖点示例
  const sellingPointExamples = [
    '高效便捷，节省时间',
    '专业权威，值得信赖',
    '性价比高，物超所值',
    '创新独特，引领潮流'
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* 页面标题 - 美观的两行布局 */}
      <div className="flex items-start gap-5 mb-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-400 to-pink-500 rounded-xl shadow-2xl shadow-purple-500/30 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <span className="text-2xl filter drop-shadow-sm">👥</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          </div>
        </div>
        <div className="flex-1 pt-1">
          <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
            精准定位你的受众
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            清晰的受众画像和产品卖点，让AI为你创作更具针对性的爆款内容
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
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 增加呼吸感 */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl flex-1 overflow-y-auto">
        {/* 目标受众 - 主要输入区域 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xl font-semibold text-white flex items-center gap-3">
              <span className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
              你的目标受众是谁？ *
              <span className="text-sm text-slate-400 font-normal ml-3">🤖 AI可智能分析生成建议</span>
            </label>
            <button
              type="button"
              onClick={handleAnalyzeAudience}
              disabled={isValidating || isAnalyzingAudience || !getNiche()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
              title="智能分析目标受众"
            >
              {isAnalyzingAudience ? (
                <SimpleAnalyzeLoading className="text-sm" />
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  AI智能分析
                </>
              )}
            </button>
          </div>
          
          <div className="relative">
            <textarea
              value={data.targetAudience || ''}
              onChange={(e) => handleTargetAudienceChange(e.target.value)}
              placeholder="例如：25-40岁的时间管理困难职场妈妈、寻求工作流程自动化的科技企业家..."
              className={`w-full h-24 bg-slate-900/50 border-2 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all resize-none text-lg ${
                errors.targetAudience ? 'border-red-500' : 'border-slate-600'
              }`}
              disabled={isValidating || isAnalyzingAudience}
            />
            <div className="absolute bottom-3 right-3 text-sm text-slate-500">
              {data.targetAudience?.length || 0} / 300
            </div>
          </div>
          
          {errors.targetAudience && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-base">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
              {errors.targetAudience}
            </div>
          )}
          
          {/* 示例标签 - 增加间距 */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-3">
              {audienceExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleTargetAudienceChange(example)}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-full text-base text-slate-300 hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-purple-300 transition-all duration-200"
                  disabled={isValidating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 产品卖点 - 主要输入区域 */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xl font-semibold text-white flex items-center gap-3">
              <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></span>
              产品核心卖点是什么？ *
              <span className="text-sm text-slate-400 font-normal ml-3">🤖 AI可智能分析生成建议</span>
            </label>
            <button
              type="button"
              onClick={handleAnalyzeSellingPoints}
              disabled={isValidating || isAnalyzingSellingPoints || !getNiche()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-yellow-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/25"
              title="智能分析产品卖点"
            >
              {isAnalyzingSellingPoints ? (
                <SimpleAnalyzeLoading className="text-sm" />
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  AI智能分析
                </>
              )}
            </button>
          </div>
          
          <div className="relative">
            <textarea
              value={data.sellingPoints || ''}
              onChange={(e) => handleSellingPointsChange(e.target.value)}
              placeholder="例如：高效便捷，科学有效，性价比高，专业指导，安全可靠..."
              className={`w-full h-24 bg-slate-900/50 border-2 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all resize-none text-lg ${
                errors.sellingPoints ? 'border-red-500' : 'border-slate-600'
              }`}
              disabled={isValidating || isAnalyzingSellingPoints}
            />
            <div className="absolute bottom-3 right-3 text-sm text-slate-500">
              {data.sellingPoints?.length || 0} / 300
            </div>
          </div>
          
          {errors.sellingPoints && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-base">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
              {errors.sellingPoints}
            </div>
          )}
          
          {/* 示例标签 - 增加间距 */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-3">
              {sellingPointExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleSellingPointsChange(example)}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-full text-base text-slate-300 hover:bg-yellow-500/20 hover:border-yellow-400/50 hover:text-yellow-300 transition-all duration-200"
                  disabled={isValidating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2AudienceSelling;