/**
 * 🎓 GRADE CALCULATION & REPORTING SYSTEM
 * 
 * Sophisticated grading algorithms that account for question difficulty,
 * time factors, and partial credit with detailed reporting
 */

const PASSING_THRESHOLD = 70; // Minimum score to pass

/**
 * Calculate weighted score based on question difficulty
 * @param {Array} questionResults - Array of question results
 * @returns {Object} - Weighted scoring results
 */
function calculateWeightedScore(questionResults) {
  const weights = {
    'Easy': 1.0,
    'Normal': 1.2, 
    'Hard': 1.5,
    'Very Hard': 2.0
  };
  
  let totalWeightedPoints = 0;
  let maxPossiblePoints = 0;
  
  questionResults.forEach(result => {
    const weight = weights[result.difficulty] || 1.0;
    maxPossiblePoints += weight;
    
    if (result.isCorrect) {
      totalWeightedPoints += weight;
    } else if (result.isPartiallyCorrect) {
      totalWeightedPoints += (weight * result.partialCreditRatio);
    }
  });
  
  return {
    weightedScore: Math.round((totalWeightedPoints / maxPossiblePoints) * 100),
    totalWeightedPoints,
    maxPossiblePoints,
    difficultyBreakdown: calculateDifficultyContribution(questionResults, weights)
  };
}

/**
 * Calculate difficulty contribution to final score
 * @param {Array} questionResults - Question results
 * @param {Object} weights - Difficulty weights
 * @returns {Object} - Difficulty breakdown
 */
function calculateDifficultyContribution(questionResults, weights) {
  const breakdown = {};
  
  questionResults.forEach(result => {
    const difficulty = result.difficulty;
    if (!breakdown[difficulty]) {
      breakdown[difficulty] = {
        totalQuestions: 0,
        correctQuestions: 0,
        partialQuestions: 0,
        totalPoints: 0,
        earnedPoints: 0,
        weight: weights[difficulty] || 1.0
      };
    }
    
    breakdown[difficulty].totalQuestions++;
    
    if (result.isCorrect) {
      breakdown[difficulty].correctQuestions++;
      breakdown[difficulty].earnedPoints += weights[difficulty] || 1.0;
    } else if (result.isPartiallyCorrect) {
      breakdown[difficulty].partialQuestions++;
      breakdown[difficulty].earnedPoints += (weights[difficulty] || 1.0) * result.partialCreditRatio;
    }
    
    breakdown[difficulty].totalPoints += weights[difficulty] || 1.0;
  });
  
  // Calculate percentages for each difficulty
  Object.keys(breakdown).forEach(difficulty => {
    const stats = breakdown[difficulty];
    stats.percentage = stats.totalPoints > 0 ? 
      Math.round((stats.earnedPoints / stats.totalPoints) * 100) : 0;
    stats.contributionToFinal = stats.totalPoints > 0 ? 
      Math.round((stats.earnedPoints / stats.totalPoints) * 100) : 0;
  });
  
  return breakdown;
}

/**
 * Apply time-based scoring adjustments
 * @param {number} baseScore - Base score before time adjustments
 * @param {Object} timeData - Time analysis data
 * @returns {Object} - Time-adjusted scoring results
 */
function applyTimeFactors(baseScore, timeData) {
  const timeFactor = calculateTimeFactor(timeData);
  
  return {
    baseScore: baseScore,
    timeBonus: timeFactor.bonus, // bonus for efficient completion
    timePenalty: timeFactor.penalty, // penalty for excessive time
    adjustedScore: Math.max(0, Math.min(100, baseScore + timeFactor.bonus - timeFactor.penalty)),
    
    timeAnalysis: {
      efficiency: timeFactor.efficiency, // percentage of optimal time used
      questionsRushed: timeFactor.rushedQuestions, // completed too quickly
      questionsDelayed: timeFactor.delayedQuestions, // took too long
      optimalTimeUsage: timeFactor.optimalUsage
    }
  };
}

/**
 * Calculate time factor for scoring adjustments
 * @param {Object} timeData - Time analysis data
 * @returns {Object} - Time factor calculations
 */
