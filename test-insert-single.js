// test-insert-single.js
// Test inserting a single question with detailed error handling

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

async function testInsertSingle() {
  try {
    console.log('🧪 Testing single question insertion...');
    
    const testQuestion = {
      questions: 'What does the SUM function do in Excel?',
      answers: ['Adds numbers', 'Subtracts numbers', 'Multiplies numbers', 'Divides numbers'],
      correct_answers: [0],
      category: 'excel',
      sub_category: 'Basic Formulas',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: 'SUM adds all the numbers in a range of cells.'
    };
    
    console.log('📋 Test question data:');
    console.log(JSON.stringify(testQuestion, null, 2));
    
    const result = await pb.collection('questions').create(testQuestion);
    
    console.log('✅ Insert successful!');
    console.log('📋 Inserted record:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Insert failed:');
    console.error('Error message:', error.message);
    console.error('Error data:', error.data);
    console.error('Error status:', error.status);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

async function main() {
  console.log('🚀 Testing Single Question Insertion...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await testInsertSingle();
  
  console.log('\n🎉 Test completed!');
}

main().catch(console.error);
