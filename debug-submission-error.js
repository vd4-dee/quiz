// debug-submission-error.js
// Debug the exact submission validation error

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

async function debugSubmissionError() {
  try {
    console.log('🔍 Debugging submission error...\n');
    
    // Get current collections
    const collections = await pb.collections.getFullList();
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    
    if (!submissionsCollection) {
      console.log('❌ Submissions collection not found');
      return;
    }
    
    console.log('📋 Current submissions collection schema:');
    submissionsCollection.fields.forEach(field => {
      console.log(`- ${field.name}: ${field.type} (required: ${field.required})`);
      if (field.values) {
        console.log(`  Values: ${field.values.join(', ')}`);
      }
      if (field.collectionId) {
        console.log(`  Collection ID: ${field.collectionId}`);
      }
    });
    
    // Get test data
    const users = await pb.collection('users').getFullList();
    const quizzes = await pb.collection('quizzes').getFullList();
    
    const student = users.find(u => u.email === 'student@test.com');
    const quiz = quizzes.find(q => q.status === 'published');
    
    if (!student || !quiz) {
      console.log('❌ Missing test data');
      return;
    }
    
    console.log(`\n👤 Test user: ${student.email} (${student.id})`);
    console.log(`🎯 Test quiz: ${quiz.title} (${quiz.id})`);
    
    // Try different submission payloads to identify the issue
    const testPayloads = [
      {
        name: 'Minimal payload',
        data: {
          user: student.id,
          quiz: quiz.id,
          total_questions: 1,
          started_at: new Date().toISOString(),
          status: 'completed',
          attempt_number: 1,
          submission_type: 'normal',
          submission_data: { test: true }
        }
      },
      {
        name: 'With completed_at',
        data: {
          user: student.id,
          quiz: quiz.id,
          total_questions: 1,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          status: 'completed',
          attempt_number: 1,
          submission_type: 'normal',
          submission_data: { test: true }
        }
      },
      {
        name: 'With score',
        data: {
          user: student.id,
          quiz: quiz.id,
          score: 85,
          total_questions: 1,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          status: 'completed',
          attempt_number: 1,
          submission_type: 'normal',
          submission_data: { test: true }
        }
      }
    ];
    
    for (const test of testPayloads) {
      console.log(`\n🧪 Testing ${test.name}...`);
      console.log('📝 Payload:', JSON.stringify(test.data, null, 2));
      
      try {
        const result = await pb.collection('submissions').create(test.data);
        console.log('✅ Success! Created submission:', result.id);
        
        // Clean up
        await pb.collection('submissions').delete(result.id);
        console.log('🧹 Cleaned up test submission');
        
      } catch (error) {
        console.error('❌ Failed:', error.message);
        if (error.response?.data) {
          console.error('📋 Validation errors:', JSON.stringify(error.response.data, null, 2));
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging submission:', error.message);
  }
}

async function checkCollectionRules() {
  try {
    console.log('\n🔐 Checking collection rules...');
    
    const collections = await pb.collections.getFullList();
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    
    if (submissionsCollection) {
      console.log('📋 Current rules:');
      console.log(`- List: ${submissionsCollection.listRule || 'none'}`);
      console.log(`- View: ${submissionsCollection.viewRule || 'none'}`);
      console.log(`- Create: ${submissionsCollection.createRule || 'none'}`);
      console.log(`- Update: ${submissionsCollection.updateRule || 'none'}`);
      console.log(`- Delete: ${submissionsCollection.deleteRule || 'none'}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking rules:', error.message);
  }
}

async function main() {
  console.log('🚀 Debugging Submission Error...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await debugSubmissionError();
  await checkCollectionRules();
  
  console.log('\n🎉 Debug complete!');
}

main().catch(console.error);
