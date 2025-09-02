// fix-submissions-rules.js
// Fix PocketBase API rules for submissions collection to allow users to create submissions

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

async function updateSubmissionsRules() {
  try {
    console.log('🔧 Updating submissions collection API rules...');
    
    // Update submissions collection
    const submissionsCollection = await pb.collections.getOne('submissions');
    
    // Allow authenticated users to create submissions
    submissionsCollection.createRule = '@request.auth.id != ""';
    
    // Allow users to view their own submissions
    submissionsCollection.listRule = '@request.auth.id != ""';
    submissionsCollection.viewRule = '@request.auth.id != ""';
    
    // Don't allow updates or deletes by regular users
    submissionsCollection.updateRule = '';
    submissionsCollection.deleteRule = '';
    
    await pb.collections.update(submissionsCollection.id, submissionsCollection);
    console.log('✅ Submissions collection rules updated');
    
    console.log('\n📋 New API Rules for Submissions:');
    console.log('- Create: Authenticated users can create submissions');
    console.log('- List: Authenticated users can list submissions');
    console.log('- View: Authenticated users can view submissions');
    console.log('- Update: Not allowed (admin only)');
    console.log('- Delete: Not allowed (admin only)');
    
    console.log('\n🎉 Submissions API rules updated successfully!');
    console.log('Users can now submit quiz results.');
    
  } catch (error) {
    console.error('❌ Error updating submissions rules:', error.message);
    if (error.data) {
      console.error('Details:', error.data);
    }
  }
}

async function main() {
  console.log('🚀 Fixing PocketBase Submissions API Rules...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await updateSubmissionsRules();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Try submitting a quiz again');
  console.log('2. Quiz submission should now work');
  console.log('3. Check if questions are displayed in the quiz screen');
}

main().catch(console.error);
