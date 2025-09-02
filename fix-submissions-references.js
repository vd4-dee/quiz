// fix-submissions-references.js
// Fix submissions collection references before deleting quizzes

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

async function checkSubmissionsReferences() {
  try {
    console.log('🔍 Checking submissions collection references...');
    
    const collections = await pb.collections.getFullList();
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    
    if (!submissionsCollection) {
      console.log('❌ Submissions collection not found');
      return;
    }
    
    console.log(`📋 Submissions collection ID: ${submissionsCollection.id}`);
    console.log('\n🔧 Submissions schema fields:');
    submissionsCollection.schema.forEach((field, index) => {
      console.log(`${index + 1}. ${field.name} (${field.type})`);
      if (field.type === 'relation') {
        console.log(`   → References: ${field.options?.collectionId || 'unknown'}`);
      }
    });
    
    // Check if there are any submissions with quiz references
    const submissions = await pb.collection('submissions').getFullList();
    console.log(`\n📊 Found ${submissions.length} submissions`);
    
    submissions.forEach((submission, index) => {
      console.log(`${index + 1}. ID: ${submission.id}`);
      console.log(`   Quiz: ${submission.quiz || 'MISSING'}`);
      console.log(`   User: ${submission.user || 'MISSING'}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking submissions references:', error.message);
  }
}

async function clearSubmissionsReferences() {
  try {
    console.log('\n🧹 Clearing submissions references...');
    
    const submissions = await pb.collection('submissions').getFullList();
    console.log(`📊 Found ${submissions.length} submissions to update`);
    
    for (const submission of submissions) {
      try {
        // Clear quiz reference
        await pb.collection('submissions').update(submission.id, {
          quiz: null
        });
        console.log(`✅ Cleared quiz reference for submission: ${submission.id}`);
      } catch (error) {
        console.log(`❌ Error clearing submission ${submission.id}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error clearing submissions references:', error.message);
  }
}

async function deleteSubmissionsCollection() {
  try {
    console.log('\n🗑️ Deleting submissions collection...');
    
    const collections = await pb.collections.getFullList();
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    
    if (submissionsCollection) {
      await pb.collections.delete(submissionsCollection.id);
      console.log('✅ Submissions collection deleted');
    } else {
      console.log('ℹ️ Submissions collection not found');
    }
    
  } catch (error) {
    console.error('❌ Error deleting submissions collection:', error.message);
  }
}

async function main() {
  console.log('🚀 Fixing Submissions References...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkSubmissionsReferences();
  await clearSubmissionsReferences();
  await deleteSubmissionsCollection();
  
  console.log('\n🎉 Submissions references fix completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Run fix-quizzes-reference.js again');
  console.log('2. Run fix-complete-schema.js');
  console.log('3. Test questions creation with all categories');
}

main().catch(console.error);
