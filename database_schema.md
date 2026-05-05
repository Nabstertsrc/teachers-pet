# Unified Database Schema

This document defines the data structures used in "Teachers Pet". The schema is designed to be compatible with **IndexedDB (via Dexie)** for local storage, **Firestore** for NoSQL cloud storage, and **PostgreSQL** for relational cloud storage (Supabase).

## Core Entities

### 1. Lessons (`lessons`)
Stores AI-generated lesson plans.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (UUID) | Unique identifier |
| `userId` | String | Owner ID (for cloud sync) |
| `title` | String | Title of the lesson |
| `subject` | String | Subject area |
| `grade` | String | Target grade |
| `topic` | String | Specific topic |
| `content` | Text / JSON | The generated lesson content |
| `createdAt` | ISO Date | Creation timestamp |
| `updatedAt` | ISO Date | Last modified timestamp |

---

### 2. Question Papers (`questionPapers`)
Stores exam papers and memorandums.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (UUID) | Unique identifier |
| `userId` | String | Owner ID |
| `subject` | String | Subject |
| `grade` | String | Grade |
| `topic` | String | Topic |
| `examType` | String | e.g., "Test", "Exam" |
| `totalMarks` | Number | Max marks |
| `difficulty` | String | easy, medium, hard, mixed |
| `content` | Text / JSON | Paper content (Markdown/HTML) |
| `includeAnswers`| Boolean | If memorandum is included |
| `createdAt` | ISO Date | Timestamp |

---

### 3. Gradebook (`gradebook`)
Stores student marks and class data.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (UUID) | Unique identifier |
| `userId` | String | Owner ID |
| `className` | String | Name of the class |
| `students` | Array / JSON | List of students and their marks |
| `updatedAt` | ISO Date | Last sync |

---

### 4. Settings (`settings`)
Application-wide preferences.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Usually "current" or `userId` |
| `schoolName` | String | Display name for exports |
| `teacherName` | String | Teacher name |
| `curriculum` | String | e.g., "CAPS", "IEB" |
| `darkMode` | Boolean | UI preference |
| `apiKeys` | JSON | Encrypted or local-only keys |

---

## Cloud Integration Mapping

### Firebase (Firestore)
- **Collections**: Use the entity names above as collection names.
- **Documents**: Each record is a document. Use `userId` as a field for security rules.
- **Sub-collections**: For complex entities like `gradebook`, `students` could be a sub-collection.

### Supabase (PostgreSQL)
- **Tables**: Create tables with the specified fields.
- **Relationships**: Use `userId` as a foreign key to a `profiles` table.
- **RLS**: Enable Row Level Security using `auth.uid()`.

```sql
-- Example Supabase Table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  subject TEXT,
  grade TEXT,
  topic TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
