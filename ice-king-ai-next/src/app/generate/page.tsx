'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepWizard from '@/components/StepWizard';
import ResultsView from '@/components/ResultsView';
import FunLoadingAnimation from '@/components/FunLoadingAnimation';
import Step1BasicInfo from '@/components/steps/Step1BasicInfo';
import Step2AudienceSelling from '@/components/steps/Step2AudienceSelling';
import Step3PlatformStyle from '@/components/steps/Step3PlatformStyle';
import Step4Confirmation from '@/components/steps/Step4Confirmation';
import { ContentInputs, ContentResults } from '@/types/content';

type AppState = 'wizard' | 'loading' | 'results';

export default function GeneratePage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>('wizard');
  const [results, setResults] = useState<ContentResults | null>(null);

  const handleGenerate = async (inputs: ContentInputs) => {
    setAppState('loading');
    
    try {
      console.log('Generating content with inputs:', inputs);
      
      // Call the API
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs,
          config: {
            modelProvider: 'openai',
            modelName: 'gpt-4',
            temperature: 0.8,
            enableCache: true,
            language: 'zh-CN'
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '生成失败');
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error?.message || '生成失败');
      }

      setResults(data.data);
      setAppState('results');
      
    } catch (error) {
      console.error('Content generation error:', error);
      // Show error message to user
      alert(`内容生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setAppState('wizard');
    }
  };

  const handleBackToForm = () => {
    setAppState('wizard');
    setResults(null);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleRegenerate = (platform: string) => {
    if (platform === 'all') {
      // Regenerate all content
      setAppState('wizard');
      setResults(null);
    }
  };

  const handleWizardComplete = (wizardData: any) => {
    // 合并所有步骤的数据
    const finalData: ContentInputs = {
      niche: wizardData.step1?.niche || '',
      productLink: wizardData.step3?.productLink || '',
      targetAudience: wizardData.step2?.targetAudience || '',
      sellingPoints: wizardData.step2?.sellingPoints || '',
      tone: wizardData.step3?.tone || 'Professional',
      mainGoal: wizardData.step3?.mainGoal || 'Grow Followers',
      selectedPlatforms: wizardData.step3?.selectedPlatforms || [],
      uploadedImage: wizardData.step1?.uploadedImage,
      imageDescription: wizardData.step1?.imageDescription
    };
    
    handleGenerate(finalData);
  };

  // 定义步骤
  const steps = [
    {
      id: 'step1',
      title: '基础信息',
      description: '配置领域和参考图片',
      component: <Step1BasicInfo />,
      validate: () => {
        // 验证逻辑在组件内部处理
        return true;
      }
    },
    {
      id: 'step2',
      title: '受众与卖点',
      description: '定义目标受众和产品优势',
      component: <Step2AudienceSelling />,
      validate: () => {
        // 验证逻辑在组件内部处理
        return true;
      }
    },
    {
      id: 'step3',
      title: '平台与风格',
      description: '选择平台和配置风格',
      component: <Step3PlatformStyle />,
      validate: () => {
        // 验证逻辑在组件内部处理
        return true;
      }
    },
    {
      id: 'step4',
      title: '确认生成',
      description: '确认配置并生成内容',
      component: <Step4Confirmation />,
      validate: () => {
        // 最后一步不需要验证
        return true;
      }
    }
  ];

  // Render based on current app state
  switch (appState) {
    case 'loading':
      return <FunLoadingAnimation type="generate" />;
    
    case 'results':
      return (
        <ResultsView 
          results={results!} 
          onBack={handleBackToForm}
          onRegenerate={handleRegenerate}
        />
      );
    
    default:
      return (
        <StepWizard 
          steps={steps}
          onComplete={handleWizardComplete}
          onCancel={handleBackToHome}
        />
      );
  }
}