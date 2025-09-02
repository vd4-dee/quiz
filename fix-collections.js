// fix-collections.js
// Fix PocketBase collections by recreating them with correct schema

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

async function deleteExistingCollections() {
  try {
    console.log('🗑️ Deleting existing collections...');
    
    // Delete existing collections if they exist
    const collections = await pb.collections.getFullList();
    
    for (const collection of collections) {
      if (['questions', 'quizzes', 'submissions'].includes(collection.name)) {
        console.log(`🗑️ Deleting collection: ${collection.name}`);
        await pb.collections.delete(collection.id);
      }
    }
    
    console.log('✅ Existing collections deleted');
  } catch (error) {
    console.log('ℹ️ Some collections may not exist, continuing...');
  }
}

async function createQuestionsCollection() {
  try {
    console.log('🔧 Creating questions collection...');
    
    const questionsCollection = {
      name: 'questions',
      type: 'base',
      system: false,
      schema: [
        {
          name: 'question',
          type: 'text',
          required: true,
          min: 10,
          max: 1000
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
          type: 'select',
          required: true,
          options: ['Excel', 'Python', 'Pandas']
        },
        {
          name: 'sub_category',
          type: 'text',
          required: false
        },
        {
          name: 'level',
          type: 'select',
          required: true,
          options: ['Easy', 'Normal', 'Hard', 'Very Hard']
        },
        {
          name: 'question_type',
          type: 'select',
          required: true,
          options: ['Yes/No', 'Single Choice', 'Multiple Choice']
        },
        {
          name: 'explanation',
          type: 'editor',
          required: false
        }
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '',
      updateRule: '',
      deleteRule: ''
    };
    
    await pb.collections.create(questionsCollection);
    console.log('✅ Questions collection created');
  } catch (error) {
    console.error('❌ Error creating questions collection:', error.message);
    throw error;
  }
}

async function createQuizzesCollection() {
  try {
    console.log('🔧 Creating quizzes collection...');
    
    const quizzesCollection = {
      name: 'quizzes',
      type: 'base',
      system: false,
      schema: [
        {
          name: 'title',
          type: 'text',
          required: true,
          min: 5,
          max: 100
        },
        {
          name: 'description',
          type: 'editor',
          required: false
        },
        {
          name: 'duration_minutes',
          type: 'number',
          required: true,
          min: 5,
          max: 180
        },
        {
          name: 'questions_list',
          type: 'relation',
          required: false,
          options: {
            collectionId: 'questions',
            multiple: true
          }
        },
        {
          name: 'dynamic_config',
          type: 'json',
          required: false
        },
        {
          name: 'start_date',
          type: 'date',
          required: false
        },
        {
          name: 'end_date',
          type: 'date',
          required: false
        },
        {
          name: 'repeat_type',
          type: 'select',
          required: false,
          options: ['Once', 'Daily', 'Weekly', 'Monthly']
        },
        {
          name: 'is_active',
          type: 'bool',
          required: false,
          default: true
        }
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '',
      updateRule: '',
      deleteRule: ''
    };
    
    await pb.collections.create(quizzesCollection);
    console.log('✅ Quizzes collection created');
  } catch (error) {
    console.error('❌ Error creating quizzes collection:', error.message);
    throw error;
  }
}

async function createSubmissionsCollection() {
  try {
    console.log('🔧 Creating submissions collection...');
    
    const submissionsCollection = {
      name: 'submissions',
      type: 'base',
      system: false,
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: '_pb_users_auth_',
            multiple: false
          }
        },
        {
          name: 'quiz',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'quizzes',
            multiple: false
          }
        },
        {
          name: 'score',
          type: 'number',
          required: false,
          min: 0,
          max: 100
        },
        {
          name: 'total_questions',
          type: 'number',
          required: false,
          min: 1
        },
        {
          name: 'started_at',
          type: 'date',
          required: true
        },
        {
          name: 'completed_at',
          type: 'date',
          required: false
        },
        {
          name: 'submission_data',
          type: 'json',
          required: true
        }
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '',
      deleteRule: ''
    };
    
    await pb.collections.create(submissionsCollection);
    console.log('✅ Submissions collection created');
  } catch (error) {
    console.error('❌ Error creating submissions collection:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Fixing PocketBase Collections...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  try {
    // Delete existing collections
    await deleteExistingCollections();
    
    // Create new collections with correct schema
    await createQuestionsCollection();
    await createQuizzesCollection();
    await createSubmissionsCollection();
    
    console.log('\n🎉 All collections created successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Run sample-data.js to populate questions');
    console.log('2. Run sample-quizzes.js to populate quizzes');
    console.log('3. Test the quiz interface again');
    
  } catch (error) {
    console.error('❌ Error fixing collections:', error.message);
  }
}

main().catch(console.error);
