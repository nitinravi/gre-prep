import React from 'react';
import { Question } from '../../types';
import { useTest } from '../../context/TestContext';
import SentenceEquivalence from './questions/SentenceEquivalence';
import TextCompletion from './questions/TextCompletion';
import ReadingComprehension from './questions/ReadingComprehension';
import QuantitativeComparison from './questions/QuantitativeComparison';
import MultipleChoiceMultiple from './questions/MultipleChoiceMultiple';

interface QuestionCardProps {
  question: Question;
  answer: any;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer }) => {
  const { setAnswer } = useTest();

  const handleAnswerChange = (value: any) => {
    setAnswer(question.id, value);
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'Sentence Equivalence':
        return (
          <SentenceEquivalence
            question={question}
            selectedOptions={answer as string[]}
            onChange={handleAnswerChange}
          />
        );
      case 'Text Completion':
        return (
          <TextCompletion
            question={question}
            selectedAnswers={answer}
            onChange={handleAnswerChange}
          />
        );
      case 'Reading Comprehension':
      case 'Multiple Choice — Single Answer':
        return (
          <ReadingComprehension
            question={question}
            selectedOption={answer as string}
            onChange={handleAnswerChange}
          />
        );
      case 'Quantitative Comparison':
        return (
          <QuantitativeComparison
            question={question}
            selectedOption={answer as string}
            onChange={handleAnswerChange}
          />
        );
      case 'Multiple Choice — Multiple Answers':
        return (
          <MultipleChoiceMultiple
            question={question}
            selectedOptions={answer as string[] || []}
            onChange={handleAnswerChange}
          />
        );
      case 'Numeric Entry':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-mono text-sm">{question.question}</pre>
            </div>
            <div>
              <input
                type="text"
                value={answer || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Enter your answer"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      default:
        return <div>Unknown question type: {question.type}</div>;
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mb-2">
          {question.type}
        </span>
        <div className="text-lg font-medium">Question {question.id}</div>
      </div>
      
      {renderQuestionContent()}
    </div>
  );
};

export default QuestionCard;