function calculateTimeFactor(timeData) {
  const { timePerQuestion, totalTime, timeLimit, questions } = timeData;
  
  let bonus = 0;
  let penalty = 0;
  let efficiency = 0;
  let rushedQuestions = 0;
  let delayedQuestions = 0;
  let optimalUsage = 0;
  
  try {
    if (timeLimit && totalTime) {
      efficiency = Math.round((totalTime / timeLimit) * 100);
      
      // Bonus for efficient completion (under 80% of time limit)
      if (efficiency < 80) {
        bonus = Math.round((80 - efficiency) * 0.5); // Up to 10 points bonus
      }
      
      // Penalty for excessive time (over 120% of time limit)
      if (efficiency > 120) {
        penalty = Math.round((efficiency - 120) * 0.3); // Up to 15 points penalty
      }
    }
    
    // Analyze individual question timing
    if (timePerQuestion && questions) {
      const avgTimePerQuestion = timeLimit ? timeLimit / questions.length : 60;
      
      Object.entries(timePerQuestion).forEach(([questionId, timeSpent]) => {
        if (timeSpent < avgTimePerQuestion * 0.3) { // Less than 30% of average
          rushedQuestions++;
        } else if (timeSpent > avgTimePerQuestion * 2) { // More than 200% of average
          delayedQuestions++;
        }
      });
      
      optimalUsage = questions.length - rushedQuestions - delayedQuestions;
    }
    
  } catch (error) {
    console.error('Error calculating time factor:', error);
  }
  
  return {
    bonus: Math.min(bonus, 10), // Cap bonus at 10 points
    penalty: Math.min(penalty, 15), // Cap penalty at 15 points
    efficiency: efficiency,
    rushedQuestions: rushedQuestions,
    delayedQuestions: delayedQuestions,
    optimalUsage: optimalUsage
  };
}

/**
 * Calculate partial credit for multiple choice questions
 * @param {Object} question - Question object
 * @param {Array} userAnswers - User's selected answers
 * @returns {Object} - Partial credit analysis
 */
function calculatePartialCredit(question, userAnswers) {
  if (question.question_type !== 'Multiple Choice') {
    return { hasPartialCredit: false, creditRatio: 0 };
  }
  
  const correctAnswers = question.correct_answers;
  const userAnswerSet = new Set(userAnswers);
  const correctAnswerSet = new Set(correctAnswers);
  
  // Calculate overlap
  const correctSelections = [...userAnswerSet].filter(ans => correctAnswerSet.has(ans));
  const incorrectSelections = [...userAnswerSet].filter(ans => !correctAnswerSet.has(ans));
  const missedCorrect = [...correctAnswerSet].filter(ans => !userAnswerSet.has(ans));
  
  // Partial credit formula
  const creditRatio = Math.max(0, 
    (correctSelections.length - incorrectSelections.length) / correctAnswers.length
  );
  
  return {
    hasPartialCredit: creditRatio > 0 && creditRatio < 1,
    creditRatio: creditRatio,
    analysis: {
      correctSelections: correctSelections.length,
      incorrectSelections: incorrectSelections.length,
      missedCorrect: missedCorrect.length,
      totalCorrect: correctAnswers.length
    }
  };
}

/**
 * Generate detailed grade report
 * @param {Object} submissionData - Submission data
 * @param {Object} gradingResults - Grading calculation results
 * @returns {Object} - Comprehensive grade report
 */
