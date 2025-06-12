import React from 'react';
import { Question } from '../../../types';

interface SentenceEquivalenceProps {
  question: Question;
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}

const SentenceEquivalence: React.FC<SentenceEquivalenceProps> = ({
  question,
  selectedOptions = [],
  onChange,
}) => {
  const handleOptionClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      // Remove option if already selected
      onChange(selectedOptions.filter(o => o !== option));
    } else if (selectedOptions.length < 2) {
      // Add option if less than 2 are selected
      onChange([...selectedOptions, option]);
    } else {
      // Replace the first selected option if 2 are already selected
      onChange([selectedOptions[1], option]);
    }
  };

  return (
    <div>
      <p className="text-lg mb-6">
        {question.question}
      </p>
      
      <div className="mb-2 text-sm text-gray-600">
        Select two answers that, when substituted for the blank, yield sentences with equivalent meanings.
      </div>
      
      <div className="space-y-3 mt-4">
        {question.options.map((option, index) => (
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
                w-5 h-5 rounded-full flex items-center justify-center mr-3
                ${selectedOptions.includes(option) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
                }
              `}>
                {selectedOptions.includes(option) && (
                  <span className="text-xs font-bold">{selectedOptions.indexOf(option) + 1}</span>
                )}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentenceEquivalence;