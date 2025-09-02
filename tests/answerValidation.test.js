/**
 * 🧪 ANSWER VALIDATION TEST SUITE
 * 
 * Comprehensive testing for answer validation logic
 * Critical for ensuring accurate student grading
 */

const {
  validateAnswer,
  validateSingleChoice,
  validateMultipleChoice,
  validateYesNo,
  processQuizSubmission,
  handleEdgeCases,
  validateSubmissionTiming
} = require('../services/answerValidation');

/**
 * Mock data helpers for testing
 */
const createMockSubmission = (options = {}) => {
  return {
    userId: options.userId || 'test-user',
    quizId: options.quizId || 'test-quiz',
    startTime: options.startTime || new Date(Date.now() - 900000), // 15 min ago
    endTime: options.endTime || new Date(),
    userAnswers: options.userAnswers || generateRandomAnswers(),
    timePerQuestion: options.timePerQuestion || generateRealisticTiming(),
    securityEvents: options.securityEvents || { tabSwitches: 0, focusLoss: 0 }
  };
};

const createMockSubmissionWithCategories = (categoryData) => {
  const questions = [];
  const userAnswers = {};
  
  Object.entries(categoryData).forEach(([category, stats]) => {
    for (let i = 0; i < stats.total; i++) {
      const questionId = `${category.toLowerCase()}_q${i + 1}`;
      questions.push({
        id: questionId,
        question: `Sample ${category} question ${i + 1}`,
        question_type: 'Single Choice',
        answers: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answers: [0],
        category: category,
        level: 'Easy'
      });
      
      // Generate answers based on performance
      if (i < stats.correct) {
        userAnswers[questionId] = 0; // Correct answer
      } else {
        userAnswers[questionId] = Math.floor(Math.random() * 3) + 1; // Wrong answer
      }
    }
  });
  
  return {
    questions: questions,
    userAnswers: userAnswers,
    startTime: new Date(Date.now() - 900000),
    endTime: new Date(),
    timePerQuestion: generateRealisticTiming(questions)
  };
};

const generateRandomAnswers = () => {
  const answers = {};
  for (let i = 1; i <= 10; i++) {
    answers[`q${i}`] = Math.floor(Math.random() * 4);
  }
  return answers;
};

const generateRealisticTiming = (questions = null) => {
  const timing = {};
  const questionCount = questions ? questions.length : 10;
  
  for (let i = 1; i <= questionCount; i++) {
    timing[`q${i}`] = Math.floor(Math.random() * 120) + 30; // 30-150 seconds
  }
  return timing;
};

const generateTimeWithPressure = (questions, timeRatio) => {
  const timing = {};
  const totalTime = questions.length * 60; // 1 minute per question
  const usedTime = totalTime * timeRatio;
  
  questions.forEach((question, index) => {
    if (index < questions.length - 1) {
      timing[question.id] = Math.floor(usedTime / questions.length);
    } else {
      timing[question.id] = usedTime - Object.values(timing).reduce((a, b) => a + b, 0);
    }
  });
  
  return timing;
};

const generateAnswersForDifficulty = (questions, difficulty, type) => {
  const answers = {};
  const difficultyQuestions = questions.filter(q => q.level === difficulty);
  
  difficultyQuestions.forEach(question => {
    if (type === 'correct') {
      answers[question.id] = question.correct_answers[0];
    } else if (type === 'partial') {
      // For multiple choice, give partial correct answers
      if (question.question_type === 'Multiple Choice') {
        const correctCount = question.correct_answers.length;
        const partialCount = Math.ceil(correctCount / 2);
        answers[question.id] = question.correct_answers.slice(0, partialCount);
      } else {
        answers[question.id] = question.correct_answers[0];
      }
    }
  });
  
  return answers;
};

const leaveQuestionsUnanswered = (questions, count) => {
  const answers = {};
  const unansweredQuestions = questions.slice(0, count);
  
  unansweredQuestions.forEach(question => {
    answers[question.id] = null;
  });
  
  return answers;
};

