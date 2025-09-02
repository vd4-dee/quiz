// test-connection.js
// Test script to verify backend connection and quiz data

async function testConnection() {
    console.log('Testing PocketBase connection...');
    
    try {
        // Test basic connection
        const response = await fetch('http://localhost:8090/api/health');
        if (response.ok) {
            console.log('Backend connection successful');
        } else {
            console.log('Backend connection failed:', response.status);
            return;
        }
        
        // Test questions collection
        console.log('\nTesting questions collection...');
        const questionsResponse = await fetch('http://localhost:8090/api/collections/questions/records');
        if (questionsResponse.ok) {
            const questions = await questionsResponse.json();
            console.log(`Found ${questions.items.length} questions`);
            if (questions.items.length > 0) {
                console.log('Sample question:', questions.items[0].questions);
            }
        } else {
            console.log('Questions collection access failed:', questionsResponse.status);
        }
        
        // Test quizzes collection
        console.log('\nTesting quizzes collection...');
        const quizzesResponse = await fetch('http://localhost:8090/api/collections/quizzes/records');
        if (quizzesResponse.ok) {
            const quizzes = await quizzesResponse.json();
            console.log(`Found ${quizzes.items.length} quizzes`);
            if (quizzes.items.length > 0) {
                console.log('Sample quiz:', quizzes.items[0].title);
            }
        } else {
            console.log('Quizzes collection access failed:', quizzesResponse.status);
        }
        
        console.log('\nConnection test completed successfully!');
        console.log('Frontend: http://localhost:5173');
        console.log('Backend: http://localhost:8090');
        
    } catch (error) {
        console.error('Connection test failed:', error.message);
    }
}

// Run the test
testConnection();
