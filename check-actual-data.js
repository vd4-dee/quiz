// check-actual-data.js
// Check actual data in questions and quizzes collections

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

async function checkActualData() {
  try {
    console.log('🔍 Checking actual data in collections...\n');
    
    // Check questions collection
    console.log('📚 QUESTIONS COLLECTION:');
    try {
      const questions = await pb.collection('questions').getFullList();
      console.log(`Total questions: ${questions.length}`);
      
      if (questions.length > 0) {
        console.log('\nFirst question:');
        console.log(JSON.stringify(questions[0], null, 2));
        
        console.log('\nAll questions summary:');
        questions.forEach((q, index) => {
          console.log(`${index + 1}. ID: ${q.id}`);
          console.log(`   Question: ${q.question || q.questions || 'MISSING'}`);
          console.log(`   Answers: ${q.answers ? q.answers.length : 'MISSING'}`);
          console.log(`   Category: ${q.category || 'MISSING'}`);
          console.log('   ---');
        });
      }
    } catch (error) {
      console.log('❌ Error accessing questions collection:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Check quizzes collection
    console.log('🎯 QUIZZES COLLECTION:');
    try {
      const quizzes = await pb.collection('quizzes').getFullList();
      console.log(`Total quizzes: ${quizzes.length}`);
      
      if (quizzes.length > 0) {
        console.log('\nFirst quiz:');
        console.log(JSON.stringify(quizzes[0], null, 2));
        
        console.log('\nAll quizzes summary:');
        quizzes.forEach((q, index) => {
          console.log(`${index + 1}. ID: ${q.id}`);
          console.log(`   Title: ${q.title || 'MISSING'}`);
          console.log(`   Questions: ${q.questions_list ? q.questions_list.length : 'MISSING'}`);
          console.log('   ---');
        });
      }
    } catch (error) {
      console.log('❌ Error accessing quizzes collection:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error in checkActualData:', error.message);
  }
}

async function main() {
  console.log('🚀 Checking Actual Data in Collections...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkActualData();
}

main().catch(console.error);
