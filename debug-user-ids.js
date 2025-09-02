// debug-user-ids.js
// Debug user IDs and fix submission issues

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

async function debugUserIds() {
  try {
    console.log('🔍 Debugging User IDs...\n');
    
    // Get all users
    const users = await pb.collection('users').getFullList();
    console.log('👥 All Users:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role || 'no role'}`);
      console.log(`  Name: ${user.name || 'no name'}`);
      console.log('');
    });
    
    // Get all quizzes
    const quizzes = await pb.collection('quizzes').getFullList();
    console.log('🎯 All Quizzes:');
    quizzes.forEach(quiz => {
      console.log(`- ID: ${quiz.id}`);
      console.log(`  Title: ${quiz.title}`);
      console.log(`  Status: ${quiz.status}`);
      console.log(`  Questions: ${quiz.questions_list?.length || 0}`);
      console.log('');
    });
    
    // Test submission with correct IDs
    const student = users.find(u => u.email === 'student@test.com');
    const quiz = quizzes.find(q => q.status === 'published');
    
    if (student && quiz) {
      console.log('🧪 Testing submission with correct IDs...');
      
      const testSubmission = {
        user: student.id,
        quiz: quiz.id,
        total_questions: 1,
        started_at: new Date().toISOString(),
        status: 'completed',
        attempt_number: 1,
        submission_type: 'normal',
        submission_data: { test: true }
      };
      
      console.log('📝 Test submission payload:', testSubmission);
      
      try {
        const result = await pb.collection('submissions').create(testSubmission);
        console.log('✅ Test submission created successfully!');
        console.log('📋 Created submission ID:', result.id);
        
        // Clean up
        await pb.collection('submissions').delete(result.id);
        console.log('🧹 Test submission cleaned up');
        
      } catch (error) {
        console.error('❌ Test submission failed:', error.message);
        if (error.response?.data) {
          console.error('📋 Validation errors:', JSON.stringify(error.response.data, null, 2));
        }
      }
    } else {
      console.log('❌ Missing test data:');
      console.log(`- Student found: ${!!student}`);
      console.log(`- Quiz found: ${!!quiz}`);
    }
    
  } catch (error) {
    console.error('❌ Error debugging user IDs:', error.message);
  }
}

async function main() {
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await debugUserIds();
}

main().catch(console.error);
