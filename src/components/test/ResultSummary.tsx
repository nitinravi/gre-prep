import React, { useState } from 'react';
import { useTest } from '../../context/TestContext';
import { CheckCircle, XCircle, RotateCcw, ChevronDown, ChevronUp, Clock, Target, Award } from 'lucide-react';

const ResultSummary: React.FC = () => {
  const { testData, userAnswers, score, resetTest, totalTimeTaken } = useTest();
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  if (!testData) return null;

  const totalQuestions = testData.questions.length;
  const accuracy = (score / totalQuestions) * 100;
  const averageTimePerQuestion = Math.round(totalTimeTaken / totalQuestions);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (score >= 80) return 'Excellent! You\'re well-prepared.';
    if (score >= 60) return 'Good job! Keep practicing.';
    if (score >= 40) return 'Getting there. More practice needed.';
    return 'Keep studying and try again soon.';
  };

  const getQuestionTypeStats = () => {
    type StatsType = { total: number; correct: number };
    const stats: Record<string, StatsType> = {
      'Sentence Equivalence': { total: 0, correct: 0 },
      'Text Completion': { total: 0, correct: 0 },
      'Reading Comprehension': { total: 0, correct: 0 },
      'Quantitative Comparison': { total: 0, correct: 0 },
      'Multiple Choice — Single Answer': { total: 0, correct: 0 },
      'Multiple Choice — Multiple Answers': { total: 0, correct: 0 },
      'Numeric Entry': { total: 0, correct: 0 }
    };

    testData.questions.forEach((question) => {
      const answer = userAnswers.find(a => a.questionId === question.id);
      if (stats[question.type]) {
        stats[question.type].total += 1;
        if (answer?.isCorrect) {
          stats[question.type].correct += 1;
        }
      }
    });

    // Only return types that have questions
    return Object.entries(stats)
      .filter(([_, data]) => data.total > 0)
      .map(([type, data]) => ({
        type,
        total: data.total,
        correct: data.correct,
        accuracy: (data.correct / data.total) * 100
      }));
  };

  const renderAnswerDetails = (question: any, answer: any) => {
    const isExpanded = expandedQuestions.includes(question.id);
    
    const renderAnswerContent = () => {
      switch (question.type) {
        case 'Sentence Equivalence':
          return (
            <>
              <div className="mb-2">
                <div className="font-medium text-gray-700">Your Answers:</div>
                <div className="ml-4">{(answer?.answer as string[] || []).join(', ') || 'No answer selected'}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Correct Answers:</div>
                <div className="ml-4">{(question.correct_answers as string[]).join(', ')}</div>
              </div>
            </>
          );
        case 'Text Completion':
          if (question.blanks === 1) {
            return (
              <>
                <div className="mb-2">
                  <div className="font-medium text-gray-700">Your Answer:</div>
                  <div className="ml-4">{answer?.answer || 'No answer selected'}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Correct Answer(s):</div>
                  <div className="ml-4">{(question.correct_answers as string[]).join(' or ')}</div>
                </div>
              </>
            );
          } else {
            const userAnswers = answer?.answer as Record<string, string> || {};
            const correctAnswers = question.correct_answers as Record<string, string>;
            return (
              <>
                <div className="mb-2">
                  <div className="font-medium text-gray-700">Your Answers:</div>
                  {Object.entries(userAnswers).map(([blank, ans], idx) => (
                    <div key={blank} className="ml-4">
                      Blank {idx + 1}: {ans || 'No answer selected'}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-medium text-gray-700">Correct Answers:</div>
                  {Object.entries(correctAnswers).map(([blank, ans], idx) => (
                    <div key={blank} className="ml-4">
                      Blank {idx + 1}: {ans}
                    </div>
                  ))}
                </div>
              </>
            );
          }
        case 'Reading Comprehension':
          return (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="font-medium text-gray-700 mb-2">Passage:</div>
                <div className="text-gray-600">{question.passage}</div>
              </div>
              <div className="mb-2">
                <div className="font-medium text-gray-700">Your Answer:</div>
                <div className="ml-4">{answer?.answer || 'No answer selected'}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Correct Answer:</div>
                <div className="ml-4">{question.correct_answers[0]}</div>
              </div>
            </>
          );
        case 'Quantitative Comparison':
          const qcOptions: Record<string, string> = {
            'A': 'Quantity A is greater',
            'B': 'Quantity B is greater',
            'C': 'The two quantities are equal',
            'D': 'The relationship cannot be determined'
          };
          const userQCAnswer = answer?.answer as keyof typeof qcOptions;
          const correctQCAnswer = question.correct_answers[0] as keyof typeof qcOptions;
          return (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <pre className="whitespace-pre-wrap font-mono text-sm">{question.question}</pre>
              </div>
              <div className="mb-2">
                <div className="font-medium text-gray-700">Your Answer:</div>
                <div className="ml-4">
                  {userQCAnswer ? `${userQCAnswer}: ${qcOptions[userQCAnswer]}` : 'No answer selected'}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Correct Answer:</div>
                <div className="ml-4">
                  {`${correctQCAnswer}: ${qcOptions[correctQCAnswer]}`}
                </div>
              </div>
            </>
          );
        case 'Multiple Choice — Single Answer':
          return (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="text-gray-700">{question.question}</div>
              </div>
              <div className="mb-2">
                <div className="font-medium text-gray-700">Your Answer:</div>
                <div className="ml-4">{answer?.answer || 'No answer selected'}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Correct Answer:</div>
                <div className="ml-4">{question.correct_answers[0]}</div>
              </div>
            </>
          );
        case 'Multiple Choice — Multiple Answers':
          return (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="text-gray-700">{question.question}</div>
              </div>
              <div className="mb-2">
                <div className="font-medium text-gray-700">Your Answers:</div>
                <div className="ml-4">{(answer?.answer as string[] || []).join(', ') || 'No answer selected'}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Correct Answers:</div>
                <div className="ml-4">{(question.correct_answers as string[]).join(', ')}</div>
              </div>
            </>
          );
        case 'Numeric Entry':
          return (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="text-gray-700">{question.question}</div>
              </div>
              <div className="mb-2">
                <div className="font-medium text-gray-700">Your Answer:</div>
                <div className="ml-4">{answer?.answer || 'No answer entered'}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Correct Answer:</div>
                <div className="ml-4">{question.correct_answers[0]}</div>
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div 
        key={question.id}
        className={`p-4 rounded-lg border transition-all duration-200 ${
          answer?.isCorrect ? 'border-green-200' : 'border-red-200'
        }`}
      >
        <div 
          className="flex items-start cursor-pointer"
          onClick={() => toggleQuestion(question.id)}
        >
          <div className="flex-shrink-0 mr-3">
            {answer?.isCorrect ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <XCircle className="text-red-600" size={20} />
            )}
          </div>
          <div className="flex-grow">
            <div className="font-medium flex items-center justify-between">
              <span>Question {question.id}: {question.type}</span>
              {isExpanded ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
            <div className="text-gray-700 mt-1">
              {question.question}
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {renderAnswerContent()}
          </div>
        )}
      </div>
    );
  };

  const questionTypeStats = getQuestionTypeStats();
  const weakestArea = questionTypeStats.reduce((prev, { type, accuracy }) => {
    return accuracy < prev.accuracy ? { type, accuracy } : prev;
  }, { type: '', accuracy: 1 });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Score</div>
              <div className="text-3xl font-bold text-blue-900">{score}/{totalQuestions}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Accuracy</div>
              <div className="text-3xl font-bold text-green-900">{accuracy.toFixed(1)}%</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">Total Time</div>
              <div className="text-3xl font-bold text-orange-900">{formatTime(totalTimeTaken)}</div>
              <div className="text-sm text-orange-600 mt-1">
                ~{formatTime(averageTimePerQuestion)} per question
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">Section</div>
              <div className="text-3xl font-bold text-purple-900">{testData.section}</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Question Type</h3>
            <div className="space-y-4">
              {getQuestionTypeStats().map(({ type, total, correct, accuracy }) => {
                const questionsOfType = userAnswers.filter(
                  a => testData.questions.find(q => q.id === a.questionId)?.type === type
                );
                const totalTimeForType = questionsOfType.reduce((sum, q) => sum + q.timeTaken, 0);
                const avgTimeForType = Math.round(totalTimeForType / total);

                return (
                  <div key={type} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{type}</span>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">
                          {correct}/{total} ({accuracy.toFixed(1)}%)
                        </span>
                        <div className="text-xs text-gray-500">
                          Avg. time: {formatTime(avgTimeForType)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Question Analysis</h3>
            {testData.questions.map((question, index) => {
              const answer = userAnswers.find(a => a.questionId === question.id);
              const isExpanded = expandedQuestions.includes(question.id);

              return (
                <div 
                  key={question.id}
                  className="bg-gray-50 rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleQuestion(question.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${answer?.isCorrect 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                        }
                      `}>
                        {answer?.isCorrect ? '✓' : '✗'}
                      </div>
                      <div>
                        <div className="font-medium">Question {index + 1}</div>
                        <div className="text-sm text-gray-500">
                          {question.type} • {formatTime(answer?.timeTaken || 0)}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400">
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4">
                      {renderAnswerDetails(question, answer)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={resetTest}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;