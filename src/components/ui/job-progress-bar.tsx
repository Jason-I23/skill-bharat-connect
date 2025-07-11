
import React from 'react';
import { Progress } from './progress';
import { CheckCircle, Circle } from 'lucide-react';

interface JobStage {
  name: string;
  completed: boolean;
  date: string | null;
}

interface JobProgressBarProps {
  stages: JobStage[];
  currentStage: number;
  className?: string;
}

export const JobProgressBar: React.FC<JobProgressBarProps> = ({
  stages,
  currentStage,
  className
}) => {
  const progressPercentage = (currentStage / (stages.length - 1)) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {stages.map((stage, index) => (
          <div
            key={stage.name}
            className={`flex items-center gap-2 p-2 rounded text-sm ${
              stage.completed
                ? 'bg-green-50 text-green-700'
                : index === currentStage
                ? 'bg-blue-50 text-blue-700'
                : 'bg-gray-50 text-gray-500'
            }`}
          >
            {stage.completed ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
            <div className="flex-1">
              <div className="font-medium">{stage.name}</div>
              {stage.date && (
                <div className="text-xs opacity-75">
                  {new Date(stage.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