function generateDetailedReport(submissionData, gradingResults) {
  return {
    // Executive Summary
    summary: {
      finalGrade: gradingResults.adjustedScore,
      letterGrade: calculateLetterGrade(gradingResults.adjustedScore),
      passStatus: gradingResults.adjustedScore >= PASSING_THRESHOLD,
      percentileRank: calculatePercentileRank(submissionData.userId, gradingResults.adjustedScore),
      timeEfficiency: gradingResults.timeAnalysis.efficiency
    },
    
    // Detailed Breakdown
    breakdown: {
      rawScore: gradingResults.baseScore,
      weightedScore: gradingResults.weightedScore,
      timeAdjustments: {
        bonus: gradingResults.timeBonus,
        penalty: gradingResults.timePenalty
      },
      partialCredit: {
        questionsWithPartialCredit: gradingResults.partialCreditQuestions.length,
        totalPartialPoints: gradingResults.totalPartialCredit
      }
    },
    
    // Performance Analysis
    performance: {
      strongestCategory: identifyStrongestCategory(gradingResults.categoryBreakdown),
      weakestCategory: identifyWeakestCategory(gradingResults.categoryBreakdown),
      difficultyProgression: analyzeDifficultyProgression(gradingResults.difficultyBreakdown),
      timeManagement: analyzeTimeManagement(gradingResults.timeAnalysis),
      
      recommendations: generateStudyRecommendations({
        categoryPerformance: gradingResults.categoryBreakdown,
        difficultyPerformance: gradingResults.difficultyBreakdown,
        timeAnalysis: gradingResults.timeAnalysis,
        historicalData: submissionData.userHistory
      })
    },
    
    // Question-Level Analysis
    questionAnalysis: gradingResults.questionResults.map(q => ({
      questionNumber: q.questionNumber,
      category: q.category,
      difficulty: q.difficulty,
      isCorrect: q.isCorrect,
      hasPartialCredit: q.hasPartialCredit,
      timeSpent: q.timeSpent,
      relativePerformance: compareToOtherUsers(q.questionId, q.isCorrect)
    }))
  };
}

/**
 * Calculate letter grade from numerical score
 * @param {number} score - Numerical score (0-100)
 * @returns {string} - Letter grade
 */
function calculateLetterGrade(score) {
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

/**
 * Calculate percentile rank for user
 * @param {string} userId - User ID
 * @param {number} score - User's score
 * @returns {number} - Percentile rank (0-100)
 */
function calculatePercentileRank(userId, score) {
  try {
    // This would typically query all users' scores and calculate percentile
    // For now, return mock calculation
    const mockPercentile = Math.floor(Math.random() * 100);
    return mockPercentile;
  } catch (error) {
    console.error('Error calculating percentile rank:', error);
    return 50; // Default to median
  }
}

/**
 * Identify strongest category for user
 * @param {Object} categoryBreakdown - Category performance breakdown
 * @returns {string} - Strongest category name
 */
function identifyStrongestCategory(categoryBreakdown) {
  if (!categoryBreakdown || Object.keys(categoryBreakdown).length === 0) {
    return 'Unknown';
  }
  
  let strongestCategory = '';
  let highestScore = -1;
  
  Object.entries(categoryBreakdown).forEach(([category, stats]) => {
    if (stats.percentage > highestScore) {
      highestScore = stats.percentage;
      strongestCategory = category;
    }
  });
  
  return strongestCategory;
}

/**
 * Identify weakest category for user
 * @param {Object} categoryBreakdown - Category performance breakdown
 * @returns {string} - Weakest category name
 */
function identifyWeakestCategory(categoryBreakdown) {
  if (!categoryBreakdown || Object.keys(categoryBreakdown).length === 0) {
    return 'Unknown';
  }
  
  let weakestCategory = '';
  let lowestScore = 101;
  
  Object.entries(categoryBreakdown).forEach(([category, stats]) => {
    if (stats.percentage < lowestScore) {
      lowestScore = stats.percentage;
      weakestCategory = category;
    }
  });
  
  return weakestCategory;
}

/**
 * Analyze difficulty progression
 * @param {Object} difficultyBreakdown - Difficulty performance breakdown
 * @returns {Object} - Difficulty progression analysis
 */
function analyzeDifficultyProgression(difficultyBreakdown) {
  const difficulties = ['Easy', 'Normal', 'Hard', 'Very Hard'];
  const progression = {
    trend: 'stable',
    recommendations: [],
    areasOfConcern: []
  };
  
  try {
    const scores = difficulties.map(diff => difficultyBreakdown[diff]?.percentage || 0);
    
    // Calculate trend
    let improving = 0;
    let declining = 0;
    
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > scores[i-1]) improving++;
      else if (scores[i] < scores[i-1]) declining++;
    }
    
    if (improving > declining) progression.trend = 'improving';
    else if (declining > improving) progression.trend = 'declining';
    
    // Identify areas of concern
    difficulties.forEach((diff, index) => {
      if (scores[index] < 70) {
        progression.areasOfConcern.push({
          difficulty: diff,
          score: scores[index],
          recommendation: `Focus on ${diff.toLowerCase()} level questions`
        });
      }
    });
    
    // Generate recommendations
    if (progression.trend === 'declining') {
      progression.recommendations.push('Consider reviewing fundamental concepts before advancing');
    }
    
    if (progression.areasOfConcern.length > 0) {
      progression.recommendations.push('Address weak areas before moving to higher difficulty levels');
    }
    
  } catch (error) {
    console.error('Error analyzing difficulty progression:', error);
  }
  
  return progression;
}

