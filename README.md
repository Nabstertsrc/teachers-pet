# Teacher's Pet — Quick Start Guide

## 🚀 How to Run

Open a terminal (PowerShell or Command Prompt) in the project folder and run:

```bash
# 1. Install all dependencies
npm install

# 2. Start the development server
npm run dev
```

Then open your browser to: **http://localhost:5173**

---

## 📁 Project Structure

```
Teachers pet/
├── .env                  # API keys (Gemini + DeepSeek)
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx           # Router + layout
    ├── styles/
    │   └── globals.css   # Full design system
    ├── lib/
    │   ├── gemini.js     # AI generation (lessons, plans, Q-papers)
    │   ├── voice.js      # Web Speech API
    │   ├── storage.js    # localStorage
    │   └── export.js     # Word (.docx) + PDF + CSV
    ├── context/
    │   ├── AppContext.jsx # Sidebar, toasts
    │   └── VoiceContext.jsx # Voice commands
    ├── components/
    │   ├── Sidebar.jsx
    │   ├── VoiceBar.jsx
    │   └── AIAssistant.jsx
    └── pages/
        ├── Dashboard.jsx
        ├── LessonGenerator.jsx
        ├── AnnualPlan.jsx
        ├── QuestionPaper.jsx
        ├── Timetable.jsx
        ├── Gradebook.jsx
        ├── Resources.jsx
        ├── StudentPortal.jsx
        ├── Todo.jsx
        └── Settings.jsx
```

## 🎙️ Voice Commands (click mic button at bottom)

| Say | Action |
|---|---|
| "Go to dashboard" | Opens dashboard |
| "Open timetable" | Opens timetable |
| "Generate a lesson on [topic] for Grade [N]" | Opens lesson gen prefilled |
| "Create a question paper for [subject]" | Opens Q-paper builder |
| "Add a task: [task description]" | Creates a todo |
| "Read this to me" | Reads current page aloud |
| "Stop" | Stops reading |
| "Reflect on [day/lesson]" | Starts portfolio reflection |
| "Check this: [text]" | Checks Harvard citation & tone |
| "Idea for [topic]" | Generates 5 classroom activities |

---

## 🤖 The Unified Teaching Assistant (Brain)

We've integrated a unified logic system that works across the app and is ready for external integration (Telegram/WhatsApp).

### Commands:
- **`/reflect [notes]`**: Turn messy voice transcripts or daily notes into structured **UNISA IPT Portfolio** reflections.
- **`/check [text]`**: Analyze your academic writing for **UNISA Harvard** referencing and professional tone.
- **`/idea [topic]`**: Instantly generate **5 creative classroom activities** with pedagogical justifications.

### 📱 External Integration (Phase 2 & 3)
To connect this logic to Telegram or WhatsApp as per the plan:
1. **Logic**: The functions in `src/lib/gemini.js` (`generateReflection`, `checkAcademicTone`, `generateClassroomIdeas`) are the "Brain".
2. **Telegram**: Use **Botpress** or **Make.com** to create a bot. Set up a Webhook that calls an API (you'd need to deploy a small backend or use a serverless function) which runs these same prompts.
3. **WhatsApp**: Connect your Botpress/Make logic to the **Meta Cloud API** or **ManyChat**.
