// debug-questions.js
// Debug the questions collection to see the actual data structure

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

async function debugQuestions() {
  try {
    console.log('🔍 Debugging questions collection...\n');
    
    // Get all questions
    const questions = await pb.collections.getFullList('questions');
    console.log(`📊 Total questions: ${questions.length}\n`);
    
    if (questions.length > 0) {
      console.log('🔍 First question structure:');
      console.log(JSON.stringify(questions[0], null, 2));
      
      console.log('\n🔍 All questions summary:');
      questions.forEach((q, index) => {
        console.log(`Question ${index + 1}:`);
        console.log(`  - ID: ${q.id}`);
        console.log(`  - Question field: ${q.question || 'MISSING'}`);
        console.log(`  - Question text: ${q.question_text || 'MISSING'}`);
        console.log(`  - Question content: ${q.content || 'MISSING'}`);
        console.log(`  - Answers: ${q.answers ? q.answers.length : 'MISSING'}`);
        console.log(`  - Category: ${q.category || 'MISSING'}`);
        console.log(`  - Level: ${q.level || 'MISSING'}`);
        console.log(`  - Type: ${q.question_type || 'MISSING'}`);
        console.log('  ---');
      });
    }
    
    // Check quiz structure
    console.log('\n🔍 Checking quiz structure...');
    const quizzes = await pb.collections.getFullList('quizzes');
    if (quizzes.length > 0) {
      const firstQuiz = quizzes[0];
      console.log(`Quiz: ${firstQuiz.title}`);
      console.log(`Questions list: ${firstQuiz.questions_list ? firstQuiz.questions_list.length : 'MISSING'}`);
      console.log(`Questions list data:`, firstQuiz.questions_list);
    }
    
  } catch (error) {
    console.error('❌ Error debugging questions:', error.message);
    if (error.data) {
      console.error('Details:', error.data);
    }
  }
}

async function main() {
  console.log('🚀 Debugging Questions Collection...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await debugQuestions();
}

main().catch(console.error);
