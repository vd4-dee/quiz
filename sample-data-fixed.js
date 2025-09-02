// sample-data-fixed.js
// Insert sample quiz data into PocketBase using the JavaScript SDK
// Run with: node sample-data-fixed.js (after installing pocketbase SDK)

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
    category: 'excel',
    sub_category: 'Basic Formulas',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'SUM adds all the numbers in a range of cells.'
  },
  {
    questions: 'Which formula calculates the average of a range?',
    answers: ['=SUM()', '=COUNT()', '=AVERAGE()', '=MAX()'],
    correct_answers: [2],
    category: 'excel',
    sub_category: 'Basic Formulas',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'AVERAGE returns the mean of the selected numbers.'
  },
  {
    questions: 'What does the COUNT function return?',
    answers: ['Sum of values', 'Number of cells with numbers', 'Maximum value', 'Minimum value'],
    correct_answers: [1],
    category: 'excel',
    sub_category: 'Basic Formulas',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'COUNT returns the number of cells that contain numbers.'
  },
  {
    questions: 'Which function finds the largest value in a range?',
    answers: ['=MIN()', '=MAX()', '=SUM()', '=COUNT()'],
    correct_answers: [1],
    category: 'excel',
    sub_category: 'Basic Formulas',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'MAX returns the largest value in a range.'
  },
  // 3 Normal
  {
    questions: 'What is the purpose of VLOOKUP in Excel?',
    answers: ['Lookup values vertically', 'Lookup values horizontally', 'Sum values', 'Sort data'],
    correct_answers: [0],
    category: 'excel',
    sub_category: 'VLOOKUP',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'VLOOKUP searches for a value in the first column and returns a value in the same row.'
  },
  {
    questions: 'Which formula is used for conditional logic?',
    answers: ['=IF()', '=SUMIF()', '=COUNTIF()', '=VLOOKUP()'],
    correct_answers: [0],
    category: 'excel',
    sub_category: 'IF Statements',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'IF allows you to make logical comparisons between a value and what you expect.'
  },
  {
    questions: 'Which chart is best for showing proportions?',
    answers: ['Pie chart', 'Line chart', 'Bar chart', 'Scatter plot'],
    correct_answers: [0],
    category: 'excel',
    sub_category: 'Charts',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'Pie charts are ideal for showing proportions of a whole.'
  },
  // 2 Hard
  {
    questions: 'What is a Pivot Table used for?',
    answers: ['Data summarization', 'Data entry', 'Data formatting', 'Data validation'],
    correct_answers: [0],
    category: 'excel',
    sub_category: 'Pivot Tables',
    level: 'hard',
    question_type: 'Single Choice',
    explanation: 'Pivot Tables summarize and analyze large amounts of data.'
  },
  {
    questions: 'Which feature allows you to restrict data entry in a cell?',
    answers: ['Data Validation', 'Conditional Formatting', 'Data Filter', 'Data Sort'],
    correct_answers: [0],
    category: 'excel',
    sub_category: 'Data Validation',
    level: 'hard',
    question_type: 'Single Choice',
    explanation: 'Data Validation restricts what can be entered in a cell.'
  },
  // 1 Very Hard
  {
    questions: 'Which tool is used to automate repetitive tasks in Excel?',
    answers: ['Macros', 'Pivot Tables', 'Charts', 'Formulas'],
    correct_answers: [0],
    category: 'excel',
    sub_category: 'Macros',
    level: 'very hard',
    question_type: 'Single Choice',
    explanation: 'Macros automate repetitive tasks using VBA code.'
  },

  // --- PYTHON (15) ---
  // 6 Easy
  {
    questions: 'Which of the following is a valid variable name in Python?',
    answers: ['2variable', 'my-variable', 'my_variable', 'class'],
    correct_answers: [2],
    category: 'python',
    sub_category: 'Variables',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'Variable names can contain letters, numbers, and underscores, but cannot start with a number.'
  },
  {
    questions: 'What is the output of print(2 + 3 * 4)?',
    answers: ['20', '14', '24', 'Error'],
    correct_answers: [1],
    category: 'python',
    sub_category: 'Operators',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'Multiplication has higher precedence than addition: 2 + (3 * 4) = 2 + 12 = 14.'
  },
  {
    questions: 'Which data type is used to store text?',
    answers: ['int', 'float', 'str', 'bool'],
    correct_answers: [2],
    category: 'python',
    sub_category: 'Data Types',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'str (string) is used to store text data.'
  },
  {
    questions: 'How do you print "Hello World" in Python?',
    answers: ['print("Hello World")', 'echo "Hello World"', 'console.log("Hello World")', 'printf("Hello World")'],
    correct_answers: [0],
    category: 'python',
    sub_category: 'Print Function',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'print() is the function used to output text in Python.'
  },
  {
    questions: 'Which symbol is used for comments in Python?',
    answers: ['//', '/*', '#', '--'],
    correct_answers: [2],
    category: 'python',
    sub_category: 'Comments',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'The # symbol is used for single-line comments in Python.'
  },
  {
    questions: 'What is the result of bool(0)?',
    answers: ['True', 'False', 'Error', 'None'],
    correct_answers: [1],
    category: 'python',
    sub_category: 'Boolean',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: '0 is considered False in boolean context.'
  },
  // 5 Normal
  {
    questions: 'Which method adds an item to a list?',
    answers: ['add()', 'append()', 'insert()', 'push()'],
    correct_answers: [1],
    category: 'python',
    sub_category: 'Lists',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'append() adds an item to the end of a list.'
  },
  {
    questions: 'How do you access the value associated with a key in a dictionary?',
    answers: ['dict.get(key)', 'dict[key]', 'dict.find(key)', 'dict.access(key)'],
    correct_answers: [1],
    category: 'python',
    sub_category: 'Dictionaries',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'Square bracket notation is used to access dictionary values.'
  },
  {
    questions: 'Which loop is used to iterate over a sequence?',
    answers: ['for', 'while', 'do-while', 'repeat'],
    correct_answers: [0],
    category: 'python',
    sub_category: 'Loops',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'for loops are used to iterate over sequences like lists, tuples, or strings.'
  },
  {
    questions: 'How do you define a function in Python?',
    answers: ['function name():', 'def name():', 'func name():', 'define name():'],
    correct_answers: [1],
    category: 'python',
    sub_category: 'Functions',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'The def keyword is used to define functions in Python.'
  },
  {
    questions: 'Which of the following is a valid list declaration?',
    answers: ['list = [1, 2, 3]', 'list = (1, 2, 3)', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
    correct_answers: [0],
    category: 'python',
    sub_category: 'Lists',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'Lists are created using square brackets [].'
  },
  // 3 Hard
  {
    questions: 'How do you handle exceptions in Python?',
    answers: ['try-catch', 'try-except', 'try-finally', 'try-rescue'],
    correct_answers: [1],
    category: 'python',
    sub_category: 'Exception Handling',
    level: 'hard',
    question_type: 'Single Choice',
    explanation: 'Python uses try-except blocks for exception handling.'
  },
  {
    questions: 'Which keyword is used to define a class?',
    answers: ['class', 'def', 'function', 'object'],
    correct_answers: [0],
    category: 'python',
    sub_category: 'Classes',
    level: 'hard',
    question_type: 'Single Choice',
    explanation: 'The class keyword is used to define classes in Python.'
  },
  {
    questions: 'What is a Python decorator?',
    answers: ['A function that modifies another function', 'A type of variable', 'A loop construct', 'A data structure'],
    correct_answers: [0],
    category: 'python',
    sub_category: 'Decorators',
    level: 'very hard',
    question_type: 'Single Choice',
    explanation: 'Decorators are functions that modify the behavior of other functions.'
  },

  // --- PANDAS (10) ---
  // 4 Easy
  {
    questions: 'How do you create a DataFrame in pandas?',
    answers: ['pd.DataFrame()', 'df.create()', 'pandas.DataFrame()', 'create_df()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'DataFrame Creation',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'pd.DataFrame() is the standard way to create a DataFrame.'
  },
  {
    questions: 'Which method returns the first 5 rows of a DataFrame?',
    answers: ['head()', 'tail()', 'first()', 'top()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Indexing',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'head() returns the first 5 rows.'
  },
  {
    questions: 'Which method returns the last 5 rows of a DataFrame?',
    answers: ['tail()', 'head()', 'last()', 'bottom()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Indexing',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'tail() returns the last 5 rows.'
  },
  {
    questions: 'How do you filter rows in pandas?',
    answers: ['Using boolean indexing', 'Using SQL queries', 'Using for loops', 'Using map()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Filtering',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'Boolean indexing is the standard way to filter rows.'
  },
  // 3 Normal
  {
    questions: 'Which method groups data in pandas?',
    answers: ['groupby()', 'aggregate()', 'split()', 'merge()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'GroupBy',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'groupby() is used to group data.'
  },
  {
    questions: 'Which operation calculates the mean of a column?',
    answers: ['mean()', 'sum()', 'count()', 'max()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Basic Operations',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'mean() calculates the average.'
  },
  {
    questions: 'What is a MultiIndex in pandas?',
    answers: ['Multiple columns as index', 'Multiple DataFrames', 'Multiple rows', 'Multiple files'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'MultiIndex',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'MultiIndex allows multiple columns to be used as the index.'
  },
  // 2 Hard
  {
    questions: 'Which method pivots data in pandas?',
    answers: ['pivot()', 'melt()', 'stack()', 'unstack()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Pivot',
    level: 'hard',
    question_type: 'Single Choice',
    explanation: 'pivot() reshapes data based on column values.'
  },
  {
    questions: 'Which method is best for optimizing performance with large DataFrames?',
    answers: ['apply()', 'vectorized operations', 'for loops', 'manual iteration'],
    correct_answers: [1],
    category: 'pandas',
    sub_category: 'Performance',
    level: 'very hard',
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
