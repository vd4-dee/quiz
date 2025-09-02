// fix-schema-field-name.js
// Fix schema field name from 'questions' to 'question' for proper import/export

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

async function fixSchemaFieldName() {
  try {
    console.log('🔧 Fixing schema field name from "questions" to "question"...');
    
    // Get current collection
    const collection = await getQuestionsCollection();
    if (!collection) {
      console.log('❌ Questions collection not found');
      return;
    }
    
    console.log('📊 Current schema fields:');
    collection.schema.forEach(field => {
      console.log(`  - ${field.name} (${field.type})`);
    });
    
    // Check if questions field exists
    const questionsField = collection.schema.find(f => f.name === 'questions');
    const questionField = collection.schema.find(f => f.name === 'question');
    
    if (questionsField && !questionField) {
      console.log('🔄 Found "questions" field, need to rename to "question"');
      
      // Update field name in schema
      const updatedSchema = collection.schema.map(field => {
        if (field.name === 'questions') {
          return {
            ...field,
            name: 'question'
          };
        }
        return field;
      });
      
      // Update collection schema
      await pb.collections.update(collection.id, {
        schema: updatedSchema
      });
      
      console.log('✅ Schema updated: "questions" → "question"');
    } else if (questionField) {
      console.log('✅ Field "question" already exists in schema');
    } else {
      console.log('❌ Neither "questions" nor "question" field found');
    }
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error.message);
  }
}

async function updateAllRecords() {
  try {
    console.log('🔄 Updating all records to use "question" field...');
    
    const questions = await pb.collection('questions').getFullList();
    console.log(`📊 Found ${questions.length} questions to update`);
    
    let updatedCount = 0;
    
    for (const question of questions) {
      try {
        // If record has 'questions' field but not 'question'
        if (question.questions && !question.question) {
          await pb.collection('questions').update(question.id, {
            question: question.questions
          });
          updatedCount++;
        }
      } catch (error) {
        console.log(`❌ Error updating question ${question.id}:`, error.message);
      }
    }
    
    console.log(`✅ Updated ${updatedCount} records`);
    
  } catch (error) {
    console.error('❌ Error updating records:', error.message);
  }
}

async function main() {
  console.log('🚀 Fixing Schema Field Name for Import/Export...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await fixSchemaFieldName();
  await updateAllRecords();
  
  console.log('\n🎉 Schema field name fix completed!');
  console.log('📋 Next steps:');
  console.log('1. Test admin interface import/export');
  console.log('2. Verify CSV files use "question" field name');
}

main().catch(console.error);
