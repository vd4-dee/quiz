# CONTEXT-ENGINEERED PLAN: HỆ THỐNG QUIZ ONLINE

## 🎯 CONTEXT OVERVIEW
You are a senior full-stack developer with 5+ years experience building educational platforms. Your task is to create a comprehensive quiz management system using PocketBase (backend) and Vue.js 3 (frontend) for LAN deployment.

**CRITICAL SUCCESS FACTORS:**
- System must run on Windows PC server in LAN environment
- Support 50+ concurrent users
- Real-time quiz taking with timer
- Comprehensive admin panel
- Secure answer validation server-side

---

## 📐 SYSTEM ARCHITECTURE CONTEXT

### Tech Stack (FIXED - DO NOT MODIFY)
```
Backend: PocketBase (SQLite + REST API)
Frontend: Vue.js 3 + Composition API
State: Pinia
HTTP: Axios  
UI: TailwindCSS
Build: Vite
Deploy: Static files in pb_public folder
```

### Database Schema (STRICT REQUIREMENTS)
```sql
-- Collection: questions
{
  "question": "string (required)",
  "answers": "json (required) - array of answer strings", 
  "correct_answers": "json (required) - array of correct indices",
  "category": "select (Excel|Python|Pandas)",
  "sub_category": "string",
  "level": "select (Easy|Normal|Hard|Very Hard)",
  "question_type": "select (Yes/No|Single Choice|Multiple Choice)",
  "explanation": "text (optional)"
}

-- Collection: quizzes  
{
  "title": "string (required)",
  "description": "text",
  "duration_minutes": "number (required)",
  "questions_list": "relation[] (to questions) - for static quizzes",
  "dynamic_config": "json - for dynamic quizzes",
  "start_date": "datetime",  
  "end_date": "datetime",
  "repeat_type": "select (Once|Daily|Weekly|Monthly)",
  "is_active": "boolean"
}

-- Collection: submissions
{
  "user": "relation (to users, required)",
  "quiz": "relation (to quizzes, required)", 
  "score": "number",
  "total_questions": "number",
  "started_at": "datetime",
  "completed_at": "datetime", 
  "submission_data": "json - complete quiz snapshot"
}
```

---

## 🏗️ PHASE 1: BACKEND FOUNDATION (Week 1)

### CONTEXT: You are setting up PocketBase backend infrastructure

**TASK 1.1: PocketBase Project Structure**
```
REQUIREMENTS:
- Create organized project structure
- Setup PocketBase executable
- Configure admin access
- Document setup process

DELIVERABLE: Working PocketBase instance with admin UI
```

**EXACT PROMPT FOR AI:**
```
Create a complete project structure for a quiz management system:

PROJECT_STRUCTURE:
quiz-system/
├── backend/
│   ├── pocketbase.exe (download link needed)
│   ├── pb_data/ (auto-created)  
│   ├── pb_public/ (frontend will go here)
│   └── README.md (setup instructions)
├── frontend/ (Vue.js project)
├── scripts/ (deployment scripts)  
└── docs/ (documentation)

REQUIREMENTS:
1. Create setup-backend.md with:
   - PocketBase download instructions for Windows
   - First run commands: ./pocketbase.exe serve --http="0.0.0.0:8090"
   - Admin UI access: http://localhost:8090/_/
   - Initial admin account creation steps

2. Create a PowerShell script start-server.ps1:
   - Check if pocketbase.exe exists
   - Start PocketBase with proper network binding
   - Display access URLs

CRITICAL: Include exact download URLs and version numbers.
```

**TASK 1.2: Database Schema Implementation**  
**EXACT PROMPT FOR AI:**
```
Create PocketBase collections configuration with exact field definitions:

CONTEXT: You are configuring a quiz system database with these exact requirements:

COLLECTION 1 - questions:
- question (text, required, min: 10 chars)
- answers (json, required) - format: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"] 
- correct_answers (json, required) - format: [0, 2] for multiple choice
- category (select, required, options: "Excel", "Python", "Pandas")
- sub_category (text, optional)
- level (select, required, options: "Easy", "Normal", "Hard", "Very Hard") 
- question_type (select, required, options: "Yes/No", "Single Choice", "Multiple Choice")
- explanation (editor, optional)
- created (datetime, auto)
- updated (datetime, auto)

API RULES for questions:
- List: admin only
- View: admin only  
- Create: admin only
- Update: admin only
- Delete: admin only

COLLECTION 2 - quizzes:
- title (text, required, min: 5 chars, max: 100 chars)
- description (editor, optional)
- duration_minutes (number, required, min: 5, max: 180)
- questions_list (relation, multiple, to: questions) 
- dynamic_config (json, optional) - format: {"category": "Python", "total": 20, "levels": {"Easy": 10, "Normal": 5, "Hard": 3, "Very Hard": 2}}
- start_date (datetime, optional)
- end_date (datetime, optional)  
- repeat_type (select, options: "Once", "Daily", "Weekly", "Monthly", default: "Once")
- is_active (bool, default: true)
- created (datetime, auto)
- updated (datetime, auto)

API RULES for quizzes:
- List: authenticated users (@request.auth.id != "")
- View: authenticated users
- Create: admin only
- Update: admin only  
- Delete: admin only

COLLECTION 3 - submissions:
- user (relation, required, to: users)
- quiz (relation, required, to: quizzes)
- score (number, min: 0, max: 100)
- total_questions (number, min: 1)
- started_at (datetime, required)
- completed_at (datetime, optional)
- submission_data (json, required) - complete quiz snapshot with questions and user answers
- created (datetime, auto)

API RULES for submissions:
- List: owner or admin (@request.auth.id = user.id || @request.auth.role = "admin")
- View: owner or admin
- Create: authenticated users  
- Update: nobody (immutable after creation)
- Delete: admin only

DELIVERABLE: 
1. Step-by-step instructions for creating these collections in PocketBase Admin UI
2. JSON export of collection schema for backup
3. API rules configuration guide
```

