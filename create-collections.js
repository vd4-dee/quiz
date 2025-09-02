// create-collections-fixed.js
// Create all collections for PocketBase Quiz System - FIXED VERSION

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

async function deleteExistingCollections() {
  try {
    console.log('🧹 Deleting existing collections...');
    
    const collections = await pb.collections.getFullList();
    const collectionsToDelete = ['questions', 'quizzes', 'submissions'];
    
    for (const collectionName of collectionsToDelete) {
      const collection = collections.find(c => c.name === collectionName);
      if (collection) {
        console.log(`🗑️ Deleting ${collectionName} collection...`);
        await pb.collections.delete(collection.id);
        console.log(`✅ ${collectionName} collection deleted`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error deleting collections:', error.message);
  }
}

async function createQuestionsCollection() {
  try {
    console.log('📝 Creating questions collection...');
    
    const questionsCollection = {
      name: 'questions',
      type: 'base',
      system: false,
      // ✅ FIX: Wrap fields in 'fields' property
      fields: [
        {
          "name": "question",
          "type": "text",
          "required": true,
          "presentable": true,
          "min": 10,
          "max": 1000
        },
        {
          "name": "answers",
          "type": "json",
          "required": true,
          "presentable": false
        },
        {
          "name": "correct_answers",
          "type": "json", 
          "required": true,
          "presentable": false
        },
        {
          "name": "category",
          "type": "select",
          "required": true,
          "presentable": false,
          "values": ["excel", "python", "pandas"]
        },
        {
          "name": "sub_category",
          "type": "text",
          "required": true,
          "presentable": false,
          "min": 1,
          "max": 100
        },
        {
          "name": "level",
          "type": "select",
          "required": true,
          "presentable": false,
          "values": ["easy", "normal", "hard", "very hard"]
        },
        {
          "name": "question_type", 
          "type": "select",
          "required": true,
          "presentable": false,
          "values": ["Single Choice", "Multiple Choice"]
        },
        {
          "name": "explanation",
          "type": "text",
          "required": false,
          "presentable": false,
          "max": 500
        },
        {
          "name": "status",
          "type": "select",
          "required": true,
          "presentable": true,
          "values": ["draft", "active", "inactive", "archived", "pending_review", "approved", "rejected"],
          "maxSelect": 1
        },
        {
          "name": "created",
          "type": "autodate",
          "onCreate": true,
          "onUpdate": false
        },
        {
          "name": "updated", 
          "type": "autodate",
          "onCreate": true,
          "onUpdate": true
        }
      ]
    };
    
    const result = await pb.collections.create(questionsCollection);
    console.log('✅ Questions collection created successfully!');
    console.log(`📋 Collection ID: ${result.id}`);
    return result;
    
  } catch (error) {
    console.error('❌ Error creating questions collection:', error.message);
    console.error('Full error:', error);
  }
}

async function createQuizzesCollection() {
  try {
    console.log('📝 Creating quizzes collection...');
    
    // Get questions collection ID for relation
    const collections = await pb.collections.getFullList();
    const questionsCollection = collections.find(c => c.name === 'questions');
    
    const quizzesCollection = {
      name: 'quizzes',
      type: 'base', 
      system: false,
      fields: [
        {
          "name": "title",
          "type": "text",
          "required": true,
          "presentable": true,
          "min": 5,
          "max": 100
        },
        {
          "name": "description",
          "type": "editor", 
          "required": false,
          "presentable": false
        },
        {
          "name": "duration_minutes",
          "type": "number",
          "required": true, 
          "presentable": false,
          "min": 5,
          "max": 180
        },
        {
          "name": "questions_list",
          "type": "relation",
          "required": false,
          "presentable": false,
          "options": {
            "collectionId": questionsCollection?.id || "",
            "cascadeDelete": false,
            "maxSelect": null,
            "minSelect": null
          }
        },
        {
          "name": "dynamic_config", 
          "type": "json",
          "required": false,
          "presentable": false
        },
        {
          "name": "start_date",
          "type": "date",
          "required": false,
          "presentable": false
        },
        {
          "name": "end_date",
          "type": "date", 
          "required": false,
          "presentable": false
        },
        {
          "name": "repeat_type",
          "type": "select",
          "required": true,
          "presentable": false,
          "values": ["Once", "Daily", "Weekly", "Monthly"],
          "maxSelect": 1
        },
        {
          "name": "status",
          "type": "select", 
          "required": true,
          "presentable": false,
          "values": ["draft", "published", "scheduled", "active", "paused", "completed", "archived"],
          "maxSelect": 1
        },
        {
          "name": "visibility",
          "type": "select",
          "required": true,
          "presentable": false, 
          "values": ["public", "private", "group", "premium"],
          "maxSelect": 1
        },
        {
          "name": "is_active",
          "type": "bool",
          "required": false,
          "presentable": false
        },
        {
          "name": "created",
          "type": "autodate",
          "onCreate": true,
          "onUpdate": false
        },
        {
          "name": "updated",
          "type": "autodate", 
          "onCreate": true,
          "onUpdate": true
        }
      ]
    };
    
    const result = await pb.collections.create(quizzesCollection);
    console.log('✅ Quizzes collection created successfully!');
    console.log(`📋 Collection ID: ${result.id}`);
    return result;
    
  } catch (error) {
    console.error('❌ Error creating quizzes collection:', error.message);
    console.error('Full error:', error);
  }
}

async function createSubmissionsCollection() {
  try {
    console.log('📝 Creating submissions collection...');
    
    // Get collections for relations
    const collections = await pb.collections.getFullList();
    const quizzesCollection = collections.find(c => c.name === 'quizzes');
    const usersCollection = collections.find(c => c.name === 'users' || c.type === 'auth');
    
    const submissionsCollection = {
      name: 'submissions',
      type: 'base',
      system: false,
      fields: [
        {
          "name": "user",
          "type": "relation",
          "required": true,
          "presentable": true,
          "options": {
            "collectionId": usersCollection?.id || "_pb_users_auth_",
            "cascadeDelete": true,
            "maxSelect": 1,
            "minSelect": 1
          }
        },
        {
          "name": "quiz", 
          "type": "relation",
          "required": true,
          "presentable": true,
          "options": {
            "collectionId": quizzesCollection?.id || "",
            "cascadeDelete": false,
            "maxSelect": 1, 
            "minSelect": 1
          }
        },
        {
          "name": "score",
          "type": "number",
          "required": false,
          "presentable": true,
          "min": 0,
          "max": 100
        },
        {
          "name": "total_questions",
          "type": "number",
          "required": true,
          "presentable": false,
          "min": 1,
          "max": 1000
        },
        {
          "name": "started_at", 
          "type": "date",
          "required": true,
          "presentable": false
        },
        {
          "name": "completed_at",
          "type": "date", 
          "required": false,
          "presentable": false
        },
        {
          "name": "status",
          "type": "select",
          "required": true,
          "presentable": true,
          "values": ["started", "in_progress", "completed", "abandoned", "timeout", "submitted", "graded", "reviewed"],
          "maxSelect": 1
        },
        {
          "name": "attempt_number",
          "type": "number",
          "required": true,
          "presentable": false,
          "min": 1,
          "max": 10
        },
        {
          "name": "submission_type",
          "type": "select", 
          "required": true,
          "presentable": false,
          "values": ["normal", "practice", "timed", "exam", "review"],
          "maxSelect": 1
        },
        {
          "name": "submission_data",
          "type": "json",
          "required": true,
          "presentable": false
        },
        {
          "name": "created",
          "type": "autodate",
          "onCreate": true,
          "onUpdate": false
        }
      ]
    };
    
    const result = await pb.collections.create(submissionsCollection);
    console.log('✅ Submissions collection created successfully!');
    console.log(`📋 Collection ID: ${result.id}`);
    return result;
    
  } catch (error) {
    console.error('❌ Error creating submissions collection:', error.message);
    console.error('Full error:', error);
  }
}

async function setCollectionRules() {
  try {
    console.log('🔧 Setting collection rules...');
    
    const collections = await pb.collections.getFullList();
    
    // Questions collection rules - enhanced with status
    const questionsCollection = collections.find(c => c.name === 'questions');
    if (questionsCollection) {
      await pb.collections.update(questionsCollection.id, {
        listRule: '@request.auth.id != "" && (status = "active" || status = "approved" || @request.auth.role = "admin")',
        viewRule: '@request.auth.id != "" && (status = "active" || status = "approved" || @request.auth.role = "admin")', 
        createRule: '@request.auth.collectionName = "users" || @request.auth.role = "admin"',
        updateRule: '@request.auth.collectionName = "users" || @request.auth.role = "admin"',
        deleteRule: '@request.auth.role = "admin"'
      });
      console.log('✅ Questions collection rules set');
    }
    
    // Quizzes collection rules - enhanced with status/visibility
    const quizzesCollection = collections.find(c => c.name === 'quizzes');
    if (quizzesCollection) {
      await pb.collections.update(quizzesCollection.id, {
        listRule: '@request.auth.id != "" && (status = "active" || status = "published" || @request.auth.role = "admin")',
        viewRule: '@request.auth.id != "" && (status = "active" || status = "published" || @request.auth.role = "admin")',
        createRule: '@request.auth.role = "admin"',
        updateRule: '@request.auth.role = "admin"', 
        deleteRule: '@request.auth.role = "admin"'
      });
      console.log('✅ Quizzes collection rules set');
    }
    
    // Submissions collection rules - enhanced with status
    const submissionsCollection = collections.find(c => c.name === 'submissions');
    if (submissionsCollection) {
      await pb.collections.update(submissionsCollection.id, {
        listRule: '@request.auth.id = user.id || @request.auth.role = "admin"',
        viewRule: '@request.auth.id = user.id || @request.auth.role = "admin"',
        createRule: '@request.auth.id != "" && @request.data.status = "started"',
        updateRule: '@request.auth.id = user.id && @request.data.status ?= ["in_progress", "completed", "submitted", "abandoned", "timeout"]',
        deleteRule: '@request.auth.role = "admin"'
      });
      console.log('✅ Submissions collection rules set');
    }
    
  } catch (error) {
    console.error('❌ Error setting collection rules:', error.message);
  }
}

async function testCollections() {
  try {
    console.log('🧪 Testing collections...');
    
    // Test questions collection 
    const testQuestion = {
      question: 'What is 2 + 2? This is a test question.',
      answers: ['3', '4', '5', '6'],
      correct_answers: [1],
      category: 'excel',
      sub_category: 'Basic Math',
      level: 'easy', 
      question_type: 'Single Choice',
      explanation: '2 + 2 equals 4',
      status: 'active'
    };
    
    const questionResult = await pb.collection('questions').create(testQuestion);
    console.log('✅ Test question created successfully!');
    console.log(`📝 Question ID: ${questionResult.id}`);
    
    // Test quizzes collection
    const testQuiz = {
      title: 'Test Quiz Sample',
      description: 'This is a test quiz',
      duration_minutes: 30,
      repeat_type: 'Once',
      status: 'draft',
      visibility: 'public'
    };
    
    const quizResult = await pb.collection('quizzes').create(testQuiz);
    console.log('✅ Test quiz created successfully!');
    console.log(`📝 Quiz ID: ${quizResult.id}`);
    
    // Clean up
    await pb.collection('questions').delete(questionResult.id);
    await pb.collection('quizzes').delete(quizResult.id);
    console.log('🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing collections:', error.message);
    console.error('Full error:', error);
  }
}

async function showCollectionsSummary() {
  try {
    console.log('\n📊 Collections Summary:');
    const collections = await pb.collections.getFullList();
    
    ['questions', 'quizzes', 'submissions'].forEach(name => {
      const collection = collections.find(c => c.name === name);
      if (collection) {
        console.log(`✅ ${name}:`);
        console.log(`   - ID: ${collection.id}`);
        console.log(`   - Fields: ${collection.fields?.length || 0}`);
        console.log(`   - Type: ${collection.type}`);
      } else {
        console.log(`❌ ${name}: Not found`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error getting collections summary:', error.message);
  }
}

async function main() {
  console.log('🚀 Creating PocketBase Collections - FIXED VERSION...\n');
  
  const loginSuccess = await loginAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin access');
    return;
  }
  
  await deleteExistingCollections();
  
  console.log('\n🏗️ Creating collections...');
  await createQuestionsCollection();
  await createQuizzesCollection(); 
  await createSubmissionsCollection();
  
  console.log('\n🔐 Setting up rules...');
  await setCollectionRules();
  
  console.log('\n🧪 Testing collections...');
  await testCollections();
  
  await showCollectionsSummary();
  
  console.log('\n🎉 All collections created successfully!');
  console.log('\n📋 Collections created:');
  console.log('1. ✅ questions - For storing quiz questions with all fields');
  console.log('2. ✅ quizzes - For storing quiz configurations with status/visibility');  
  console.log('3. ✅ submissions - For storing quiz submissions with status tracking');
  console.log('\n📋 Status Management Guide:');
  console.log('\n📝 Questions Status:');
  console.log('   • draft - Câu hỏi đang được soạn thảo');
  console.log('   • pending_review - Chờ review/duyệt');
  console.log('   • approved - Đã được duyệt, sẵn sàng sử dụng');
  console.log('   • active - Đang được sử dụng trong quiz');
  console.log('   • inactive - Tạm thời không sử dụng');
  console.log('   • rejected - Bị từ chối, cần chỉnh sửa');
  console.log('   • archived - Đã lưu trữ, không sử dụng nữa');
  
  console.log('\n🎯 Quizzes Status:');
  console.log('   • draft - Quiz đang được tạo');
  console.log('   • published - Sẵn sàng nhưng chưa bắt đầu'); 
  console.log('   • scheduled - Có lịch trình cụ thể');
  console.log('   • active - Đang diễn ra, users có thể làm');
  console.log('   • paused - Tạm dừng');
  console.log('   • completed - Đã kết thúc');
  console.log('   • archived - Đã lưu trữ');
  
  console.log('\n📊 Submissions Status:');
  console.log('   • started - Bắt đầu làm quiz');
  console.log('   • in_progress - Đang làm bài');
  console.log('   • completed - Hoàn thành tất cả câu');
  console.log('   • submitted - Đã nộp bài chính thức');
  console.log('   • abandoned - Bỏ dở giữa chừng');
  console.log('   • timeout - Hết thời gian');
  console.log('   • graded - Đã chấm điểm');
  console.log('   • reviewed - Admin đã review');
  
  console.log('\n🔧 Admin Queries Examples:');
  console.log('   • Active questions: status = "active"');
  console.log('   • Pending questions: status = "pending_review"');
  console.log('   • Live quizzes: status = "active" || status = "published"');
  console.log('   • Completed submissions: status = "submitted" || status = "graded"');
}

main().catch(console.error);