// create-complete-sample-data.js
// Create comprehensive sample data for testing the quiz webapp
// Run with: node create-complete-sample-data.js

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

// --- AUTH ---
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

// --- CREATE USERS ---
async function createUsers() {
  console.log('\n👥 Creating test users...');
  
  const users = [
    {
      email: 'student@test.com',
      password: 'student123',
      passwordConfirm: 'student123',
      name: 'Test Student',
      role: 'student'
    },
    {
      email: 'teacher@test.com', 
      password: 'teacher123',
      passwordConfirm: 'teacher123',
      name: 'Test Teacher',
      role: 'teacher'
    },
    {
      email: 'admin@test.com',
      password: 'admin123', 
      passwordConfirm: 'admin123',
      name: 'Test Admin',
      role: 'admin'
    }
  ];

  const createdUsers = [];
  
  for (const userData of users) {
    try {
      const user = await pb.collection('users').create(userData);
      console.log(`✅ Created user: ${user.email} (${user.role})`);
      createdUsers.push(user);
    } catch (error) {
      if (error.data?.email?.code === 'validation_invalid_email') {
        console.log(`ℹ️ User ${userData.email} already exists, skipping`);
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }
  }
  
  return createdUsers;
}

// --- CREATE QUESTIONS ---
async function createQuestions() {
  console.log('\n📝 Creating sample questions...');
  
  const questions = [
    // Excel Questions
    {
      question: 'What does the SUM function do in Excel?',
      answers: ['Adds numbers', 'Subtracts numbers', 'Multiplies numbers', 'Divides numbers'],
      correct_answers: [0],
      category: 'excel',
      sub_category: 'Basic Formulas',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: 'SUM adds all the numbers in a range of cells.',
      status: 'active'
    },
    {
      question: 'Which formula calculates the average of a range?',
      answers: ['=SUM()', '=COUNT()', '=AVERAGE()', '=MAX()'],
      correct_answers: [2],
      category: 'excel',
      sub_category: 'Basic Formulas', 
      level: 'easy',
      question_type: 'Single Choice',
      explanation: 'AVERAGE returns the mean of the selected numbers.',
      status: 'active'
    },
    {
      question: 'What is the purpose of VLOOKUP in Excel?',
      answers: ['Lookup values vertically', 'Lookup values horizontally', 'Sum values', 'Sort data'],
      correct_answers: [0],
      category: 'excel',
      sub_category: 'VLOOKUP',
      level: 'normal',
      question_type: 'Single Choice',
      explanation: 'VLOOKUP searches for a value in the first column and returns a value in the same row.',
      status: 'active'
    },
    {
      question: 'Which formula is used for conditional logic?',
      answers: ['=IF()', '=SUMIF()', '=COUNTIF()', '=VLOOKUP()'],
      correct_answers: [0],
      category: 'excel',
      sub_category: 'IF Statements',
      level: 'normal',
      question_type: 'Single Choice',
      explanation: 'IF allows you to make logical comparisons between a value and what you expect.',
      status: 'active'
    },
    // Python Questions
    {
      question: 'What is the correct way to create a variable in Python?',
      answers: ['var x = 5', 'x = 5', 'let x = 5', 'const x = 5'],
      correct_answers: [1],
      category: 'python',
      sub_category: 'Variables',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: 'In Python, you simply assign a value to create a variable.',
      status: 'active'
    },
    {
      question: 'Which of the following is a Python data type?',
      answers: ['list', 'array', 'vector', 'matrix'],
      correct_answers: [0],
      category: 'python',
      sub_category: 'Data Types',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: 'List is a built-in data type in Python.',
      status: 'active'
    },
    {
      question: 'How do you create a function in Python?',
      answers: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'create myFunc():'],
      correct_answers: [1],
      category: 'python',
      sub_category: 'Functions',
      level: 'normal',
      question_type: 'Single Choice',
      explanation: 'Functions in Python are defined using the def keyword.',
      status: 'active'
    },
    // Pandas Questions
    {
      question: 'What is the primary data structure in pandas?',
      answers: ['Series', 'DataFrame', 'Array', 'List'],
      correct_answers: [1],
      category: 'pandas',
      sub_category: 'DataFrame',
      level: 'easy',
      question_type: 'Single Choice',
      explanation: 'DataFrame is the primary data structure in pandas.',
      status: 'active'
    },
    {
      question: 'How do you read a CSV file in pandas?',
      answers: ['pd.read_csv()', 'pd.load_csv()', 'pd.import_csv()', 'pd.open_csv()'],
      correct_answers: [0],
      category: 'pandas',
      sub_category: 'File I/O',
      level: 'normal',
      question_type: 'Single Choice',
      explanation: 'pd.read_csv() is used to read CSV files in pandas.',
      status: 'active'
    },
    {
      question: 'Which method is used to get basic statistics of a DataFrame?',
      answers: ['describe()', 'info()', 'summary()', 'stats()'],
      correct_answers: [0],
      category: 'pandas',
      sub_category: 'Data Analysis',
      level: 'normal',
      question_type: 'Single Choice',
      explanation: 'describe() provides basic statistics of the DataFrame.',
      status: 'active'
    }
  ];

  const createdQuestions = [];
  
  for (const questionData of questions) {
    try {
      const question = await pb.collection('questions').create(questionData);
      console.log(`✅ Created question: ${question.question.substring(0, 50)}...`);
      createdQuestions.push(question);
    } catch (error) {
      console.error('❌ Error creating question:', error.message);
    }
  }
  
  return createdQuestions;
}

