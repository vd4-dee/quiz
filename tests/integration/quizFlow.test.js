/**
 * 🧪 INTEGRATION TESTING FOR COMPLETE QUIZ FLOW
 * 
 * Test the complete quiz flow from start to finish
 * Verify all components work together correctly
 * Test performance under load and edge cases
 */

const { 
  validateAnswer, 
  processQuizSubmission, 
  handleEdgeCases 
} = require('../../services/answerValidation');

const { 
  calculateUserStats, 
  calculateQuizStats, 
  updateRealTimeStats 
} = require('../../services/statisticsEngine');

const { 
  processQuizSubmission: processSecureSubmission 
} = require('../../services/answerSecurity');

const { 
  calculateComprehensiveGrade, 
  generateDetailedReport 
} = require('../../services/gradingEngine');

const { 
  IncrementalStatsCalculator, 
  StatisticsCache, 
  BatchStatsProcessor, 
  PerformanceMonitor 
} = require('../../services/statisticsOptimizer');

/**
 * Mock data for testing
 */
const mockQuizData = {
  id: 'quiz_001',
  title: 'Computer Science Fundamentals',
  description: 'Test your knowledge of basic computer science concepts',
  timeLimit: 1800, // 30 minutes
  questions: [
    {
      id: 'q1',
      question: 'What is the primary function of RAM?',
      question_type: 'Single Choice',
      answers: ['Store data permanently', 'Process calculations', 'Provide temporary storage', 'Connect to internet'],
      correct_answers: [2],
      category: 'Hardware',
      difficulty: 'Easy',
      points: 10
    },
    {
      id: 'q2',
      question: 'Which programming languages are object-oriented?',
      question_type: 'Multiple Choice',
      answers: ['Java', 'C++', 'Python', 'Assembly'],
      correct_answers: [0, 1, 2],
      category: 'Programming',
      difficulty: 'Medium',
      points: 15
    },
    {
      id: 'q3',
      question: 'Is JavaScript a compiled language?',
      question_type: 'Yes/No',
      answers: ['Yes', 'No'],
      correct_answers: [1],
      category: 'Programming',
      difficulty: 'Easy',
      points: 5
    },
    {
      id: 'q4',
      question: 'What does CPU stand for?',
      question_type: 'Single Choice',
      answers: ['Central Processing Unit', 'Computer Personal Unit', 'Central Personal Unit', 'Computer Processing Unit'],
      correct_answers: [0],
      category: 'Hardware',
      difficulty: 'Easy',
      points: 10
    },
    {
      id: 'q5',
      question: 'Which data structures use LIFO principle?',
      question_type: 'Multiple Choice',
      answers: ['Stack', 'Queue', 'Array', 'Tree'],
      correct_answers: [0],
      category: 'Data Structures',
      difficulty: 'Hard',
      points: 20
    }
  ]
};

const mockUserData = {
  id: 'user_001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'student',
  joinDate: '2024-01-01'
};

const mockSubmissionData = {
  quizId: 'quiz_001',
  userId: 'user_001',
  startedAt: new Date('2024-01-15T10:00:00Z'),
  completedAt: new Date('2024-01-15T10:25:00Z'),
  answers: [
    { questionId: 'q1', answer: 2 }, // Correct
    { questionId: 'q2', answer: [0, 1, 2] }, // Correct
    { questionId: 'q3', answer: 1 }, // Correct
    { questionId: 'q4', answer: 0 }, // Correct
    { questionId: 'q5', answer: [0] } // Correct
  ],
  timeSpent: 1500, // 25 minutes
  metadata: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ipAddress: '192.168.1.100',
    sessionId: 'session_12345'
  }
};

/**
 * Test Suite: Complete Quiz Flow Integration
 */
