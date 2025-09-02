// fix-schema-and-test.js
// Fix schema and test creating questions with full data

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

async function checkSchema() {
  try {
    console.log('🔍 Checking current schema...');
    
    const collections = await pb.collections.getFullList();
    const questionsCollection = collections.find(c => c.name === 'questions');
    
    if (!questionsCollection) {
      console.log('❌ Questions collection not found');
      return;
    }
    
    console.log(`📋 Questions collection ID: ${questionsCollection.id}`);
    console.log(`📋 Collection name: ${questionsCollection.name}`);
    console.log(`📋 Collection type: ${questionsCollection.type}`);
    
    console.log('\n🔧 Schema fields:');
    if (questionsCollection.schema) {
      questionsCollection.schema.forEach((field, index) => {
        console.log(`${index + 1}. ${field.name} (${field.type})`);
        if (field.values) {
          console.log(`   Values: [${field.values.join(', ')}]`);
        }
        if (field.required !== undefined) {
          console.log(`   Required: ${field.required}`);
        }
      });
    } else {
      console.log('❌ Schema is undefined');
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  }
}

async function testCreateQuestion() {
  try {
    console.log('\n🧪 Testing question creation...');
    
    const testQuestion = {
      question: 'What is 2 + 2?',
      answers: ['3', '4', '5', '6'],
      correct_answers: [1],
      category: 'excel',
      sub_category: 'Basic Math',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: '2 + 2 = 4'
    };
    
    console.log('📝 Test data:', JSON.stringify(testQuestion, null, 2));
    
    const result = await pb.collection('questions').create(testQuestion);
    console.log('✅ Question created successfully!');
    console.log('📋 Result:', JSON.stringify(result, null, 2));
    
    // Get the created question to verify
    const createdQuestion = await pb.collection('questions').getOne(result.id);
    console.log('🔍 Created question details:');
    console.log(JSON.stringify(createdQuestion, null, 2));
    
    // Clean up
    await pb.collection('questions').delete(result.id);
    console.log('🧹 Test question cleaned up');
    
  } catch (error) {
    console.error('❌ Error creating question:', error.message);
    if (error.data) {
      console.error('Error details:', JSON.stringify(error.data, null, 2));
    }
  }
}

async function clearAndRecreateQuestions() {
  try {
    console.log('\n🧹 Clearing all questions...');
    
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
    console.log('\n📝 Recreating sample data...');
    
    // Import the sample data
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
  console.log('🚀 Fixing Schema and Testing...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkSchema();
  await testCreateQuestion();
  await clearAndRecreateQuestions();
  await recreateSampleData();
  
  console.log('\n🎉 Schema fix and test completed!');
}

main().catch(console.error);
