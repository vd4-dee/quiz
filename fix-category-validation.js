// fix-category-validation.js
// Fix category validation to include 'pandas' option

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

async function getQuestionsCollection() {
  try {
    const collections = await pb.collections.getFullList();
    const questionsCollection = collections.find(c => c.name === 'questions');
    return questionsCollection;
  } catch (error) {
    console.error('❌ Error getting questions collection:', error.message);
    return null;
  }
}

async function fixCategoryValidation() {
  try {
    console.log('🔧 Fixing category validation to include pandas...');
    
    // Get current collection
    const collection = await getQuestionsCollection();
    if (!collection) {
      console.log('❌ Questions collection not found');
      return;
    }
    
    console.log('📊 Current schema fields:');
    collection.schema.forEach(field => {
      if (field.name === 'category') {
        console.log(`  - ${field.name}: ${field.type} (${field.values?.join(', ') || 'no values'})`);
      } else {
        console.log(`  - ${field.name}: ${field.type}`);
      }
    });
    
    // Find category field
    const categoryField = collection.schema.find(f => f.name === 'category');
    if (!categoryField) {
      console.log('❌ Category field not found');
      return;
    }
    
    // Check current values
    const currentValues = categoryField.values || [];
    console.log(`📋 Current category values: [${currentValues.join(', ')}]`);
    
    // Add pandas if not present
    if (!currentValues.includes('pandas')) {
      console.log('🔄 Adding "pandas" to category options...');
      
      const updatedValues = [...currentValues, 'pandas'];
      
      // Update schema
      const updatedSchema = collection.schema.map(field => {
        if (field.name === 'category') {
          return {
            ...field,
            values: updatedValues
          };
        }
        return field;
      });
      
      // Update collection
      await pb.collections.update(collection.id, {
        schema: updatedSchema
      });
      
      console.log('✅ Category validation updated with pandas option');
      console.log(`📋 New category values: [${updatedValues.join(', ')}]`);
    } else {
      console.log('✅ Pandas option already exists in category');
    }
    
  } catch (error) {
    console.error('❌ Error fixing category validation:', error.message);
  }
}

async function testPandasQuestions() {
  try {
    console.log('\n🧪 Testing pandas questions creation...');
    
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
    console.log('✅ Test pandas question created successfully!');
    console.log(`📝 Question ID: ${result.id}`);
    
    // Clean up - delete test question
    await pb.collection('questions').delete(result.id);
    console.log('🧹 Test question cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing pandas question:', error.message);
  }
}

async function main() {
  console.log('🚀 Fixing Category Validation for Pandas...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await fixCategoryValidation();
  await testPandasQuestions();
  
  console.log('\n🎉 Category validation fix completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Test adding pandas questions via admin interface');
  console.log('2. Test CSV import with pandas category');
  console.log('3. Verify all 3 categories work: excel, python, pandas');
}

main().catch(console.error);