/**
 * Analyze time management
 * @param {Object} timeAnalysis - Time analysis data
 * @returns {Object} - Time management analysis
 */
function analyzeTimeManagement(timeAnalysis) {
  const analysis = {
    efficiency: timeAnalysis.efficiency || 0,
    rushedQuestions: timeAnalysis.rushedQuestions || 0,
    delayedQuestions: timeAnalysis.delayedQuestions || 0,
    recommendations: []
  };
  
  try {
    if (analysis.efficiency < 60) {
      analysis.recommendations.push('Consider improving time management skills');
      analysis.recommendations.push('Practice with timed quizzes to build speed');
    }
    
    if (analysis.rushedQuestions > 0) {
      analysis.recommendations.push(`Review ${analysis.rushedQuestions} questions that were answered too quickly`);
      analysis.recommendations.push('Take time to read questions carefully');
    }
    
    if (analysis.delayedQuestions > 0) {
      analysis.recommendations.push(`Consider skipping difficult questions and returning later`);
      analysis.recommendations.push('Practice time allocation strategies');
    }
    
    if (analysis.efficiency > 120) {
      analysis.recommendations.push('Work on improving answer speed');
      analysis.recommendations.push('Review time allocation for different question types');
    }
    
  } catch (error) {
    console.error('Error analyzing time management:', error);
  }
  
  return analysis;
}

/**
 * Generate personalized study recommendations
 * @param {Object} performanceData - User performance data
 * @returns {Array} - Array of study recommendations
 */
function generateStudyRecommendations(performanceData) {
  const recommendations = [];
  
  try {
    // Category-based recommendations
    Object.entries(performanceData.categoryPerformance || {}).forEach(([category, stats]) => {
      if (stats.percentage < 70) {
        recommendations.push({
          type: 'CATEGORY_IMPROVEMENT',
          priority: 'HIGH',
          category: category,
          currentScore: stats.percentage,
          targetScore: 80,
          studyTopics: getWeakTopicsInCategory(category, performanceData.questionAnalysis),
          estimatedStudyTime: calculateEstimatedStudyTime(stats.percentage, 80),
          resources: getStudyResources(category)
        });
      }
    });
    
    // Difficulty-based recommendations
    if (performanceData.difficultyPerformance?.['Easy']?.percentage < 90) {
      recommendations.push({
        type: 'FOUNDATION_REVIEW',
        priority: 'CRITICAL',
        message: 'Focus on fundamental concepts before advancing',
        suggestedActions: ['Review basic concepts', 'Practice easy questions', 'Seek tutor help']
      });
    }
    
    // Time management recommendations
    if (performanceData.timeAnalysis?.efficiency < 60) {
      recommendations.push({
        type: 'TIME_MANAGEMENT',
        priority: 'MEDIUM',
        message: 'Improve time management skills',
        suggestedActions: ['Practice with timer', 'Skip difficult questions first', 'Review time allocation strategies']
      });
    }
    
    // Sort by priority
    return recommendations.sort((a, b) => getPriorityWeight(a.priority) - getPriorityWeight(b.priority));
    
  } catch (error) {
    console.error('Error generating study recommendations:', error);
    return [];
  }
}

