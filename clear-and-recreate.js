// clear-and-recreate.js
// Clear all questions and recreate with correct field names

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

async function clearAllQuestions() {
  try {
    console.log('🧹 Clearing all questions...');
    
    const questions = await pb.collection('questions').getFullList();
    console.log(`📊 Found ${questions.length} questions to delete`);
    
    for (const question of questions) {
      await pb.collection('questions').delete(question.id);
    }
    
    console.log('✅ All questions cleared');
    
  } catch (error) {
    console.error('❌ Error clearing questions:', error.message);
  }
}

async function recreateSampleData() {
  try {
    console.log('📝 Recreating sample data...');
    
    // Import the fixed sample data
    const { questions } = require('./sample-data.js');
    
    let insertedCount = 0;
    
    for (const questionData of questions) {
      try {
        await pb.collection('questions').create(questionData);
        insertedCount++;
        console.log(`✅ Inserted: ${questionData.question}`);
      } catch (error) {
        console.log(`❌ Failed to insert: ${questionData.question} - ${error.message}`);
      }
    }
    
    console.log(`🎉 Sample data recreation complete! Inserted ${insertedCount} questions`);
    
  } catch (error) {
    console.error('❌ Error recreating sample data:', error.message);
  }
}

async function main() {
  console.log('🚀 Clearing and Recreating Data...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await clearAllQuestions();
  await recreateSampleData();
  
  console.log('\n🎉 Data recreation completed!');
}

main().catch(console.error);
