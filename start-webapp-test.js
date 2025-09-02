// start-webapp-test.js
// Start the frontend and provide testing instructions

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Quiz Webapp Test Environment...\n');

console.log('📊 Current Backend Status:');
console.log('✅ PocketBase running on http://localhost:8090');
console.log('✅ Sample data loaded:');
console.log('   - 4 users (student@test.com, teacher@test.com, etc.)');
console.log('   - 11 questions (Excel, Python, Pandas)');
console.log('   - 4 quizzes (3 published, 1 draft)');
console.log('   - 0 submissions (ready for testing)');

console.log('\n🌐 Access URLs:');
console.log('📋 Admin Panel: http://localhost:8090/_/');
console.log('   - Login: admin@test.com / admin123');
console.log('   - View collections, data, and manage users');

console.log('\n🎯 Frontend: http://localhost:5173/');
console.log('   - Student login: student@test.com / student123');
console.log('   - Teacher login: teacher@test.com / teacher123');

console.log('\n📋 Test Credentials:');
console.log('👨‍🎓 Student: student@test.com / student123');
console.log('👨‍🏫 Teacher: teacher@test.com / teacher123');
console.log('👨‍💼 Admin: admin@test.com / admin123');

console.log('\n🎯 Available Quizzes for Testing:');
console.log('1. Excel Basics Quiz (published) - 30 minutes');
console.log('2. Python Fundamentals (published) - 45 minutes');
console.log('3. Pandas Data Analysis (published) - 60 minutes');
console.log('4. Mixed Skills Assessment (draft) - 90 minutes');

console.log('\n🧪 Testing Scenarios:');
console.log('1. Student Login & Quiz Taking:');
console.log('   - Login as student@test.com');
console.log('   - Browse available quizzes');
console.log('   - Start and complete a quiz');
console.log('   - View results and scores');

console.log('\n2. Teacher Login & Management:');
console.log('   - Login as teacher@test.com');
console.log('   - View student submissions');
console.log('   - Check quiz statistics');

console.log('\n3. Admin Panel Testing:');
console.log('   - Access http://localhost:8090/_/');
console.log('   - Login as admin@test.com');
console.log('   - View all collections and data');
console.log('   - Manage users and permissions');

console.log('\n🚀 Starting Frontend...');
console.log('(Press Ctrl+C to stop)');

// Start the frontend
const frontendPath = path.join(__dirname, '..', 'frontend');
const frontendProcess = spawn('npm', ['run', 'dev'], {
  cwd: frontendPath,
  stdio: 'inherit',
  shell: true
});

frontendProcess.on('error', (error) => {
  console.error('❌ Error starting frontend:', error.message);
  console.log('\n💡 Manual start instructions:');
  console.log('1. Open terminal in frontend directory: cd ../frontend');
  console.log('2. Install dependencies: npm install');
  console.log('3. Start development server: npm run dev');
});

frontendProcess.on('close', (code) => {
  console.log(`\n🛑 Frontend process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping frontend...');
  frontendProcess.kill('SIGINT');
  process.exit(0);
});
