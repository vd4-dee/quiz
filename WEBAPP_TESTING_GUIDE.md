# Quiz Webapp Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- PocketBase running on http://localhost:8090
- Frontend dependencies installed

### 1. Start Backend (PocketBase)
```bash
# In backend directory
./pocketbase.exe serve
# Or use the start script
./start-dev.bat
```

### 2. Create Sample Data
```bash
# In backend directory
node create-complete-sample-data.js
```

### 3. Start Frontend
```bash
# In frontend directory
npm install
npm run dev
```

## 📊 Sample Data Overview

### Users Created
- **Student**: `student@test.com` / `student123`
- **Teacher**: `teacher@test.com` / `teacher123`
- **Admin**: `admin@test.com` / `admin123`

### Questions Available (11 total)
- **Excel**: 4 questions (Basic Formulas, VLOOKUP, IF Statements)
- **Python**: 3 questions (Variables, Data Types, Functions)
- **Pandas**: 3 questions (DataFrame, File I/O, Data Analysis)

### Quizzes Available (4 total)
1. **Excel Basics Quiz** (published) - 30 minutes
2. **Python Fundamentals** (published) - 45 minutes
3. **Pandas Data Analysis** (published) - 60 minutes
4. **Mixed Skills Assessment** (draft) - 90 minutes

## 🧪 Testing Scenarios

### Scenario 1: Student Experience
1. **Login as Student**
   - URL: http://localhost:5173/
   - Credentials: `student@test.com` / `student123`

2. **Browse Quizzes**
   - View available published quizzes
   - Check quiz details (duration, description)

3. **Take a Quiz**
   - Start "Excel Basics Quiz"
   - Answer questions
   - Submit and view results

4. **View History**
   - Check submission history
   - Review scores and performance

### Scenario 2: Teacher Experience
1. **Login as Teacher**
   - URL: http://localhost:5173/
   - Credentials: `teacher@test.com` / `teacher123`

2. **View Student Submissions**
   - Access submission dashboard
   - Review student performance

3. **Quiz Management**
   - View quiz statistics
   - Check question analytics

### Scenario 3: Admin Panel
1. **Access Admin Panel**
   - URL: http://localhost:8090/_/
   - Credentials: `admin@test.com` / `admin123`

2. **Manage Collections**
   - View questions collection
   - View quizzes collection
   - View submissions collection
   - View users collection

3. **Data Management**
   - Add/edit questions
   - Create new quizzes
   - Manage user permissions

## 🔧 Technical Testing

### API Endpoints
- **Questions**: `GET /api/collections/questions/records`
- **Quizzes**: `GET /api/collections/quizzes/records`
- **Submissions**: `GET /api/collections/submissions/records`
- **Users**: `GET /api/collections/users/records`

### Database Schema
```sql
-- Questions Collection
- question (text)
- answers (json)
- correct_answers (json)
- category (select: excel, python, pandas)
- sub_category (text)
- level (select: easy, normal, hard, very hard)
- question_type (select: Single Choice, Multiple Choice)
- explanation (text)
- status (select: draft, active, inactive, archived, pending_review, approved, rejected)

-- Quizzes Collection
- title (text)
- description (editor)
- duration_minutes (number)
- questions_list (relation to questions)
- dynamic_config (json)
- start_date (date)
- end_date (date)
- repeat_type (select: Once, Daily, Weekly, Monthly)
- status (select: draft, published, scheduled, active, paused, completed, archived)
- visibility (select: public, private, group, premium)
- is_active (bool)

-- Submissions Collection
- user (relation to users)
- quiz (relation to quizzes)
- score (number)
- total_questions (number)
- started_at (date)
- completed_at (date)
- status (select: started, in_progress, completed, abandoned, timeout, submitted, graded, reviewed)
- attempt_number (number)
- submission_type (select: normal, practice, timed, exam, review)
- submission_data (json)
```

## 🐛 Common Issues & Solutions

### Issue: User Creation Fails
**Error**: `validation_not_unique`
**Solution**: Users already exist, use existing credentials

### Issue: Submission Creation Fails
**Error**: `validation_required`
**Solution**: Check that user and quiz IDs are valid

### Issue: Frontend Won't Start
**Error**: `npm run dev` fails
**Solution**: 
1. Check if dependencies are installed: `npm install`
2. Verify Node.js version: `node --version`
3. Check port 5173 is available

### Issue: PocketBase Won't Start
**Error**: Port 8090 in use
**Solution**: 
1. Check if PocketBase is already running
2. Kill existing process: `taskkill /f /im pocketbase.exe`
3. Restart: `./pocketbase.exe serve`

## 📈 Performance Testing

### Load Testing
- Create multiple users
- Simulate concurrent quiz taking
- Test with large question sets

### Data Volume Testing
- Import 100+ questions
- Create 10+ quizzes
- Generate 50+ submissions

## 🔒 Security Testing

### Authentication
- Test invalid credentials
- Verify role-based access
- Check session management

### Authorization
- Test user permissions
- Verify data isolation
- Check admin privileges

## 📱 Responsive Testing

### Device Testing
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### Browser Testing
- Chrome
- Firefox
- Safari
- Edge

## 🎯 Success Criteria

### Functional Requirements
- [ ] Users can register and login
- [ ] Students can browse and take quizzes
- [ ] Teachers can view student submissions
- [ ] Admins can manage all data
- [ ] Quiz results are calculated correctly
- [ ] Submissions are saved properly

### Non-Functional Requirements
- [ ] Page load time < 3 seconds
- [ ] Quiz submission time < 5 seconds
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility
- [ ] Data integrity maintained

## 📞 Support

### Debug Information
```bash
# Check backend logs
tail -f pb_data/logs/pocketbase.log

# Check frontend logs
# Browser Developer Tools > Console

# Test API endpoints
curl http://localhost:8090/api/collections/questions/records
```

### Contact
- Backend Issues: Check PocketBase admin panel
- Frontend Issues: Check browser console
- Database Issues: Check collection rules and schema