const generatePerfectAnswers = (questions) => {
  const answers = {};
  questions.forEach(question => {
    answers[question.id] = question.correct_answers[0];
  });
  return answers;
};

/**
 * Test Suite: Single Choice Answer Validation
 */
describe('Single Choice Answer Validation', () => {
  test('Correct single answer validates properly', () => {
    const question = {
      question_type: 'Single Choice',
      answers: ['add()', 'append()', 'insert()', 'push()'],
      correct_answers: [1] // append() is correct
    };
    
    expect(validateAnswer(question, 1)).toBe(true);
    expect(validateAnswer(question, 0)).toBe(false);
    expect(validateAnswer(question, 2)).toBe(false);
    expect(validateAnswer(question, 3)).toBe(false);
  });
  
  test('Invalid answer indices are handled gracefully', () => {
    const question = {
      question_type: 'Single Choice',
      answers: ['add()', 'append()', 'insert()', 'push()'],
      correct_answers: [1]
    };
    
    expect(validateAnswer(question, 4)).toBe(false); // out of range
    expect(validateAnswer(question, -1)).toBe(false); // negative
    expect(validateAnswer(question, 'invalid')).toBe(false); // wrong type
    expect(validateAnswer(question, null)).toBe(false); // null
    expect(validateAnswer(question, undefined)).toBe(false); // undefined
  });
  
  test('Edge cases for single choice questions', () => {
    const question = {
      question_type: 'Single Choice',
      answers: ['Yes', 'No'],
      correct_answers: [0]
    };
    
    expect(validateAnswer(question, 0)).toBe(true); // Yes
    expect(validateAnswer(question, 1)).toBe(false); // No
    expect(validateAnswer(question, 2)).toBe(false); // out of range
  });
  
  test('Single choice validation with different answer counts', () => {
    const question3Options = {
      question_type: 'Single Choice',
      answers: ['A', 'B', 'C'],
      correct_answers: [1]
    };
    
    const question5Options = {
      question_type: 'Single Choice',
      answers: ['A', 'B', 'C', 'D', 'E'],
      correct_answers: [2]
    };
    
    expect(validateAnswer(question3Options, 1)).toBe(true);
    expect(validateAnswer(question3Options, 3)).toBe(false); // out of range for 3 options
    
    expect(validateAnswer(question5Options, 2)).toBe(true);
    expect(validateAnswer(question5Options, 5)).toBe(false); // out of range for 5 options
  });
});

/**
 * Test Suite: Multiple Choice Answer Validation
 */
describe('Multiple Choice Answer Validation', () => {
  test('Correct multiple answers validate properly', () => {
    const question = {
      question_type: 'Multiple Choice',
      answers: ['Excel', 'Word', 'PowerPoint', 'Access'],
      correct_answers: [0, 2] // Excel and PowerPoint
    };
    
    expect(validateAnswer(question, [0, 2])).toBe(true);
    expect(validateAnswer(question, [2, 0])).toBe(true); // order doesn't matter
    expect(validateAnswer(question, [0])).toBe(false); // incomplete
    expect(validateAnswer(question, [0, 1, 2])).toBe(false); // extra answer
  });
  
  test('Edge cases for multiple choice questions', () => {
    const question = {
      question_type: 'Multiple Choice',
      answers: ['A', 'B', 'C', 'D'],
      correct_answers: [0, 1]
    };
    
    expect(validateAnswer(question, [])).toBe(false); // no answers
    expect(validateAnswer(question, [0, 0])).toBe(false); // duplicates
    expect(validateAnswer(question, null)).toBe(false); // null value
    expect(validateAnswer(question, [0, 4])).toBe(false); // invalid index
    expect(validateAnswer(question, [0, -1])).toBe(false); // negative index
  });
  
  test('Multiple choice with different answer counts', () => {
    const question2Correct = {
      question_type: 'Multiple Choice',
      answers: ['A', 'B', 'C', 'D'],
      correct_answers: [0, 1]
    };
    
    const question3Correct = {
      question_type: 'Multiple Choice',
      answers: ['A', 'B', 'C', 'D'],
      correct_answers: [0, 1, 2]
    };
    
    expect(validateAnswer(question2Correct, [0, 1])).toBe(true);
    expect(validateAnswer(question2Correct, [0, 1, 2])).toBe(false); // too many
    
    expect(validateAnswer(question3Correct, [0, 1, 2])).toBe(true);
    expect(validateAnswer(question3Correct, [0, 1])).toBe(false); // too few
  });
  
  test('Multiple choice with complex answer patterns', () => {
    const question = {
      question_type: 'Multiple Choice',
      answers: ['A', 'B', 'C', 'D', 'E', 'F'],
      correct_answers: [1, 3, 5]
    };
    
    expect(validateAnswer(question, [1, 3, 5])).toBe(true);
    expect(validateAnswer(question, [5, 1, 3])).toBe(true); // different order
    expect(validateAnswer(question, [1, 3])).toBe(false); // missing one
    expect(validateAnswer(question, [1, 3, 5, 0])).toBe(false); // extra one
  });
});

