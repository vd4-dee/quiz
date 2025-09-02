// fix-api-rules.js
// Fix PocketBase API rules to allow authenticated users to read data

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function loginAdmin() {
  try {
    await pb.admins.authWithPassword('admin@test.com', 'admin123');
    console.log('✅ Admin login successful');
  } catch (error) {
    console.log('❌ Admin login failed:', error.message);
    console.log('Please check your admin credentials');
    return false;
  }
  return true;
}

async function updateCollectionRules() {
  try {
    console.log('🔧 Updating collection API rules...');
    
    // Update quizzes collection
    const quizzesCollection = await pb.collections.getOne('quizzes');
    quizzesCollection.listRule = '@request.auth.id != ""';
    quizzesCollection.viewRule = '@request.auth.id != ""';
    await pb.collections.update(quizzesCollection.id, quizzesCollection);
    console.log('✅ Quizzes collection rules updated');
    
    // Update submissions collection
    const submissionsCollection = await pb.collections.getOne('submissions');
    submissionsCollection.listRule = '@request.auth.id != ""';
    submissionsCollection.viewRule = '@request.auth.id != ""';
    await pb.collections.update(submissionsCollection.id, submissionsCollection);
    console.log('✅ Submissions collection rules updated');
    
    // Update questions collection
    const questionsCollection = await pb.collections.getOne('questions');
    questionsCollection.listRule = '@request.auth.id != ""';
    questionsCollection.viewRule = '@request.auth.id != ""';
    await pb.collections.update(questionsCollection.id, questionsCollection);
    console.log('✅ Questions collection rules updated');
    
    console.log('\n🎉 All API rules updated successfully!');
    console.log('Regular users can now access quizzes and submissions.');
    
  } catch (error) {
    console.error('❌ Error updating collection rules:', error.message);
    if (error.data) {
      console.error('Details:', error.data);
    }
  }
}

async function main() {
  console.log('🚀 Fixing PocketBase API Rules...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await updateCollectionRules();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Restart your frontend application');
  console.log('2. Try logging in as a regular user');
  console.log('3. Quizzes should now display properly');
}

main().catch(console.error);
