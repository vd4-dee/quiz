# PocketBase Collections Setup for Quiz System

## Step-by-Step: Create Collections in Admin UI

### 1. Login to PocketBase Admin UI
- Go to http://localhost:8090/_/ and login as admin.

### 2. Create Collection: `questions`
- Name: `questions`
- Fields:
  - `question` (Text, required, min: 10 chars)
  - `answers` (JSON, required)
  - `correct_answers` (JSON, required)
  - `category` (Select, required, options: Excel, Python, Pandas)
  - `sub_category` (Text, optional)
  - `level` (Select, required, options: Easy, Normal, Hard, Very Hard)
  - `question_type` (Select, required, options: Yes/No, Single Choice, Multiple Choice)
  - `explanation` (Editor, optional)
- API Rules:
  - List/View/Create/Update/Delete: admin only

### 3. Create Collection: `quizzes`
- Name: `quizzes`
- Fields:
  - `title` (Text, required, min: 5, max: 100)
  - `description` (Editor, optional)
  - `duration_minutes` (Number, required, min: 5, max: 180)
  - `questions_list` (Relation, multiple, to: questions)
  - `dynamic_config` (JSON, optional)
  - `start_date` (Datetime, optional)
  - `end_date` (Datetime, optional)
  - `repeat_type` (Select, options: Once, Daily, Weekly, Monthly, default: Once)
  - `is_active` (Bool, default: true)
- API Rules:
  - List/View: authenticated users
  - Create/Update/Delete: admin only

### 4. Create Collection: `submissions`
- Name: `submissions`
- Fields:
  - `user` (Relation, required, to: users)
  - `quiz` (Relation, required, to: quizzes)
  - `score` (Number, min: 0, max: 100)
  - `total_questions` (Number, min: 1)
  - `started_at` (Datetime, required)
  - `completed_at` (Datetime, optional)
  - `submission_data` (JSON, required)
- API Rules:
  - List/View: owner or admin
  - Create: authenticated users
  - Update: nobody
  - Delete: admin only

## Exporting Schema
- After setup, use the Admin UI "Export Collections" feature to save a JSON backup.

## API Rules Configuration
- Set API rules in the "API Rules" tab for each collection as described above.

---

For full JSON schema export, use the Admin UI after creating all collections.