/**
 * Test Suite: Yes/No Answer Validation
 */
describe('Yes/No Answer Validation', () => {
  test('Yes/No validation works correctly', () => {
    const question = {
      question_type: 'Yes/No',
      answers: ['Yes', 'No'],
      correct_answers: [0] // Yes is correct
    };
    
    expect(validateAnswer(question, 0)).toBe(true); // Yes
    expect(validateAnswer(question, 1)).toBe(false); // No
  });
  
  test('Yes/No edge cases', () => {
    const question = {
      question_type: 'Yes/No',
      answers: ['Yes', 'No'],
      correct_answers: [1] // No is correct
    };
    
    expect(validateAnswer(question, 0)).toBe(false); // Yes (wrong)
    expect(validateAnswer(question, 1)).toBe(true); // No (correct)
    expect(validateAnswer(question, 2)).toBe(false); // out of range
    expect(validateAnswer(question, -1)).toBe(false); // negative
    expect(validateAnswer(question, 'Yes')).toBe(false); // wrong type
  });
});

/**
 * Test Suite: Score Calculation
 */
describe('Score Calculation', () => {
  test('Perfect score calculation', () => {
    const submission = createMockSubmissionWithCategories({
      Excel: { correct: 10, total: 10 },
      Python: { correct: 8, total: 8 },
      Pandas: { correct: 5, total: 5 }
    });
    
    const result = processQuizSubmission(submission);
    expect(result.finalScore).toBe(100);
    expect(result.correctAnswers).toBe(23);
    expect(result.incorrectAnswers).toBe(0);
    expect(result.unansweredQuestions).toBe(0);
  });
  
  test('Partial score calculation', () => {
    const submission = createMockSubmissionWithCategories({
      Excel: { correct: 7, total: 10 },
      Python: { correct: 6, total: 8 },
      Pandas: { correct: 3, total: 5 }
    });
    
    const result = processQuizSubmission(submission);
    expect(result.finalScore).toBe(70); // 16/23 = 69.57% rounded to 70
    expect(result.correctAnswers).toBe(16);
    expect(result.incorrectAnswers).toBe(7);
    expect(result.unansweredQuestions).toBe(0);
  });
  
  test('Score calculation with unanswered questions', () => {
    const submission = createMockSubmissionWithCategories({
      Excel: { correct: 5, total: 10 },
      Python: { correct: 4, total: 8 },
      Pandas: { correct: 2, total: 5 }
    });
    
    // Add some unanswered questions
    submission.userAnswers['excel_q6'] = null;
    submission.userAnswers['python_q5'] = null;
    
    const result = processQuizSubmission(submission);
    expect(result.unansweredQuestions).toBe(2);
    expect(result.correctAnswers).toBe(11);
    expect(result.incorrectAnswers).toBe(10);
  });
  
  test('Zero score calculation', () => {
    const submission = createMockSubmissionWithCategories({
      Excel: { correct: 0, total: 10 },
      Python: { correct: 0, total: 8 },
      Pandas: { correct: 0, total: 5 }
    });
    
    const result = processQuizSubmission(submission);
    expect(result.finalScore).toBe(0);
    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(23);
  });
});

