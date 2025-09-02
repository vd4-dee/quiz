// update-schema-pandas.js
// Update schema to add pandas to category options

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

async function updateSchemaWithPandas() {
  try {
    console.log('🔧 Updating schema to include pandas...');
    
    // Get questions collection
    const collections = await pb.collections.getFullList();
    const questionsCollection = collections.find(c => c.name === 'questions');
    
    if (!questionsCollection) {
      console.log('❌ Questions collection not found');
      return;
    }
    
    console.log(`📋 Found questions collection: ${questionsCollection.id}`);
    
    // Create updated schema with pandas
    const updatedSchema = [
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
    ];
    
    // Update collection
    await pb.collections.update(questionsCollection.id, {
      schema: updatedSchema
    });
    
    console.log('✅ Schema updated successfully with pandas option');
    console.log('📋 Category values: [excel, python, pandas]');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
  }
}

async function testPandasCreation() {
  try {
    console.log('\n🧪 Testing pandas question creation...');
    
    const testQuestion = {
      question: 'What is pandas in Python?',
      answers: ['A library for data analysis', 'A type of animal', 'A programming language', 'A database'],
      correct_answers: [0],
      category: 'pandas',
      sub_category: 'Basics',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: 'Pandas is a Python library for data manipulation and analysis.'
    };
    
    const result = await pb.collection('questions').create(testQuestion);
    console.log('✅ Pandas question created successfully!');
    console.log(`📝 Question ID: ${result.id}`);
    
    // Clean up
    await pb.collection('questions').delete(result.id);
    console.log('🧹 Test question cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing pandas creation:', error.message);
  }
}

async function main() {
  console.log('🚀 Updating Schema to Include Pandas...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await updateSchemaWithPandas();
  await testPandasCreation();
  
  console.log('\n🎉 Schema update completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Test adding pandas questions via admin interface');
  console.log('2. Test CSV import with pandas category');
  console.log('3. Run your test.js script again');
}

main().catch(console.error);