**TASK 1.3: Sample Data Creation**
**EXACT PROMPT FOR AI:**
```
Create comprehensive sample data for testing:

CONTEXT: You need realistic quiz questions for 3 categories with proper difficulty distribution.

CREATE: sample-data.js file that uses PocketBase JavaScript SDK to insert:

EXCEL QUESTIONS (10 total):
- 4 Easy: Basic formulas (SUM, AVERAGE, COUNT, MAX/MIN)
- 3 Normal: VLOOKUP, IF statements, basic charts  
- 2 Hard: Pivot tables, advanced formulas, data validation
- 1 Very Hard: Macros, VBA basics, complex nested formulas

PYTHON QUESTIONS (15 total):
- 6 Easy: Variables, data types, basic operators, print statements
- 5 Normal: Lists, dictionaries, loops, functions
- 3 Hard: Classes, file I/O, exception handling  
- 1 Very Hard: Decorators, generators, advanced OOP

PANDAS QUESTIONS (10 total):
- 4 Easy: DataFrame creation, basic indexing, head/tail
- 3 Normal: Filtering, groupby, basic operations
- 2 Hard: Multi-index, pivot, advanced aggregations
- 1 Very Hard: Complex transformations, performance optimization

FORMAT FOR EACH QUESTION:
{
  "question": "Clear, specific question text",
  "answers": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answers": [index_of_correct_answer], // [0] for single, [0,2] for multiple
  "category": "Excel|Python|Pandas", 
  "sub_category": "Specific topic",
  "level": "Easy|Normal|Hard|Very Hard",
  "question_type": "Single Choice|Multiple Choice|Yes/No",
  "explanation": "Detailed explanation of correct answer"
}

REQUIREMENTS:
1. Mix of Single Choice (70%), Multiple Choice (25%), Yes/No (5%)
2. Real-world scenarios, not just theoretical knowledge
3. Progressive difficulty within each level
4. Comprehensive explanations for learning

DELIVERABLE: Complete sample-data.js with PocketBase insertion logic
```

---

## 🏗️ PHASE 2: FRONTEND FOUNDATION (Week 2)

### CONTEXT: You are setting up Vue.js 3 frontend with modern tooling

**TASK 2.1: Vue.js Project Setup**
**EXACT PROMPT FOR AI:**
```
Initialize a production-ready Vue.js 3 project with specific configuration:

CONTEXT: Building a quiz platform frontend that will be served from PocketBase pb_public folder.

REQUIREMENTS:
1. Create Vue.js 3 project with these EXACT dependencies:
   - vue: ^3.3.0
   - vue-router: ^4.2.0  
   - pinia: ^2.1.0
   - axios: ^1.4.0
   - pocketbase: ^0.20.0
   - @tailwindcss/forms: ^0.5.0
   - @headlessui/vue: ^1.7.0
   - @heroicons/vue: ^2.0.0
   - lucide-vue-next: ^0.263.0

2. Project structure:
src/
├── components/
│   ├── common/ (shared UI components)
│   ├── admin/ (admin-specific components)
│   └── user/ (user-specific components)
├── views/
│   ├── admin/ (admin pages)
│   ├── user/ (user pages) 
│   └── auth/ (login/register pages)
├── stores/ (Pinia stores)
├── services/ (API services)
├── composables/ (Vue 3 composables)
├── utils/ (helper functions)
├── assets/ (static files)
└── styles/ (global styles)

3. Configure Vite for production build to work with PocketBase:
   - Base URL configuration
   - Output directory: pb_public  
   - Asset optimization
   - Environment variables setup

4. Setup TailwindCSS with:
   - Custom color scheme for quiz interface
   - Component styles for forms, buttons, cards
   - Responsive breakpoints
   - Dark mode support

DELIVERABLE: Complete package.json, vite.config.js, tailwind.config.js, and folder structure
```

**TASK 2.2: PocketBase Integration Service**
**EXACT PROMPT FOR AI:**
```
Create a comprehensive PocketBase service layer:

CONTEXT: You need a robust API service that handles all PocketBase interactions with proper error handling and TypeScript-like structure.

CREATE: services/pocketbase.js with these EXACT methods:

CLASS: PocketBaseService
CONSTRUCTOR:
- Initialize PocketBase client
- Set base URL from environment
- Setup auth state listener
- Configure default headers

AUTHENTICATION METHODS:
- login(email, password) -> user object or error
- logout() -> boolean
- register(email, password, passwordConfirm, name) -> user object
- refreshAuth() -> boolean  
- getCurrentUser() -> user object or null
- isAuthenticated() -> boolean
- isAdmin() -> boolean

QUESTIONS METHODS:  
- getAllQuestions(filters = {}) -> questions array
- getQuestionById(id) -> question object
- createQuestion(questionData) -> created question
- updateQuestion(id, questionData) -> updated question  
- deleteQuestion(id) -> boolean
- searchQuestions(query, filters) -> filtered questions

QUIZZES METHODS:
- getAllQuizzes(includeInactive = false) -> quizzes array
- getQuizById(id, expand = []) -> quiz object with relations
- createQuiz(quizData) -> created quiz
- updateQuiz(id, quizData) -> updated quiz
- deleteQuiz(id) -> boolean
- generateDynamicQuiz(config) -> questions array
- getAvailableQuizzes(userId) -> user-available quizzes

SUBMISSIONS METHODS:
- submitQuiz(quizId, answers, timeTaken) -> submission object
- getUserSubmissions(userId, limit = 10) -> submissions array
- getSubmissionById(id) -> submission with full data
- getQuizStatistics(quizId) -> stats object
- getAllSubmissions(filters = {}) -> admin submissions view

USERS METHODS (Admin only):
- getAllUsers(pagination = {}) -> users array  
- createUser(userData) -> created user
- updateUser(id, userData) -> updated user
- deleteUser(id) -> boolean
- resetUserPassword(id, newPassword) -> boolean

ERROR HANDLING:
- Consistent error format: { success: false, error: "message", code: "ERROR_CODE" }
- Network error handling
- Authentication error handling  
- Validation error mapping
- Rate limiting handling

DELIVERABLE: Complete pocketbase.js service with comprehensive error handling
```