/**
 * Get weak topics within a category
 * @param {string} category - Category name
 * @param {Array} questionAnalysis - Question analysis data
 * @returns {Array} - Weak topics list
 */
function getWeakTopicsInCategory(category, questionAnalysis) {
  try {
    const categoryQuestions = questionAnalysis.filter(q => q.category === category && !q.isCorrect);
    const topics = categoryQuestions.map(q => q.topic || 'General').filter(Boolean);
    
    // Return unique topics
    return [...new Set(topics)];
  } catch (error) {
    console.error('Error getting weak topics:', error);
    return [];
  }
}

/**
 * Calculate estimated study time
 * @param {number} currentScore - Current score
 * @param {number} targetScore - Target score
 * @returns {number} - Estimated study time in hours
 */
function calculateEstimatedStudyTime(currentScore, targetScore) {
  try {
    const scoreGap = targetScore - currentScore;
    if (scoreGap <= 0) return 0;
    
    // Rough estimate: 1 hour per 10 points improvement
    return Math.ceil(scoreGap / 10);
  } catch (error) {
    console.error('Error calculating study time:', error);
    return 5; // Default 5 hours
  }
}

/**
 * Get study resources for category
 * @param {string} category - Category name
 * @returns {Array} - Study resources
 */
function getStudyResources(category) {
  const resourceMap = {
    'Excel': [
      'Microsoft Excel Tutorials',
      'Excel Practice Exercises',
      'Excel Formulas Reference'
    ],
    'Python': [
      'Python Documentation',
      'Codecademy Python Course',
      'Python Practice Problems'
    ],
    'Pandas': [
      'Pandas Documentation',
      'DataCamp Pandas Course',
      'Pandas Cheat Sheet'
    ]
  };
  
  return resourceMap[category] || ['General study materials', 'Online tutorials', 'Practice exercises'];
}

/**
 * Get priority weight for sorting
 * @param {string} priority - Priority level
 * @returns {number} - Priority weight
 */
function getPriorityWeight(priority) {
  const weights = {
    'CRITICAL': 3,
    'HIGH': 2,
    'MEDIUM': 1,
    'LOW': 0
  };
  
  return weights[priority] || 0;
}

/**
 * Compare user performance to other users
 * @param {string} questionId - Question ID
 * @param {boolean} isCorrect - Whether user got it correct
 * @returns {string} - Relative performance description
 */
function compareToOtherUsers(questionId, isCorrect) {
  try {
    // This would typically query question statistics
    // For now, return mock comparison
    if (isCorrect) {
      return 'Above average';
    } else {
      return 'Below average';
    }
  } catch (error) {
    console.error('Error comparing to other users:', error);
    return 'Unknown';
  }
}

/**
 * Calculate comprehensive grade for quiz submission
 * @param {Object} submissionData - Complete submission data
 * @returns {Object} - Comprehensive grading results
 */
function calculateComprehensiveGrade(submissionData) {
  try {
    // Step 1: Calculate base score
    const baseScore = calculateBaseScore(submissionData);
    
    // Step 2: Apply weighted scoring
    const weightedResults = calculateWeightedScore(submissionData.questionResults);
    
    // Step 3: Apply time factors
    const timeAdjustedResults = applyTimeFactors(weightedResults.weightedScore, {
      timePerQuestion: submissionData.timePerQuestion,
      totalTime: submissionData.totalTime,
      timeLimit: submissionData.timeLimit,
      questions: submissionData.questions
    });
    
    // Step 4: Calculate partial credit
    const partialCreditResults = calculatePartialCreditResults(submissionData);
    
    // Step 5: Generate final report
    const finalReport = generateDetailedReport(submissionData, {
      baseScore: baseScore,
      weightedScore: weightedResults.weightedScore,
      adjustedScore: timeAdjustedResults.adjustedScore,
      timeBonus: timeAdjustedResults.timeBonus,
      timePenalty: timeAdjustedResults.timePenalty,
      timeAnalysis: timeAdjustedResults.timeAnalysis,
      categoryBreakdown: submissionData.categoryBreakdown,
      difficultyBreakdown: weightedResults.difficultyBreakdown,
      partialCreditQuestions: partialCreditResults.questionsWithPartialCredit,
      totalPartialCredit: partialCreditResults.totalPartialCredit,
      questionResults: submissionData.questionResults
    });
    
    return {
      success: true,
      grade: finalReport.summary.finalGrade,
      letterGrade: finalReport.summary.letterGrade,
      passStatus: finalReport.summary.passStatus,
      report: finalReport,
      calculations: {
        baseScore: baseScore,
        weightedScore: weightedResults.weightedScore,
        timeAdjustedScore: timeAdjustedResults.adjustedScore,
        partialCredit: partialCreditResults
      }
    };
    
  } catch (error) {
    console.error('Error calculating comprehensive grade:', error);
    return {
      success: false,
      error: error.message,
      grade: 0,
      letterGrade: 'F',
      passStatus: false
    };
  }
}

