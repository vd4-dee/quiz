// check-schema-details.js
// Check detailed schema of questions collection

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

async function checkSchemaDetails() {
  try {
    console.log('🔍 Checking detailed schema...');
    
    const collections = await pb.collections.getFullList();
    const questionsCollection = collections.find(c => c.name === 'questions');
    
    if (!questionsCollection) {
      console.log('❌ Questions collection not found');
      return;
    }
    
    console.log(`📋 Collection: ${questionsCollection.name}`);
    console.log(`📋 ID: ${questionsCollection.id}`);
    console.log(`📋 Type: ${questionsCollection.type}`);
    
    console.log('\n🔧 Schema fields:');
    if (questionsCollection.schema) {
      questionsCollection.schema.forEach((field, index) => {
        console.log(`${index + 1}. ${field.name} (${field.type})`);
        console.log(`   Required: ${field.required}`);
        console.log(`   System: ${field.system}`);
        if (field.values) {
          console.log(`   Values: [${field.values.join(', ')}]`);
        }
        console.log('');
      });
    } else {
      console.log('❌ No schema found');
    }
    
    console.log('\n📋 API Rules:');
    console.log(`List: ${questionsCollection.listRule}`);
    console.log(`View: ${questionsCollection.viewRule}`);
    console.log(`Create: ${questionsCollection.createRule}`);
    console.log(`Update: ${questionsCollection.updateRule}`);
    console.log(`Delete: ${questionsCollection.deleteRule}`);
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  }
}

async function main() {
  console.log('🚀 Checking Detailed Schema...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkSchemaDetails();
  
  console.log('\n🎉 Schema check completed!');
}

main().catch(console.error);
