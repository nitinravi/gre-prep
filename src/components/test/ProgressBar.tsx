import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, answered }) => {
  const progressPercentage = (current / total) * 100;
  const answeredPercentage = (answered / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm text-gray-600">
        <div>Question {current} of {total}</div>
        <div>{answered} answered</div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;