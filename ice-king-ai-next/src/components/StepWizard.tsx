'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Circle } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

interface StepWizardProps {
  steps: Step[];
  onComplete: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

const StepWizard: React.FC<StepWizardProps> = ({ steps, onComplete, onCancel, className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  const handleNext = async () => {
    const step = steps[currentStep];
    
    if (step.validate) {
      setIsValidating(true);
      try {
        const isValid = await step.validate();
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      } catch (error) {
        console.error('Step validation error:', error);
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 最后一步，完成向导
      onComplete(stepData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleStepData = (stepId: string, data: any) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const getAllData = () => {
    const allData: any = {};
    Object.values(stepData).forEach(stepData => {
      Object.assign(allData, stepData);
    });
    return allData;
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className={`h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col ${className || ''}`}>
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col p-4">
        {/* 进度指示器 - 增加呼吸感 */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isClickable = index <= currentStep; // 只允许回到已访问的步骤

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => isClickable && goToStep(index)}
                    className={`flex items-center gap-3 flex-1 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    disabled={!isClickable}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      isActive ? 'border-yellow-400 bg-yellow-400 text-slate-900' :
                      isCompleted ? 'border-green-400 bg-green-400 text-slate-900' :
                      'border-slate-600 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="hidden sm:block text-left flex-1">
                      <div className={`text-sm font-medium transition-colors duration-200
                        ${isActive ? 'text-yellow-400' : 
                          isCompleted ? 'text-green-400' : 
                          'text-slate-400'}`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-slate-500 hidden lg:block">{step.description}</div>
                    </div>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-colors duration-200 ${
                      isCompleted ? 'bg-green-400' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 当前步骤内容 - 增加呼吸感 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex-1 min-h-0">
          <div className="h-full overflow-y-auto">
            {React.cloneElement(steps[currentStep].component as React.ReactElement, {
              onDataChange: (data: any) => handleStepData(steps[currentStep].id, data),
              data: stepData[steps[currentStep].id] || {},
              allStepData: stepData, // 传递所有步骤的数据给当前步骤
              isValidating: isValidating
            })}
          </div>
        </div>

        {/* 导航按钮 - 增加呼吸感 */}
        <div className="flex items-center justify-between mt-6 flex-shrink-0">
          <button
            onClick={handlePrevious}
            className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-blue-200 px-4 py-3 rounded-lg hover:text-white hover:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
            disabled={isValidating}
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep === 0 ? '取消' : '上一步'}
          </button>

          <div className="text-base text-slate-400">
            步骤 {currentStep + 1} / {steps.length}
          </div>

          <button
            onClick={handleNext}
            disabled={isValidating}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-semibold px-6 py-3 rounded-lg hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {currentStep === steps.length - 1 ? '生成内容' : '下一步'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepWizard;