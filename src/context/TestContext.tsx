import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TestData, Question, Answer, HistoryEntry } from '../types';
import { useHistory } from './HistoryContext';

interface TestContextType {
  testData: TestData | null;
  currentQuestionIndex: number;
  userAnswers: Answer[];
  isTestStarted: boolean;
  isTestComplete: boolean;
  timeRemaining: number;
  score: number;
  loadTest: (data: TestData) => void;
  startTest: () => void;
  setAnswer: (questionId: number, answer: string | string[] | Record<string, string>) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  completeTest: () => void;
  resetTest: () => void;
  setTimeRemaining: (time: number) => void;
  decrementTime: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

interface TestProviderProps {
  children: ReactNode;
}

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(35 * 60); // 35 minutes in seconds
  const [score, setScore] = useState(0);
  const { addHistoryEntry } = useHistory();

  const loadTest = (data: TestData) => {
    setTestData(data);
    // Initialize empty answers for each question
    const initialAnswers = data.questions.map(q => ({
      questionId: q.id,
      answer: q.type === 'Sentence Equivalence' ? [] : (
        q.type === 'Text Completion' && q.blanks > 1 ? {} : ''
      ),
      isCorrect: false,
    }));
    setUserAnswers(initialAnswers);
    setIsTestStarted(false);
    setIsTestComplete(false);
    setCurrentQuestionIndex(0);
    setTimeRemaining(35 * 60); // Reset timer
    setScore(0);
  };

  const startTest = () => {
    setIsTestStarted(true);
  };

  const setAnswer = (questionId: number, answer: string | string[] | Record<string, string>) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      const index = newAnswers.findIndex(a => a.questionId === questionId);
      
      if (index !== -1) {
        newAnswers[index] = {
          ...newAnswers[index],
          answer,
        };
      }
      
      return newAnswers;
    });
  };

  const nextQuestion = () => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (testData && index >= 0 && index < testData.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const evaluateAnswer = (question: Question, userAnswer: any): boolean => {
    if (!userAnswer) return false;
    
    if (question.type === 'Sentence Equivalence') {
      const selectedAnswers = userAnswer as string[];
      if (selectedAnswers.length !== 2) return false;
      
      const correctAnswers = question.correct_answers as string[];
      return correctAnswers.every(a => selectedAnswers.includes(a));
    } 
    else if (question.type === 'Text Completion') {
      if (question.blanks === 1) {
        const correctAnswers = question.correct_answers as string[];
        return correctAnswers.includes(userAnswer);
      } else {
        const userBlankAnswers = userAnswer as Record<string, string>;
        const correctBlankAnswers = question.correct_answers as Record<string, string>;
        
        return Object.keys(correctBlankAnswers).every(
          blank => userBlankAnswers[blank] === correctBlankAnswers[blank]
        );
      }
    } 
    else if (question.type === 'Reading Comprehension' || 
             question.type === 'Quantitative Comparison' ||
             question.type === 'Multiple Choice — Single Answer') {
      return userAnswer === question.correct_answers[0];
    }
    else if (question.type === 'Multiple Choice — Multiple Answers') {
      const selectedAnswers = userAnswer as string[];
      const correctAnswers = question.correct_answers as string[];
      return selectedAnswers.length === correctAnswers.length &&
             correctAnswers.every(a => selectedAnswers.includes(a));
    }
    else if (question.type === 'Numeric Entry') {
      const userNum = parseFloat(userAnswer);
      const correctNum = parseFloat(question.correct_answers[0]);
      // Allow for small floating point differences
      return Math.abs(userNum - correctNum) < 0.0001;
    }
    
    return false;
  };

  const completeTest = () => {
    if (!testData) return;
    
    // Evaluate answers and calculate score
    const evaluatedAnswers = userAnswers.map(answer => {
      const question = testData.questions.find(q => q.id === answer.questionId);
      const isCorrect = question ? evaluateAnswer(question, answer.answer) : false;
      return { ...answer, isCorrect };
    });
    
    const correctCount = evaluatedAnswers.filter(a => a.isCorrect).length;
    const calculatedScore = Math.round((correctCount / testData.questions.length) * 100);
    
    // Update state
    setUserAnswers(evaluatedAnswers);
    setScore(calculatedScore);
    setIsTestComplete(true);
    
    // Create history entry
    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      testName: testData.section,
      score: calculatedScore,
      questions: testData.questions.length,
      correctAnswers: correctCount,
    };
    
    addHistoryEntry(historyEntry);
  };

  const resetTest = () => {
    setIsTestStarted(false);
    setIsTestComplete(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    
    if (testData) {
      const initialAnswers = testData.questions.map(q => ({
        questionId: q.id,
        answer: q.type === 'Sentence Equivalence' ? [] : (
          q.type === 'Text Completion' && q.blanks > 1 ? {} : ''
        ),
        isCorrect: false,
      }));
      setUserAnswers(initialAnswers);
    }
    
    setTimeRemaining(35 * 60); // Reset timer
  };

  const decrementTime = () => {
    setTimeRemaining(prev => Math.max(0, prev - 1));
  };

  // Auto-complete test when time runs out
  useEffect(() => {
    if (isTestStarted && timeRemaining === 0 && !isTestComplete) {
      completeTest();
    }
  }, [timeRemaining, isTestStarted, isTestComplete]);

  const value = {
    testData,
    currentQuestionIndex,
    userAnswers,
    isTestStarted,
    isTestComplete,
    timeRemaining,
    score,
    loadTest,
    startTest,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    completeTest,
    resetTest,
    setTimeRemaining,
    decrementTime,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};