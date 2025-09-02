/**
 * 🔒 SECURE ANSWER VALIDATION SYSTEM
 * 
 * CRITICAL SECURITY REQUIREMENT: Answer validation must happen server-side only.
 * Frontend never receives correct answers.
 */

/**
 * Validate answer for any question type
 * @param {Object} question - Question object with type and correct answers
 * @param {any} userAnswer - User's submitted answer
 * @returns {boolean} - Whether answer is correct
 */
function validateAnswer(question, userAnswer) {
  if (!question || userAnswer === null || userAnswer === undefined) {
    return false;
  }

  switch (question.question_type) {
    case 'Single Choice':
      return validateSingleChoice(userAnswer, question.correct_answers);
    case 'Multiple Choice':
      return validateMultipleChoice(userAnswer, question.correct_answers);
    case 'Yes/No':
      return validateYesNo(userAnswer, question.correct_answers);
    default:
      console.warn(`Unknown question type: ${question.question_type}`);
      return false;
  }
}

/**
 * Validate Single Choice question
 * @param {number} userAnswer - Index of selected answer
 * @param {Array} correctAnswers - Array with single correct answer index
 * @returns {boolean} - Whether answer is correct
 */
function validateSingleChoice(userAnswer, correctAnswers) {
  // Validate input types
  if (typeof userAnswer !== 'number' || !Array.isArray(correctAnswers)) {
    return false;
  }
  
  // Check if userAnswer is within valid range
  if (userAnswer < 0 || userAnswer >= 4) { // Assuming 4 answer options
    return false;
  }
  
  // Single choice should have exactly one correct answer
  if (correctAnswers.length !== 1) {
    console.warn('Single choice question should have exactly one correct answer');
    return false;
  }
  
  return userAnswer === correctAnswers[0];
}

/**
 * Validate Multiple Choice question
 * @param {Array} userAnswers - Indices of selected answers
 * @param {Array} correctAnswers - Indices of correct answers
 * @returns {boolean} - Whether answers are correct
 */
function validateMultipleChoice(userAnswers, correctAnswers) {
  // Validate input types
  if (!Array.isArray(userAnswers) || !Array.isArray(correctAnswers)) {
    return false;
  }
  
  // Must match exactly - same length and same indices
  if (userAnswers.length !== correctAnswers.length) {
    return false;
  }
  
  // Check for invalid indices
  if (userAnswers.some(ans => typeof ans !== 'number' || ans < 0 || ans >= 4)) {
    return false;
  }
  
  // Check for duplicates
  if (new Set(userAnswers).size !== userAnswers.length) {
    return false;
  }
  
  // Sort both arrays for comparison (order doesn't matter)
  const sortedUser = [...userAnswers].sort((a, b) => a - b);
  const sortedCorrect = [...correctAnswers].sort((a, b) => a - b);
  
  return sortedUser.every((answer, index) => answer === sortedCorrect[index]);
}

/**
 * Validate Yes/No question
 * @param {number} userAnswer - 0 for Yes, 1 for No
 * @param {Array} correctAnswers - Array with single correct answer index
 * @returns {boolean} - Whether answer is correct
 */
function validateYesNo(userAnswer, correctAnswers) {
  // Validate input types
  if (typeof userAnswer !== 'number' || !Array.isArray(correctAnswers)) {
    return false;
  }
  
  // Yes/No should have exactly one correct answer
  if (correctAnswers.length !== 1) {
    console.warn('Yes/No question should have exactly one correct answer');
    return false;
  }
  
  // User answer should be 0 (Yes) or 1 (No)
  if (userAnswer !== 0 && userAnswer !== 1) {
    return false;
  }
  
  return userAnswer === correctAnswers[0];
}

/**
 * Process complete quiz submission and calculate results
 * @param {Object} submissionData - Complete submission data
 * @returns {Object} - Detailed results with scoring and breakdowns
 */
