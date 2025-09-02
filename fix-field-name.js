// fix-field-name.js
// Fix field name from 'questions' to 'question' in all records

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

async function fixFieldName() {
  try {
    console.log('🔧 Fixing field name from "questions" to "question"...');
    
    // Get all questions
    const questions = await pb.collection('questions').getFullList();
    console.log(`📊 Found ${questions.length} questions to fix`);
    
    let fixedCount = 0;
    
    for (const question of questions) {
      try {
        // Check if questions field exists and has value
        if (question.questions && !question.question) {
          // Update the record with correct field name
          await pb.collection('questions').update(question.id, {
            question: question.questions,
            // Keep other fields unchanged
            answers: question.answers,
            correct_answers: question.correct_answers,
            category: question.category,
            sub_category: question.sub_category,
            level: question.level,
            question_type: question.question_type,
            explanation: question.explanation
          });
          
          fixedCount++;
          console.log(`✅ Fixed question ID: ${question.id}`);
        }
      } catch (error) {
        console.log(`❌ Error fixing question ${question.id}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} questions successfully!`);
    
  } catch (error) {
    console.error('❌ Error in fixFieldName:', error.message);
  }
}

async function main() {
  console.log('🚀 Fixing Field Names in Questions Collection...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await fixFieldName();
}

main().catch(console.error);
