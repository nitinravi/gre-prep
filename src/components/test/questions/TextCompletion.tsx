import React from 'react';
import { Question } from '../../../types';

interface TextCompletionProps {
  question: Question;
  selectedAnswers: string | Record<string, string>;
  onChange: (answers: string | Record<string, string>) => void;
}

const TextCompletion: React.FC<TextCompletionProps> = ({
  question,
  selectedAnswers,
  onChange,
}) => {
  // Handle single blank question
  if (question.blanks === 1) {
    const selectedOption = selectedAnswers as string;
    
    const handleOptionClick = (option: string) => {
      onChange(option);
    };

    return (
      <div>
        <p className="text-lg mb-6">
          {question.question}
        </p>
        
        <div className="mb-2 text-sm text-gray-600">
          Select the option that best completes the text.
        </div>
        
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
  }
  
  // Handle multiple blanks question
  const blanksAnswers = selectedAnswers as Record<string, string> || {};
  
  const handleBlankOptionClick = (blank: string, option: string) => {
    onChange({
      ...blanksAnswers,
      [blank]: option,
    });
  };

  return (
    <div>
      <p className="text-lg mb-6">
        {question.question}
      </p>
      
      <div className="mb-4 text-sm text-gray-600">
        Select the options that best complete each blank in the text.
      </div>
      
      {Object.keys(question.options).map((blank, blankIndex) => (
        <div key={blank} className="mb-6">
          <div className="font-medium mb-2">Blank {blankIndex + 1}:</div>
          <div className="space-y-2">
            {question.options[blank].map((option, optionIndex) => (
              <div 
                key={optionIndex}
                onClick={() => handleBlankOptionClick(blank, option)}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-colors
                  ${blanksAnswers[blank] === option 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center mr-3
                    ${blanksAnswers[blank] === option 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                    }
                  `}>
                    {blanksAnswers[blank] === option && '✓'}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TextCompletion;