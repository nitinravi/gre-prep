import React, { useState } from 'react';
import { Clock, BookOpen, Award } from 'lucide-react';
import { useTest } from '../../context/TestContext';

const TestStartScreen: React.FC = () => {
  const { testData, startTest } = useTest();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!testData) return null;

  const handleStartTest = () => {
    setIsConfirming(true);
  };

  const handleConfirmStart = () => {
    startTest();
  };

  const handleCancelStart = () => {
    setIsConfirming(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold">{testData.section}</h1>
          <p className="mt-2 opacity-90">Prepare for test day with this mock exam</p>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                <BookOpen className="text-blue-600 mr-3 mt-1" size={24} />
                <div>
                  <h3 className="font-medium">Questions</h3>
                  <p className="text-gray-600">{testData.total_questions} questions</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                <Clock className="text-blue-600 mr-3 mt-1" size={24} />
                <div>
                  <h3 className="font-medium">Time Limit</h3>
                  <p className="text-gray-600">35 minutes</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                <Award className="text-blue-600 mr-3 mt-1" size={24} />
                <div>
                  <h3 className="font-medium">Scoring</h3>
                  <p className="text-gray-600">Immediate results</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Question Types</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-gray-700">
                <span className="font-medium">Sentence Equivalence:</span> Select two answers that create sentences with the same meaning
              </li>
              <li className="text-gray-700">
                <span className="font-medium">Text Completion:</span> Fill in the blanks to complete the sentence
              </li>
              <li className="text-gray-700">
                <span className="font-medium">Reading Comprehension:</span> Answer questions based on a passage
              </li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-gray-700">You can navigate between questions using the next/previous buttons</li>
              <li className="text-gray-700">You can mark questions for review and return to them later</li>
              <li className="text-gray-700">The timer will count down from 35 minutes</li>
              <li className="text-gray-700">Your test will be automatically submitted when time expires</li>
            </ul>
          </div>
          
          {!isConfirming ? (
            <button
              onClick={handleStartTest}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Start Test
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-yellow-800 mb-2">Are you ready to begin?</h3>
              <p className="text-yellow-700 mb-4">
                Once you start, the 35-minute timer will begin. Make sure you're in a quiet environment and ready to focus.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmStart}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Yes, Start Now
                </button>
                <button
                  onClick={handleCancelStart}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Not Yet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestStartScreen;