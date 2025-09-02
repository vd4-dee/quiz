// test-sample-data.js
// Test the sample data and create a test submission

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

async function testSampleData() {
  console.log('🧪 Testing Sample Data...\n');
  
  try {
    // Get all collections data
    const questions = await pb.collection('questions').getFullList();
    const quizzes = await pb.collection('quizzes').getFullList();
    const users = await pb.collection('users').getFullList();
    const submissions = await pb.collection('submissions').getFullList();
    
    console.log('📊 Current Data Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📝 Questions: ${questions.length}`);
    console.log(`🎯 Quizzes: ${quizzes.length}`);
    console.log(`📊 Submissions: ${submissions.length}`);
    
    console.log('\n👥 Available Users:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role || 'no role'})`);
    });
    
    console.log('\n📝 Available Questions:');
    questions.slice(0, 3).forEach(q => {
      console.log(`- ${q.question.substring(0, 50)}... (${q.category})`);
    });
    
    console.log('\n🎯 Available Quizzes:');
    quizzes.forEach(q => {
      console.log(`- ${q.title} (${q.status}) - ${q.questions_list?.length || 0} questions`);
    });
    
    // Create a test submission if we have users and quizzes
    if (users.length > 0 && quizzes.length > 0) {
      const student = users.find(u => u.email === 'student@test.com') || users[0];
      const quiz = quizzes.find(q => q.status === 'published') || quizzes[0];
      
      if (student && quiz) {
        console.log('\n📊 Creating test submission...');
        
        const testSubmission = {
          user: student.id,
          quiz: quiz.id,
          score: 85,
          total_questions: quiz.questions_list?.length || 3,
          started_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          completed_at: new Date().toISOString(),
          status: 'completed',
          attempt_number: 1,
          submission_type: 'normal',
          submission_data: {
            answers: [0, 1, 2],
            time_spent: 1200,
            correct_answers: 2,
            total_questions: 3
          }
        };
        
        try {
          const submission = await pb.collection('submissions').create(testSubmission);
          console.log(`✅ Test submission created for ${quiz.title} - Score: ${testSubmission.score}%`);
        } catch (error) {
          console.log('⚠️ Could not create test submission:', error.message);
        }
      }
    }
    
    console.log('\n🎉 Sample data test complete!');
    console.log('\n📋 Test Credentials:');
    console.log('Student: student@test.com / student123');
    console.log('Teacher: teacher@test.com / teacher123');
    console.log('Admin: admin@test.com / admin123');
    
    console.log('\n🌐 Access URLs:');
    console.log('Admin Panel: http://localhost:8090/_/');
    console.log('Frontend: http://localhost:5173/ (if running)');
    
  } catch (error) {
    console.error('❌ Error testing sample data:', error.message);
  }
}

async function main() {
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await testSampleData();
}

main().catch(console.error);
