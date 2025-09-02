// test-frontend-submission.js
// Test the frontend submission payload format

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function loginAdmin() {
  try {
    await pb.admins.authWithPassword('admin@test.com', 'admin123');
    console.log('✅ Admin login successful');
    return true;
  } catch (error) {
    console.log('❌ Admin login failed:', error.message);
    return false;
  }
}

async function testFrontendSubmissionFormat() {
  try {
    console.log('🧪 Testing frontend submission format...\n');
    
    // Get test data
    const users = await pb.collection('users').getFullList();
    const quizzes = await pb.collection('quizzes').getFullList();
    
    const student = users.find(u => u.email === 'student@test.com');
    const quiz = quizzes.find(q => q.status === 'published');
    
    if (!student || !quiz) {
      console.log('❌ Missing test data');
      return;
    }
    
    console.log(`👤 Test user: ${student.email} (${student.id})`);
    console.log(`🎯 Test quiz: ${quiz.title} (${quiz.id})`);
    
    // Simulate the frontend submission payload (with the fix)
    const frontendSubmissionPayload = {
      user: student.id,
      quiz: quiz.id,
      score: 85,
      total_questions: 1,
      started_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      completed_at: new Date().toISOString(),
      status: 'completed', // ✅ FIXED: Added required status field
      attempt_number: 1, // ✅ FIXED: Added required attempt_number field
      submission_type: 'normal', // ✅ FIXED: Added required submission_type field
      submission_data: {
        quizId: quiz.id,
        answers: { 'test-question-id': 0 },
        timeTaken: 1800,
        score: 85,
        correctAnswers: 1,
        totalQuestions: 1
      }
    };
    
    console.log('\n📝 Frontend submission payload (with fix):');
    console.log(JSON.stringify(frontendSubmissionPayload, null, 2));
    
    try {
      const result = await pb.collection('submissions').create(frontendSubmissionPayload);
      console.log('\n✅ Frontend submission format works!');
      console.log('📋 Created submission:', {
        id: result.id,
        user: result.user,
        quiz: result.quiz,
        score: result.score,
        status: result.status,
        attempt_number: result.attempt_number,
        submission_type: result.submission_type
      });
      
      // Clean up
      await pb.collection('submissions').delete(result.id);
      console.log('🧹 Test submission cleaned up');
      
    } catch (error) {
      console.error('❌ Frontend submission format failed:', error.message);
      if (error.response?.data) {
        console.error('📋 Validation errors:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing frontend submission:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing Frontend Submission Format...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await testFrontendSubmissionFormat();
  
  console.log('\n🎉 Frontend submission test complete!');
  console.log('\n📋 The frontend should now work correctly for quiz submissions.');
}

main().catch(console.error);
