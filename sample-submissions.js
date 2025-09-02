// sample-submissions.js
// Insert sample submissions into PocketBase

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function loginAdmin() {
  await pb.admins.authWithPassword('admin@test.com', 'admin123');
}

// Replace with actual user and quiz IDs from your database
const studentId = 'student_user_id'; // e.g., 'stu123abc'
const quizId = 'quiz_id_1'; // e.g., 'quiz1'

const submissions = [
  {
    user: studentId,
    quiz: quizId,
    score: 2,
    total: 3,
    answers: [
      { question: 'question_id_1', answer: 0 },
      { question: 'question_id_2', answer: 2 },
      { question: 'question_id_3', answer: 1 }
    ]
  }
];

async function insertSubmissions() {
  for (const sub of submissions) {
    try {
      await pb.collection('submissions').create(sub);
      console.log('Inserted submission for user:', sub.user);
    } catch (e) {
      console.error('Error inserting submission:', e.data || e.message);
    }
  }
}

(async () => {
  await loginAdmin();
  await insertSubmissions();
  console.log('Sample submissions insertion complete.');
})();