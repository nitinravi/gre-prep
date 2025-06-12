import React from 'react';
import { Question } from '../../../types';

interface ReadingComprehensionProps {
  question: Question;
  selectedOption: string;
  onChange: (option: string) => void;
}

const ReadingComprehension: React.FC<ReadingComprehensionProps> = ({
  question,
  selectedOption,
  onChange,
}) => {
  const handleOptionClick = (option: string) => {
    onChange(option);
  };

  return (
    <div>
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-md mb-6">
        <p className="text-gray-700 leading-relaxed">
          {question.passage}
        </p>
      </div>
      
      <p className="text-lg font-medium mb-4">
        {question.question}
      </p>
      
      <div className="space-y-3 mt-4">
        {question.options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`
              p-3 rounded-lg border cursor-pointer transition-colors
              ${selectedOption === option 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center mr-3
                ${selectedOption === option 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
                }
              `}>
                {selectedOption === option && '✓'}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingComprehension;