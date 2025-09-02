// check-users-collection.js
// Check users collection schema and fix relation issues

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function loginAdmin() {
  try {
    await pb.admins.authWithPassword('admin@test.com', 'admin123');
    console.log('✅ Admin login successful');
    return true;
  } catch (error) {
    console.log('❌ Admin login failed:', error.message);
    return false;
  }
}

async function checkUsersCollection() {
  try {
    console.log('🔍 Checking users collection...\n');
    
    const collections = await pb.collections.getFullList();
    const usersCollection = collections.find(c => c.name === 'users');
    
    if (!usersCollection) {
      console.log('❌ Users collection not found');
      return;
    }
    
    console.log('📋 Users collection info:');
    console.log(`- Name: ${usersCollection.name}`);
    console.log(`- Type: ${usersCollection.type}`);
    console.log(`- System: ${usersCollection.system}`);
    console.log(`- ID: ${usersCollection.id}`);
    
    console.log('\n📋 Users collection fields:');
    usersCollection.fields.forEach(field => {
      console.log(`- ${field.name}: ${field.type} (required: ${field.required})`);
      if (field.values) {
        console.log(`  Values: ${field.values.join(', ')}`);
      }
    });
    
    // Check if users collection is the auth collection
    const authCollections = collections.filter(c => c.type === 'auth');
    console.log('\n🔐 Auth collections:');
    authCollections.forEach(auth => {
      console.log(`- ${auth.name} (${auth.id})`);
    });
    
    return usersCollection;
  } catch (error) {
    console.error('❌ Error checking users collection:', error.message);
  }
}

async function testUserAccess() {
  try {
    console.log('\n🧪 Testing user access...');
    
    // Try to get a specific user
    const users = await pb.collection('users').getFullList();
    const student = users.find(u => u.email === 'student@test.com');
    
    if (student) {
      console.log('✅ User found:', student.email);
      console.log('📋 User details:', {
        id: student.id,
        email: student.email,
        role: student.role,
        name: student.name
      });
      
      // Try to get the user by ID
      try {
        const userById = await pb.collection('users').getOne(student.id);
        console.log('✅ User accessible by ID:', userById.email);
      } catch (error) {
        console.error('❌ Cannot access user by ID:', error.message);
      }
    } else {
      console.log('❌ Student user not found');
    }
    
  } catch (error) {
    console.error('❌ Error testing user access:', error.message);
  }
}

async function fixSubmissionsRelation() {
  try {
    console.log('\n🔧 Fixing submissions relation...');
    
    const collections = await pb.collections.getFullList();
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    const usersCollection = collections.find(c => c.name === 'users');
    
    if (!submissionsCollection || !usersCollection) {
      console.log('❌ Missing collections');
      return;
    }
    
    // Check the user relation field in submissions
    const userField = submissionsCollection.fields.find(f => f.name === 'user');
    if (userField) {
      console.log('📋 Current user relation field:');
      console.log(`- Collection ID: ${userField.collectionId}`);
      console.log(`- Cascade Delete: ${userField.cascadeDelete}`);
      console.log(`- Max Select: ${userField.maxSelect}`);
      console.log(`- Min Select: ${userField.minSelect}`);
      
      // Update the relation to point to the correct users collection
      if (userField.collectionId !== usersCollection.id) {
        console.log('🔧 Updating user relation field...');
        
        // This would require updating the field, but PocketBase doesn't allow field updates
        // We need to recreate the collection or use the correct collection ID
        console.log('⚠️ Cannot update field directly. Need to use correct collection ID.');
        console.log(`📋 Use collection ID: ${usersCollection.id}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing submissions relation:', error.message);
  }
}

async function main() {
  console.log('🚀 Checking Users Collection and Relations...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkUsersCollection();
  await testUserAccess();
  await fixSubmissionsRelation();
  
  console.log('\n🎉 Users collection check complete!');
}

main().catch(console.error);
