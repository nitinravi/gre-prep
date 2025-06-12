import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../../context/TestContext';
import QuestionCard from './QuestionCard';

const TestScreen: React.FC = () => {
  const { 
    testData, 
    userAnswers, 
    timeElapsed,
    isTestActive,
    startTest,
    endTest
  } = useTest();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (testData && !isTestActive) {
      startTest();
    }
  }, [testData, isTestActive, startTest]);

  if (!testData) {
    navigate('/upload');
    return null;
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const totalQuestions = testData.questions.length;
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id)?.answer;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      endTest();
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {testData.section}
              </h1>
              <div className="text-sm text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-blue-600">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Time Elapsed</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <QuestionCard 
            question={currentQuestion}
            answer={currentAnswer}
          />

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestScreen; 