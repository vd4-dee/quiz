// final-fix-field-names.js
// Final fix for field names to ensure proper import/export

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

async function checkCurrentState() {
  try {
    console.log('🔍 Checking current state...');
    
    const questions = await pb.collection('questions').getFullList(1);
    if (questions.length > 0) {
      const q = questions[0];
      console.log('📊 Sample question fields:');
      Object.keys(q).forEach(key => {
        if (!key.startsWith('collection') && key !== 'id' && key !== 'created' && key !== 'updated') {
          const hasContent = q[key] && (typeof q[key] === 'string' ? q[key].length > 0 : true);
          console.log(`  - ${key}: ${typeof q[key]} ${hasContent ? '✅' : '❌'}`);
        }
      });
      
      // Check question content
      if (q.question) {
        console.log('✅ Field "question" has content');
        return 'question';
      } else if (q.questions) {
        console.log('❌ Field "questions" has content (needs fix)');
        return 'questions';
      } else {
        console.log('❌ No question content found');
        return 'none';
      }
    }
  } catch (error) {
    console.error('❌ Error checking state:', error.message);
    return 'error';
  }
}

async function fixAllRecords() {
  try {
    console.log('🔄 Fixing all records to use "question" field...');
    
    const questions = await pb.collection('questions').getFullList();
    console.log(`📊 Found ${questions.length} questions to fix`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    for (const q of questions) {
      try {
        // If record has 'questions' field but not 'question'
        if (q.questions && !q.question) {
          await pb.collection('questions').update(q.id, {
            question: q.questions
          });
          fixedCount++;
          console.log(`✅ Fixed question ID: ${q.id}`);
        } else if (q.question) {
          skippedCount++;
        }
      } catch (error) {
        console.log(`❌ Error updating question ${q.id}:`, error.message);
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} records, skipped ${skippedCount} records`);
    
  } catch (error) {
    console.error('❌ Error fixing records:', error.message);
  }
}

async function createTestCSV() {
  try {
    console.log('📤 Creating test CSV with correct field names...');
    
    const questions = await pb.collection('questions').getFullList(5); // Get first 5
    
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
    const filename = 'test_questions_export.csv';
    require('fs').writeFileSync(filename, csvContent);
    console.log(`✅ Created test CSV: ${filename}`);
    
    // Show header
    console.log('\n📄 CSV Header:');
    console.log(headers.join(','));
    
    return filename;
    
  } catch (error) {
    console.error('❌ Error creating test CSV:', error.message);
  }
}

async function main() {
  console.log('🚀 Final Fix for Field Names...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  // Check current state
  const currentField = await checkCurrentState();
  
  // Fix records if needed
  if (currentField === 'questions') {
    await fixAllRecords();
  } else if (currentField === 'question') {
    console.log('✅ Records already use correct field name');
  }
  
  // Create test CSV
  await createTestCSV();
  
  console.log('\n🎉 Field name fix completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Test admin interface import/export');
  console.log('2. Verify CSV uses "question" field name');
  console.log('3. Test creating new questions via admin');
  console.log('\n🔗 Admin URLs:');
  console.log('- http://localhost:8090/_/admin/questions');
  console.log('- http://localhost:8090/_/admin/users');
  console.log('- http://localhost:8090/_/admin/quizzes');
}

main().catch(console.error);
