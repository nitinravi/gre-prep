import React, { createContext, useContext, useState, useEffect } from 'react';

interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
  correct_answers: string[] | Record<string, string>;
  passage?: string;
  blanks?: number;
}

interface TestData {
  section: string;
  total_questions: number;
  questions: Question[];
}

interface UserAnswer {
  questionId: number;
  answer: string | string[] | Record<string, string>;
  isCorrect: boolean;
  timeTaken: number;
}

interface TestContextType {
  testData: TestData | null;
  setTestData: (data: TestData) => void;
  userAnswers: UserAnswer[];
  setAnswer: (questionId: number, answer: any) => void;
  score: number;
  resetTest: () => void;
  timeElapsed: number;
  isTestActive: boolean;
  startTest: () => void;
  endTest: () => void;
  totalTimeTaken: number;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'gre_test_state';

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testData, setTestData] = useState<TestData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(() => {
    const savedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (savedState) {
      const { userAnswers } = JSON.parse(savedState);
      return userAnswers;
    }
    return [];
  });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTimeTaken, setTotalTimeTaken] = useState(() => {
    const savedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (savedState) {
      const { totalTimeTaken } = JSON.parse(savedState);
      return totalTimeTaken;
    }
    return 0;
  });

  useEffect(() => {
    let timer: number;
    if (isTestActive) {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [isTestActive]);

  useEffect(() => {
    if (userAnswers.length > 0) {
      const state = {
        userAnswers,
        totalTimeTaken
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    }
  }, [userAnswers, totalTimeTaken]);

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
    else if (question.type === 'Multiple Choice — Multiple Answers') {
      const selectedAnswers = userAnswer as string[];
      const correctAnswers = question.correct_answers as string[];
      return correctAnswers.length === selectedAnswers.length &&
        correctAnswers.every(a => selectedAnswers.includes(a));
    }
    else if (question.type === 'Numeric Entry') {
      const correctAnswers = question.correct_answers as string[];
      return userAnswer === correctAnswers[0];
    }
    else {
      const correctAnswers = question.correct_answers as string[];
      return userAnswer === correctAnswers[0];
    }
  };

  const setAnswer = (questionId: number, answer: any) => {
    const question = testData?.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = evaluateAnswer(question, answer);
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setUserAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      const newAnswer = { questionId, answer, isCorrect, timeTaken };
      
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = newAnswer;
        return newAnswers;
      }
      
      return [...prev, newAnswer];
    });

    setTotalTimeTaken(prev => prev + timeTaken);
    setQuestionStartTime(Date.now()); // Reset timer for next question
  };

  const score = userAnswers.filter(a => a.isCorrect).length;

  const startTest = () => {
    setIsTestActive(true);
    setTimeElapsed(0);
    setQuestionStartTime(Date.now());
    setTotalTimeTaken(0);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const endTest = () => {
    setIsTestActive(false);
  };

  const resetTest = () => {
    setTestData(null);
    setUserAnswers([]);
    setTimeElapsed(0);
    setIsTestActive(false);
    setTotalTimeTaken(0);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <TestContext.Provider value={{ 
      testData, 
      setTestData, 
      userAnswers, 
      setAnswer,
      score,
      resetTest,
      timeElapsed,
      isTestActive,
      startTest,
      endTest,
      totalTimeTaken
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

export type { Question, TestData, UserAnswer };