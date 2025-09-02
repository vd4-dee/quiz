// fix-collections-simple.js
// Fix PocketBase collections with simpler approach

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

async function checkCollections() {
  try {
    console.log('🔍 Checking current collections...\n');
    
    const collections = await pb.collections.getFullList();
    console.log(`📊 Total collections: ${collections.length}`);
    
    collections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name} (${col.type}) - System: ${col.system}`);
    });
    
    return collections;
  } catch (error) {
    console.error('❌ Error checking collections:', error.message);
    return [];
  }
}

async function createSimpleQuestionsCollection() {
  try {
    console.log('🔧 Creating simple questions collection...');
    
    const questionsCollection = {
      name: 'questions',
      type: 'base',
      system: false,
      schema: [
        {
          name: 'question',
          type: 'text',
          required: true
        },
        {
          name: 'answers',
          type: 'json',
          required: true
        },
        {
          name: 'correct_answers',
          type: 'json',
          required: true
        },
        {
          name: 'category',
          type: 'text',
          required: true
        },
        {
          name: 'level',
          type: 'text',
          required: true
        },
        {
          name: 'question_type',
          type: 'text',
          required: true
        }
      ]
    };
    
    const result = await pb.collections.create(questionsCollection);
    console.log('✅ Questions collection created:', result.id);
  } catch (error) {
    console.error('❌ Error creating questions collection:', error.message);
    if (error.data) {
      console.error('Error details:', error.data);
    }
    throw error;
  }
}

async function createSimpleQuizzesCollection() {
  try {
    console.log('🔧 Creating simple quizzes collection...');
    
    const quizzesCollection = {
      name: 'quizzes',
      type: 'base',
      system: false,
      schema: [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'description',
          type: 'text',
          required: false
        },
        {
          name: 'duration_minutes',
          type: 'number',
          required: true
        },
        {
          name: 'questions_list',
          type: 'json',
          required: false
        },
        {
          name: 'is_active',
          type: 'bool',
          required: false
        }
      ]
    };
    
    const result = await pb.collections.create(quizzesCollection);
    console.log('✅ Quizzes collection created:', result.id);
  } catch (error) {
    console.error('❌ Error creating quizzes collection:', error.message);
    if (error.data) {
      console.error('Error details:', error.data);
    }
    throw error;
  }
}

async function main() {
  console.log('🚀 Fixing PocketBase Collections (Simple Version)...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  try {
    // Check current collections
    const collections = await checkCollections();
    
    // Check if our collections already exist
    const hasQuestions = collections.some(c => c.name === 'questions');
    const hasQuizzes = collections.some(c => c.name === 'quizzes');
    
    if (hasQuestions) {
      console.log('ℹ️ Questions collection already exists');
    } else {
      await createSimpleQuestionsCollection();
    }
    
    if (hasQuizzes) {
      console.log('ℹ️ Quizzes collection already exists');
    } else {
      await createSimpleQuizzesCollection();
    }
    
    console.log('\n🎉 Collections check completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Check if collections were created');
    console.log('2. Run sample-data.js to populate questions');
    console.log('3. Run sample-quizzes.js to populate quizzes');
    
  } catch (error) {
    console.error('❌ Error in main process:', error.message);
  }
}

main().catch(console.error);
