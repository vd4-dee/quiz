// test-complete-flow.js
// Test complete data flow with admin privileges

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

async function testCompleteFlow() {
  try {
    console.log('🧪 Testing complete data flow...');
    
    // 1. Create a test question
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
    
    console.log('📝 Creating test question...');
    const questionResult = await pb.collection('questions').create(testQuestion);
    console.log('✅ Question created:', questionResult.id);
    
    // 2. Fetch the question back
    console.log('📖 Fetching question back...');
    const fetchedQuestion = await pb.collection('questions').getOne(questionResult.id);
    console.log('✅ Question fetched successfully!');
    console.log('📋 Question data:');
    console.log(JSON.stringify(fetchedQuestion, null, 2));
    
    // 3. Create a test quiz
    const testQuiz = {
      title: 'Excel Basics Quiz',
      description: 'Test your knowledge of basic Excel functions',
      duration_minutes: 30,
      questions_list: [questionResult.id],
      is_active: true,
      repeat_type: 'Once'
    };
    
    console.log('📝 Creating test quiz...');
    const quizResult = await pb.collection('quizzes').create(testQuiz);
    console.log('✅ Quiz created:', quizResult.id);
    
    // 4. Fetch the quiz back
    console.log('📖 Fetching quiz back...');
    const fetchedQuiz = await pb.collection('quizzes').getOne(quizResult.id);
    console.log('✅ Quiz fetched successfully!');
    console.log('📋 Quiz data:');
    console.log(JSON.stringify(fetchedQuiz, null, 2));
    
    // 5. List all questions
    console.log('📋 Listing all questions...');
    const allQuestions = await pb.collection('questions').getList(1, 5);
    console.log(`✅ Found ${allQuestions.totalItems} questions`);
    console.log('📋 First 5 questions:');
    allQuestions.items.forEach((q, index) => {
      console.log(`${index + 1}. ID: ${q.id}`);
      console.log(`   Question: ${q.questions || 'MISSING'}`);
      console.log(`   Category: ${q.category || 'MISSING'}`);
      console.log(`   Level: ${q.level || 'MISSING'}`);
      console.log('');
    });
    
    // 6. Clean up
    console.log('🧹 Cleaning up test data...');
    await pb.collection('quizzes').delete(quizResult.id);
    await pb.collection('questions').delete(questionResult.id);
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error in test flow:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

async function main() {
  console.log('🚀 Testing Complete Data Flow...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await testCompleteFlow();
  
  console.log('\n🎉 Complete flow test finished!');
}

main().catch(console.error);
