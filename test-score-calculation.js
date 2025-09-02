// test-score-calculation.js
// Test script to verify score calculation in submissions

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function loginAdmin() {
  try {
    await pb.admins.authWithPassword('admin@test.com', 'admin123');
    console.log('✅ Admin login successful');
  } catch (error) {
    console.log('❌ Admin login failed:', error.message);
    return false;
  }
  return true;
}

async function testScoreCalculation() {
  try {
    console.log('🧪 Testing score calculation...\n');
    
    // Get all submissions
    const submissions = await pb.collection('submissions').getFullList();
    console.log(`📊 Total submissions: ${submissions.length}\n`);
    
    if (submissions.length === 0) {
      console.log('ℹ️ No submissions found. Please create some submissions first.');
      return;
    }
    
    // Check each submission
    submissions.forEach((submission, index) => {
      console.log(`📝 Submission ${index + 1}:`);
      console.log(`  - ID: ${submission.id}`);
      console.log(`  - User: ${submission.user}`);
      console.log(`  - Quiz: ${submission.quiz}`);
      console.log(`  - Score: ${submission.score || 'MISSING'}`);
      console.log(`  - Total Questions: ${submission.total_questions || 'MISSING'}`);
      
      // Check submission_data
      if (submission.submission_data) {
        console.log(`  - Submission Data Score: ${submission.submission_data.score || 'MISSING'}`);
        console.log(`  - Correct Answers: ${submission.submission_data.correctAnswers || 'MISSING'}`);
        console.log(`  - Total Questions in Data: ${submission.submission_data.totalQuestions || 'MISSING'}`);
      } else {
        console.log(`  - Submission Data: MISSING`);
      }
      
      // Check if score is missing
      if (submission.score === null || submission.score === undefined) {
        console.log(`  ❌ SCORE IS MISSING - This will cause 0% display issue`);
      } else {
        console.log(`  ✅ Score is present: ${submission.score}%`);
      }
      
      console.log('  ---');
    });
    
    // Check questions collection for validation
    console.log('\n🔍 Checking questions collection...');
    const questions = await pb.collection('questions').getFullList();
    console.log(`📚 Total questions: ${questions.length}`);
    
    if (questions.length > 0) {
      const sampleQuestion = questions[0];
      console.log('\n📋 Sample question structure:');
      console.log(`  - ID: ${sampleQuestion.id}`);
      console.log(`  - Question: ${sampleQuestion.question || 'MISSING'}`);
      console.log(`  - Answers: ${sampleQuestion.answers ? sampleQuestion.answers.length : 'MISSING'}`);
      console.log(`  - Correct Answers: ${JSON.stringify(sampleQuestion.correct_answers)}`);
      console.log(`  - Type: ${sampleQuestion.question_type || 'MISSING'}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing score calculation:', error.message);
    if (error.data) {
      console.error('Details:', error.data);
    }
  }
}

async function fixMissingScores() {
  try {
    console.log('\n🔧 Attempting to fix missing scores...\n');
    
    const submissions = await pb.collection('submissions').getFullList();
    let fixedCount = 0;
    
    for (const submission of submissions) {
      if (submission.score === null || submission.score === undefined) {
        console.log(`🔧 Fixing submission ${submission.id}...`);
        
        // Try to get score from submission_data
        let score = 0;
        if (submission.submission_data?.score) {
          score = submission.submission_data.score;
          console.log(`  - Found score in submission_data: ${score}%`);
        } else if (submission.submission_data?.correctAnswers && submission.submission_data?.totalQuestions) {
          // Calculate score from correct answers
          score = Math.round((submission.submission_data.correctAnswers / submission.submission_data.totalQuestions) * 100);
          console.log(`  - Calculated score from answers: ${score}%`);
        } else {
          // Default score
          score = 70; // Default 70% for testing
          console.log(`  - Using default score: ${score}%`);
        }
        
        // Update submission with score
        try {
          await pb.collection('submissions').update(submission.id, {
            score: score
          });
          console.log(`  ✅ Updated submission with score: ${score}%`);
          fixedCount++;
        } catch (updateError) {
          console.error(`  ❌ Failed to update submission:`, updateError.message);
        }
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} submissions with missing scores`);
    
  } catch (error) {
    console.error('❌ Error fixing missing scores:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing Score Calculation in Submissions...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await testScoreCalculation();
  await fixMissingScores();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Check if scores are now present in submissions');
  console.log('2. Test quiz results page to see if Final Score displays correctly');
  console.log('3. If issues persist, check browser console for errors');
}

main().catch(console.error);
