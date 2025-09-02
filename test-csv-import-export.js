// test-csv-import-export.js
// Test CSV import/export functionality with correct field names

const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');
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

async function exportQuestionsToCSV() {
  try {
    console.log('📤 Exporting questions to CSV...');
    
    // Get all questions
    const questions = await pb.collection('questions').getFullList();
    console.log(`📊 Found ${questions.length} questions to export`);
    
    if (questions.length === 0) {
      console.log('❌ No questions to export');
      return;
    }
    
    // Create CSV header
    const headers = ['id', 'question', 'answers', 'correct_answers', 'category', 'sub_category', 'level', 'question_type', 'explanation'];
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    questions.forEach(q => {
      const row = [
        q.id,
        `"${(q.question || q.questions || '').replace(/"/g, '""')}"`,
        `"${JSON.stringify(q.answers || []).replace(/"/g, '""')}"`,
        `"${JSON.stringify(q.correct_answers || []).replace(/"/g, '""')}"`,
        q.category || '',
        `"${(q.sub_category || '').replace(/"/g, '""')}"`,
        q.level || '',
        q.question_type || '',
        `"${(q.explanation || '').replace(/"/g, '""')}"`
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Write to file
    const filename = 'questions_export.csv';
    fs.writeFileSync(filename, csvContent);
    console.log(`✅ Exported to ${filename}`);
    
    // Show first few lines
    console.log('\n📄 First 3 lines of exported CSV:');
    const lines = csvContent.split('\n').slice(0, 4);
    lines.forEach(line => console.log(line));
    
    return filename;
    
  } catch (error) {
    console.error('❌ Error exporting CSV:', error.message);
  }
}

async function testCSVImport() {
  try {
    console.log('\n📥 Testing CSV import...');
    
    // Create a test CSV with correct field names
    const testCSV = `id,question,answers,correct_answers,category,sub_category,level,question_type,explanation
test1,"What is 2+2?","[""3"",""4"",""5"",""6""]","[1]",excel,"Basic Math",easy,"Single Choice","2+2 equals 4"
test2,"What is Python?","[""Programming language"",""Snake"",""Game"",""Tool""]","[0]",python,"Basics",easy,"Single Choice","Python is a programming language"`;
    
    const filename = 'test_import.csv';
    fs.writeFileSync(filename, testCSV);
    console.log(`✅ Created test CSV: ${filename}`);
    
    console.log('\n📄 Test CSV content:');
    console.log(testCSV);
    
    return filename;
    
  } catch (error) {
    console.error('❌ Error creating test CSV:', error.message);
  }
}

async function checkFieldNames() {
  try {
    console.log('\n🔍 Checking field names in current data...');
    
    const questions = await pb.collection('questions').getFullList(1);
    if (questions.length > 0) {
      const question = questions[0];
      console.log('📊 Sample question fields:');
      Object.keys(question).forEach(key => {
        if (!key.startsWith('collection') && key !== 'id' && key !== 'created' && key !== 'updated') {
          console.log(`  - ${key}: ${typeof question[key]} (${key === 'question' ? '✅' : key === 'questions' ? '❌' : '⚠️'})`);
        }
      });
      
      // Check which field has the question content
      if (question.question) {
        console.log('✅ Field "question" contains content');
      } else if (question.questions) {
        console.log('❌ Field "questions" contains content (should be "question")');
      } else {
        console.log('❌ No question content found');
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking field names:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing CSV Import/Export with Field Names...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await checkFieldNames();
  await exportQuestionsToCSV();
  await testCSVImport();
  
  console.log('\n🎉 CSV Import/Export Test Completed!');
  console.log('\n📋 Results:');
  console.log('1. Check if exported CSV uses "question" field name');
  console.log('2. Verify admin interface can import the CSV');
  console.log('3. Test creating new questions via admin interface');
}

main().catch(console.error);
