// check-schema.js
// Check current schema to understand category field structure

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
    console.log(`📊 Total collections: ${collections.length}`);
    
    const questionsCollection = collections.find(c => c.name === 'questions');
    if (!questionsCollection) {
      console.log('❌ Questions collection not found');
      return;
    }
    
    console.log('\n📋 Questions Collection Schema:');
    console.log(`ID: ${questionsCollection.id}`);
    console.log(`Name: ${questionsCollection.name}`);
    console.log(`Type: ${questionsCollection.type}`);
    
    console.log('\n🔧 Schema Fields:');
    questionsCollection.schema.forEach((field, index) => {
      console.log(`${index + 1}. ${field.name} (${field.type})`);
      if (field.values) {
        console.log(`   Values: [${field.values.join(', ')}]`);
      }
      if (field.required !== undefined) {
        console.log(`   Required: ${field.required}`);
      }
    });
    
    // Check category field specifically
    const categoryField = questionsCollection.schema.find(f => f.name === 'category');
    if (categoryField) {
      console.log('\n🎯 Category Field Details:');
      console.log(`Type: ${categoryField.type}`);
      console.log(`Values: [${categoryField.values?.join(', ') || 'none'}]`);
      console.log(`Required: ${categoryField.required}`);
      console.log(`MaxSelect: ${categoryField.maxSelect}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  }
}

async function testCategoryValues() {
  try {
    console.log('\n🧪 Testing category values...');
    
    const testCategories = ['excel', 'python', 'pandas'];
    
    for (const category of testCategories) {
      try {
        const testQuestion = {
          question: `Test question for ${category}`,
          answers: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correct_answers: [0],
          category: category,
          sub_category: 'Test',
          level: 'easy',
          question_type: 'Single Choice'
        };
        
        const result = await pb.collection('questions').create(testQuestion);
        console.log(`✅ ${category}: SUCCESS (ID: ${result.id})`);
        
        // Clean up
        await pb.collection('questions').delete(result.id);
        
      } catch (error) {
        console.log(`❌ ${category}: FAILED - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing categories:', error.message);
  }
}

async function main() {
  console.log('🚀 Checking Schema and Category Validation...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkSchema();
  await testCategoryValues();
  
  console.log('\n🎉 Schema check completed!');
}

main().catch(console.error);