**TASK 2.3: Pinia Stores Setup**
**EXACT PROMPT FOR AI:**
```
Create Pinia stores for state management:

CONTEXT: You need centralized state management for authentication, quiz taking, and admin data.

STORE 1 - stores/auth.js:
STATE:
- user: null | user object
- isAuthenticated: boolean
- isAdmin: boolean  
- loading: boolean
- error: null | string

ACTIONS:
- login(email, password) -> async login with validation
- logout() -> clear state and redirect
- checkAuth() -> verify current auth status
- updateProfile(userData) -> update user info

GETTERS:
- userDisplayName -> computed full name or email
- hasAdminAccess -> boolean for admin features

STORE 2 - stores/quiz.js:
STATE:
- currentQuiz: null | quiz object
- questions: [] 
- currentQuestionIndex: 0
- userAnswers: {} // questionId -> answer(s)
- timeRemaining: 0 
- quizStartTime: null
- isSubmitting: false
- flaggedQuestions: Set()

ACTIONS:
- startQuiz(quizId) -> load quiz and start timer  
- nextQuestion() -> navigate to next question
- previousQuestion() -> navigate to previous
- saveAnswer(questionId, answer) -> save user answer
- flagQuestion(questionId) -> mark for review
- submitQuiz() -> submit all answers
- pauseQuiz() -> pause timer (if allowed)
- resumeQuiz() -> resume timer

GETTERS:
- progressPercentage -> completion percentage
- answeredCount -> number of answered questions
- remainingTime -> formatted time string
- canSubmit -> boolean if ready to submit

STORE 3 - stores/admin.js:
STATE:
- users: []
- questions: []
- quizzes: []
- submissions: []
- statistics: {}
- loading: { users: false, questions: false, quizzes: false }

ACTIONS:
- loadUsers() -> fetch all users
- loadQuestions(filters) -> fetch questions with filters
- loadQuizzes() -> fetch all quizzes  
- loadSubmissions(filters) -> fetch submissions
- refreshStatistics() -> update dashboard stats

PERSISTENCE:
- Use localStorage for auth state
- Session storage for quiz progress  
- Clear sensitive data on logout

DELIVERABLE: Three complete Pinia stores with proper TypeScript JSDoc comments
```

---

## 🏗️ PHASE 3: ADMIN INTERFACE (Week 3)

### CONTEXT: You are building a comprehensive admin panel for quiz management

**TASK 3.1: Admin Layout & Navigation**
**EXACT PROMPT FOR AI:**
```
Create a professional admin interface with sidebar navigation:

CONTEXT: Building admin panel that matches modern dashboard standards with proper UX.

CREATE: components/admin/AdminLayout.vue

REQUIREMENTS:
SIDEBAR NAVIGATION:
- Dashboard (overview stats)
- User Management (create/edit users)
- Question Bank (CRUD questions)  
- Quiz Management (create/manage quizzes)
- Submissions (view all submissions)
- Analytics (detailed statistics)
- Settings (system configuration)

HEADER:
- Admin user info dropdown
- Notifications bell (future feature)
- Logout button
- System status indicator

RESPONSIVE DESIGN:
- Collapsible sidebar on mobile
- Breadcrumb navigation  
- Toast notification system
- Loading states for all actions
- Confirm dialogs for destructive actions

STYLING REQUIREMENTS:
- Clean, professional design using TailwindCSS
- Dark/light mode toggle
- Consistent spacing and typography
- Smooth transitions and animations
- Accessible color contrast
- Mobile-first responsive design

COMPONENTS TO CREATE:
1. AdminSidebar.vue - navigation menu
2. AdminHeader.vue - top header bar  
3. AdminBreadcrumb.vue - page navigation
4. ToastNotification.vue - success/error messages
5. ConfirmDialog.vue - confirmation modals
6. LoadingSpinner.vue - loading states

DELIVERABLE: Complete admin layout system with all components
```

**TASK 3.2: User Management Interface**  
**EXACT PROMPT FOR AI:**
```
Build comprehensive user management system:

CONTEXT: Admin needs to create, edit, and manage all system users with bulk operations.

CREATE: views/admin/UserManagement.vue

FEATURES REQUIRED:
USER TABLE:
- Sortable columns: Name, Email, Role, Created Date, Last Login
- Search functionality (name, email)
- Filter by role (Admin, User)
- Pagination (50 users per page)
- Bulk selection with actions
- Export to CSV functionality

USER ACTIONS:
- Create new user (modal form)
- Edit user details (inline or modal)
- Reset password (generate new + send email simulation)
- Activate/Deactivate user
- Delete user (with confirmation)
- View user quiz history

BULK OPERATIONS:
- Create multiple users from CSV import
- Bulk password reset
- Bulk role assignment
- Bulk delete (with safeguards)

FORM VALIDATION:
- Email format validation
- Password strength requirements
- Duplicate email prevention
- Required field validation  
- Real-time validation feedback

CREATE USER MODAL:
- Full name (required)
- Email address (required, unique)
- Password (auto-generate option)
- Confirm password
- Role selection
- Account status (active/inactive)

COMPONENTS TO CREATE:
1. UserTable.vue - main data table
2. UserFormModal.vue - create/edit form
3. BulkActions.vue - bulk operation controls  
4. UserImport.vue - CSV import functionality
5. UserExport.vue - export options

ERROR HANDLING:
- Network errors
- Validation errors  
- Duplicate email errors
- Permission errors
- Success confirmations

DELIVERABLE: Complete user management interface with all CRUD operations
```

