// test-fetch-record.js
// Fetch and display a specific record to see if data was saved

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

async function fetchRecord() {
  try {
    console.log('🔍 Fetching record...');
    
    // Get the latest record
    const records = await pb.collection('questions').getList(1, 1, {
      sort: '-created'
    });
    
    if (records.items.length === 0) {
      console.log('❌ No records found');
      return;
    }
    
    const record = records.items[0];
    console.log('📋 Latest record:');
    console.log(JSON.stringify(record, null, 2));
    
    console.log('\n🔧 All fields:');
    Object.keys(record).forEach(key => {
      console.log(`  - ${key}: ${typeof record[key]} = ${JSON.stringify(record[key])}`);
    });
    
  } catch (error) {
    console.error('❌ Error fetching record:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing Record Fetch...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await fetchRecord();
  
  console.log('\n🎉 Test completed!');
}

main().catch(console.error);
