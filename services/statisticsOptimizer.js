/**
 * ⚡ PERFORMANCE OPTIMIZATION FOR STATISTICS
 * 
 * Optimize statistics calculation for real-time performance with large datasets
 * System must calculate complex statistics for 50+ concurrent users without performance degradation
 */

/**
 * Incremental Statistics Calculator
 * Updates running totals without recalculating everything
 */
class IncrementalStatsCalculator {
  constructor() {
    this.runningStats = {
      totalSubmissions: 0,
      totalScore: 0,
      categoryStats: {},
      difficultyStats: {},
      userStats: new Map(),
      quizStats: new Map(),
      lastUpdate: Date.now()
    };
    
    this.updateCount = 0;
    this.lastCleanup = Date.now();
  }
  
  /**
   * Update statistics incrementally with new submission
   * @param {Object} newSubmission - New submission data
   * @returns {Object} - Current averages
   */
  updateStatsIncremental(newSubmission) {
    try {
      const startTime = process.hrtime.bigint();
      
      // Update running totals without recalculating everything
      this.runningStats.totalSubmissions++;
      this.runningStats.totalScore += newSubmission.score;
      
      // Update category stats incrementally
      if (newSubmission.category) {
        if (!this.runningStats.categoryStats[newSubmission.category]) {
          this.runningStats.categoryStats[newSubmission.category] = { 
            total: 0, 
            sum: 0,
            highest: 0,
            lowest: 100
          };
        }
        
        const categoryStats = this.runningStats.categoryStats[newSubmission.category];
        categoryStats.total++;
        categoryStats.sum += newSubmission.score;
        categoryStats.highest = Math.max(categoryStats.highest, newSubmission.score);
        categoryStats.lowest = Math.min(categoryStats.lowest, newSubmission.score);
      }
      
      // Update difficulty stats incrementally
      if (newSubmission.difficulty) {
        if (!this.runningStats.difficultyStats[newSubmission.difficulty]) {
          this.runningStats.difficultyStats[newSubmission.difficulty] = { 
            total: 0, 
            sum: 0,
            correct: 0
          };
        }
        
        const difficultyStats = this.runningStats.difficultyStats[newSubmission.difficulty];
        difficultyStats.total++;
        difficultyStats.sum += newSubmission.score;
        if (newSubmission.score >= 70) {
          difficultyStats.correct++;
        }
      }
      
      // Update user stats incrementally
      this.updateUserStatsIncremental(newSubmission.userId, newSubmission);
      
      // Update quiz stats incrementally
      this.updateQuizStatsIncremental(newSubmission.quizId, newSubmission);
      
      // Update counters
      this.updateCount++;
      this.runningStats.lastUpdate = Date.now();
      
      // Periodic cleanup to prevent memory bloat
      if (this.updateCount % 1000 === 0) {
        this.performCleanup();
      }
      
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      
      // Log slow updates
      if (duration > 10) {
        console.warn(`Slow incremental update: ${duration}ms`);
      }
      
      return this.getCurrentAverages();
      
    } catch (error) {
      console.error('Error in incremental stats update:', error);
      throw error;
    }
  }
  
