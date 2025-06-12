export interface Question {
  id: number;
  type: 'Sentence Equivalence' | 'Text Completion' | 'Reading Comprehension' | 
        'Quantitative Comparison' | 'Multiple Choice — Single Answer' | 
        'Multiple Choice — Multiple Answers' | 'Numeric Entry';
  question: string;
  options: any;
  correct_answers: any;
  blanks?: number;
  passage?: string;
}

export interface TestData {
  section: string;
  total_questions: number;
  questions: Question[];
}

export interface Answer {
  questionId: number;
  answer: string | string[] | Record<string, string>;
  isCorrect: boolean;
}

export interface HistoryEntry {
  id: string;
  date: string;
  testName: string;
  score: number;
  questions: number;
  correctAnswers: number;
  section: 'Verbal Reasoning' | 'Quantitative Reasoning';
}

export interface Analytics {
  totalTests: number;
  averageScore: number;
  sectionBreakdown: {
    verbal: {
      count: number;
      average: number;
    };
    quantitative: {
      count: number;
      average: number;
    };
  };
  questionTypePerformance: Record<string, {
    total: number;
    correct: number;
  }>;
  recentScores: number[];
}