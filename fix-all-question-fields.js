// fix-all-question-fields.js
// Fix all question field names in sample-data.js

const fs = require('fs');
const path = require('path');

function fixQuestionFields() {
  try {
    console.log('🔧 Fixing all question field names...');
    
    const filePath = path.join(__dirname, 'sample-data.js');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Count occurrences
    const questionCount = (content.match(/question:/g) || []).length;
    console.log(`📊 Found ${questionCount} occurrences of 'question:'`);
    
    // Replace all occurrences of 'question:' with 'questions:'
    const fixedContent = content.replace(/question:/g, 'questions:');
    
    // Write back to file
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    
    console.log('✅ All question field names fixed successfully!');
    console.log(`📝 Replaced ${questionCount} occurrences of 'question:' with 'questions:'`);
    
  } catch (error) {
    console.error('❌ Error fixing question fields:', error.message);
  }
}

fixQuestionFields();