  /**
   * Update user statistics incrementally
   * @param {string} userId - User ID
   * @param {Object} submission - Submission data
   */
  updateUserStatsIncremental(userId, submission) {
    if (!this.runningStats.userStats.has(userId)) {
      this.runningStats.userStats.set(userId, {
        totalQuizzes: 0,
        totalScore: 0,
        highestScore: 0,
        lowestScore: 100,
        lastQuizDate: null,
        categoryPerformance: {},
        difficultyPerformance: {}
      });
    }
    
    const userStats = this.runningStats.userStats.get(userId);
    userStats.totalQuizzes++;
    userStats.totalScore += submission.score;
    userStats.highestScore = Math.max(userStats.highestScore, submission.score);
    userStats.lowestScore = Math.min(userStats.lowestScore, submission.score);
    userStats.lastQuizDate = new Date();
    
    // Update category performance
    if (submission.category) {
      if (!userStats.categoryPerformance[submission.category]) {
        userStats.categoryPerformance[submission.category] = { total: 0, sum: 0 };
      }
      userStats.categoryPerformance[submission.category].total++;
      userStats.categoryPerformance[submission.category].sum += submission.score;
    }
    
    // Update difficulty performance
    if (submission.difficulty) {
      if (!userStats.difficultyPerformance[submission.difficulty]) {
        userStats.difficultyPerformance[submission.difficulty] = { total: 0, sum: 0 };
      }
      userStats.difficultyPerformance[submission.difficulty].total++;
      userStats.difficultyPerformance[submission.difficulty].sum += submission.score;
    }
  }
  
  /**
   * Update quiz statistics incrementally
   * @param {string} quizId - Quiz ID
   * @param {Object} submission - Submission data
   */
  updateQuizStatsIncremental(quizId, submission) {
    if (!this.runningStats.quizStats.has(quizId)) {
      this.runningStats.quizStats.set(quizId, {
        totalAttempts: 0,
        totalScore: 0,
        highestScore: 0,
        lowestScore: 100,
        uniqueUsers: new Set(),
        lastAttemptDate: null
      });
    }
    
    const quizStats = this.runningStats.quizStats.get(quizId);
    quizStats.totalAttempts++;
    quizStats.totalScore += submission.score;
    quizStats.highestScore = Math.max(quizStats.highestScore, submission.score);
    quizStats.lowestScore = Math.min(quizStats.lowestScore, submission.score);
    quizStats.uniqueUsers.add(submission.userId);
    quizStats.lastAttemptDate = new Date();
  }
  
  /**
   * Get current averages from running statistics
   * @returns {Object} - Current statistical averages
   */
  getCurrentAverages() {
    try {
      const averages = {
        overall: {
          average: this.runningStats.totalSubmissions > 0 ? 
            Math.round(this.runningStats.totalScore / this.runningStats.totalSubmissions) : 0,
          totalSubmissions: this.runningStats.totalSubmissions,
          lastUpdate: this.runningStats.lastUpdate
        },
        categoryAverages: {},
        difficultyAverages: {},
        userCount: this.runningStats.userStats.size,
        quizCount: this.runningStats.quizStats.size
      };
      
      // Calculate category averages
      Object.entries(this.runningStats.categoryStats).forEach(([category, stats]) => {
        averages.categoryAverages[category] = {
          average: Math.round(stats.sum / stats.total),
          total: stats.total,
          highest: stats.highest,
          lowest: stats.lowest
        };
      });
      
      // Calculate difficulty averages
      Object.entries(this.runningStats.difficultyStats).forEach(([difficulty, stats]) => {
        averages.difficultyAverages[difficulty] = {
          average: Math.round(stats.sum / stats.total),
          total: stats.total,
          correctRate: Math.round((stats.correct / stats.total) * 100)
        };
      });
      
      return averages;
      
    } catch (error) {
      console.error('Error getting current averages:', error);
      return {
        overall: { average: 0, totalSubmissions: 0, lastUpdate: Date.now() },
        categoryAverages: {},
        difficultyAverages: {},
        userCount: 0,
        quizCount: 0
      };
    }
  }
  
  /**
   * Perform periodic cleanup to prevent memory bloat
   */
  performCleanup() {
    try {
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      // Clean up old user stats (inactive for more than 1 day)
      for (const [userId, userStats] of this.runningStats.userStats.entries()) {
        if (userStats.lastQuizDate && userStats.lastQuizDate.getTime() < oneDayAgo) {
          this.runningStats.userStats.delete(userId);
        }
      }
      
      // Clean up old quiz stats (inactive for more than 1 day)
      for (const [quizId, quizStats] of this.runningStats.quizStats.entries()) {
        if (quizStats.lastAttemptDate && quizStats.lastAttemptDate.getTime() < oneDayAgo) {
          this.runningStats.quizStats.delete(quizId);
        }
      }
      
      this.lastCleanup = now;
      console.log(`Cleanup completed. Active users: ${this.runningStats.userStats.size}, Active quizzes: ${this.runningStats.quizStats.size}`);
      
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
  
  /**
   * Get memory usage statistics
   * @returns {Object} - Memory usage information
   */
  getMemoryUsage() {
    const userStatsSize = this.runningStats.userStats.size;
    const quizStatsSize = this.runningStats.quizStats.size;
    const categoryStatsSize = Object.keys(this.runningStats.categoryStats).length;
    const difficultyStatsSize = Object.keys(this.runningStats.difficultyStats).length;
    
    return {
      userStats: userStatsSize,
      quizStats: quizStatsSize,
      categoryStats: categoryStatsSize,
      difficultyStats: difficultyStatsSize,
      totalEntries: userStatsSize + quizStatsSize + categoryStatsSize + difficultyStatsSize,
      lastCleanup: this.lastCleanup,
      updateCount: this.updateCount
    };
  }
}

/**
 * Statistics Cache with intelligent invalidation
 */
class StatisticsCache {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    this.maxCacheSize = 1000; // Maximum cache entries
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
  
  /**
   * Get statistics from cache or calculate fresh
   * @param {string} key - Cache key
   * @param {Function} calculationFn - Function to calculate fresh stats
   * @returns {Object} - Cached or fresh statistics
   */
  getStats(key, calculationFn) {
    const now = Date.now();
    
    // Check if cached and not expired
    if (this.cache.has(key) && this.cacheExpiry.get(key) > now) {
      this.cacheHits++;
      return this.cache.get(key);
    }
    
    // Calculate fresh stats
    this.cacheMisses++;
    const stats = calculationFn();
    
    // Cache the results
    this.setCache(key, stats);
    
    return stats;
  }
  
  /**
   * Set cache entry with size management
   * @param {string} key - Cache key
   * @param {Object} value - Value to cache
   */
  setCache(key, value) {
    // Check cache size limit
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldestEntries();
    }
    
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }
  
  /**
   * Evict oldest cache entries when size limit is reached
   */
  evictOldestEntries() {
    const entriesToRemove = Math.ceil(this.maxCacheSize * 0.2); // Remove 20% of entries
    
    // Sort by expiry time and remove oldest
    const sortedEntries = Array.from(this.cacheExpiry.entries())
      .sort(([, a], [, b]) => a - b)
      .slice(0, entriesToRemove);
    
    sortedEntries.forEach(([key]) => {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    });
    
    console.log(`Cache evicted ${entriesToRemove} entries. Current size: ${this.cache.size}`);
  }
  
  /**
   * Invalidate cache entries matching pattern
   * @param {string} pattern - Pattern to match for invalidation
   */
  invalidateCache(pattern) {
    let invalidatedCount = 0;
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
        invalidatedCount++;
      }
    }
    
    if (invalidatedCount > 0) {
      console.log(`Invalidated ${invalidatedCount} cache entries matching pattern: ${pattern}`);
    }
  }
  
  /**
   * Get cache performance statistics
   * @returns {Object} - Cache performance metrics
   */
  getCacheStats() {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;
    
    return {
      hitRate: Math.round(hitRate * 100) / 100,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      totalRequests: totalRequests,
      currentSize: this.cache.size,
      maxSize: this.maxCacheSize,
      utilization: Math.round((this.cache.size / this.maxCacheSize) * 100)
    };
  }
  
  /**
   * Clear entire cache
   */
  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
    console.log('Cache cleared');
  }
}

/**
 * Batch Statistics Processor
 * Processes multiple submissions in batches for efficiency
 */
class BatchStatsProcessor {
  constructor() {
    this.pendingUpdates = [];
    this.batchSize = 50;
    this.batchTimeout = 2000; // 2 seconds
    this.batchTimer = null;
    this.isProcessing = false;
    this.totalProcessed = 0;
    this.processingTimes = [];
  }
  
  /**
   * Queue statistics update for batch processing
   * @param {Object} submissionData - Submission data to process
   */
  queueStatsUpdate(submissionData) {
    this.pendingUpdates.push(submissionData);
    
    if (this.pendingUpdates.length >= this.batchSize) {
      this.processBatch();
    } else if (!this.batchTimer) {
      this.scheduleNextBatch();
    }
  }
  
  /**
   * Schedule next batch processing
   */
  scheduleNextBatch() {
    this.batchTimer = setTimeout(() => {
      this.processBatch();
    }, this.batchTimeout);
  }
  
  /**
   * Process batch of submissions
   */
  async processBatch() {
    if (this.isProcessing || this.pendingUpdates.length === 0) return;
    
    this.isProcessing = true;
    const startTime = Date.now();
    
    try {
      // Clear timer
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
        this.batchTimer = null;
      }
      
      // Get batch to process
      const batch = this.pendingUpdates.splice(0, this.batchSize);
      
      // Process all submissions in batch
      const batchResults = await this.calculateBatchStatistics(batch);
      
      // Update database in single transaction
      await this.saveBatchResults(batchResults);
      
      // Broadcast updates to connected admin dashboards
      this.broadcastUpdates(batchResults);
      
      // Update metrics
      const processingTime = Date.now() - startTime;
      this.processingTimes.push(processingTime);
      this.totalProcessed += batch.length;
      
      // Keep only last 100 processing times
      if (this.processingTimes.length > 100) {
        this.processingTimes.shift();
      }
      
      console.log(`Batch processed ${batch.length} submissions in ${processingTime}ms`);
      
    } catch (error) {
      console.error('Batch processing error:', error);
      
      // Re-queue failed submissions
      if (this.pendingUpdates.length === 0) {
        this.pendingUpdates.unshift(...this.pendingUpdates.splice(0, this.batchSize));
      }
    } finally {
      this.isProcessing = false;
      
      // Schedule next batch if there are more pending updates
      if (this.pendingUpdates.length > 0) {
        this.scheduleNextBatch();
      }
    }
  }
  
  /**
   * Calculate statistics for batch of submissions
   * @param {Array} batch - Batch of submissions
   * @returns {Object} - Batch statistics results
   */
  async calculateBatchStatistics(batch) {
    try {
      const batchStats = {
        totalSubmissions: batch.length,
        averageScore: 0,
        categoryBreakdown: {},
        difficultyBreakdown: {},
        userBreakdown: {},
        quizBreakdown: {},
        timestamp: new Date()
      };
      
      let totalScore = 0;
      
      batch.forEach(submission => {
        totalScore += submission.score;
        
        // Category breakdown
        if (submission.category) {
          if (!batchStats.categoryBreakdown[submission.category]) {
            batchStats.categoryBreakdown[submission.category] = { total: 0, sum: 0 };
          }
          batchStats.categoryBreakdown[submission.category].total++;
          batchStats.categoryBreakdown[submission.category].sum += submission.score;
        }
        
        // Difficulty breakdown
        if (submission.difficulty) {
          if (!batchStats.difficultyBreakdown[submission.difficulty]) {
            batchStats.difficultyBreakdown[submission.difficulty] = { total: 0, sum: 0 };
          }
          batchStats.difficultyBreakdown[submission.difficulty].total++;
          batchStats.difficultyBreakdown[submission.difficulty].sum += submission.score;
        }
        
        // User breakdown
        if (submission.userId) {
          if (!batchStats.userBreakdown[submission.userId]) {
            batchStats.userBreakdown[submission.userId] = { total: 0, sum: 0 };
          }
          batchStats.userBreakdown[submission.userId].total++;
          batchStats.userBreakdown[submission.userId].sum += submission.score;
        }
        
        // Quiz breakdown
        if (submission.quizId) {
          if (!batchStats.quizBreakdown[submission.quizId]) {
            batchStats.quizBreakdown[submission.quizId] = { total: 0, sum: 0 };
          }
          batchStats.quizBreakdown[submission.quizId].total++;
          batchStats.quizBreakdown[submission.quizId].sum += submission.score;
        }
      });
      
      // Calculate averages
      batchStats.averageScore = Math.round(totalScore / batch.length);
      
      // Calculate category percentages
      Object.keys(batchStats.categoryBreakdown).forEach(category => {
        const stats = batchStats.categoryBreakdown[category];
        stats.average = Math.round(stats.sum / stats.total);
      });
      
      // Calculate difficulty percentages
      Object.keys(batchStats.difficultyBreakdown).forEach(difficulty => {
        const stats = batchStats.difficultyBreakdown[difficulty];
        stats.average = Math.round(stats.sum / stats.total);
      });
      
      return batchStats;
      
    } catch (error) {
      console.error('Error calculating batch statistics:', error);
      throw error;
    }
  }
  
  /**
   * Save batch results to database
   * @param {Object} batchResults - Batch statistics results
   */
  async saveBatchResults(batchResults) {
    try {
      // This would typically save to database
      // For now, just log the results
      console.log('Saving batch results:', {
        totalSubmissions: batchResults.totalSubmissions,
        averageScore: batchResults.averageScore,
        categories: Object.keys(batchResults.categoryBreakdown).length,
        difficulties: Object.keys(batchStats.difficultyBreakdown).length
      });
      
      // Simulate database save time
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error('Error saving batch results:', error);
      throw error;
    }
  }
  
  /**
   * Broadcast updates to connected clients
   * @param {Object} batchResults - Batch statistics results
   */
  async broadcastUpdates(batchResults) {
    try {
      // This would typically use WebSocket or Server-Sent Events
      // For now, just log the broadcast
      console.log('Broadcasting batch updates to connected clients');
      
      // Simulate broadcast time
      await new Promise(resolve => setTimeout(resolve, 10));
      
    } catch (error) {
      console.error('Error broadcasting updates:', error);
      // Don't throw error for broadcast failures
    }
  }
  
  /**
   * Get batch processing performance metrics
   * @returns {Object} - Performance metrics
   */
  getPerformanceMetrics() {
    const avgProcessingTime = this.processingTimes.length > 0 ? 
      this.processingTimes.reduce((a, b) => a + b, 0) / this.processingTimes.length : 0;
    
    return {
      totalProcessed: this.totalProcessed,
      pendingUpdates: this.pendingUpdates.length,
      isProcessing: this.isProcessing,
      averageProcessingTime: Math.round(avgProcessingTime),
      batchSize: this.batchSize,
      batchTimeout: this.batchTimeout
    };
  }
}

/**
 * Performance Monitor for statistics calculations
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      calculationTimes: [],
      cacheHitRate: 0,
      batchProcessingTimes: [],
      memoryUsage: [],
      slowOperations: []
    };
    
    this.startTime = Date.now();
    this.operationCount = 0;
  }
  
  /**
   * Measure calculation time for performance monitoring
   * @param {Function} calculationFn - Function to measure
   * @param {string} context - Context description
   * @returns {any} - Result of calculation function
   */
  measureCalculationTime(calculationFn, context) {
    const startTime = process.hrtime.bigint();
    const result = calculationFn();
    const endTime = process.hrtime.bigint();
    
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    this.metrics.calculationTimes.push({
      context,
      duration,
      timestamp: Date.now()
    });
    
    // Track slow operations
    if (duration > 1000) { // More than 1 second
      this.metrics.slowOperations.push({
        context,
        duration,
        timestamp: Date.now(),
        severity: duration > 5000 ? 'CRITICAL' : 'WARNING'
      });
      
      console.warn(`Slow calculation detected: ${context} took ${duration}ms`);
    }
    
    // Keep only last 1000 calculation times
    if (this.metrics.calculationTimes.length > 1000) {
      this.metrics.calculationTimes.shift();
    }
    
    this.operationCount++;
    
    return result;
  }
  
  /**
   * Update cache hit rate
   * @param {number} hitRate - Current cache hit rate
   */
  updateCacheHitRate(hitRate) {
    this.metrics.cacheHitRate = hitRate;
  }
  
  /**
   * Record batch processing time
   * @param {number} processingTime - Batch processing time in milliseconds
   */
  recordBatchProcessingTime(processingTime) {
    this.metrics.batchProcessingTimes.push({
      duration: processingTime,
      timestamp: Date.now()
    });
    
    // Keep only last 100 batch processing times
    if (this.metrics.batchProcessingTimes.length > 100) {
      this.metrics.batchProcessingTimes.shift();
    }
  }
  
  /**
   * Record memory usage
   * @param {Object} memoryInfo - Memory usage information
   */
  recordMemoryUsage(memoryInfo) {
    this.metrics.memoryUsage.push({
      ...memoryInfo,
      timestamp: Date.now()
    });
    
    // Keep only last 100 memory measurements
    if (this.metrics.memoryUsage.length > 100) {
      this.metrics.memoryUsage.shift();
    }
  }
  
  /**
   * Get comprehensive performance report
   * @returns {Object} - Performance report
   */
  getPerformanceReport() {
    const uptime = Date.now() - this.startTime;
    const avgCalculationTime = this.metrics.calculationTimes.length > 0 ? 
      this.metrics.calculationTimes.reduce((sum, m) => sum + m.duration, 0) / this.metrics.calculationTimes.length : 0;
    
    const avgBatchTime = this.metrics.batchProcessingTimes.length > 0 ? 
      this.metrics.batchProcessingTimes.reduce((sum, m) => sum + m.duration, 0) / this.metrics.batchProcessingTimes.length : 0;
    
    return {
      uptime: Math.round(uptime / 1000), // in seconds
      operationCount: this.operationCount,
      operationsPerSecond: Math.round((this.operationCount / (uptime / 1000)) * 100) / 100,
      
      performance: {
        averageCalculationTime: Math.round(avgCalculationTime * 100) / 100,
        averageBatchProcessingTime: Math.round(avgBatchTime * 100) / 100,
        cacheHitRate: this.metrics.cacheHitRate,
        slowOperations: this.metrics.slowOperations.length
      },
      
      slowestCalculations: this.metrics.calculationTimes
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10),
      
      slowestBatches: this.metrics.batchProcessingTimes
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10),
      
      memoryTrend: this.metrics.memoryUsage.slice(-20), // Last 20 measurements
      
      recommendations: this.generateOptimizationRecommendations()
    };
  }
  
  /**
   * Generate optimization recommendations based on performance data
   * @returns {Array} - Array of optimization recommendations
   */
  generateOptimizationRecommendations() {
    const recommendations = [];
    
    // Check calculation time performance
    if (this.metrics.calculationTimes.length > 0) {
      const avgTime = this.metrics.calculationTimes.reduce((sum, m) => sum + m.duration, 0) / this.metrics.calculationTimes.length;
      
      if (avgTime > 500) {
        recommendations.push({
          type: 'CALCULATION_PERFORMANCE',
          priority: 'HIGH',
          message: 'Average calculation time is high',
          suggestion: 'Consider implementing more aggressive caching or algorithm optimization'
        });
      }
    }
    
    // Check cache performance
    if (this.metrics.cacheHitRate < 70) {
      recommendations.push({
        type: 'CACHE_OPTIMIZATION',
        priority: 'MEDIUM',
        message: 'Cache hit rate is below optimal',
        suggestion: 'Review cache invalidation strategy and increase cache duration'
      });
    }
    
    // Check batch processing performance
    if (this.metrics.batchProcessingTimes.length > 0) {
      const avgBatchTime = this.metrics.batchProcessingTimes.reduce((sum, m) => sum + m.duration, 0) / this.metrics.batchProcessingTimes.length;
      
      if (avgBatchTime > 1000) {
        recommendations.push({
          type: 'BATCH_OPTIMIZATION',
          priority: 'MEDIUM',
          message: 'Batch processing is taking too long',
          suggestion: 'Consider reducing batch size or optimizing batch processing logic'
        });
      }
    }
    
    // Check memory usage
    if (this.metrics.memoryUsage.length > 0) {
      const recentMemory = this.metrics.memoryUsage.slice(-10);
      const avgMemory = recentMemory.reduce((sum, m) => sum + m.totalEntries, 0) / recentMemory.length;
      
      if (avgMemory > 10000) {
        recommendations.push({
          type: 'MEMORY_OPTIMIZATION',
          priority: 'HIGH',
          message: 'High memory usage detected',
          suggestion: 'Implement more aggressive cleanup and memory management'
        });
      }
    }
    
    return recommendations.sort((a, b) => {
      const priorityWeight = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }
}

/**
 * Database query optimization utilities
 */
const optimizedQueries = {
  /**
   * Optimized query for user performance statistics
   */
  getUserPerformanceStats: `
    SELECT 
      u.id,
      u.name,
      COUNT(s.id) as total_quizzes,
      AVG(s.score) as avg_score,
      SUM(CASE WHEN s.score >= 70 THEN 1 ELSE 0 END) as passed_quizzes,
      MAX(s.completed_at) as last_quiz_date,
      AVG(JULIANDAY(s.completed_at) - JULIANDAY(s.started_at)) * 24 * 60 as avg_duration_minutes
    FROM users u
    LEFT JOIN submissions s ON u.id = s.user
    WHERE u.id = ?
    GROUP BY u.id
  `,
  
  /**
   * Optimized query for quiz effectiveness statistics
   */
  getQuizEffectivenessStats: `
    SELECT 
      q.id,
      q.title,
      COUNT(s.id) as total_attempts,
      AVG(s.score) as avg_score,
      COUNT(DISTINCT s.user) as unique_users,
      AVG(JULIANDAY(s.completed_at) - JULIANDAY(s.started_at)) * 24 * 60 as avg_duration_minutes,
      SUM(CASE WHEN s.score >= 70 THEN 1 ELSE 0 END) as passed_attempts
    FROM quizzes q
    LEFT JOIN submissions s ON q.id = s.quiz
    WHERE q.is_active = true
    GROUP BY q.id
    ORDER BY total_attempts DESC
  `,
  
  /**
   * Optimized query for category performance
   */
  getCategoryPerformance: `
    SELECT 
      JSON_EXTRACT(s.submission_data, '$.categoryBreakdown') as category_data,
      s.score,
      s.completed_at,
      s.user
    FROM submissions s
    WHERE s.user = ? AND s.completed_at >= datetime('now', '-30 days')
    ORDER BY s.completed_at DESC
  `,
  
  /**
   * Optimized query for difficulty performance
   */
  getDifficultyPerformance: `
    SELECT 
      JSON_EXTRACT(s.submission_data, '$.difficultyBreakdown') as difficulty_data,
      s.score,
      s.completed_at,
      s.user
    FROM submissions s
    WHERE s.user = ? AND s.completed_at >= datetime('now', '-30 days')
    ORDER BY s.completed_at DESC
  `
};

// Export classes and utilities
module.exports = {
  IncrementalStatsCalculator,
  StatisticsCache,
  BatchStatsProcessor,
  PerformanceMonitor,
  optimizedQueries
};
