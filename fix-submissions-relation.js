// fix-submissions-relation.js
// Fix submissions collection relation to point to correct users collection

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

async function fixSubmissionsRelation() {
  try {
    console.log('🔧 Fixing submissions collection relation...\n');
    
    const collections = await pb.collections.getFullList();
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    const quizzesCollection = collections.find(c => c.name === 'quizzes');
    
    if (!submissionsCollection || !quizzesCollection) {
      console.log('❌ Missing collections');
      return;
    }
    
    console.log('📋 Current submissions collection ID:', submissionsCollection.id);
    console.log('📋 Quizzes collection ID:', quizzesCollection.id);
    console.log('📋 Users collection ID: _pb_users_auth_');
    
    // Delete the existing submissions collection
    console.log('\n🗑️ Deleting existing submissions collection...');
    await pb.collections.delete(submissionsCollection.id);
    console.log('✅ Submissions collection deleted');
    
    // Create new submissions collection with correct relations
    console.log('\n🏗️ Creating new submissions collection...');
    
    const newSubmissionsCollection = {
      name: 'submissions',
      type: 'base',
      system: false,
      fields: [
        {
          name: "user",
          type: "relation",
          required: true,
          presentable: true,
          collectionId: '_pb_users_auth_', // Correct users collection ID
          cascadeDelete: true,
          maxSelect: 1,
          minSelect: 1
        },
        {
          name: "quiz", 
          type: "relation",
          required: true,
          presentable: true,
          collectionId: quizzesCollection.id,
          cascadeDelete: false,
          maxSelect: 1, 
          minSelect: 1
        },
        {
          name: "score",
          type: "number",
          required: false,
          presentable: true,
          min: 0,
          max: 100
        },
        {
          name: "total_questions",
          type: "number",
          required: true,
          presentable: false,
          min: 1,
          max: 1000
        },
        {
          name: "started_at", 
          type: "date",
          required: true,
          presentable: false
        },
        {
          name: "completed_at",
          type: "date", 
          required: false,
          presentable: false
        },
        {
          name: "status",
          type: "select",
          required: true,
          presentable: true,
          values: ["started", "in_progress", "completed", "abandoned", "timeout", "submitted", "graded", "reviewed"],
          maxSelect: 1
        },
        {
          name: "attempt_number",
          type: "number",
          required: true,
          presentable: false,
          min: 1,
          max: 10
        },
        {
          name: "submission_type",
          type: "select", 
          required: true,
          presentable: false,
          values: ["normal", "practice", "timed", "exam", "review"],
          maxSelect: 1
        },
        {
          name: "submission_data",
          type: "json",
          required: true,
          presentable: false
        },
        {
          name: "created",
          type: "autodate",
          onCreate: true,
          onUpdate: false
        }
      ]
    };
    
    const result = await pb.collections.create(newSubmissionsCollection);
    console.log('✅ New submissions collection created successfully!');
    console.log(`📋 Collection ID: ${result.id}`);
    
    // Set collection rules
    console.log('\n🔐 Setting collection rules...');
    await pb.collections.update(result.id, {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""'
    });
    console.log('✅ Collection rules set');
    
    return result;
    
  } catch (error) {
    console.error('❌ Error fixing submissions relation:', error.message);
    if (error.response?.data) {
      console.error('📋 Error details:', JSON.stringify(error.response.data, null, 2));
    }
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
    
    console.log(`👤 Using student: ${student.email} (${student.id})`);
    console.log(`🎯 Using quiz: ${quiz.title} (${quiz.id})`);
    
    // Test submission with correct relation
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
      console.log('📋 Submission details:', {
        id: result.id,
        user: result.user,
        quiz: result.quiz,
        score: result.score,
        status: result.status
      });
      
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

async function main() {
  console.log('🚀 Fixing Submissions Collection Relation...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await fixSubmissionsRelation();
  await testSubmissionCreation();
  
  console.log('\n🎉 Submissions relation fix complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Try submitting a quiz again in the frontend');
  console.log('2. The submission should now work correctly');
  console.log('3. Check the admin panel to verify submissions are being created');
}

main().catch(console.error);
