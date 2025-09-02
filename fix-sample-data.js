// fix-sample-data.js
// Fix the field name from 'question' to 'questions' in all sample data

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

async function fixSampleData() {
  try {
    console.log('🔧 Fixing sample data field names...');
    
    // Get all questions
    const questions = await pb.collection('questions').getFullList();
    console.log(`📋 Found ${questions.length} questions to fix`);
    
    let fixedCount = 0;
    
    for (const question of questions) {
      try {
        // Check if the question has the wrong field name
        if (question.question && !question.questions) {
          // Update the record with correct field name
          await pb.collection('questions').update(question.id, {
            questions: question.question,
            // Remove the old field by setting it to undefined
            question: undefined
          });
          fixedCount++;
          console.log(`✅ Fixed question: ${question.question?.substring(0, 50)}...`);
        }
      } catch (error) {
        console.log(`❌ Error fixing question ${question.id}:`, error.message);
      }
    }
    
    console.log(`🎉 Fixed ${fixedCount} questions successfully!`);
    
  } catch (error) {
    console.error('❌ Error fixing sample data:', error.message);
  }
}

async function main() {
  console.log('🚀 Fixing Sample Data Field Names...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await fixSampleData();
  
  console.log('\n🎉 Sample data fix completed!');
}

main().catch(console.error);
