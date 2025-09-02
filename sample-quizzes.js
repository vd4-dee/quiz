// sample-quizzes.js
// Insert sample quizzes into PocketBase

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function loginAdmin() {
  await pb.admins.authWithPassword('admin@test.com', 'admin123');
}

// Replace with actual user and question IDs from your database
const teacherId = 'teacher_user_id'; // e.g., 'abc123xyz'
const questionIds = [
  'vpmbk9jpixa6j5j', // e.g., 'q1'
  '9tx5mk320xppll2',
  'f0eo95lztjogtxl'
];

const quizzes = [
  {
    title: 'Excel Basics Quiz',
    description: 'A quiz on basic Excel functions.',
    owner: teacherId,
    questions: questionIds,
    duration_minutes: 30, // required field
    is_active: true,      // required field
    repeat_type: 'none'   // required field, adjust if your schema expects other values
  },
  {
    title: 'Python Fundamentals',
    description: 'Test your Python basics.',
    owner: teacherId,
    questions: questionIds,
    duration_minutes: 30,
    is_active: true,
    repeat_type: 'none'
  }
];

async function insertQuizzes() {
  for (const quiz of quizzes) {
    try {
      await pb.collection('quizzes').create(quiz);
      console.log('Inserted quiz:', quiz.title);
    } catch (e) {
      console.error('Error inserting quiz:', quiz.title, e.data || e.message);
    }
  }
}

(async () => {
  await loginAdmin();
  await insertQuizzes();
  console.log('Sample quizzes insertion complete.');
})();