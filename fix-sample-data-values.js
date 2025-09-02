// fix-sample-data-values.js
// Fix all category and level values in sample data to match new schema

const fs = require('fs');
const path = require('path');

function fixSampleDataValues() {
  try {
    console.log('🔧 Fixing sample data values to match new schema...');
    
    const filePath = path.join(__dirname, 'sample-data.js');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix category values (lowercase to proper case)
    let fixedContent = content.replace(/category: 'excel'/g, "category: 'Excel'");
    fixedContent = fixedContent.replace(/category: 'python'/g, "category: 'Python'");
    fixedContent = fixedContent.replace(/category: 'pandas'/g, "category: 'Pandas'");
    
    // Fix level values (lowercase to proper case)
    fixedContent = fixedContent.replace(/level: 'easy'/g, "level: 'Easy'");
    fixedContent = fixedContent.replace(/level: 'normal'/g, "level: 'Normal'");
    fixedContent = fixedContent.replace(/level: 'hard'/g, "level: 'Hard'");
    fixedContent = fixedContent.replace(/level: 'very hard'/g, "level: 'Very Hard'");
    
    // Write back to file
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    
    console.log('✅ Sample data values fixed successfully!');
    console.log('📝 Updated:');
    console.log('   - Categories: excel → Excel, python → Python, pandas → Pandas');
    console.log('   - Levels: easy → Easy, normal → Normal, hard → Hard, very hard → Very Hard');
    
  } catch (error) {
    console.error('❌ Error fixing sample data values:', error.message);
  }
}

fixSampleDataValues();
