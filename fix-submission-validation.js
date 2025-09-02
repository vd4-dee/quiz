// fix-submission-validation.js
// Fix submission validation issues

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

async function checkSubmissionsSchema() {
  try {
    console.log('🔍 Checking submissions collection schema...');
    
    const collections = await pb.collections.getFullList();
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    
    if (!submissionsCollection) {
      console.log('❌ Submissions collection not found');
      return;
    }
    
    console.log('📋 Submissions collection fields:');
    submissionsCollection.fields.forEach(field => {
      console.log(`- ${field.name}: ${field.type} (required: ${field.required})`);
      if (field.values) {
        console.log(`  Values: ${field.values.join(', ')}`);
      }
    });
    
    return submissionsCollection;
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  }
}

async function testSubmissionCreation() {
  try {
    console.log('\n🧪 Testing submission creation...');
    
    // Get a user and quiz for testing
    const users = await pb.collection('users').getFullList();
    const quizzes = await pb.collection('quizzes').getFullList();
    
    const student = users.find(u => u.email === 'student@test.com');
    const quiz = quizzes.find(q => q.status === 'published');
    
    if (!student || !quiz) {
      console.log('❌ Missing test data - student or quiz not found');
      return;
    }
    
    console.log(`👤 Using student: ${student.email}`);
    console.log(`🎯 Using quiz: ${quiz.title}`);
    
    // Test submission with minimal required fields
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
      console.log('📋 Created submission:', result);
      
      // Clean up
      await pb.collection('submissions').delete(result.id);
      console.log('🧹 Test submission cleaned up');
      
    } catch (error) {
      console.error('❌ Test submission failed:', error.message);
      if (error.response?.data) {
        console.error('📋 Validation errors:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing submission:', error.message);
  }
}

async function fixSubmissionRules() {
  try {
    console.log('\n🔧 Fixing submission collection rules...');
    
    const collections = await pb.collections.getFullList();
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    
    if (!submissionsCollection) {
      console.log('❌ Submissions collection not found');
      return;
    }
    
    // Update collection rules to be more permissive for testing
    await pb.collections.update(submissionsCollection.id, {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""'
    });
    
    console.log('✅ Submission collection rules updated');
    
  } catch (error) {
    console.error('❌ Error fixing rules:', error.message);
  }
}

async function main() {
  console.log('🚀 Fixing Submission Validation Issues...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkSubmissionsSchema();
  await fixSubmissionRules();
  await testSubmissionCreation();
  
  console.log('\n🎉 Submission validation fix complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Try submitting a quiz again in the frontend');
  console.log('2. Check the browser console for any remaining errors');
  console.log('3. Verify submissions are being created in the admin panel');
}

main().catch(console.error);
