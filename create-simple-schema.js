// create-simple-schema.js
// Create simple schema without validation errors

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

async function createSimpleSchema() {
  try {
    console.log('🔧 Creating simple schema...');
    
    // Delete existing collections if they exist
    const collections = await pb.collections.getFullList();
    
    // Delete questions collection
    const questionsCollection = collections.find(c => c.name === 'questions');
    if (questionsCollection) {
      console.log('🗑️ Deleting existing questions collection...');
      await pb.collections.delete(questionsCollection.id);
      console.log('✅ Questions collection deleted');
    }
    
    // Delete quizzes collection
    const quizzesCollection = collections.find(c => c.name === 'quizzes');
    if (quizzesCollection) {
      console.log('🗑️ Deleting existing quizzes collection...');
      await pb.collections.delete(quizzesCollection.id);
      console.log('✅ Quizzes collection deleted');
    }
    
    console.log('\n📋 Creating collections...');
    
    // 1. Create questions collection with minimal schema
    const questionsSchema = {
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
          "id": "text3169056664",
          "max": 0,
          "min": 0,
          "name": "category",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "id": "text3169056665",
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
          "id": "text3169056666",
          "max": 0,
          "min": 0,
          "name": "level",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "id": "text3169056667",
          "max": 0,
          "min": 0,
          "name": "question_type",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
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
    
    const questionsResult = await pb.collections.create(questionsSchema);
    console.log('✅ Questions collection created successfully!');
    console.log(`📋 Questions ID: ${questionsResult.id}`);
    
    // 2. Create quizzes collection
    const quizzesSchema = {
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
          "id": "text2329695445",
          "max": 100,
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
          "id": "editor2284106510",
          "maxSize": 0,
          "name": "description",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "editor"
        },
        {
          "id": "number105650625",
          "max": 180,
          "min": 1,
          "name": "duration_minutes",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "id": "json3148230340",
          "maxSize": 0,
          "name": "questions_list",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "id": "json3148230341",
          "maxSize": 0,
          "name": "dynamic_config",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "id": "date105650625",
          "name": "start_date",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "id": "date2599078931",
          "name": "end_date",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "id": "text3526408902",
          "max": 0,
          "min": 0,
          "name": "repeat_type",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "id": "bool1547992806",
          "name": "is_active",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
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
    
    const quizzesResult = await pb.collections.create(quizzesSchema);
    console.log('✅ Quizzes collection created successfully!');
    console.log(`📋 Quizzes ID: ${quizzesResult.id}`);
    
    console.log('\n🎉 Simple schema created successfully!');
    console.log('\n📋 Collection IDs:');
    console.log(`   Questions: ${questionsResult.id}`);
    console.log(`   Quizzes: ${quizzesResult.id}`);
    
  } catch (error) {
    console.error('❌ Error creating schema:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

async function testSchema() {
  try {
    console.log('\n🧪 Testing schema with sample data...');
    
    // Test questions insertion
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
    
    const questionResult = await pb.collection('questions').create(testQuestion);
    console.log('✅ Test question created successfully!');
    console.log(`📋 Question ID: ${questionResult.id}`);
    
    // Test quiz creation
    const testQuiz = {
      title: 'Excel Basics Quiz',
      description: 'Test your knowledge of basic Excel functions',
      duration_minutes: 30,
      questions_list: [questionResult.id],
      is_active: true,
      repeat_type: 'Once'
    };
    
    const quizResult = await pb.collection('quizzes').create(testQuiz);
    console.log('✅ Test quiz created successfully!');
    console.log(`📋 Quiz ID: ${quizResult.id}`);
    
    // Clean up test data
    await pb.collection('quizzes').delete(quizResult.id);
    await pb.collection('questions').delete(questionResult.id);
    console.log('🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing schema:', error.message);
  }
}

async function main() {
  console.log('🚀 Creating Simple Schema...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await createSimpleSchema();
  await testSchema();
  
  console.log('\n🎉 Schema creation completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Run sample-data.js to insert questions');
  console.log('2. Run sample-quizzes.js to create quizzes');
  console.log('3. Test frontend-backend integration');
}

main().catch(console.error);
