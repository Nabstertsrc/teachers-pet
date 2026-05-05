import { db } from './db'

// ===== Local Storage Migration / Simple Keys =====
const PREFIX = 'tp_'
const local = {
  get: (key, fallback = null) => {
    try { const v = localStorage.getItem(PREFIX + key); return v ? JSON.parse(v) : fallback } catch { return fallback }
  },
  set: (key, value) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch (e) { console.error('Storage error', e) }
  },
}

// ===== DATABASE WRAPPERS (Async) =====

// Lessons
export const getLessons = () => db.lessons.reverse().toArray()
export const addLesson = async (lesson) => {
  const id = await db.lessons.add({ ...lesson, createdAt: new Date().toISOString() })
  return { ...lesson, id }
}
export const deleteLesson = (id) => db.lessons.delete(id)

// Annual Plans
export const getAnnualPlans = () => db.annualPlans.reverse().toArray()
export const saveAnnualPlan = async (plan) => {
  const id = await db.annualPlans.add({ ...plan, createdAt: new Date().toISOString() })
  return { ...plan, id }
}
export const deleteAnnualPlan = (id) => db.annualPlans.delete(id)

// Question Papers
export const getQuestionPapers = () => db.questionPapers.reverse().toArray()
export const saveQuestionPaper = async (paper) => {
  const id = await db.questionPapers.add({ ...paper, createdAt: new Date().toISOString() })
  return { ...paper, id }
}
export const deleteQuestionPaper = (id) => db.questionPapers.delete(id)

// Timetable (Still stored in settings/local for simplicity or a dedicated table)
export const getTimetable = () => local.get('timetable', {})
export const saveTimetable = (tt) => local.set('timetable', tt)

// Gradebook
export const getGradebook = async () => (await db.gradebook.toArray())[0] || { classes: [] }
export const saveGradebook = async (gb) => {
  const existing = await db.gradebook.toArray()
  if (existing.length > 0) {
    await db.gradebook.update(existing[0].id, gb)
  } else {
    await db.gradebook.add(gb)
  }
}

// Todos
export const getTodos = () => db.todos.reverse().toArray()
export const addTodo = async (todo) => {
  const id = await db.todos.add({ ...todo, completed: false, createdAt: new Date().toISOString() })
  return { ...todo, id }
}
export const saveTodos = async (todos) => {
  // Bulk update or clear and add? Dexie is better with individual operations or collection.put
  await db.todos.clear()
  await db.todos.bulkAdd(todos)
}

// Resources
export const getResources = () => db.resources.reverse().toArray()
export const addResource = async (resource) => {
  const id = await db.resources.add({ ...resource, createdAt: new Date().toISOString() })
  return { ...resource, id }
}
export const saveResources = async (resources) => {
  await db.resources.clear()
  await db.resources.bulkAdd(resources)
}

// Settings (Singleton)
export const getSettings = async () => {
  const s = await db.settings.get('current')
  return s || {
    schoolName: 'My School',
    teacherName: '',
    curriculum: 'CAPS',
    darkMode: true,
    voiceEnabled: true,
    fontSize: 'medium',
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    deepseekKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  }
}
export const saveSettings = async (s) => {
  localStorage.setItem('tp_settings', JSON.stringify(s))
  return await db.settings.put({ ...s, id: 'current' })
}

// Student Notes
export const getStudentNotes = () => db.studentNotes.reverse().toArray()
export const saveStudentNote = async (note) => {
  const id = await db.studentNotes.add({ ...note, createdAt: new Date().toISOString() })
  return { ...note, id }
}

// Attendance
export const getAttendance = () => db.attendance.reverse().toArray()
export const saveAttendance = async (records) => {
  await db.attendance.clear()
  await db.attendance.bulkAdd(records)
}