/**
 * Calculate base score from raw answers
 * @param {Object} submissionData - Submission data
 * @returns {number} - Base score (0-100)
 */
function calculateBaseScore(submissionData) {
  try {
    const { questions, userAnswers } = submissionData;
    let correctCount = 0;
    let totalCount = questions.length;
    
    questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (validateAnswer(question, userAnswer)) {
        correctCount++;
      }
    });
    
    return totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  } catch (error) {
    console.error('Error calculating base score:', error);
    return 0;
  }
}

/**
 * Calculate partial credit results
 * @param {Object} submissionData - Submission data
 * @returns {Object} - Partial credit summary
 */
function calculatePartialCreditResults(submissionData) {
  try {
    const { questions, userAnswers } = submissionData;
    let questionsWithPartialCredit = 0;
    let totalPartialCredit = 0;
    
    questions.forEach(question => {
      if (question.question_type === 'Multiple Choice') {
        const partialCredit = calculatePartialCredit(question, userAnswers[question.id]);
        if (partialCredit.hasPartialCredit) {
          questionsWithPartialCredit++;
          totalPartialCredit += partialCredit.creditRatio;
        }
      }
    });
    
    return {
      questionsWithPartialCredit: questionsWithPartialCredit,
      totalPartialCredit: totalPartialCredit
    };
  } catch (error) {
    console.error('Error calculating partial credit results:', error);
    return {
      questionsWithPartialCredit: 0,
      totalPartialCredit: 0
    };
  }
}

/**
 * Validate answer for grading (import from answerValidation service)
 * @param {Object} question - Question object
 * @param {any} userAnswer - User's answer
 * @returns {boolean} - Whether answer is correct
 */
function validateAnswer(question, userAnswer) {
  // This would typically import from answerValidation service
  // For now, implement basic validation
  try {
    if (!question || userAnswer === null || userAnswer === undefined) {
      return false;
    }
    
    const { question_type, correct_answers } = question;
    
    switch (question_type) {
      case 'Single Choice':
        return userAnswer === correct_answers[0];
      case 'Multiple Choice':
        if (!Array.isArray(userAnswer) || !Array.isArray(correct_answers)) {
          return false;
        }
        if (userAnswer.length !== correct_answers.length) {
          return false;
        }
        const sortedUser = [...userAnswer].sort();
        const sortedCorrect = [...correct_answers].sort();
        return sortedUser.every((ans, index) => ans === sortedCorrect[index]);
      case 'Yes/No':
        return userAnswer === correct_answers[0];
      default:
        return false;
    }
  } catch (error) {
    console.error('Error validating answer:', error);
    return false;
  }
}

module.exports = {
  calculateWeightedScore,
  applyTimeFactors,
  calculatePartialCredit,
  generateDetailedReport,
  calculateLetterGrade,
  calculatePercentileRank,
  identifyStrongestCategory,
  identifyWeakestCategory,
  analyzeDifficultyProgression,
  analyzeTimeManagement,
  generateStudyRecommendations,
  calculateComprehensiveGrade,
  calculateBaseScore,
  calculatePartialCreditResults
};