describe('🧪 INTEGRATION TESTING: Complete Quiz Flow', () => {
  let incrementalCalculator;
  let statisticsCache;
  let batchProcessor;
  let performanceMonitor;
  
  beforeAll(() => {
    // Initialize all services
    incrementalCalculator = new IncrementalStatsCalculator();
    statisticsCache = new StatisticsCache();
    batchProcessor = new BatchStatsProcessor();
    performanceMonitor = new PerformanceMonitor();
  });
  
  afterAll(() => {
    // Cleanup
    statisticsCache.clearCache();
  });
  
  describe('🎯 Perfect Submission Flow', () => {
    test('Complete perfect score submission flow', async () => {
      const startTime = Date.now();
      
      // Step 1: Validate all answers
      const validationResults = mockQuizData.questions.map((question, index) => {
        const userAnswer = mockSubmissionData.answers[index];
        const isCorrect = validateAnswer(question, userAnswer.answer);
        
        expect(isCorrect).toBe(true);
        
        return {
          questionId: question.id,
          isCorrect,
          points: isCorrect ? question.points : 0,
          category: question.category,
          difficulty: question.difficulty
        };
      });
      
      // Step 2: Calculate score and breakdowns
      const scoreResults = await processQuizSubmission(
        mockQuizData.id,
        mockSubmissionData.userId,
        mockSubmissionData.answers,
        mockSubmissionData.metadata
      );
      
      expect(scoreResults.success).toBe(true);
      expect(scoreResults.score).toBe(60); // Perfect score: 10+15+5+10+20
      expect(scoreResults.categoryBreakdown).toBeDefined();
      expect(scoreResults.difficultyBreakdown).toBeDefined();
      
      // Step 3: Security validation
      const securityResults = await processSecureSubmission(
        mockQuizData.id,
        mockSubmissionData.userId,
        mockSubmissionData.answers,
        mockSubmissionData.metadata
      );
      
      expect(securityResults.success).toBe(true);
      expect(securityResults.submission).toBeDefined();
      expect(securityResults.security).toBeDefined();
      
      // Step 4: Calculate comprehensive grade
      const gradeResults = calculateComprehensiveGrade(
        scoreResults.score,
        mockQuizData.questions,
        mockSubmissionData.answers,
        mockSubmissionData.timeSpent,
        mockQuizData.timeLimit
      );
      
      expect(gradeResults.letterGrade).toBe('A');
      expect(gradeResults.percentage).toBe(100);
      expect(gradeResults.weightedScore).toBeGreaterThan(scoreResults.score);
      
      // Step 5: Generate detailed report
      const detailedReport = generateDetailedReport(
        mockUserData,
        mockQuizData,
        scoreResults,
        gradeResults,
        mockSubmissionData
      );
      
      expect(detailedReport.userName).toBe(mockUserData.name);
      expect(detailedReport.quizTitle).toBe(mockQuizData.title);
      expect(detailedReport.finalScore).toBe(scoreResults.score);
      expect(detailedReport.studyRecommendations).toBeDefined();
      
      // Step 6: Update statistics incrementally
      const statsUpdate = incrementalCalculator.updateStatsIncremental({
        userId: mockSubmissionData.userId,
        quizId: mockSubmissionData.quizId,
        score: scoreResults.score,
        category: 'Mixed',
        difficulty: 'Mixed',
        timeSpent: mockSubmissionData.timeSpent
      });
      
      expect(statsUpdate.overall.average).toBe(scoreResults.score);
      expect(statsUpdate.overall.totalSubmissions).toBe(1);
      
      // Step 7: Cache statistics
      const cachedStats = statisticsCache.getStats(
        `user_${mockSubmissionData.userId}_stats`,
        () => calculateUserStats(mockSubmissionData.userId)
      );
      
      expect(cachedStats).toBeDefined();
      
      // Step 8: Queue for batch processing
      batchProcessor.queueStatsUpdate({
        userId: mockSubmissionData.userId,
        quizId: mockSubmissionData.quizId,
        score: scoreResults.score,
        timestamp: new Date()
      });
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      console.log(`Perfect submission flow completed in ${totalTime}ms`);
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
    
    test('Verify all statistics are updated correctly', async () => {
      // Wait for batch processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const currentAverages = incrementalCalculator.getCurrentAverages();
      expect(currentAverages.overall.totalSubmissions).toBe(1);
      expect(currentAverages.overall.average).toBe(60);
      expect(currentAverages.userCount).toBe(1);
      expect(currentAverages.quizCount).toBe(1);
      
      const memoryUsage = incrementalCalculator.getMemoryUsage();
      expect(memoryUsage.userStats).toBe(1);
      expect(memoryUsage.quizStats).toBe(1);
      
      const cacheStats = statisticsCache.getCacheStats();
      expect(cacheStats.cacheHits).toBeGreaterThan(0);
      expect(cacheStats.currentSize).toBeGreaterThan(0);
    });
  });
  
  describe('📊 Mixed Performance Flow', () => {
    test('Submission with mixed performance (some correct, some incorrect)', async () => {
      const mixedAnswers = [
        { questionId: 'q1', answer: 2 }, // Correct
        { questionId: 'q2', answer: [0, 1] }, // Partially correct
        { questionId: 'q3', answer: 0 }, // Incorrect
        { questionId: 'q4', answer: 0 }, // Correct
        { questionId: 'q5', answer: [1] } // Incorrect
      ];
      
      const mixedSubmission = {
        ...mockSubmissionData,
        answers: mixedAnswers,
        completedAt: new Date('2024-01-15T10:20:00Z'),
        timeSpent: 1200 // 20 minutes
      };
      
      // Step 1: Validate mixed answers
      const validationResults = mockQuizData.questions.map((question, index) => {
        const userAnswer = mixedSubmission.answers[index];
        return validateAnswer(question, userAnswer.answer);
      });
      
      expect(validationResults[0]).toBe(true); // q1 correct
      expect(validationResults[1]).toBe(false); // q2 partially correct
      expect(validationResults[2]).toBe(false); // q3 incorrect
      expect(validationResults[3]).toBe(true); // q4 correct
      expect(validationResults[4]).toBe(false); // q5 incorrect
      
      // Step 2: Process submission
      const scoreResults = await processQuizSubmission(
        mockQuizData.id,
        mixedSubmission.userId,
        mixedSubmission.answers,
        mixedSubmission.metadata
      );
      
      expect(scoreResults.success).toBe(true);
      expect(scoreResults.score).toBeLessThan(60); // Should be less than perfect
      expect(scoreResults.score).toBeGreaterThan(0); // Should be greater than 0
      
      // Step 3: Calculate grade with partial credit
      const gradeResults = calculateComprehensiveGrade(
        scoreResults.score,
        mockQuizData.questions,
        mixedSubmission.answers,
        mixedSubmission.timeSpent,
        mockQuizData.timeLimit
      );
      
      expect(gradeResults.letterGrade).toBeDefined();
      expect(gradeResults.percentage).toBeLessThan(100);
      expect(gradeResults.partialCredit).toBeDefined();
      
      // Step 4: Update statistics
      incrementalCalculator.updateStatsIncremental({
        userId: mixedSubmission.userId,
        quizId: mixedSubmission.quizId,
        score: scoreResults.score,
        category: 'Mixed',
        difficulty: 'Mixed',
        timeSpent: mixedSubmission.timeSpent
      });
      
      const updatedAverages = incrementalCalculator.getCurrentAverages();
      expect(updatedAverages.overall.totalSubmissions).toBe(2);
      expect(updatedAverages.overall.average).toBeLessThan(60); // Should be lower than perfect score
    });
  });
  
  describe('⚠️ Edge Cases and Error Handling', () => {
    test('Handle empty submission data', async () => {
      const emptySubmission = {
        quizId: 'quiz_001',
        userId: 'user_001',
        answers: [],
        metadata: {}
      };
      
      const edgeCaseResults = handleEdgeCases(emptySubmission);
      expect(edgeCaseResults.normalizedAnswers).toEqual([]);
      expect(edgeCaseResults.isValid).toBe(false);
      expect(edgeCaseResults.errors).toContain('No answers provided');
    });
    
    test('Handle submission with invalid question indices', async () => {
      const invalidSubmission = {
        ...mockSubmissionData,
        answers: [
          { questionId: 'q1', answer: 5 }, // Invalid index (should be 0-3)
          { questionId: 'q2', answer: [0, 1, 2, 3] }, // Too many answers
          { questionId: 'q3', answer: 2 } // Invalid index (should be 0-1)
        ]
      };
      
      const edgeCaseResults = handleEdgeCases(invalidSubmission);
      expect(edgeCaseResults.normalizedAnswers).toBeDefined();
      expect(edgeCaseResults.isValid).toBe(false);
      expect(edgeCaseResults.errors.length).toBeGreaterThan(0);
    });
    
    test('Handle malformed submission data', async () => {
      const malformedSubmission = {
        quizId: null,
        userId: undefined,
        answers: 'not an array',
        metadata: null
      };
      
      const edgeCaseResults = handleEdgeCases(malformedSubmission);
      expect(edgeCaseResults.normalizedAnswers).toBeDefined();
      expect(edgeCaseResults.isValid).toBe(false);
      expect(edgeCaseResults.errors.length).toBeGreaterThan(0);
    });
    
    test('Handle timer expiry scenarios', async () => {
      const expiredSubmission = {
        ...mockSubmissionData,
        timeSpent: mockQuizData.timeLimit + 60, // Over time limit
        completedAt: new Date(Date.now() + 60000) // Future time
      };
      
      const edgeCaseResults = handleEdgeCases(expiredSubmission);
      expect(edgeCaseResults.isValid).toBe(false);
      expect(edgeCaseResults.errors).toContain('Time limit exceeded');
    });
  });
  
  describe('🚀 Performance Under Load', () => {
    test('Process multiple submissions concurrently', async () => {
      const concurrentSubmissions = Array.from({ length: 10 }, (_, index) => ({
        ...mockSubmissionData,
        userId: `user_${index + 1}`,
        answers: mockSubmissionData.answers.map(answer => ({ ...answer })),
        score: Math.floor(Math.random() * 40) + 20 // Random score 20-60
      }));
      
      const startTime = Date.now();
      
      // Process all submissions concurrently
      const results = await Promise.all(
        concurrentSubmissions.map(submission => 
          processQuizSubmission(
            submission.quizId,
            submission.userId,
            submission.answers,
            submission.metadata
          )
        )
      );
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
        expect(result.score).toBeGreaterThan(0);
      });
      
      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(10000); // 10 seconds for 10 submissions
      console.log(`Processed ${concurrentSubmissions.length} submissions in ${totalTime}ms`);
      
      // Update statistics for all
      concurrentSubmissions.forEach(submission => {
        incrementalCalculator.updateStatsIncremental({
          userId: submission.userId,
          quizId: submission.quizId,
          score: submission.score,
          category: 'Mixed',
          difficulty: 'Mixed',
          timeSpent: submission.timeSpent
        });
      });
      
      const finalAverages = incrementalCalculator.getCurrentAverages();
      expect(finalAverages.overall.totalSubmissions).toBe(12); // 1 perfect + 1 mixed + 10 concurrent
    });
    
    test('Batch processing performance', async () => {
      const batchSubmissions = Array.from({ length: 50 }, (_, index) => ({
        userId: `batch_user_${index + 1}`,
        quizId: `batch_quiz_${index + 1}`,
        score: Math.floor(Math.random() * 40) + 20,
        timestamp: new Date()
      }));
      
      const startTime = Date.now();
      
      // Queue all for batch processing
      batchSubmissions.forEach(submission => {
        batchProcessor.queueStatsUpdate(submission);
      });
      
      // Wait for batch processing to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      const performanceMetrics = batchProcessor.getPerformanceMetrics();
      expect(performanceMetrics.totalProcessed).toBeGreaterThan(0);
      expect(performanceMetrics.averageProcessingTime).toBeLessThan(1000); // Should be under 1 second
      
      console.log(`Batch processing completed in ${totalTime}ms`);
      console.log('Performance metrics:', performanceMetrics);
    });
  });
  
  describe('✅ Accuracy Verification', () => {
    test('Verify answer validation accuracy across all question types', () => {
      // Single Choice validation
      const singleChoiceQuestion = mockQuizData.questions[0];
      expect(validateAnswer(singleChoiceQuestion, 2)).toBe(true); // Correct
      expect(validateAnswer(singleChoiceQuestion, 0)).toBe(false); // Incorrect
      expect(validateAnswer(singleChoiceQuestion, 5)).toBe(false); // Invalid index
      expect(validateAnswer(singleChoiceQuestion, null)).toBe(false); // Null
      
      // Multiple Choice validation
      const multipleChoiceQuestion = mockQuizData.questions[1];
      expect(validateAnswer(multipleChoiceQuestion, [0, 1, 2])).toBe(true); // All correct
      expect(validateAnswer(multipleChoiceQuestion, [0, 1])).toBe(false); // Incomplete
      expect(validateAnswer(multipleChoiceQuestion, [0, 1, 2, 3])).toBe(false); // Extra answer
      expect(validateAnswer(multipleChoiceQuestion, [0, 0, 1])).toBe(false); // Duplicate
      
      // Yes/No validation
      const yesNoQuestion = mockQuizData.questions[2];
      expect(validateAnswer(yesNoQuestion, 1)).toBe(true); // Correct
      expect(validateAnswer(yesNoQuestion, 0)).toBe(false); // Incorrect
      expect(validateAnswer(yesNoQuestion, 2)).toBe(false); // Invalid index
    });
    
    test('Verify scoring calculation accuracy', async () => {
      // Perfect score calculation
      const perfectAnswers = [
        { questionId: 'q1', answer: 2 }, // 10 points
        { questionId: 'q2', answer: [0, 1, 2] }, // 15 points
        { questionId: 'q3', answer: 1 }, // 5 points
        { questionId: 'q4', answer: 0 }, // 10 points
        { questionId: 'q5', answer: [0] } // 20 points
      ];
      
      const perfectResults = await processQuizSubmission(
        mockQuizData.id,
        'test_user',
        perfectAnswers,
        {}
      );
      
      expect(perfectResults.score).toBe(60); // 10+15+5+10+20
      expect(perfectResults.categoryBreakdown.Hardware.total).toBe(2);
      expect(perfectResults.categoryBreakdown.Programming.total).toBe(2);
      expect(perfectResults.categoryBreakdown['Data Structures'].total).toBe(1);
      
      // Partial score calculation
      const partialAnswers = [
        { questionId: 'q1', answer: 2 }, // 10 points
        { questionId: 'q2', answer: [0, 1] }, // 0 points (incomplete)
        { questionId: 'q3', answer: 1 }, // 5 points
        { questionId: 'q4', answer: 1 }, // 0 points (incorrect)
        { questionId: 'q5', answer: [0] } // 20 points
      ];
      
      const partialResults = await processQuizSubmission(
        mockQuizData.id,
        'test_user',
        partialAnswers,
        {}
      );
      
      expect(partialResults.score).toBe(35); // 10+0+5+0+20
    });
    
    test('Verify grade calculation accuracy', () => {
      // Perfect score should be A
      const perfectGrade = calculateComprehensiveGrade(60, mockQuizData.questions, [], 1500, 1800);
      expect(perfectGrade.letterGrade).toBe('A');
      expect(perfectGrade.percentage).toBe(100);
      
      // Good score should be B
      const goodGrade = calculateComprehensiveGrade(45, mockQuizData.questions, [], 1500, 1800);
      expect(goodGrade.letterGrade).toBe('B');
      expect(goodGrade.percentage).toBe(75);
      
      // Passing score should be C
      const passingGrade = calculateComprehensiveGrade(35, mockQuizData.questions, [], 1500, 1800);
      expect(passingGrade.letterGrade).toBe('C');
      expect(passingGrade.percentage).toBe(58);
      
      // Failing score should be F
      const failingGrade = calculateComprehensiveGrade(25, mockQuizData.questions, [], 1500, 1800);
      expect(failingGrade.letterGrade).toBe('F');
      expect(failingGrade.percentage).toBe(42);
    });
  });
  
  describe('📈 Performance Monitoring Integration', () => {
    test('Monitor performance metrics throughout the flow', () => {
      // Record memory usage
      const memoryInfo = incrementalCalculator.getMemoryUsage();
      performanceMonitor.recordMemoryUsage(memoryInfo);
      
      // Record cache performance
      const cacheStats = statisticsCache.getCacheStats();
      performanceMonitor.updateCacheHitRate(cacheStats.hitRate);
      
      // Record batch processing performance
      const batchMetrics = batchProcessor.getPerformanceMetrics();
      if (batchMetrics.averageProcessingTime > 0) {
        performanceMonitor.recordBatchProcessingTime(batchMetrics.averageProcessingTime);
      }
      
      // Get comprehensive performance report
      const performanceReport = performanceMonitor.getPerformanceReport();
      
      expect(performanceReport.uptime).toBeGreaterThan(0);
      expect(performanceReport.operationCount).toBeGreaterThan(0);
      expect(performanceReport.performance).toBeDefined();
      expect(performanceReport.recommendations).toBeDefined();
      
      console.log('Performance Report:', {
        uptime: performanceReport.uptime,
        operations: performanceReport.operationCount,
        opsPerSecond: performanceReport.operationsPerSecond,
        cacheHitRate: performanceReport.performance.cacheHitRate,
        recommendations: performanceReport.recommendations.length
      });
    });
    
    test('Verify performance recommendations are generated', () => {
      const recommendations = performanceMonitor.generateOptimizationRecommendations();
      
      // Should generate recommendations based on current performance
      expect(Array.isArray(recommendations)).toBe(true);
      
      recommendations.forEach(recommendation => {
        expect(recommendation.type).toBeDefined();
        expect(recommendation.priority).toBeDefined();
        expect(recommendation.message).toBeDefined();
        expect(recommendation.suggestion).toBeDefined();
      });
      
      console.log('Generated recommendations:', recommendations);
    });
  });
  
  describe('🔄 End-to-End Flow Validation', () => {
    test('Complete end-to-end flow with all components', async () => {
      const testStartTime = Date.now();
      
      // 1. User starts quiz
      const quizStart = {
        quizId: mockQuizData.id,
        userId: 'e2e_user',
        startTime: new Date(),
        metadata: { sessionId: 'e2e_session' }
      };
      
      // 2. User answers questions
      const userAnswers = [
        { questionId: 'q1', answer: 2 }, // Correct
        { questionId: 'q2', answer: [0, 1] }, // Partially correct
        { questionId: 'q3', answer: 1 }, // Correct
        { questionId: 'q4', answer: 0 }, // Correct
        { questionId: 'q5', answer: [0] } // Correct
      ];
      
      // 3. Submit quiz
      const submission = {
        ...quizStart,
        answers: userAnswers,
        completedAt: new Date(),
        timeSpent: 1400 // 23 minutes
      };
      
      // 4. Process submission through all systems
      const answerValidation = await processQuizSubmission(
        submission.quizId,
        submission.userId,
        submission.answers,
        submission.metadata
      );
      
      const securityValidation = await processSecureSubmission(
        submission.quizId,
        submission.userId,
        submission.answers,
        submission.metadata
      );
      
      const gradeCalculation = calculateComprehensiveGrade(
        answerValidation.score,
        mockQuizData.questions,
        submission.answers,
        submission.timeSpent,
        mockQuizData.timeLimit
      );
      
      const detailedReport = generateDetailedReport(
        mockUserData,
        mockQuizData,
        answerValidation,
        gradeCalculation,
        submission
      );
      
      // 5. Update all statistics
      incrementalCalculator.updateStatsIncremental({
        userId: submission.userId,
        quizId: submission.quizId,
        score: answerValidation.score,
        category: 'Mixed',
        difficulty: 'Mixed',
        timeSpent: submission.timeSpent
      });
      
      // 6. Cache results
      statisticsCache.getStats(
        `e2e_user_${submission.quizId}`,
        () => ({ score: answerValidation.score, grade: gradeCalculation.letterGrade })
      );
      
      // 7. Queue for batch processing
      batchProcessor.queueStatsUpdate({
        userId: submission.userId,
        quizId: submission.quizId,
        score: answerValidation.score,
        timestamp: new Date()
      });
      
      // 8. Verify all systems worked together
      expect(answerValidation.success).toBe(true);
      expect(securityValidation.success).toBe(true);
      expect(gradeCalculation.letterGrade).toBeDefined();
      expect(detailedReport.finalScore).toBe(answerValidation.score);
      
      // 9. Check statistics were updated
      const finalStats = incrementalCalculator.getCurrentAverages();
      expect(finalStats.overall.totalSubmissions).toBeGreaterThan(0);
      
      // 10. Verify performance
      const testEndTime = Date.now();
      const totalTestTime = testEndTime - testStartTime;
      
      expect(totalTestTime).toBeLessThan(10000); // Should complete within 10 seconds
      
      console.log(`End-to-end flow completed in ${totalTestTime}ms`);
      console.log('Final statistics:', {
        totalSubmissions: finalStats.overall.totalSubmissions,
        averageScore: finalStats.overall.average,
        activeUsers: finalStats.userCount,
        activeQuizzes: finalStats.quizCount
      });
    });
  });
});