/**
 * Test Suite: Category Performance Calculation
 */
describe('Category Performance Calculation', () => {
  test('Category breakdown accuracy', () => {
    const submission = createMockSubmissionWithCategories({
      Excel: { correct: 8, total: 10 },
      Python: { correct: 6, total: 8 },
      Pandas: { correct: 4, total: 5 }
    });
    
    const result = processQuizSubmission(submission);
    
    expect(result.categoryBreakdown.Excel.percentage).toBe(80);
    expect(result.categoryBreakdown.Python.percentage).toBe(75);
    expect(result.categoryBreakdown.Pandas.percentage).toBe(80);
    
    expect(result.categoryBreakdown.Excel.correct).toBe(8);
    expect(result.categoryBreakdown.Excel.total).toBe(10);
  });
  
  test('Category breakdown with mixed performance', () => {
    const submission = createMockSubmissionWithCategories({
      Excel: { correct: 10, total: 10 }, // 100%
      Python: { correct: 4, total: 8 },  // 50%
      Pandas: { correct: 1, total: 5 }   // 20%
    });
    
    const result = processQuizSubmission(submission);
    
    expect(result.categoryBreakdown.Excel.percentage).toBe(100);
    expect(result.categoryBreakdown.Python.percentage).toBe(50);
    expect(result.categoryBreakdown.Pandas.percentage).toBe(20);
  });
  
  test('Category breakdown with no questions in category', () => {
    const submission = createMockSubmissionWithCategories({
      Excel: { correct: 5, total: 10 }
    });
    
    const result = processQuizSubmission(submission);
    
    expect(result.categoryBreakdown.Excel.percentage).toBe(50);
    expect(result.categoryBreakdown.Python).toBeUndefined();
    expect(result.categoryBreakdown.Pandas).toBeUndefined();
  });
});

/**
 * Test Suite: Difficulty Performance Calculation
 */
describe('Difficulty Performance Calculation', () => {
  test('Difficulty breakdown accuracy', () => {
    const questions = [
      { id: 'q1', level: 'Easy', category: 'Excel' },
      { id: 'q2', level: 'Easy', category: 'Excel' },
      { id: 'q3', level: 'Normal', category: 'Python' },
      { id: 'q4', level: 'Hard', category: 'Python' },
      { id: 'q5', level: 'Very Hard', category: 'Pandas' }
    ];
    
    const userAnswers = {
      'q1': 0, // correct
      'q2': 1, // wrong
      'q3': 0, // correct
      'q4': 1, // wrong
      'q5': 0  // correct
    };
    
    const submission = {
      questions: questions.map(q => ({
        ...q,
        question_type: 'Single Choice',
        answers: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
        correct_answers: [0]
      })),
      userAnswers: userAnswers,
      startTime: new Date(Date.now() - 900000),
      endTime: new Date()
    };
    
    const result = processQuizSubmission(submission);
    
    expect(result.difficultyBreakdown.Easy.percentage).toBe(50); // 1/2 correct
    expect(result.difficultyBreakdown.Normal.percentage).toBe(100); // 1/1 correct
    expect(result.difficultyBreakdown.Hard.percentage).toBe(0); // 0/1 correct
    expect(result.difficultyBreakdown['Very Hard'].percentage).toBe(100); // 1/1 correct
  });
});

/**
 * Test Suite: Edge Cases Handling
 */
