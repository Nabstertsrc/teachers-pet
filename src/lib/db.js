import Dexie from 'dexie';

export const db = new Dexie('TeachersPetDB');

// Schema definition for local storage (IndexedDB)
// The fields after ++id are indexed for faster searching.
db.version(3).stores({
  lessons: '++id, userId, subject, grade, topic, createdAt',
  questionPapers: '++id, userId, subject, grade, topic, examType, createdAt',
  annualPlans: '++id, userId, subject, grade, createdAt',
  gradebook: '++id, userId, className',
  todos: '++id, userId, completed, createdAt',
  resources: '++id, userId, type, createdAt',
  studentNotes: '++id, userId, studentName, createdAt',
  attendance: '++id, userId, className, date',
  settings: 'id', // 'current' will be the id
  schoolProfile: 'id', // 'current' will be the id
  qms: '++id, userId, type, date',
  interventions: '++id, userId, studentId, date',
  lab_content: '++id, labType, grade, generatedAt'
});

/**
 * DATABASE SCHEMA FOR CLOUD INTEGRATION (Firebase/Supabase)
 * 
 * To integrate with Firebase Firestore or Supabase PostgreSQL:
 * 
 * 1. Lessons: { id, userId, title, subject, grade, topic, content, createdAt, updatedAt }
 * 2. QuestionPapers: { id, userId, subject, grade, topic, examType, totalMarks, difficulty, content, createdAt }
 * 3. Todos: { id, userId, task, completed, createdAt }
 * 4. Settings: { userId, schoolName, teacherName, curriculum, darkMode, ... }
 * 
 * In Firestore, use userId as a top-level field for Security Rules.
 * In Supabase, use Row Level Security (RLS) with auth.uid() = user_id.
 */