/**
 * Performance benchmarks
 */
describe('🏃‍♂️ PERFORMANCE BENCHMARKS', () => {
  test('Answer validation performance benchmark', () => {
    const iterations = 1000;
    const startTime = process.hrtime.bigint();
    
    for (let i = 0; i < iterations; i++) {
      validateAnswer(mockQuizData.questions[0], 2);
      validateAnswer(mockQuizData.questions[1], [0, 1, 2]);
      validateAnswer(mockQuizData.questions[2], 1);
    }
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    const operationsPerSecond = Math.round((iterations * 3) / (duration / 1000));
    
    console.log(`Answer validation benchmark: ${iterations * 3} operations in ${duration}ms`);
    console.log(`Performance: ${operationsPerSecond} operations/second`);
    
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
    expect(operationsPerSecond).toBeGreaterThan(1000); // Should handle 1000+ ops/sec
  });
  
  test('Statistics calculation performance benchmark', () => {
    const calculator = new IncrementalStatsCalculator();
    const iterations = 100;
    const startTime = process.hrtime.bigint();
    
    for (let i = 0; i < iterations; i++) {
      calculator.updateStatsIncremental({
        userId: `benchmark_user_${i}`,
        quizId: `benchmark_quiz_${i}`,
        score: Math.floor(Math.random() * 40) + 20,
        category: 'Benchmark',
        difficulty: 'Medium',
        timeSpent: 1200
      });
    }
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000;
    
    const operationsPerSecond = Math.round(iterations / (duration / 1000));
    
    console.log(`Statistics calculation benchmark: ${iterations} operations in ${duration}ms`);
    console.log(`Performance: ${operationsPerSecond} operations/second`);
    
    expect(duration).toBeLessThan(500); // Should complete within 500ms
    expect(operationsPerSecond).toBeGreaterThan(100); // Should handle 100+ ops/sec
  });
});

console.log('🧪 Integration test suite loaded successfully');
console.log('📋 Test coverage: Complete quiz flow, edge cases, performance, accuracy verification');
console.log('🚀 Ready to run comprehensive integration tests');