**TASK 3.3: Question Bank Management**
**EXACT PROMPT FOR AI:**
```
Create advanced question bank management system:

CONTEXT: Admin needs to create, organize, and manage quiz questions with rich editing capabilities.

CREATE: views/admin/QuestionBank.vue

QUESTION TABLE FEATURES:
- Columns: Question Preview, Category, Level, Type, Actions
- Advanced filtering: Category, Level, Question Type, Date Range
- Full-text search in question content
- Bulk operations: Delete, Change Category, Change Level
- Import from Excel/CSV with template
- Export selected questions

QUESTION FORM (Modal):
BASIC INFO:
- Question text (rich text editor with formatting)
- Category (dropdown: Excel, Python, Pandas)
- Sub-category (free text)
- Difficulty level (Easy, Normal, Hard, Very Hard)
- Question type (Yes/No, Single Choice, Multiple Choice)

ANSWER OPTIONS:
- Dynamic answer list (add/remove options)
- Rich text support for answers
- Multiple correct answer selection for Multiple Choice
- Visual indicator for correct answers
- Answer reordering (drag & drop)

EXPLANATION:
- Rich text editor for detailed explanations
- Support for code blocks, links, images
- Preview mode

QUESTION PREVIEW:
- Live preview as admin types
- Test mode to simulate quiz taking
- Mobile preview

ADVANCED FEATURES:
- Duplicate question with modifications
- Question versioning/history
- Question usage statistics (how many quizzes use it)
- Difficulty analysis based on user performance
- Tag system for better organization

BULK IMPORT:
- Excel template download
- CSV format support  
- Validation and error reporting
- Preview before import
- Import progress tracking

COMPONENTS TO CREATE:
1. QuestionTable.vue - main questions list
2. QuestionFormModal.vue - create/edit form
3. RichTextEditor.vue - enhanced text editor
4. AnswerOptionsEditor.vue - answer management
5. QuestionPreview.vue - preview component
6. QuestionImport.vue - bulk import system
7. QuestionExport.vue - export functionality

VALIDATION:
- Question text minimum length (10 characters)
- At least 2 answers for choice questions
- At least 1 correct answer selected
- Unique answer options
- Valid HTML in rich text

DELIVERABLE: Complete question bank management system with rich editing capabilities
```

---

## 🏗️ PHASE 4: QUIZ CREATION & MANAGEMENT (Week 4)

### CONTEXT: You are building the core quiz creation and management system

**TASK 4.1: Quiz Creation Interface**
**EXACT PROMPT FOR AI:**
```
Build advanced quiz creation system with static and dynamic quiz support:

CONTEXT: Admin needs to create two types of quizzes - static (pre-selected questions) and dynamic (auto-generated based on criteria).

CREATE: views/admin/QuizManagement.vue with tabbed interface

TAB 1 - STATIC QUIZ CREATION:
QUIZ INFO SECTION:
- Quiz title (required, 5-100 characters)
- Description (rich text editor)  
- Duration in minutes (5-180 minutes)
- Start date/time (optional)
- End date/time (optional)
- Repeat schedule (Once, Daily, Weekly, Monthly)
- Active status toggle

QUESTION SELECTION:
- Search and filter interface for questions
- Categories filter (Excel, Python, Pandas)
- Difficulty filter (multiple selection)
- Question type filter
- Selected questions list (right panel)
- Drag & drop reordering
- Question preview on hover
- Remove questions from selection
- Total questions counter
- Estimated completion time

TAB 2 - DYNAMIC QUIZ CREATION:
QUIZ CONFIGURATION:
- Same basic info as static quiz
- Category selection (single or multiple)
- Total number of questions
- Difficulty distribution:
  * Easy: slider (0-100%)
  * Normal: slider (0-100%) 
  * Hard: slider (0-100%)
  * Very Hard: slider (0-100%)
  * Auto-balance remaining percentage

PREVIEW GENERATION:
- "Generate Preview" button
- Shows sample questions that would be selected
- Question distribution summary
- Regenerate option with different random seed

TAB 3 - QUIZ MANAGEMENT:
EXISTING QUIZZES TABLE:
- Quiz name, Type (Static/Dynamic), Questions, Duration, Status, Actions
- Search and filter functionality  
- Sort by creation date, name, status
- Quick status toggle (Active/Inactive)
- Clone quiz functionality
- Delete with confirmation

QUIZ ACTIONS:
- Edit quiz (reopen creation form)
- Preview quiz (student view)
- View submissions
- Export quiz data
- Archive/Unarchive

COMPONENTS TO CREATE:
1. QuizCreationTabs.vue - main tabbed interface
2. StaticQuizCreator.vue - static quiz creation
3. DynamicQuizCreator.vue - dynamic quiz configuration  
4. QuestionSelector.vue - question search and selection
5. QuestionDistribution.vue - difficulty distribution controls
6. QuizPreview.vue - preview generated quiz
7. QuizTable.vue - existing quizzes management
8. QuizCloneModal.vue - clone quiz functionality

VALIDATION:
- Quiz title uniqueness
- At least 1 question for static quiz
- Valid difficulty distribution (totals 100%)
- Sufficient questions available for dynamic config
- Valid date ranges
- Duration minimum/maximum limits

DELIVERABLE: Complete quiz creation and management system
```

