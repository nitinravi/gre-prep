import React, { useRef, useState } from 'react';
import { useTest } from '../../context/TestContext';
import TestStartScreen from './TestStartScreen';
import QuestionCard from './QuestionCard';
import TestNavigation from './TestNavigation';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import ResultSummary from './ResultSummary';
import { TestData } from '../../types';

const TestContainer: React.FC = () => {
  const { 
    testData, 
    isTestStarted, 
    isTestComplete, 
    currentQuestionIndex,
    userAnswers,
    loadTest, 
    startTest, 
    completeTest 
  } = useTest();
  
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Validate the JSON structure
        if (!data.section || !data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid test format');
        }
        
        loadTest(data as TestData);
        setError(null);
      } catch (err) {
        setError('Failed to parse test file. Please ensure it is valid JSON in the correct format.');
        console.error(err);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTestSubmit = () => {
    completeTest();
  };

  if (!testData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">GRE Mock Test</h1>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Test Data</h2>
          <p className="mb-4 text-gray-600">
            Upload a JSON file containing GRE test questions in the required format.
          </p>
          
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md mb-4">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isTestStarted) {
    return <TestStartScreen />;
  }

  if (isTestComplete) {
    return <ResultSummary />;
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{testData.section}</h1>
        <Timer />
      </div>
      
      <ProgressBar
        current={currentQuestionIndex + 1}
        total={testData.questions.length}
        answered={userAnswers.filter(a => {
          const answer = a.answer;
          if (Array.isArray(answer)) return answer.length > 0;
          if (typeof answer === 'object') return Object.keys(answer).length > 0;
          return !!answer;
        }).length}
      />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <QuestionCard
          question={currentQuestion}
          answer={currentAnswer?.answer}
        />
      </div>
      
      <TestNavigation
        currentIndex={currentQuestionIndex}
        totalQuestions={testData.questions.length}
        onComplete={handleTestSubmit}
      />
    </div>
  );
};

export default TestContainer;