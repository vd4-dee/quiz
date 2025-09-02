// fix-complete-schema.js
// Complete fix for schema with correct field names and category options

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
          "name": "questions",
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
            "Yes/No",
            "Single Choice"
          ]
        },
        {
          "id": "editor2284106510",
          "maxSize": 0,
          "name": "explanation",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "editor"
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

async function testAllCategories() {
  try {
    console.log('\n🧪 Testing all categories...');
    
    const testQuestions = [
      {
        question: 'What does SUM function do in Excel?',
        answers: ['Adds numbers', 'Subtracts numbers', 'Multiplies numbers', 'Divides numbers'],
        correct_answers: [0],
        category: 'excel',
        sub_category: 'Basic Formulas',
        level: 'easy',
        question_type: 'Single Choice',
        explanation: 'SUM adds all numbers in a range.'
      },
      {
        question: 'What is Python?',
        answers: ['Programming language', 'Snake', 'Game', 'Tool'],
        correct_answers: [0],
        category: 'python',
        sub_category: 'Basics',
        level: 'easy',
        question_type: 'Single Choice',
        explanation: 'Python is a programming language.'
      },
      {
        question: 'What is pandas in Python?',
        answers: ['A library for data analysis', 'A type of animal', 'A programming language', 'A database'],
        correct_answers: [0],
        category: 'pandas',
        sub_category: 'Basics',
        level: 'easy',
        question_type: 'Single Choice',
        explanation: 'Pandas is a Python library for data manipulation and analysis.'
      }
    ];
    
    for (const testQ of testQuestions) {
      try {
        const result = await pb.collection('questions').create(testQ);
        console.log(`✅ ${testQ.category}: SUCCESS (ID: ${result.id})`);
        
        // Clean up
        await pb.collection('questions').delete(result.id);
        
      } catch (error) {
        console.log(`❌ ${testQ.category}: FAILED - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing categories:', error.message);
  }
}

async function main() {
  console.log('🚀 Complete Schema Fix...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await recreateQuestionsCollection();
  await testAllCategories();
  
  console.log('\n🎉 Complete schema fix finished!');
  console.log('\n📋 Next steps:');
  console.log('1. Run your test.js script again');
  console.log('2. Test admin interface import/export');
  console.log('3. Verify all 3 categories work: excel, python, pandas');
}

main().catch(console.error);