**TASK 4.2: Quiz Analytics Dashboard**
**EXACT PROMPT FOR AI:**
```
Create comprehensive analytics dashboard for quiz performance:

CONTEXT: Admin needs detailed insights into quiz performance, user engagement, and system usage.

CREATE: views/admin/Analytics.vue

OVERVIEW METRICS (Top Cards):
- Total Active Users
- Total Quizzes Created
- Total Submissions This Month  
- Average Score Across All Quizzes
- Most Popular Quiz Category
- Peak Usage Hours

QUIZ PERFORMANCE SECTION:
- Quiz performance table: Name, Attempts, Avg Score, Completion Rate
- Quiz difficulty analysis (are Hard questions too hard?)
- Question effectiveness (which questions are answered correctly most/least)
- Time analysis (average completion time vs allocated time)

USER ENGAGEMENT SECTION:  
- User activity heatmap (days/hours)
- Top performers leaderboard
- User progress tracking
- Engagement trends (daily/weekly/monthly)

DETAILED CHARTS:
- Score distribution histogram
- Performance by category (Excel vs Python vs Pandas)
- Performance by difficulty level
- Time series of quiz attempts
- User retention analysis

QUESTION ANALYSIS:
- Most missed questions
- Questions with highest/lowest success rate
- Question time analysis (which take longest)
- Correlation between question difficulty and performance

EXPORT CAPABILITIES:
- Export charts as images
- Export data as CSV/Excel
- Generate PDF reports
- Schedule automated reports

COMPONENTS TO CREATE:
1. MetricsCards.vue - overview statistics cards
2. QuizPerformanceTable.vue - detailed quiz stats
3. ScoreDistributionChart.vue - score histogram  
4. CategoryPerformanceChart.vue - performance by category
5. UserEngagementHeatmap.vue - activity heatmap
6. QuestionAnalytics.vue - question-level insights
7. ExportControls.vue - export and reporting options

CHART REQUIREMENTS:
- Use Chart.js or similar for visualizations
- Interactive charts with drill-down capability
- Responsive design for mobile viewing
- Loading states for data fetching
- Empty states when no data available

DELIVERABLE: Complete analytics dashboard with interactive charts and insights
```

---

## 🏗️ PHASE 5: USER QUIZ INTERFACE (Week 5)

### CONTEXT: You are building the student-facing quiz taking experience

**TASK 5.1: User Dashboard & Quiz Selection**
**EXACT PROMPT FOR AI:**
```
Create intuitive user dashboard and quiz selection interface:

CONTEXT: Students need clean, distraction-free interface to view available quizzes and track progress.

CREATE: views/user/Dashboard.vue

USER DASHBOARD SECTIONS:
HEADER SECTION:
- Welcome message with user name
- Quick stats: Quizzes Completed, Average Score, Time Spent
- Progress streak indicator
- Next quiz recommendation

AVAILABLE QUIZZES:
- Grid layout of quiz cards
- Quiz card information:
  * Quiz title and description
  * Number of questions
  * Estimated duration
  * Difficulty level indicator
  * Deadline (if applicable)
  * "Start Quiz" button
  * Previous attempt score (if any)

QUIZ FILTERING:
- Category filter (Excel, Python, Pandas, All)
- Difficulty filter
- Status filter (Available, Completed, Expired)
- Search by quiz name

RECENT ACTIVITY:
- Last 5 quiz attempts with scores
- Performance trend chart (last 10 quizzes)
- Recent achievements/badges
- Study suggestions based on weak areas

QUIZ CARD STATES:
- Available (green border, enabled button)
- In Progress (yellow border, "Continue" button)  
- Completed (blue border, "Review Results" button)
- Expired (red border, disabled)
- Locked (gray, with unlock conditions)

COMPONENTS TO CREATE:
1. UserStats.vue - user statistics display
2. QuizCard.vue - individual quiz card component
3. QuizFilters.vue - filtering controls
4. RecentActivity.vue - activity feed
5. PerformanceTrend.vue - progress chart
6. AchievementBadges.vue - gamification elements

RESPONSIVE DESIGN:
- Mobile-first approach
- Touch-friendly buttons  
- Collapsible sidebar filters
- Swipeable quiz cards on mobile

DELIVERABLE: Complete user dashboard with quiz selection interface
```

