// check-current-schema.js
// Check current schema of questions collection

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

async function checkCurrentSchema() {
  try {
    console.log('🔍 Checking current questions schema...');
    
    const collections = await pb.collections.getFullList();
    const questionsCollection = collections.find(c => c.name === 'questions');
    
    if (!questionsCollection) {
      console.log('❌ Questions collection not found');
      return;
    }
    
    console.log(`📋 Questions collection ID: ${questionsCollection.id}`);
    console.log(`📋 Collection name: ${questionsCollection.name}`);
    console.log(`📋 Collection type: ${questionsCollection.type}`);
    
    console.log('\n🔧 Schema fields:');
    questionsCollection.schema.forEach((field, index) => {
      console.log(`${index + 1}. ${field.name} (${field.type})`);
      if (field.values) {
        console.log(`   Values: [${field.values.join(', ')}]`);
      }
      if (field.required !== undefined) {
        console.log(`   Required: ${field.required}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  }
}

async function main() {
  console.log('🚀 Checking Current Schema...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkCurrentSchema();
  
  console.log('\n🎉 Schema check completed!');
}

main().catch(console.error);
