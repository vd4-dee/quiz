// test-pandas-simple.js
// Simple test for creating pandas questions

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

async function testPandasQuestion() {
  try {
    console.log('🧪 Testing pandas question creation...');
    
    // Test with both field names
    const testData = {
      question: 'What is pandas in Python?',
      answers: ['A library for data analysis', 'A type of animal', 'A programming language', 'A database'],
      correct_answers: [0],
      category: 'pandas',
      sub_category: 'Basics',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: 'Pandas is a Python library for data manipulation and analysis.'
    };
    
    console.log('📝 Test data:', JSON.stringify(testData, null, 2));
    
    const result = await pb.collection('questions').create(testData);
    console.log('✅ Pandas question created successfully!');
    console.log(`📝 Question ID: ${result.id}`);
    
    // Show created question
    console.log('📋 Created question:', JSON.stringify(result, null, 2));
    
    // Clean up
    await pb.collection('questions').delete(result.id);
    console.log('🧹 Test question cleaned up');
    
  } catch (error) {
    console.error('❌ Error creating pandas question:', error.message);
    if (error.data) {
      console.error('Error details:', JSON.stringify(error.data, null, 2));
    }
  }
}

async function checkExistingQuestions() {
  try {
    console.log('\n🔍 Checking existing questions...');
    
    const questions = await pb.collection('questions').getFullList(3);
    console.log(`📊 Found ${questions.length} questions`);
    
    questions.forEach((q, index) => {
      console.log(`${index + 1}. ID: ${q.id}`);
      console.log(`   Question: ${q.question || q.questions || 'MISSING'}`);
      console.log(`   Category: ${q.category || 'MISSING'}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error checking questions:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing Pandas Questions...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkExistingQuestions();
  await testPandasQuestion();
  
  console.log('\n🎉 Test completed!');
}

main().catch(console.error);
