
"use client";

import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  milestones: { step: number; label: string }[];
  onBack: () => void;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  currentStep,
  totalSteps,
  milestones,
  onBack,
}) => {
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

  const getMilestoneStatus = (
    milestoneStep: number
  ): 'completed' | 'active' | 'upcoming' => {
    if (currentStep > milestoneStep) return 'completed';
    if (currentStep === milestoneStep) return 'active';
    // Find the previous milestone to see if we are between milestones
    const currentMilestoneIndex = milestones.findIndex(m => m.step === milestoneStep);
    const prevMilestone = milestones[currentMilestoneIndex-1];
    if (prevMilestone && currentStep > prevMilestone.step) {
        return 'active';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-2">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          disabled={currentStep === 0}
          className="text-primary disabled:opacity-50"
          style={{ color: '#014946' }}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="relative flex-1">
          {/* Progress track */}
          <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-gray-200 rounded-full" />
          {/* Progress fill */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-300"
            style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: '#194f2a',
             }}
          />
          {/* Milestones */}
          <div className="relative flex justify-between items-center w-full">
            {milestones.map(({ step, label }) => {
              const status = getMilestoneStatus(step);
              const positionPercentage = (step / (totalSteps - 1)) * 100;

              return (
                <div
                  key={step}
                  className="relative flex flex-col items-center group"
                  style={{
                    position: 'absolute',
                    left: `${positionPercentage}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                      {
                        'bg-[#194f2a] border-[#194f2a]': status === 'completed',
                        'bg-white border-[#194f2a]': status === 'active',
                        'bg-gray-200 border-gray-300': status === 'upcoming',
                      }
                    )}
                  >
                    {status === 'completed' && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                     {status === 'active' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#194f2a]" />
                    )}
                  </div>
                   <div className="absolute top-full mt-2 text-center text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#014946' }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-10 h-10"></div>
      </div>
    </div>
  );
};

export default QuizProgress;