**TASK 5.2: Quiz Taking Interface**
**EXACT PROMPT FOR AI:**
```
Build comprehensive quiz taking interface with timer and navigation:

CONTEXT: Core quiz taking experience must be robust, distraction-free, and handle edge cases.

CREATE: views/user/TakeQuiz.vue

PRE-QUIZ SCREEN:
- Quiz information display (title, description, rules)
- Question count and time limit
- Instructions and tips
- "Start Quiz" button with confirmation
- Terms acceptance checkbox

QUIZ INTERFACE LAYOUT:
HEADER BAR:
- Quiz progress bar (visual progress indicator)
- Question counter (3 of 20)
- Timer display (MM:SS format)
- Quiz title
- Flag question button

QUESTION AREA:
- Question text (clear typography)
- Question number and total
- Answer options based on type:
  * Single Choice: radio buttons
  * Multiple Choice: checkboxes  
  * Yes/No: large Yes/No buttons
- Clear selection button

NAVIGATION:
- Previous/Next question buttons
- Question navigator (numbered grid)
- Visual indicators: Answered (green), Current (blue), Flagged (orange), Unanswered (gray)
- "Review Flagged" quick access

QUIZ CONTROLS:
- Save & continue (auto-save every 30 seconds)
- Flag for review toggle
- Submit quiz button (available anytime)
- Pause quiz (if allowed by admin)

TIMER FUNCTIONALITY:
- Countdown timer with visual warnings
- Warning at 10 minutes remaining (yellow)
- Warning at 2 minutes remaining (red)
- Auto-submit when time expires
- Time tracking for analytics

ANSWER PERSISTENCE:
- Auto-save answers to localStorage
- Restore on page refresh
- Clear on quiz completion
- Handle network disconnection

SUBMISSION FLOW:
- Review screen showing:
  * Answered questions count
  * Unanswered questions list  
  * Flagged questions list
  * Final confirmation dialog
- Submission progress indicator
- Success/error handling

EDGE CASES:
- Network disconnection handling
- Page refresh recovery
- Multiple tab prevention
- Timer synchronization
- Auto-submit on time expiry

COMPONENTS TO CREATE:
1. QuizHeader.vue - progress bar and timer
2. QuestionDisplay.vue - question and answers
3. QuestionNavigation.vue - question navigator
4. TimerWidget.vue - countdown timer
5. QuizControls.vue - quiz action buttons
6. ReviewScreen.vue - pre-submission review
7. NetworkStatus.vue - connection monitoring

ACCESSIBILITY:
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management
- Skip links

DELIVERABLE: Complete quiz taking interface with robust timer and navigation
```

**TASK 5.3: Results & History Interface**
**EXACT PROMPT FOR AI:**
```
Create comprehensive results display and quiz history tracking:

CONTEXT: Users need detailed feedback on performance with learning opportunities.

CREATE: views/user/QuizResults.vue

RESULTS SCREEN LAYOUT:
SCORE DISPLAY:
- Large score display with animation (75/100)
- Percentage with visual progress ring
- Pass/Fail status (if applicable)
- Percentile ranking among all users
- Time taken vs allocated time

PERFORMANCE BREAKDOWN:
- Correct answers count (green)
- Incorrect answers count (red)  
- Unanswered questions count (gray)
- Category-wise performance (Excel: 8/10, Python: 12/15)
- Difficulty-wise performance (Easy: 95%, Hard: 60%)

DETAILED REVIEW:
- Question-by-question breakdown
- User answer vs correct answer
- Explanation for each question (expandable)
- Time spent per question
- Difficulty level of each question

VISUAL INDICATORS:
- Color coding: Green (correct), Red (incorrect), Gray (unanswered)
- Icons for question types
- Progress bars for category performance
- Charts for performance visualization

ACTION BUTTONS:
- Retake quiz (if allowed)
- Review explanations
- Share results (generate shareable link)
- Download certificate (for passed quizzes)
- Print results
- Back to dashboard

CREATE: views/user/QuizHistory.vue

HISTORY INTERFACE:
QUIZ HISTORY TABLE:
- Quiz name and category
- Date taken
- Score achieved
- Time taken
- Status (Completed, In Progress, Expired)
- Actions (View Details, Retake)

FILTERING OPTIONS:
- Date range picker
- Category filter
- Score range filter
- Status filter
- Search by quiz name

PERFORMANCE TRENDS:
- Score trend line chart over time
- Category performance comparison
- Best/worst performing areas
- Improvement suggestions

DETAILED VIEW:
- Click to expand full quiz details
- Question-by-question review
- Performance analytics for that attempt
- Comparison with previous attempts

COMPONENTS TO CREATE:
1. ResultsDisplay.vue - main score display
2. PerformanceBreakdown.vue - detailed breakdown
3. QuestionReview.vue - question-by-question review
4. PerformanceChart.vue - visual performance data
5. HistoryTable.vue - quiz history table
6. HistoryFilters.vue - filtering controls
7. TrendAnalysis.vue - performance trends

DELIVERABLE: Complete results and history tracking system with detailed analytics

---

## 🏗️ PHASE 6: SECURITY & OPTIMIZATION (Week 6)

### CONTEXT: You are implementing security measures and performance optimizations

**TASK 6.1: Security Implementation**
**EXACT PROMPT FOR AI:**
```
Implement comprehensive security measures for quiz system:

CONTEXT: Quiz system must prevent cheating and ensure data integrity.

SECURITY REQUIREMENTS:

QUIZ TAKING SECURITY:
- Disable right-click context menu during quiz
- Disable text selection and copy/paste
- Prevent tab switching detection (blur/focus events)
- Disable browser back button during quiz
- Full-screen mode enforcement (optional)
- Screenshot prevention attempts
- Disable developer tools (F12, Ctrl+Shift+I)

SESSION MANAGEMENT:
- Single session per user enforcement
- Automatic logout on inactivity
- Session timeout warnings
- Secure token storage and refresh
- Cross-tab quiz prevention

DATA PROTECTION:
- Input sanitization for all user inputs
- XSS prevention in rich text content
- CSRF token implementation
- SQL injection prevention (PocketBase handles this)
- Rate limiting for API calls

ANSWER SECURITY:
- Never send correct answers to frontend
- Server-side answer validation only
- Encrypted answer submission
- Tamper detection for quiz data
- Time-based submission validation

CREATE: composables/useQuizSecurity.js
METHODS:
- enableQuizMode() - activate security measures
- disableQuizMode() - restore normal functionality  
- detectCheating() - monitor suspicious behavior
- preventCopyPaste() - disable copy/paste
- monitorTabSwitching() - track focus changes
- enforceFullscreen() - fullscreen management

