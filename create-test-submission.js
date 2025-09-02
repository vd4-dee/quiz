// create-test-submission.js
// Create a test submission with proper score for testing

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

async function createTestSubmission() {
  try {
    console.log('🧪 Creating test submission with score...\n');
    
    // Get first user
    const users = await pb.collection('users').getFullList();
    if (users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }
    const testUser = users[0];
    console.log(`👤 Using test user: ${testUser.email} (ID: ${testUser.id})`);
    
    // Get first quiz
    const quizzes = await pb.collection('quizzes').getFullList();
    if (quizzes.length === 0) {
      console.log('❌ No quizzes found. Please create a quiz first.');
      return;
    }
    const testQuiz = quizzes[0];
    console.log(`🎯 Using test quiz: ${testQuiz.title} (ID: ${testQuiz.id})`);
    
    // Get questions for this quiz
    const questions = await pb.collection('questions').getFullList();
    if (questions.length === 0) {
      console.log('❌ No questions found. Please create questions first.');
      return;
    }
    console.log(`📚 Found ${questions.length} questions`);
    
    // Create mock answers (simulating user taking quiz)
    const mockAnswers = {};
    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
      const questionId = question.id;
      
      // Simulate user answers (70% correct for testing)
      let userAnswer;
      if (index < Math.floor(questions.length * 0.7)) {
        // Correct answer
        userAnswer = question.correct_answers[0];
        correctAnswers++;
      } else {
        // Incorrect answer
        userAnswer = (question.correct_answers[0] + 1) % 4; // Wrong answer
      }
      
      mockAnswers[questionId] = userAnswer;
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    console.log(`📊 Mock quiz results:`);
    console.log(`  - Total questions: ${questions.length}`);
    console.log(`  - Correct answers: ${correctAnswers}`);
    console.log(`  - Score: ${score}%`);
    
    // Create submission with proper score
    const submissionData = {
      user: testUser.id,
      quiz: testQuiz.id,
      score: score, // ✅ Include score field
      total_questions: questions.length,
      started_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      completed_at: new Date().toISOString(),
      submission_data: {
        quizId: testQuiz.id,
        answers: mockAnswers,
        timeTaken: 1800, // 30 minutes
        score: score, // ✅ Include score in submission data
        correctAnswers: correctAnswers,
        totalQuestions: questions.length
      }
    };
    
    console.log('\n📝 Creating submission with data:', {
      user: submissionData.user,
      quiz: submissionData.quiz,
      score: submissionData.score,
      total_questions: submissionData.total_questions
    });
    
    const submission = await pb.collection('submissions').create(submissionData);
    
    console.log('\n✅ Test submission created successfully!');
    console.log(`  - Submission ID: ${submission.id}`);
    console.log(`  - Score: ${submission.score}%`);
    console.log(`  - Total Questions: ${submission.total_questions}`);
    console.log(`  - User: ${submission.user}`);
    console.log(`  - Quiz: ${submission.quiz}`);
    
    console.log('\n🎯 Test this submission:');
    console.log(`  - Frontend URL: http://localhost:5173/results/${submission.id}`);
    console.log(`  - Check if Final Score displays ${score}% instead of 0%`);
    
  } catch (error) {
    console.error('❌ Error creating test submission:', error.message);
    if (error.data) {
      console.error('Validation errors:', error.data);
    }
  }
}

async function main() {
  console.log('🚀 Creating Test Submission with Score...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await createTestSubmission();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Check if submission was created with score');
  console.log('2. Test the quiz results page with the new submission ID');
  console.log('3. Verify that Final Score displays correctly (not 0%)');
}

main().catch(console.error);