function processQuizSubmission(submissionData) {
  const results = {
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unansweredQuestions: 0,
    categoryBreakdown: {},
    difficultyBreakdown: {},
    questionResults: [],
    finalScore: 0,
    timeAnalysis: {}
  };

  // Validate submission data structure
  if (!submissionData.questions || !Array.isArray(submissionData.questions)) {
    throw new Error('Invalid submission data: questions array required');
  }

  // Process each question
  submissionData.questions.forEach((question, index) => {
    const userAnswer = submissionData.userAnswers?.[question.id];
    const isCorrect = validateAnswer(question, userAnswer);
    
    // Update counters
    results.totalQuestions++;
    if (userAnswer === null || userAnswer === undefined) {
      results.unansweredQuestions++;
    } else if (isCorrect) {
      results.correctAnswers++;
    } else {
      results.incorrectAnswers++;
    }
    
    // Category tracking
    if (question.category) {
      if (!results.categoryBreakdown[question.category]) {
        results.categoryBreakdown[question.category] = { correct: 0, total: 0 };
      }
      results.categoryBreakdown[question.category].total++;
      if (isCorrect) {
        results.categoryBreakdown[question.category].correct++;
      }
    }
    
    // Difficulty tracking
    if (question.level) {
      if (!results.difficultyBreakdown[question.level]) {
        results.difficultyBreakdown[question.level] = { correct: 0, total: 0 };
      }
      results.difficultyBreakdown[question.level].total++;
      if (isCorrect) {
        results.difficultyBreakdown[question.level].correct++;
      }
    }
    
    // Store individual question result
    results.questionResults.push({
      questionId: question.id,
      questionText: question.question,
      userAnswer: userAnswer,
      isCorrect: isCorrect,
      category: question.category || 'Unknown',
      difficulty: question.level || 'Unknown',
      timeSpent: submissionData.timePerQuestion?.[question.id] || 0
    });
  });
  
  // Calculate final score
  if (results.totalQuestions > 0) {
    results.finalScore = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  }
  
  // Calculate category percentages
  Object.keys(results.categoryBreakdown).forEach(category => {
    const stats = results.categoryBreakdown[category];
    stats.percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  });
  
  // Calculate difficulty percentages
  Object.keys(results.difficultyBreakdown).forEach(difficulty => {
    const stats = results.difficultyBreakdown[difficulty];
    stats.percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  });
  
  return results;
}

/**
 * Handle edge cases for quiz submissions
 * @param {Object} submissionData - Raw submission data
 * @returns {Object} - Normalized submission data
 */
function handleEdgeCases(submissionData) {
  const normalized = { ...submissionData };
  
  // Handle empty submissions
  if (!normalized.userAnswers || Object.keys(normalized.userAnswers).length === 0) {
    normalized.userAnswers = {};
    console.warn('Empty submission detected');
  }
  
  // Handle partial submissions
  const answeredQuestions = Object.keys(normalized.userAnswers).length;
  const totalQuestions = normalized.questions?.length || 0;
  if (answeredQuestions < totalQuestions) {
    console.info(`Partial submission: ${answeredQuestions}/${totalQuestions} questions answered`);
  }
  
  // Handle invalid answer indices
  Object.entries(normalized.userAnswers).forEach(([questionId, answer]) => {
    if (typeof answer === 'number' && (answer < 0 || answer >= 4)) {
      console.warn(`Invalid answer index for question ${questionId}: ${answer}`);
      normalized.userAnswers[questionId] = null; // Mark as unanswered
    }
  });
  
  // Handle malformed submission data
  if (!normalized.startTime) {
    normalized.startTime = new Date();
    console.warn('Missing start time, using current time');
  }
  
  if (!normalized.endTime) {
    normalized.endTime = new Date();
    console.warn('Missing end time, using current time');
  }
  
  return normalized;
}

/**
 * Validate submission timing for security
 * @param {Object} submissionData - Submission data with timing
 * @returns {Object} - Timing validation results
 */
function validateSubmissionTiming(submissionData) {
  const { startTime, endTime, timePerQuestion } = submissionData;
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  const totalDuration = (end - start) / 1000; // in seconds
  
  const timingValidation = {
    isValid: true,
    issues: [],
    totalDuration: totalDuration
  };
  
  // Check minimum time per question (suspicious if too fast)
  if (timePerQuestion) {
    Object.entries(timePerQuestion).forEach(([questionId, timeSpent]) => {
      if (timeSpent < 2) { // Less than 2 seconds per question
        timingValidation.issues.push(`Question ${questionId} answered too quickly: ${timeSpent}s`);
        timingValidation.isValid = false;
      }
    });
  }
  
  // Check reasonable total duration
  const minExpectedTime = (submissionData.questions?.length || 0) * 10; // 10 seconds per question minimum
  if (totalDuration < minExpectedTime) {
    timingValidation.issues.push(`Total time too short: ${totalDuration}s (expected minimum: ${minExpectedTime}s)`);
    timingValidation.isValid = false;
  }
  
  // Check for timer manipulation
  if (totalDuration > 7200) { // More than 2 hours
    timingValidation.issues.push(`Total time suspiciously long: ${totalDuration}s`);
    timingValidation.isValid = false;
  }
  
  return timingValidation;
}

module.exports = {
  validateAnswer,
  validateSingleChoice,
  validateMultipleChoice,
  validateYesNo,
  processQuizSubmission,
  handleEdgeCases,
  validateSubmissionTiming
};