SECURITY MONITORING:
- Log suspicious activities
- Track tab switching events
- Monitor unusual completion times
- Detect multiple session attempts
- Report security violations to admin

COMPONENTS TO CREATE:
1. SecurityWrapper.vue - quiz security container
2. CheatingDetection.vue - monitoring component
3. SessionGuard.vue - session management
4. SecureInput.vue - protected input fields

DELIVERABLE: Complete security implementation with monitoring
```

**TASK 6.2: Performance Optimization**
**EXACT PROMPT FOR AI:**
```
Implement performance optimizations for 50+ concurrent users:

CONTEXT: System must handle multiple simultaneous quiz sessions efficiently.

OPTIMIZATION AREAS:

FRONTEND PERFORMANCE:
- Lazy loading for all routes
- Component code splitting
- Image optimization and lazy loading
- Virtual scrolling for large lists
- Debounced search inputs
- Memoized expensive computations
- Bundle size optimization

API OPTIMIZATION:
- Request batching where possible  
- Caching strategies for static data
- Pagination for large datasets
- Optimized database queries
- Connection pooling
- Response compression

QUIZ PERFORMANCE:
- Question preloading (next 3 questions)
- Answer auto-save optimization
- Timer precision improvement
- State management optimization
- Memory leak prevention

CACHING STRATEGY:
- Question bank caching
- User session caching
- Quiz configuration caching
- Static asset caching
- Service worker implementation

CREATE: utils/performance.js
METHODS:
- preloadQuestions(questionIds) - preload question data
- optimizeImages(imageUrls) - lazy load images
- debounceSearch(searchFn, delay) - debounced search
- memoizeExpensive(fn, keyFn) - memoization helper
- trackPerformance(metric) - performance monitoring

MONITORING:
- Page load time tracking
- API response time monitoring  
- Memory usage tracking
- User interaction performance
- Error rate monitoring

COMPONENTS TO CREATE:
1. LazyLoader.vue - lazy loading wrapper
2. VirtualScroller.vue - virtual scrolling
3. PerformanceMonitor.vue - monitoring component
4. CacheManager.vue - cache management

DELIVERABLE: Optimized system capable of handling 50+ concurrent users
```

---

## 🏗️ PHASE 7: DEPLOYMENT & PRODUCTION (Week 7)

### CONTEXT: You are preparing the system for production deployment

**TASK 7.1: Production Build & Deployment**
**EXACT PROMPT FOR AI:**
```
Create production-ready deployment system:

CONTEXT: System must be easily deployable on Windows PC server in LAN environment.

DEPLOYMENT REQUIREMENTS:

BUILD PROCESS:
- Production Vue.js build optimization
- Asset minification and compression
- Environment variable configuration
- Source map generation (for debugging)
- Build verification scripts

CREATE: scripts/build-production.ps1
FUNCTIONALITY:
- Clean previous builds
- Run Vue.js production build
- Copy build files to pb_public folder
- Verify all assets are present
- Generate deployment report
- Create backup of current deployment

CREATE: scripts/deploy-server.ps1  
FUNCTIONALITY:
- Check system requirements
- Backup current PocketBase data
- Start PocketBase server with production settings
- Configure Windows Firewall rules
- Set up automatic service restart
- Generate server access URLs for LAN

PRODUCTION CONFIGURATION:
- Environment-specific settings
- Logging configuration
- Error reporting setup
- Performance monitoring
- Security hardening

SERVER SETUP:
- Windows service configuration
- Automatic startup on boot
- Log rotation setup
- Backup scheduling
- Health check monitoring

CREATE: config/production.env
VARIABLES:
- VITE_API_URL=http://[SERVER_IP]:8090
- VITE_APP_NAME=Quiz Management System
- VITE_VERSION=[AUTO_GENERATED]
- VITE_BUILD_DATE=[AUTO_GENERATED]

NETWORKING:
- LAN IP address detection
- Port configuration (default 8090)
- Firewall rule automation
- Network connectivity testing

COMPONENTS TO CREATE:
1. DeploymentChecker.vue - system status checker
2. ServerInfo.vue - server information display
3. NetworkTest.vue - connectivity testing
4. BackupManager.vue - backup/restore interface

DELIVERABLE: Complete deployment system with automation scripts
```

**TASK 7.2: Documentation & User Guides**
**EXACT PROMPT FOR AI:**
```
Create comprehensive documentation for system deployment and usage:

CONTEXT: Non-technical users need clear instructions for installation, configuration, and daily operations.

DOCUMENTATION STRUCTURE:

CREATE: docs/INSTALLATION.md
CONTENT:
- System requirements (Windows 10/11, RAM, disk space)
- Step-by-step installation guide
- First-time setup wizard instructions
- Network configuration guide
- Troubleshooting common issues

CREATE: docs/ADMIN-GUIDE.md
CONTENT:
- Admin account creation and login
- User management procedures
- Question bank management best practices
- Quiz creation workflows (static vs dynamic)
- Submission review and analytics
- System maintenance tasks
- Data backup and restore procedures

CREATE: docs/USER-GUIDE.md
CONTENT:
- Student login process
- How to take a quiz (step-by-step)
- Understanding quiz results
- Viewing quiz history
- Technical requirements for students
- FAQ for common student questions

CREATE: docs/API-REFERENCE.md
CONTENT:
- PocketBase API endpoints used
- Authentication flow documentation
- Data schema reference
- Error codes and troubleshooting
- Integration possibilities

CREATE: docs/TROUBLESHOOTING.md  
CONTENT:
- Common installation issues
- Network connectivity problems
- Performance optimization tips
- Data recovery procedures
- Log file locations and analysis
- Contact support information