// --- CREATE QUIZZES ---
async function createQuizzes(questions) {
  console.log('\n🎯 Creating sample quizzes...');
  
  // Get some question IDs for the quizzes
  const questionIds = questions.slice(0, 5).map(q => q.id);
  
  const quizzes = [
    {
      title: 'Excel Basics Quiz',
      description: 'Test your knowledge of basic Excel functions and formulas.',
      duration_minutes: 30,
      questions_list: questionIds.slice(0, 3),
      repeat_type: 'Once',
      status: 'published',
      visibility: 'public',
      is_active: true
    },
    {
      title: 'Python Fundamentals',
      description: 'Basic Python programming concepts and syntax.',
      duration_minutes: 45,
      questions_list: questionIds.slice(3, 6),
      repeat_type: 'Once',
      status: 'published',
      visibility: 'public',
      is_active: true
    },
    {
      title: 'Pandas Data Analysis',
      description: 'Introduction to pandas library for data manipulation.',
      duration_minutes: 60,
      questions_list: questionIds.slice(6, 9),
      repeat_type: 'Once',
      status: 'published',
      visibility: 'public',
      is_active: true
    },
    {
      title: 'Mixed Skills Assessment',
      description: 'Combined test covering Excel, Python, and Pandas.',
      duration_minutes: 90,
      questions_list: questionIds,
      repeat_type: 'Once',
      status: 'draft',
      visibility: 'private',
      is_active: false
    }
  ];

  const createdQuizzes = [];
  
  for (const quizData of quizzes) {
    try {
      const quiz = await pb.collection('quizzes').create(quizData);
      console.log(`✅ Created quiz: ${quiz.title}`);
      createdQuizzes.push(quiz);
    } catch (error) {
      console.error('❌ Error creating quiz:', error.message);
    }
  }
  
  return createdQuizzes;
}

// --- CREATE SUBMISSIONS ---
async function createSubmissions(users, quizzes) {
  console.log('\n📊 Creating sample submissions...');
  
  const submissions = [];
  
  // Create submissions for the first student
  const student = users.find(u => u.role === 'student');
  if (student) {
    for (let i = 0; i < 3; i++) {
      const quiz = quizzes[i];
      if (quiz) {
        const submission = {
          user: student.id,
          quiz: quiz.id,
          score: Math.floor(Math.random() * 100),
          total_questions: quiz.questions_list?.length || 3,
          started_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          completed_at: new Date().toISOString(),
          status: 'completed',
          attempt_number: 1,
          submission_type: 'normal',
          submission_data: {
            answers: [0, 1, 2],
            time_spent: Math.floor(Math.random() * 1800) + 300
          }
        };
        
        try {
          const result = await pb.collection('submissions').create(submission);
          console.log(`✅ Created submission for ${quiz.title} - Score: ${submission.score}%`);
          submissions.push(result);
        } catch (error) {
          console.error('❌ Error creating submission:', error.message);
        }
      }
    }
  }
  
  return submissions;
}

// --- SHOW SUMMARY ---
async function showSummary(users, questions, quizzes, submissions) {
  console.log('\n📊 Sample Data Summary:');
  console.log(`👥 Users created: ${users.length}`);
  console.log(`📝 Questions created: ${questions.length}`);
  console.log(`🎯 Quizzes created: ${quizzes.length}`);
  console.log(`📊 Submissions created: ${submissions.length}`);
  
  console.log('\n🔑 Test Credentials:');
  console.log('Student: student@test.com / student123');
  console.log('Teacher: teacher@test.com / teacher123');
  console.log('Admin: admin@test.com / admin123');
  
  console.log('\n📋 Available Quizzes:');
  quizzes.forEach(quiz => {
    console.log(`- ${quiz.title} (${quiz.status})`);
  });
  
  console.log('\n🎉 Sample data creation complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the frontend: cd ../frontend && npm run dev');
  console.log('2. Login with test credentials');
  console.log('3. Test quiz taking functionality');
  console.log('4. Check admin interface at http://localhost:8090/_/');
}

// --- MAIN FUNCTION ---
async function main() {
  console.log('🚀 Creating Complete Sample Data for Quiz Webapp...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  const users = await createUsers();
  const questions = await createQuestions();
  const quizzes = await createQuizzes(questions);
  const submissions = await createSubmissions(users, quizzes);
  
  await showSummary(users, questions, quizzes, submissions);
}

main().catch(console.error);
