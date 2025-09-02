// debug-question.js
// Debug a specific question to see actual field names

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

async function debugQuestion() {
  try {
    console.log('🔍 Debugging a specific question...');
    
    const questions = await pb.collection('questions').getFullList(1);
    if (questions.length === 0) {
      console.log('❌ No questions found');
      return;
    }
    
    const question = questions[0];
    console.log('📋 Question details:');
    console.log(JSON.stringify(question, null, 2));
    
    console.log('\n🔧 All field names:');
    Object.keys(question).forEach(key => {
      if (!key.startsWith('collection')) {
        console.log(`  - ${key}: ${typeof question[key]} = ${JSON.stringify(question[key])}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error debugging question:', error.message);
  }
}

async function main() {
  console.log('🚀 Debugging Question Field Names...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await debugQuestion();
  
  console.log('\n🎉 Debug completed!');
}

main().catch(console.error);
