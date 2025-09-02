// test-admin-insert.js
// Test insertion with admin privileges

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

async function testAdminInsert() {
  try {
    console.log('🧪 Testing admin insertion...');
    
    const testQuestion = {
      questions: 'What does the SUM function do in Excel?',
      answers: ['Adds numbers', 'Subtracts numbers', 'Multiplies numbers', 'Divides numbers'],
      correct_answers: [0],
      category: 'Excel',
      sub_category: 'Basic Formulas',
      level: 'Easy',
      question_type: 'Single Choice',
      explanation: 'SUM adds all the numbers in a range of cells.'
    };
    
    console.log('📋 Test question data:');
    console.log(JSON.stringify(testQuestion, null, 2));
    
    // Try to create with admin privileges
    const result = await pb.collection('questions').create(testQuestion);
    
    console.log('✅ Insert successful!');
    console.log('📋 Inserted record:');
    console.log(JSON.stringify(result, null, 2));
    
    // Try to fetch the record
    const fetched = await pb.collection('questions').getOne(result.id);
    console.log('\n📋 Fetched record:');
    console.log(JSON.stringify(fetched, null, 2));
    
    // Clean up
    await pb.collection('questions').delete(result.id);
    console.log('🧹 Test record cleaned up');
    
  } catch (error) {
    console.error('❌ Insert failed:');
    console.error('Error message:', error.message);
    console.error('Error data:', error.data);
    console.error('Error status:', error.status);
  }
}

async function main() {
  console.log('🚀 Testing Admin Insertion...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await testAdminInsert();
  
  console.log('\n🎉 Test completed!');
}

main().catch(console.error);
