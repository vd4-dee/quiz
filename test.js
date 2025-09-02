// sample-data-vn.js
// Thêm câu hỏi pandas tiếng Việt vào PocketBase
// Chạy với: node sample-data-vn.js (sau khi cài đặt pocketbase SDK)

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

// --- AUTH ---
async function loginAdmin() {
  // Thay thế bằng thông tin admin của bạn
  await pb.admins.authWithPassword('admin@test.com', 'admin123');
}

// --- CÂUHỎI PANDAS TIẾNG VIỆT ---
const vietnamesePandasQuestions = [
  // --- 4 câu dễ ---
  {
    questions: 'Làm thế nào để tạo một DataFrame trong pandas?',
    answers: ['pd.DataFrame()', 'pd.Series()', 'pd.Table()', 'pd.Array()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Tạo DataFrame',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'pd.DataFrame() là hàm chuẩn để tạo một DataFrame mới trong pandas.'
  },
  {
    questions: 'Phương thức nào trả về 5 dòng đầu tiên của DataFrame?',
    answers: ['head()', 'tail()', 'top()', 'first()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Xem dữ liệu',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'head() mặc định trả về 5 dòng đầu tiên của DataFrame.'
  },
  {
    questions: 'Phương thức nào để xem thông tin tổng quan về DataFrame?',
    answers: ['info()', 'describe()', 'summary()', 'overview()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Thông tin DataFrame',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'info() cung cấp thông tin về kiểu dữ liệu, số lượng giá trị non-null và memory usage.'
  },
  {
    questions: 'Làm thế nào để chọn một cột trong DataFrame?',
    answers: ['df.column_name', 'df[column_name]', 'df->column_name', 'df::column_name'],
    correct_answers: [1],
    category: 'pandas',
    sub_category: 'Chọn dữ liệu',
    level: 'easy',
    question_type: 'Single Choice',
    explanation: 'df[column_name] là cách chuẩn để chọn một cột từ DataFrame.'
  },

  // --- 3 câu trung bình ---
  {
    questions: 'Làm thế nào để lọc dữ liệu trong pandas dựa trên điều kiện?',
    answers: ['Sử dụng boolean indexing', 'Sử dụng SQL queries', 'Sử dụng vòng lặp for', 'Sử dụng hàm filter()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Lọc dữ liệu',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'Boolean indexing là phương pháp chuẩn để lọc dữ liệu dựa trên điều kiện trong pandas.'
  },
  {
    questions: 'Phương thức nào để gộp nhóm dữ liệu trong pandas?',
    answers: ['groupby()', 'merge()', 'join()', 'concat()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Nhóm dữ liệu',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'groupby() được sử dụng để nhóm dữ liệu theo một hoặc nhiều cột.'
  },
  {
    questions: 'Làm thế nào để xử lý giá trị null trong pandas?',
    answers: ['dropna() hoặc fillna()', 'remove() hoặc replace()', 'delete() hoặc substitute()', 'clear() hoặc update()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Xử lý Missing Data',
    level: 'normal',
    question_type: 'Single Choice',
    explanation: 'dropna() loại bỏ các dòng/cột có giá trị null, fillna() điền giá trị vào chỗ null.'
  },

  // --- 2 câu khó ---
  {
    questions: 'MultiIndex trong pandas được sử dụng để làm gì?',
    answers: ['Tạo index từ nhiều cột', 'Kết hợp nhiều DataFrame', 'Tạo nhiều cột mới', 'Chia DataFrame thành nhiều phần'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'MultiIndex',
    level: 'hard',
    question_type: 'Single Choice',
    explanation: 'MultiIndex cho phép sử dụng nhiều cột làm index, tạo cấu trúc dữ liệu phân cấp.'
  },
  {
    questions: 'Phương thức nào để chuyển đổi dữ liệu từ dạng wide sang long format?',
    answers: ['melt()', 'pivot()', 'stack()', 'reshape()'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Reshape Data',
    level: 'hard',
    question_type: 'Single Choice',
    explanation: 'melt() chuyển đổi DataFrame từ wide format sang long format bằng cách unpivot columns.'
  },

  // --- 1 câu rất khó ---
  {
    questions: 'Để tối ưu hiệu suất khi làm việc với DataFrame lớn, nên sử dụng phương pháp nào?',
    answers: ['Vectorized operations và avoid loops', 'Sử dụng nhiều vòng lặp for', 'Chia nhỏ DataFrame thành nhiều phần', 'Sử dụng apply() cho mọi thao tác'],
    correct_answers: [0],
    category: 'pandas',
    sub_category: 'Tối ưu hiệu suất',
    level: 'very hard',
    question_type: 'Single Choice',
    explanation: 'Vectorized operations tận dụng NumPy backend của pandas, nhanh hơn nhiều so với Python loops thông thường.'
  }
];

async function insertVietnameseQuestions() {
  console.log('Bắt đầu thêm câu hỏi pandas tiếng Việt...');
  
  for (const q of vietnamesePandasQuestions) {
    try {
      await pb.collection('questions').create(q);
      console.log('✅ Đã thêm:', q.questions.substring(0, 50) + '...');
    } catch (e) {
      console.error('❌ Lỗi khi thêm:', q.questions.substring(0, 30) + '...', e.data || e.message);
    }
  }
}

// --- MAIN EXECUTION ---
(async () => {
  try {
    console.log('🔑 Đang đăng nhập admin...');
    await loginAdmin();
    console.log('✅ Đăng nhập thành công!');
    
    await insertVietnameseQuestions();
    
    console.log('\n📊 Tóm tắt:');
    console.log(`- Tổng số câu hỏi: ${vietnamesePandasQuestions.length}`);
    console.log('- Phân bố độ khó:');
    console.log('  + Dễ: 4 câu');
    console.log('  + Trung bình: 3 câu'); 
    console.log('  + Khó: 2 câu');
    console.log('  + Rất khó: 1 câu');
    console.log('- Danh mục: pandas');
    console.log('- Ngôn ngữ: Tiếng Việt');
    
    console.log('\n🎉 Hoàn thành việc thêm câu hỏi pandas tiếng Việt!');
  } catch (error) {
    console.error('💥 Lỗi:', error.message);
  }
})();