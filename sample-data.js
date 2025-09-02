// sample-data.js
// Insert sample quiz data into PocketBase using the JavaScript SDK
// Run with: node sample-data.js (after installing pocketbase SDK)

/**
 * @typedef {Object} Question
 * @property {string} questions
 * @property {string[]} answers
 * @property {number[]} correct_answers
 * @property {string} category
 * @property {string} sub_category
 * @property {string} level
 * @property {string} question_type
 * @property {string} [explanation]
 */

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

// --- AUTH ---
async function loginAdmin() {
  // Replace with your admin credentials
  await pb.admins.authWithPassword('admin@test.com', 'admin123');
}

// --- SAMPLE DATA ---
const questions = [
  // --- EXCEL (10) ---
  // 4 Easy
  {
    questions: 'What does the SUM function do in Excel?',
    answers: ['Adds numbers', 'Subtracts numbers', 'Multiplies numbers', 'Divides numbers'],
    correct_answers: [0],
    category: 'Excel',
    sub_category: 'Basic Formulas',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'SUM adds all the numbers in a range of cells.'
  },
  {
    questions: 'Which formula calculates the average of a range?',
    answers: ['=SUM()', '=COUNT()', '=AVERAGE()', '=MAX()'],
    correct_answers: [2],
    category: 'Excel',
    sub_category: 'Basic Formulas',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'AVERAGE returns the mean of the selected numbers.'
  },
  {
    questions: 'What does the COUNT function return?',
    answers: ['Sum of values', 'Number of cells with numbers', 'Maximum value', 'Minimum value'],
    correct_answers: [1],
    category: 'Excel',
    sub_category: 'Basic Formulas',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'COUNT returns the number of cells that contain numbers.'
  },
  {
    questions: 'Which function finds the largest value in a range?',
    answers: ['=MIN()', '=MAX()', '=SUM()', '=COUNT()'],
    correct_answers: [1],
    category: 'Excel',
    sub_category: 'Basic Formulas',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'MAX returns the largest value in a range.'
  },
  // 3 Normal
  {
    questions: 'What is the purpose of VLOOKUP in Excel?',
    answers: ['Lookup values vertically', 'Lookup values horizontally', 'Sum values', 'Sort data'],
    correct_answers: [0],
    category: 'Excel',
    sub_category: 'VLOOKUP',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'VLOOKUP searches for a value in the first column and returns a value in the same row.'
  },
  {
    questions: 'Which formula is used for conditional logic?',
    answers: ['=IF()', '=SUMIF()', '=COUNTIF()', '=VLOOKUP()'],
    correct_answers: [0],
    category: 'Excel',
    sub_category: 'IF Statements',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'IF allows you to make logical comparisons between a value and what you expect.'
  },
  {
    questions: 'Which chart is best for showing proportions?',
    answers: ['Pie chart', 'Line chart', 'Bar chart', 'Scatter plot'],
    correct_answers: [0],
    category: 'Excel',
    sub_category: 'Charts',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'Pie charts are ideal for showing proportions of a whole.'
  },
  // 2 Hard
  {
    questions: 'What is a Pivot Table used for?',
    answers: ['Summarizing data', 'Formatting cells', 'Sorting data', 'Creating charts'],
    correct_answers: [0],
    category: 'Excel',
    sub_category: 'Pivot Tables',
    level: 'Hard',
    question_type: 'Single Choice',
    explanation: 'Pivot Tables are used to summarize, analyze, explore, and present data.'
  },
  {
    questions: 'Which feature allows you to restrict data entry in a cell?',
    answers: ['Conditional Formatting', 'Data Validation', 'Pivot Table', 'Goal Seek'],
    correct_answers: [1],
    category: 'Excel',
    sub_category: 'Data Validation',
    level: 'Hard',
    question_type: 'Single Choice',
    explanation: 'Data Validation restricts the type of data or values that users enter into a cell.'
  },
  // 1 Very Hard
  {
    questions: 'Which tool is used to automate repetitive tasks in Excel?',
    answers: ['Macros/VBA', 'Conditional Formatting', 'Data Validation', 'Solver'],
    correct_answers: [0],
    category: 'Excel',
    sub_category: 'Macros',
    level: 'Very Hard',
    question_type: 'Single Choice',
    explanation: 'Macros and VBA are used to automate tasks in Excel.'
  },
  // --- PYTHON (15) ---
  // 6 Easy
  {
    questions: 'Which of the following is a valid variable name in Python?',
    answers: ['2var', 'var_2', 'var-2', 'var 2'],
    correct_answers: [1],
    category: 'Python',
    sub_category: 'Variables',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'Variable names cannot start with a number or contain spaces/hyphens.'
  },
  {
    questions: 'What is the output of print(2 + 3 * 4)?',
    answers: ['20', '14', '24', '9'],
    correct_answers: [1],
    category: 'Python',
    sub_category: 'Operators',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'Multiplication has higher precedence, so 3*4=12, then 2+12=14.'
  },
  {
    questions: 'Which data type is used to store text?',
    answers: ['int', 'float', 'str', 'bool'],
    correct_answers: [2],
    category: 'Python',
    sub_category: 'Data Types',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'str is used for text.'
  },
  {
    questions: 'How do you print "Hello World" in Python?',
    answers: ['echo "Hello World"', 'print("Hello World")', 'printf("Hello World")', 'console.log("Hello World")'],
    correct_answers: [1],
    category: 'Python',
    sub_category: 'Print Statements',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'print() is the correct function.'
  },
  {
    questions: 'Which symbol is used for comments in Python?',
    answers: ['//', '#', '--', '/* */'],
    correct_answers: [1],
    category: 'Python',
    sub_category: 'Syntax',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: '# is used for single-line comments.'
  },
  {
    questions: 'What is the result of bool(0)?',
    answers: ['True', 'False', '0', 'None'],
    correct_answers: [1],
    category: 'Python',
    sub_category: 'Data Types',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'bool(0) is False.'
  },
  // 5 Normal
  {
    questions: 'Which method adds an item to a list?',
    answers: ['add()', 'append()', 'insert()', 'push()'],
    correct_answers: [1],
    category: 'Python',
    sub_category: 'Lists',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'append() adds an item to the end of a list.'
  },
  {
    questions: 'How do you access the value associated with a key in a dictionary?',
    answers: ['dict.key', 'dict[key]', 'dict->key', 'dict::key'],
    correct_answers: [1],
    category: 'Python',
    sub_category: 'Dictionaries',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'dict[key] accesses the value.'
  },
  {
    questions: 'Which loop is used to iterate over a sequence?',
    answers: ['for', 'while', 'do-while', 'foreach'],
    correct_answers: [0],
    category: 'Python',
    sub_category: 'Loops',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'for loop is used for sequences.'
  },
  {
    questions: 'How do you define a function in Python?',
    answers: ['function myFunc()', 'def myFunc():', 'func myFunc()', 'define myFunc()'],
    correct_answers: [1],
    category: 'Python',
    sub_category: 'Functions',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'def is used to define a function.'
  },
  {
    questions: 'Which of the following is a valid list declaration?',
    answers: ['list = [1,2,3]', 'list = (1,2,3)', 'list = {1,2,3}', 'list = <1,2,3>'],
    correct_answers: [0],
    category: 'Python',
    sub_category: 'Lists',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: '[] is used for lists.'
  },
  // 3 Hard
  // Skipped: 'Multiple Choice' not allowed by schema, so this question will not be inserted.
  {
    questions: 'How do you handle exceptions in Python?',
    answers: ['try/except', 'catch/except', 'try/catch', 'handle/except'],
    correct_answers: [0],
    category: 'Python',
    sub_category: 'Exception Handling',
    level: 'Hard',
    question_type: 'Single Choice',
    explanation: 'try/except is the correct syntax.'
  },
  {
    questions: 'Which keyword is used to define a class?',
    answers: ['function', 'def', 'class', 'object'],
    correct_answers: [2],
    category: 'Python',
    sub_category: 'Classes',
    level: 'Hard',
    question_type: 'Single Choice',
    explanation: 'class is used to define a class.'
  },
  // 1 Very Hard
  {
    questions: 'What is a Python decorator?',
    answers: ['A function that modifies another function', 'A type of loop', 'A class method', 'A variable'],
    correct_answers: [0],
    category: 'Python',
    sub_category: 'Decorators',
    level: 'Very Hard',
    question_type: 'Single Choice',
    explanation: 'A decorator is a function that takes another function and extends its behavior.'
  },
  // --- PANDAS (10) ---
  // 4 Easy
  {
    questions: 'How do you create a DataFrame in pandas?',
    answers: ['pd.DataFrame()', 'pd.Series()', 'pd.Table()', 'pd.List()'],
    correct_answers: [0],
    category: 'Pandas',
    sub_category: 'DataFrame Creation',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'pd.DataFrame() creates a DataFrame.'
  },
  {
    questions: 'Which method returns the first 5 rows of a DataFrame?',
    answers: ['head()', 'tail()', 'first()', 'top()'],
    correct_answers: [0],
    category: 'Pandas',
    sub_category: 'Indexing',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'head() returns the first 5 rows.'
  },
  // Skipped: 'Multiple Choice' not allowed by schema, so this question will not be inserted.
  {
    questions: 'Which method returns the last 5 rows of a DataFrame?',
    answers: ['tail()', 'head()', 'last()', 'bottom()'],
    correct_answers: [0],
    category: 'Pandas',
    sub_category: 'Indexing',
    level: 'Easy',
    question_type: 'Single Choice',
    explanation: 'tail() returns the last 5 rows.'
  },
  // 3 Normal
  {
    questions: 'How do you filter rows in pandas?',
    answers: ['Using boolean indexing', 'Using SQL queries', 'Using for loops', 'Using map()'],
    correct_answers: [0],
    category: 'Pandas',
    sub_category: 'Filtering',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'Boolean indexing is the standard way to filter rows.'
  },
  {
    questions: 'Which method groups data in pandas?',
    answers: ['groupby()', 'aggregate()', 'split()', 'merge()'],
    correct_answers: [0],
    category: 'Pandas',
    sub_category: 'GroupBy',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'groupby() is used to group data.'
  },
  {
    questions: 'Which operation calculates the mean of a column?',
    answers: ['mean()', 'sum()', 'count()', 'max()'],
    correct_answers: [0],
    category: 'Pandas',
    sub_category: 'Basic Operations',
    level: 'Normal',
    question_type: 'Single Choice',
    explanation: 'mean() calculates the average.'
  },
  // 2 Hard
  {
    questions: 'What is a MultiIndex in pandas?',
    answers: ['Multiple columns as index', 'Multiple DataFrames', 'Multiple rows', 'Multiple files'],
    correct_answers: [0],
    category: 'Pandas',
    sub_category: 'MultiIndex',
    level: 'Hard',
    question_type: 'Single Choice',
    explanation: 'MultiIndex allows multiple columns to be used as the index.'
  },
  {
    questions: 'Which method pivots data in pandas?',
    answers: ['pivot()', 'melt()', 'stack()', 'unstack()'],
    correct_answers: [0],
    category: 'Pandas',
    sub_category: 'Pivot',
    level: 'Hard',
    question_type: 'Single Choice',
    explanation: 'pivot() reshapes data based on column values.'
  },
  // 1 Very Hard
  {
    questions: 'Which method is best for optimizing performance with large DataFrames?',
    answers: ['apply()', 'vectorized operations', 'for loops', 'manual iteration'],
    correct_answers: [1],
    category: 'Pandas',
    sub_category: 'Performance',
    level: 'Very Hard',
    question_type: 'Single Choice',
    explanation: 'Vectorized operations are much faster than loops.'
  }
];

async function insertQuestions() {
  for (const q of questions) {
    try {
      await pb.collection('questions').create(q);
      console.log('Inserted:', q.questions);
    } catch (e) {
      console.error('Error inserting:', q.questions, e.data || e.message);
    }
  }
}

(async () => {
  await loginAdmin();
  await insertQuestions();
  console.log('Sample data insertion complete.');
})();
