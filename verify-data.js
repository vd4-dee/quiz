// verify-data.js
// Simple script to verify data insertion

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

async function verifyData() {
  try {
    console.log('🔍 Verifying data insertion...');
    
    // Get questions
    const questions = await pb.collection('questions').getList(1, 5);
    console.log(`📋 Found ${questions.totalItems} questions`);
    
    if (questions.items.length > 0) {
      const firstQuestion = questions.items[0];
      console.log('\n📋 First question details:');
      console.log(JSON.stringify(firstQuestion, null, 2));
      
      console.log('\n🔧 All fields:');
      Object.keys(firstQuestion).forEach(key => {
        console.log(`  - ${key}: ${typeof firstQuestion[key]} = ${JSON.stringify(firstQuestion[key])}`);
      });
    }
    
    // Get quizzes
    const quizzes = await pb.collection('quizzes').getList(1, 5);
    console.log(`\n📋 Found ${quizzes.totalItems} quizzes`);
    
  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
  }
}

async function main() {
  console.log('🚀 Verifying Data Insertion...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await verifyData();
  
  console.log('\n🎉 Verification completed!');
}

main().catch(console.error);
