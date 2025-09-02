// create-student-user.js
// Create a student user for testing the quiz system

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function createStudentUser() {
  try {
    // Login as admin first
    console.log('Logging in as admin...');
    await pb.admins.authWithPassword('admin@test.com', 'admin123');
    console.log('Admin login successful!');

    // Create a student user
    console.log('Creating student user...');
    const studentData = {
      email: 'student@test.com',
      password: 'student123',
      passwordConfirm: 'student123',
      name: 'Test Student',
      role: 'student'
    };

    const user = await pb.collection('users').create(studentData);
    console.log('Student user created successfully!');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);

    // Also create a teacher user for testing
    console.log('\nCreating teacher user...');
    const teacherData = {
      email: 'teacher@test.com',
      password: 'teacher123',
      passwordConfirm: 'teacher123',
      name: 'Test Teacher',
      role: 'teacher'
    };

    const teacher = await pb.collection('users').create(teacherData);
    console.log('Teacher user created successfully!');
    console.log('User ID:', teacher.id);
    console.log('Email:', teacher.email);
    console.log('Role:', teacher.role);

    console.log('\n✅ All test users created successfully!');
    console.log('\nTest Credentials:');
    console.log('Student: student@test.com / student123');
    console.log('Teacher: teacher@test.com / teacher123');

  } catch (error) {
    console.error('Error creating user:', error);
    if (error.data) {
      console.error('Validation errors:', error.data);
    }
  }
}

// Run the function
createStudentUser();
