// test-simple-question.js
// Test creating a simple question with correct field names

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

async function testSimpleQuestion() {
  try {
    console.log('🧪 Testing simple question creation...');
    
    const testQuestion = {
      question: 'What is 2 + 2?',
      answers: ['3', '4', '5', '6'],
      correct_answers: [1],
      category: 'excel',
      sub_category: 'Basic Math',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: '2 + 2 = 4'
    };
    
    console.log('📝 Test data:', JSON.stringify(testQuestion, null, 2));
    
    const result = await pb.collection('questions').create(testQuestion);
    console.log('✅ Question created successfully!');
    console.log('📋 Result:', JSON.stringify(result, null, 2));
    
    // Get the created question to verify
    const createdQuestion = await pb.collection('questions').getOne(result.id);
    console.log('🔍 Created question details:');
    console.log(JSON.stringify(createdQuestion, null, 2));
    
    // Clean up
    await pb.collection('questions').delete(result.id);
    console.log('🧹 Test question cleaned up');
    
  } catch (error) {
    console.error('❌ Error creating question:', error.message);
    if (error.data) {
      console.error('Error details:', JSON.stringify(error.data, null, 2));
    }
  }
}

async function main() {
  console.log('🚀 Testing Simple Question Creation...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await testSimpleQuestion();
  
  console.log('\n🎉 Test completed!');
}

main().catch(console.error);