describe('Edge Cases Handling', () => {
  test('Empty submission handling', () => {
    const submission = {
      questions: [
        { id: 'q1', question_type: 'Single Choice', answers: ['A', 'B'], correct_answers: [0] }
      ],
      userAnswers: {},
      startTime: new Date(),
      endTime: new Date()
    };
    
    const result = processQuizSubmission(submission);
    
    expect(result.totalQuestions).toBe(1);
    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(0);
    expect(result.unansweredQuestions).toBe(1);
    expect(result.finalScore).toBe(0);
  });
  
  test('Partial submission handling', () => {
    const submission = {
      questions: [
        { id: 'q1', question_type: 'Single Choice', answers: ['A', 'B'], correct_answers: [0] },
        { id: 'q2', question_type: 'Single Choice', answers: ['A', 'B'], correct_answers: [1] },
        { id: 'q3', question_type: 'Single Choice', answers: ['A', 'B'], correct_answers: [0] }
      ],
      userAnswers: {
        'q1': 0, // correct
        'q2': 0  // wrong
        // q3 unanswered
      },
      startTime: new Date(),
      endTime: new Date()
    };
    
    const result = processQuizSubmission(submission);
    
    expect(result.totalQuestions).toBe(3);
    expect(result.correctAnswers).toBe(1);
    expect(result.incorrectAnswers).toBe(1);
    expect(result.unansweredQuestions).toBe(1);
    expect(result.finalScore).toBe(33); // 1/3 = 33.33% rounded to 33
  });
  
  test('Invalid answer indices handling', () => {
    const submission = {
      questions: [
        { id: 'q1', question_type: 'Single Choice', answers: ['A', 'B'], correct_answers: [0] }
      ],
      userAnswers: {
        'q1': 5 // invalid index
      },
      startTime: new Date(),
      endTime: new Date()
    };
    
    const result = processQuizSubmission(submission);
    
    expect(result.totalQuestions).toBe(1);
    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(1);
    expect(result.finalScore).toBe(0);
  });
  
  test('Malformed submission data handling', () => {
    const submission = {
      questions: null,
      userAnswers: {},
      startTime: new Date(),
      endTime: new Date()
    };
    
    expect(() => processQuizSubmission(submission)).toThrow('Invalid submission data: questions array required');
  });
});

/**
 * Test Suite: Timing Validation
 */
describe('Timing Validation', () => {
  test('Valid timing passes validation', () => {
    const submission = {
      startTime: new Date(Date.now() - 900000), // 15 minutes ago
      endTime: new Date(),
      timePerQuestion: {
        'q1': 45, // 45 seconds
        'q2': 67, // 67 seconds
        'q3': 89  // 89 seconds
      },
      questions: [{}, {}, {}]
    };
    
    const result = validateSubmissionTiming(submission);
    
    expect(result.isValid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.totalDuration).toBeGreaterThan(800); // ~15 minutes
  });
  
  test('Suspiciously fast answers are detected', () => {
    const submission = {
      startTime: new Date(Date.now() - 60000), // 1 minute ago
      endTime: new Date(),
      timePerQuestion: {
        'q1': 1,  // 1 second (suspicious)
        'q2': 2,  // 2 seconds (suspicious)
        'q3': 45  // 45 seconds (normal)
      },
      questions: [{}, {}, {}]
    };
    
    const result = validateSubmissionTiming(submission);
    
    expect(result.isValid).toBe(false);
    expect(result.issues).toHaveLength(2);
    expect(result.issues[0]).toContain('answered too quickly');
  });
  
  test('Total time too short is detected', () => {
    const submission = {
      startTime: new Date(Date.now() - 30000), // 30 seconds ago
      endTime: new Date(),
      timePerQuestion: {
        'q1': 10,
        'q2': 10,
        'q3': 10
      },
      questions: [{}, {}, {}]
    };
    
    const result = validateSubmissionTiming(submission);
    
    expect(result.isValid).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toContain('Total time too short');
  });
  
  test('Timer manipulation is detected', () => {
    const submission = {
      startTime: new Date(Date.now() - 7200000), // 2 hours ago
      endTime: new Date(),
      timePerQuestion: {
        'q1': 30,
        'q2': 30
      },
      questions: [{}, {}]
    };
    
    const result = validateSubmissionTiming(submission);
    
    expect(result.isValid).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toContain('suspiciously long');
  });
});

