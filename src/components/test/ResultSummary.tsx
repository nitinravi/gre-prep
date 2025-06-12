import React, { useState } from 'react';
import { useTest } from '../../context/TestContext';
import { CheckCircle, XCircle, RotateCcw, ChevronDown, ChevronUp, Clock, Target, Award } from 'lucide-react';

const ResultSummary: React.FC = () => {
  const { testData, userAnswers, resetTest, score } = useTest();
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  if (!testData) return null;

  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const totalQuestions = testData.questions.length;
  const accuracy = (correctCount / totalQuestions) * 100;

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

    // Remove question types with 0 total questions
    return Object.entries(stats)
      .filter(([_, s]) => s.total > 0)
      .reduce<Record<string, StatsType>>((acc, [type, s]) => ({
        ...acc,
        [type]: s
      }), {});
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
                <div className="ml-4">{(answer.answer as string[]).join(', ') || 'No answer selected'}</div>
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
                  <div className="ml-4">{answer.answer || 'No answer selected'}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Correct Answer(s):</div>
                  <div className="ml-4">{(question.correct_answers as string[]).join(' or ')}</div>
                </div>
              </>
            );
          } else {
            const userAnswers = answer.answer as Record<string, string>;
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
                <div className="ml-4">{answer.answer || 'No answer selected'}</div>
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
          const userQCAnswer = answer.answer as keyof typeof qcOptions;
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
                <div className="ml-4">{answer.answer || 'No answer selected'}</div>
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
                <div className="ml-4">{(answer.answer as string[] || []).join(', ') || 'No answer selected'}</div>
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
                <div className="ml-4">{answer.answer || 'No answer entered'}</div>
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
  const weakestArea = Object.entries(questionTypeStats)
    .reduce((prev, [type, stats]) => {
      const accuracy = stats.total > 0 ? (stats.correct / stats.total) : 1;
      return accuracy < prev.accuracy ? { type, accuracy } : prev;
    }, { type: '', accuracy: 1 });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Test Results</h1>
          <p className="mt-2 opacity-90">{testData.section}</p>
        </div>
        
        <div className="p-6">
          {/* Score Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border p-4 flex items-center">
              <Award className="text-blue-600 mr-3" size={24} />
              <div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <div className={`text-2xl font-bold ${getScoreColor()}`}>
                  {score}%
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4 flex items-center">
              <Target className="text-blue-600 mr-3" size={24} />
              <div>
                <div className="text-sm text-gray-600">Accuracy</div>
                <div className="text-2xl font-bold">
                  {correctCount} / {totalQuestions}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4 flex items-center">
              <Clock className="text-blue-600 mr-3" size={24} />
              <div>
                <div className="text-sm text-gray-600">Time Used</div>
                <div className="text-2xl font-bold">35:00</div>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Performance Analysis</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">By Question Type</h3>
                  <div className="space-y-2">
                    {Object.entries(questionTypeStats).map(([type, stats]) => (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{type}</span>
                          <span className="font-medium">
                            {stats.correct}/{stats.total}
                            <span className="text-gray-600 ml-1">
                              ({Math.round((stats.correct / stats.total) * 100)}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Key Insights</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-700">
                      • Overall Accuracy: {Math.round(accuracy)}%
                    </li>
                    <li className="text-gray-700">
                      • Strongest Area: {Object.entries(questionTypeStats)
                        .reduce((prev, [type, stats]) => {
                          const acc = stats.total > 0 ? (stats.correct / stats.total) : 0;
                          return acc > prev.acc ? { type, acc } : prev;
                        }, { type: '', acc: 0 }).type}
                    </li>
                    <li className="text-gray-700">
                      • Area for Improvement: {weakestArea.type}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed Question Analysis */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Question Analysis</h2>
            <div className="space-y-4">
              {testData.questions.map((question) => {
                const answer = userAnswers.find(a => a.questionId === question.id);
                return renderAnswerDetails(question, answer);
              })}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <button
              onClick={resetTest}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              <RotateCcw size={18} className="mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;