'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputForm from '@/components/InputForm';
import ResultsView from '@/components/ResultsView';
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
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl px-8 py-6">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-white text-lg font-semibold">正在生成爆款内容...</p>
                <p className="text-blue-200 text-sm">为所有平台创建优化内容</p>
              </div>
            </div>
          </div>
        </div>
      );
    
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
          isLoading={appState === 'loading'}
          onBack={handleBackToHome}
        />
      );
  }
}