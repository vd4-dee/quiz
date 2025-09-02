// fix-quizzes-reference.js
// Fix quizzes collection references before recreating questions

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

async function checkQuizzesReferences() {
  try {
    console.log('🔍 Checking quizzes collection references...');
    
    const collections = await pb.collections.getFullList();
    const quizzesCollection = collections.find(c => c.name === 'quizzes');
    
    if (!quizzesCollection) {
      console.log('❌ Quizzes collection not found');
      return;
    }
    
    console.log(`📋 Quizzes collection ID: ${quizzesCollection.id}`);
    console.log('\n🔧 Quizzes schema fields:');
    quizzesCollection.schema.forEach((field, index) => {
      console.log(`${index + 1}. ${field.name} (${field.type})`);
      if (field.type === 'relation') {
        console.log(`   → References: ${field.options?.collectionId || 'unknown'}`);
      }
    });
    
    // Check if there are any quizzes with questions references
    const quizzes = await pb.collection('quizzes').getFullList();
    console.log(`\n📊 Found ${quizzes.length} quizzes`);
    
    quizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ID: ${quiz.id}`);
      console.log(`   Title: ${quiz.title || 'MISSING'}`);
      console.log(`   Questions: ${quiz.questions_list ? quiz.questions_list.length : 0}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking references:', error.message);
  }
}

async function clearQuizzesReferences() {
  try {
    console.log('\n🧹 Clearing quizzes references...');
    
    const quizzes = await pb.collection('quizzes').getFullList();
    console.log(`📊 Found ${quizzes.length} quizzes to update`);
    
    for (const quiz of quizzes) {
      try {
        // Clear questions_list reference
        await pb.collection('quizzes').update(quiz.id, {
          questions_list: []
        });
        console.log(`✅ Cleared references for quiz: ${quiz.id}`);
      } catch (error) {
        console.log(`❌ Error clearing quiz ${quiz.id}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error clearing references:', error.message);
  }
}

async function deleteQuizzesCollection() {
  try {
    console.log('\n🗑️ Deleting quizzes collection...');
    
    const collections = await pb.collections.getFullList();
    const quizzesCollection = collections.find(c => c.name === 'quizzes');
    
    if (quizzesCollection) {
      await pb.collections.delete(quizzesCollection.id);
      console.log('✅ Quizzes collection deleted');
    } else {
      console.log('ℹ️ Quizzes collection not found');
    }
    
  } catch (error) {
    console.error('❌ Error deleting quizzes collection:', error.message);
  }
}

async function recreateQuizzesCollection() {
  try {
    console.log('\n🔧 Recreating quizzes collection...');
    
    const newQuizzesCollection = {
      name: 'quizzes',
      type: 'base',
      system: false,
      schema: [
        {
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "id": "text2329695446",
          "max": 0,
          "min": 1,
          "name": "title",
          "pattern": "",
          "presentable": true,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "id": "text3169056665",
          "max": 0,
          "min": 0,
          "name": "description",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "id": "number105650626",
          "max": 0,
          "min": 0,
          "name": "duration_minutes",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "id": "json1355859463",
          "maxSize": 0,
          "name": "questions_list",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "id": "bool1547992807",
          "name": "is_active",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "id": "autodate2990389177",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "id": "autodate3332085496",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ]
    };
    
    const result = await pb.collections.create(newQuizzesCollection);
    console.log('✅ New quizzes collection created successfully!');
    console.log(`📋 Collection ID: ${result.id}`);
    
  } catch (error) {
    console.error('❌ Error recreating quizzes collection:', error.message);
  }
}

async function main() {
  console.log('🚀 Fixing Quizzes References...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkQuizzesReferences();
  await clearQuizzesReferences();
  await deleteQuizzesCollection();
  await recreateQuizzesCollection();
  
  console.log('\n🎉 Quizzes references fix completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Run fix-complete-schema.js again');
  console.log('2. Test questions creation with all categories');
}

main().catch(console.error);
