import React from 'react';
import { Question } from '../../../types';

interface MultipleChoiceMultipleProps {
  question: Question;
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}

const MultipleChoiceMultiple: React.FC<MultipleChoiceMultipleProps> = ({
  question,
  selectedOptions = [],
  onChange,
}) => {
  const handleOptionClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      // Remove option if already selected
      onChange(selectedOptions.filter(o => o !== option));
    } else {
      // Add option (no limit on number of selections)
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div>
      <p className="text-lg mb-6">
        {question.question}
      </p>
      
      <div className="mb-2 text-sm text-gray-600">
        Select all answers that apply.
      </div>
      
      <div className="space-y-3 mt-4">
        {question.options.map((option: string, index: number) => (
          <div 
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`
              p-3 rounded-lg border cursor-pointer transition-colors
              ${selectedOptions.includes(option) 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center">
              <div className={`
                w-5 h-5 rounded flex items-center justify-center mr-3 border
                ${selectedOptions.includes(option) 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-gray-300'
                }
              `}>
                {selectedOptions.includes(option) && '✓'}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceMultiple; 