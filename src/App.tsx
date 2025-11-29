import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';
import { ContentInputs, ContentResults, generateContentPackage } from './services/contentGenerator';
import './App.css';

type AppState = 'landing' | 'form' | 'results' | 'loading';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [results, setResults] = useState<ContentResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartCreating = () => {
    setAppState('form');
  };

  const handleGenerate = async (inputs: ContentInputs) => {
    setIsLoading(true);
    setAppState('loading');
    
    // Simulate realistic generation time for better UX
    setTimeout(() => {
      try {
        const generatedResults = generateContentPackage(inputs);
        setResults(generatedResults);
        setAppState('results');
      } catch (error) {
        console.error('Content generation error:', error);
        // Handle error appropriately - could show error state
        setAppState('form');
      } finally {
        setIsLoading(false);
      }
    }, 2000); // 2 second delay for realistic feel
  };

  const handleRegenerate = (platform: string) => {
    // This could be extended to regenerate specific platforms
    console.log(`Regenerating content for ${platform}`);
  };

  const handleBackToForm = () => {
    setAppState('form');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setResults(null);
  };

  // Render based on current app state
  switch (appState) {
    case 'landing':
      return <LandingPage onStartCreating={handleStartCreating} />;
    
    case 'form':
      return (
        <div>
          {/* Back to Landing Navigation */}
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={handleBackToLanding}
              className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-blue-200 px-4 py-2 rounded-lg hover:text-white hover:border-slate-600 transition-all"
            >
              ← 返回首页
            </button>
          </div>
          <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
      );
    
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
        <div>
          {/* Navigation Header */}
          <div className="fixed top-4 left-4 right-4 z-50">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToForm}
                className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-blue-200 px-4 py-2 rounded-lg hover:text-white hover:border-slate-600 transition-all"
              >
                ← 生成新内容
              </button>
              <button
                onClick={handleBackToLanding}
                className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-blue-200 px-4 py-2 rounded-lg hover:text-white hover:border-slate-600 transition-all"
              >
                首页
              </button>
            </div>
          </div>
          {results && (
            <div className="pt-20">
              <ResultsView results={results} onRegenerate={handleRegenerate} />
            </div>
          )}
        </div>
      );
    
    default:
      return <LandingPage onStartCreating={handleStartCreating} />;
  }
}

export default App;