VIDEO TUTORIALS (Scripts):
- System installation walkthrough
- Creating your first quiz
- Managing users effectively
- Understanding analytics reports
- Backup and maintenance

QUICK REFERENCE:
- Admin cheat sheet (common tasks)
- Keyboard shortcuts
- Default settings reference
- Important file locations
- Emergency procedures

DELIVERABLE: Complete documentation suite with installation and usage guides
```

**TASK 7.3: Testing & Quality Assurance**
**EXACT PROMPT FOR AI:**
```
Implement comprehensive testing strategy:

CONTEXT: System must be thoroughly tested before production deployment.

TESTING REQUIREMENTS:

UNIT TESTING:
- Component testing (Vue Test Utils)
- Service layer testing (API calls)
- Utility function testing
- State management testing (Pinia)
- Form validation testing

INTEGRATION TESTING:
- API integration tests
- Authentication flow testing
- Quiz taking end-to-end flow
- Admin panel functionality
- Data persistence testing

PERFORMANCE TESTING:
- Load testing (50+ concurrent users)
- Stress testing (maximum capacity)
- Memory leak detection
- API response time testing
- Frontend performance auditing

SECURITY TESTING:
- Authentication bypass attempts
- Input validation testing
- XSS vulnerability scanning
- CSRF protection testing
- Session management testing

CREATE: tests/unit/components.spec.js
TEST COVERAGE:
- All Vue components (minimum 80% coverage)
- Critical user flows (100% coverage)
- API service methods (100% coverage)
- Utility functions (100% coverage)

CREATE: tests/e2e/quiz-flow.spec.js
SCENARIOS:
- Complete quiz taking flow
- Admin quiz creation flow
- User management workflow
- Results and analytics flow
- Error handling scenarios

AUTOMATED TESTING:
- Pre-commit testing hooks
- Continuous integration setup
- Automated deployment testing
- Regression testing suite
- Performance benchmark testing

MANUAL TESTING CHECKLIST:
- Cross-browser compatibility (Chrome, Firefox, Edge)
- Mobile responsiveness testing
- Accessibility testing (screen readers)
- Print functionality testing
- Offline behavior testing

QUALITY METRICS:
- Code coverage reports
- Performance benchmarks
- Accessibility scores
- Security scan results
- User experience metrics

DELIVERABLE: Complete testing suite with automated and manual test procedures

---

## 🚀 AI INTERACTION GUIDELINES

### PROMPT TEMPLATES FOR MAXIMUM EFFECTIVENESS:

**FOR COMPONENT CREATION:**
```
CONTEXT: [Specific context about what you're building]
REQUIREMENTS: [Exact specifications]  
DELIVERABLE: [What should be produced]

Create [ComponentName].vue with these EXACT features:
[Bulleted list of specific features]

STYLING: Use TailwindCSS with [specific design requirements]
FUNCTIONALITY: [Detailed functional requirements]
ERROR HANDLING: [Specific error scenarios to handle]
ACCESSIBILITY: [Accessibility requirements]

COMPONENTS TO CREATE: [List of sub-components if needed]
```

**FOR SERVICE/UTILITY CREATION:**
```
CONTEXT: [Technical context]
CREATE: [Filename and purpose]

CLASS/METHODS REQUIRED:
[Detailed method signatures with expected inputs/outputs]

ERROR HANDLING:
[Specific error scenarios and expected responses]

DELIVERABLE: [Exact specifications of what should be delivered]
```

**FOR CONFIGURATION/SETUP:**
```
CONTEXT: [Setup context]
REQUIREMENTS: [Technical requirements]

CONFIGURE:
[Exact configuration steps]

FILES TO CREATE:
[List of files with their purposes]

DELIVERABLE: [Complete setup specifications]
```

### AI RESPONSE EXPECTATIONS:

1. **Complete Code**: Always provide full, working code - no placeholders or "// TODO" comments
2. **Production Ready**: Code should be production-ready with error handling
3. **Best Practices**: Follow Vue 3 Composition API, modern JavaScript, and accessibility standards
4. **Documentation**: Include JSDoc comments for complex functions
5. **Testing**: Include test cases when requested
6. **Responsive**: Always consider mobile-first responsive design

### CODE QUALITY STANDARDS:

- **Vue 3 Composition API**: Use `<script setup>` syntax
- **TypeScript-style**: Use JSDoc for type hints
- **Error Boundaries**: Implement proper error handling
- **Loading States**: Always include loading indicators
- **Empty States**: Handle no-data scenarios
- **Accessibility**: WCAG 2.1 compliance
- **Performance**: Optimize for 50+ concurrent users

---

## 📋 PROJECT SUCCESS METRICS

### TECHNICAL METRICS:
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] Support for 50+ concurrent users
- [ ] 99.9% uptime during quiz sessions
- [ ] Zero data loss during submission
- [ ] Cross-browser compatibility (Chrome, Firefox, Edge)
- [ ] Mobile responsive (tablet/phone)

### FUNCTIONAL METRICS:
- [ ] Admin can create quiz in < 5 minutes
- [ ] Student can complete quiz without technical issues
- [ ] Real-time timer accuracy within 1 second
- [ ] Automatic backup and recovery system
- [ ] Complete audit trail of all activities
- [ ] Secure authentication and authorization

### USER EXPERIENCE METRICS:
- [ ] Intuitive interface requiring minimal training
- [ ] Clear error messages and recovery guidance
- [ ] Consistent design language throughout system
- [ ] Accessible to users with disabilities
- [ ] Fast response to user interactions
- [ ] Professional, clean visual design

This context-engineered plan provides AI with everything needed to build a production-ready quiz management system. Each task includes specific deliverables, exact requirements, and clear success criteria.