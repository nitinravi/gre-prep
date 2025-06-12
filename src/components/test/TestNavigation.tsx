import React from 'react';
import { ArrowLeft, ArrowRight, Flag, Check } from 'lucide-react';
import { useTest } from '../../context/TestContext';

interface TestNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onComplete: () => void;
}

const TestNavigation: React.FC<TestNavigationProps> = ({
  currentIndex,
  totalQuestions,
  onComplete,
}) => {
  const { prevQuestion, nextQuestion } = useTest();

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={prevQuestion}
        disabled={currentIndex === 0}
        className={`
          flex items-center px-4 py-2 rounded-lg font-medium transition-colors
          ${currentIndex === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }
        `}
      >
        <ArrowLeft size={18} className="mr-2" />
        Previous
      </button>
      
      <div className="flex space-x-2">
        {currentIndex === totalQuestions - 1 && (
          <button
            onClick={onComplete}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Check size={18} className="mr-2" />
            Submit Test
          </button>
        )}
      </div>
      
      <button
        onClick={nextQuestion}
        disabled={currentIndex === totalQuestions - 1}
        className={`
          flex items-center px-4 py-2 rounded-lg font-medium transition-colors
          ${currentIndex === totalQuestions - 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        `}
      >
        Next
        <ArrowRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

export default TestNavigation;