/**
 * Test Suite: Edge Case Normalization
 */
describe('Edge Case Normalization', () => {
  test('Empty submission normalization', () => {
    const submission = {
      questions: [{ id: 'q1' }],
      userAnswers: {},
      startTime: null,
      endTime: null
    };
    
    const normalized = handleEdgeCases(submission);
    
    expect(normalized.userAnswers).toEqual({});
    expect(normalized.startTime).toBeInstanceOf(Date);
    expect(normalized.endTime).toBeInstanceOf(Date);
  });
  
  test('Partial submission normalization', () => {
    const submission = {
      questions: [{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }],
      userAnswers: { 'q1': 0 },
      startTime: new Date(),
      endTime: new Date()
    };
    
    const normalized = handleEdgeCases(submission);
    
    expect(Object.keys(normalized.userAnswers)).toHaveLength(1);
    expect(normalized.userAnswers['q1']).toBe(0);
  });
  
  test('Invalid answer indices normalization', () => {
    const submission = {
      questions: [{ id: 'q1' }],
      userAnswers: { 'q1': 999 },
      startTime: new Date(),
      endTime: new Date()
    };
    
    const normalized = handleEdgeCases(submission);
    
    expect(normalized.userAnswers['q1']).toBe(null);
  });
});

/**
 * Test Suite: Integration Testing
 */
describe('Integration Testing', () => {
  test('Complete quiz submission flow', () => {
    const questions = [
      {
        id: 'q1',
        question: 'What is 2 + 2?',
        question_type: 'Single Choice',
        answers: ['3', '4', '5', '6'],
        correct_answers: [1],
        category: 'Math',
        level: 'Easy'
      },
      {
        id: 'q2',
        question: 'Which are programming languages?',
        question_type: 'Multiple Choice',
        answers: ['Python', 'Java', 'HTML', 'CSS'],
        correct_answers: [0, 1],
        category: 'Programming',
        level: 'Normal'
      }
    ];
    
    const userAnswers = {
      'q1': 1, // correct
      'q2': [0, 1] // correct
    };
    
    const submission = {
      questions: questions,
      userAnswers: userAnswers,
      startTime: new Date(Date.now() - 300000), // 5 minutes ago
      endTime: new Date(),
      timePerQuestion: {
        'q1': 30,
        'q2': 45
      }
    };
    
    const result = processQuizSubmission(submission);
    
    expect(result.success).toBe(true);
    expect(result.totalQuestions).toBe(2);
    expect(result.correctAnswers).toBe(2);
    expect(result.incorrectAnswers).toBe(0);
    expect(result.finalScore).toBe(100);
    expect(result.categoryBreakdown.Math.percentage).toBe(100);
    expect(result.categoryBreakdown.Programming.percentage).toBe(100);
  });
  
  test('Mixed performance submission', () => {
    const questions = [
      {
        id: 'q1',
        question: 'Easy question',
        question_type: 'Single Choice',
        answers: ['A', 'B', 'C', 'D'],
        correct_answers: [0],
        category: 'Easy',
        level: 'Easy'
      },
      {
        id: 'q2',
        question: 'Hard question',
        question_type: 'Single Choice',
        answers: ['A', 'B', 'C', 'D'],
        correct_answers: [1],
        category: 'Hard',
        level: 'Hard'
      }
    ];
    
    const userAnswers = {
      'q1': 0, // correct
      'q2': 2  // wrong
    };
    
    const submission = {
      questions: questions,
      userAnswers: userAnswers,
      startTime: new Date(Date.now() - 120000), // 2 minutes ago
      endTime: new Date(),
      timePerQuestion: {
        'q1': 25,
        'q2': 95
      }
    };
    
    const result = processQuizSubmission(submission);
    
    expect(result.totalQuestions).toBe(2);
    expect(result.correctAnswers).toBe(1);
    expect(result.incorrectAnswers).toBe(1);
    expect(result.finalScore).toBe(50);
    expect(result.difficultyBreakdown.Easy.percentage).toBe(100);
    expect(result.difficultyBreakdown.Hard.percentage).toBe(0);
  });
});

