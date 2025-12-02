'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputForm from '@/components/InputForm';
import ResultsView from '@/components/ResultsView';
import FunLoadingAnimation from '@/components/FunLoadingAnimation';
import { ContentInputs, ContentResults } from '@/types/content';

type AppState = 'form' | 'loading' | 'results';

export default function GeneratePage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>('form');
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
      console.log('API Response:', data);

      if (!data.success || !data.data) {
        throw new Error(data.error?.message || '生成失败');
      }

      setResults(data.data);
      setAppState('results');
      
    } catch (error) {
      console.error('Content generation error:', error);
      // Show error message to user
      alert(`内容生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setAppState('form');
    }
  };

  const handleBackToForm = () => {
    setAppState('form');
    setResults(null);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleRegenerate = (platform: string) => {
    if (platform === 'all') {
      // Regenerate all content
      setAppState('form');
      setResults(null);
    }
  };

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
        <InputForm 
          onGenerate={handleGenerate} 
          isLoading={false}
          onBack={handleBackToHome}
        />
      );
  }
}