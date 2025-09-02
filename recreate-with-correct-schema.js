// recreate-with-correct-schema.js
// Recreate questions collection with correct schema and test

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

async function recreateQuestionsCollection() {
  try {
    console.log('🔧 Recreating questions collection with correct schema...');
    
    // Get current collection
    const collections = await pb.collections.getFullList();
    const questionsCollection = collections.find(c => c.name === 'questions');
    
    if (questionsCollection) {
      console.log('🗑️ Deleting existing questions collection...');
      await pb.collections.delete(questionsCollection.id);
      console.log('✅ Existing collection deleted');
    }
    
    // Create new collection with correct schema
    const newCollection = {
      name: 'questions',
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
          "id": "text2329695445",
          "max": 0,
          "min": 1,
          "name": "question",
          "pattern": "",
          "presentable": true,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "id": "json1355859462",
          "maxSize": 0,
          "name": "answers",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "json"
        },
        {
          "id": "json3148230340",
          "maxSize": 0,
          "name": "correct_answers",
          "presentable": true,
          "required": true,
          "system": false,
          "type": "json"
        },
        {
          "id": "select105650625",
          "maxSelect": 1,
          "name": "category",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "excel",
            "python",
            "pandas"
          ]
        },
        {
          "id": "text3169056664",
          "max": 0,
          "min": 0,
          "name": "sub_category",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "id": "select2599078931",
          "maxSelect": 1,
          "name": "level",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "easy",
            "normal",
            "hard",
            "very hard"
          ]
        },
        {
          "id": "select3526408902",
          "maxSelect": 1,
          "name": "question_type",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "Single Choice",
            "Multiple Choice"
          ]
        },
        {
          "id": "text2284106510",
          "max": 0,
          "min": 0,
          "name": "explanation",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ]
    };
    
    const result = await pb.collections.create(newCollection);
    console.log('✅ New questions collection created successfully!');
    console.log(`📋 Collection ID: ${result.id}`);
    
  } catch (error) {
    console.error('❌ Error recreating collection:', error.message);
  }
}

async function testQuestionCreation() {
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
    
    const result = await pb.collection('questions').create(testQuestion);
    console.log('✅ Question created successfully!');
    console.log(`📝 Question ID: ${result.id}`);
    
    // Get the created question to verify
    const createdQuestion = await pb.collection('questions').getOne(result.id);
    console.log('🔍 Created question details:');
    console.log(JSON.stringify(createdQuestion, null, 2));
    
    // Clean up
    await pb.collection('questions').delete(result.id);
    console.log('🧹 Test question cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing question creation:', error.message);
    if (error.data) {
      console.error('Error details:', JSON.stringify(error.data, null, 2));
    }
  }
}

async function main() {
  console.log('🚀 Recreating with Correct Schema...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await recreateQuestionsCollection();
  await testQuestionCreation();
  
  console.log('\n🎉 Recreation completed!');
}

main().catch(console.error);