/**
 * Test Suite: Performance Testing
 */
describe('Performance Testing', () => {
  test('Handles large number of questions efficiently', () => {
    const questions = [];
    const userAnswers = {};
    
    // Generate 100 questions
    for (let i = 1; i <= 100; i++) {
      questions.push({
        id: `q${i}`,
        question: `Question ${i}`,
        question_type: 'Single Choice',
        answers: ['A', 'B', 'C', 'D'],
        correct_answers: [0],
        category: 'Test',
        level: 'Normal'
      });
      
      userAnswers[`q${i}`] = i % 2; // Alternate correct/incorrect
    }
    
    const submission = {
      questions: questions,
      userAnswers: userAnswers,
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(),
      timePerQuestion: generateRealisticTiming(questions)
    };
    
    const startTime = Date.now();
    const result = processQuizSubmission(submission);
    const endTime = Date.now();
    
    expect(result.totalQuestions).toBe(100);
    expect(result.correctAnswers).toBe(50);
    expect(result.incorrectAnswers).toBe(50);
    expect(result.finalScore).toBe(50);
    
    // Should process 100 questions in under 100ms
    expect(endTime - startTime).toBeLessThan(100);
  });
  
  test('Handles concurrent validation requests', () => {
    const submissions = [];
    
    // Generate 10 submissions
    for (let i = 0; i < 10; i++) {
      submissions.push(createMockSubmission({
        userId: `user${i}`,
        quizId: `quiz${i}`,
        userAnswers: generateRandomAnswers()
      }));
    }
    
    const startTime = Date.now();
    
    // Process all submissions
    const results = submissions.map(sub => {
      try {
        return processQuizSubmission(sub);
      } catch (error) {
        return { error: error.message };
      }
    });
    
    const endTime = Date.now();
    
    // Should process 10 submissions in under 50ms
    expect(endTime - startTime).toBeLessThan(50);
    expect(results).toHaveLength(10);
    
    // All should have results (either success or error)
    results.forEach(result => {
      expect(result).toHaveProperty('totalQuestions');
    });
  });
});

/**
 * Test Suite: Error Handling
 */
describe('Error Handling', () => {
  test('Handles null questions gracefully', () => {
    const submission = {
      questions: null,
      userAnswers: {},
      startTime: new Date(),
      endTime: new Date()
    };
    
    expect(() => processQuizSubmission(submission)).toThrow('Invalid submission data: questions array required');
  });
  
  test('Handles invalid question structure gracefully', () => {
    const submission = {
      questions: [
        {
          id: 'q1',
          // Missing required fields
        }
      ],
      userAnswers: { 'q1': 0 },
      startTime: new Date(),
      endTime: new Date()
    };
    
    const result = processQuizSubmission(submission);
    
    // Should handle gracefully without crashing
    expect(result.totalQuestions).toBe(1);
    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(1);
  });
  
  test('Handles malformed user answers gracefully', () => {
    const submission = {
      questions: [
        {
          id: 'q1',
          question_type: 'Single Choice',
          answers: ['A', 'B', 'C', 'D'],
          correct_answers: [0],
          category: 'Test',
          level: 'Easy'
        }
      ],
      userAnswers: {
        'q1': 'invalid_answer_type'
      },
      startTime: new Date(),
      endTime: new Date()
    };
    
    const result = processQuizSubmission(submission);
    
    expect(result.totalQuestions).toBe(1);
    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(1);
  });
});

// Export test utilities for use in other test files
module.exports = {
  createMockSubmission,
  createMockSubmissionWithCategories,
  generateRandomAnswers,
  generateRealisticTiming,
  generateTimeWithPressure,
  generateAnswersForDifficulty,
  leaveQuestionsUnanswered,
  generatePerfectAnswers
};
