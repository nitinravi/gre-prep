import React from 'react';
import { Question } from '../../../types';

interface QuantitativeComparisonProps {
  question: Question;
  selectedOption: string;
  onChange: (option: string) => void;
}

const QuantitativeComparison: React.FC<QuantitativeComparisonProps> = ({
  question,
  selectedOption,
  onChange,
}) => {
  const options = [
    { value: 'A', label: 'Quantity A is greater' },
    { value: 'B', label: 'Quantity B is greater' },
    { value: 'C', label: 'The two quantities are equal' },
    { value: 'D', label: 'The relationship cannot be determined' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap font-mono text-sm">{question.question}</pre>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            className={`
              flex items-center justify-start w-full p-3 rounded-lg border transition-colors
              ${selectedOption === option.value 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }
            `}
            onClick={() => onChange(option.value)}
          >
            <div className="flex items-center">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center mr-3
                ${selectedOption === option.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
                }
              `}>
                {selectedOption === option.value && '✓'}
              </div>
              <div>
                <span className="font-semibold mr-2">{option.value}:</span>
                <span>{option.label}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuantitativeComparison;