export default function About() {
  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">About Teacher&apos;s Pet</h1>
          <p className="page-subtitle">Professional teaching and learning workspace for planning, delivery, and support.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Platform Overview</h3>
          <p style={{ marginTop: 8 }}>
            Teacher&apos;s Pet combines lesson planning, assessment generation, learner labs, and productivity tooling in one
            workspace designed for classroom reality and curriculum alignment.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>Curriculum and lesson design support</li>
            <li>Assessment and rubric authoring workflows</li>
            <li>Student hub with interactive subject labs</li>
            <li>Career, communication, and admin utilities</li>
          </ul>
        </div>

        <div className="card">
          <h3>AI & Reliability</h3>
          <p style={{ marginTop: 8 }}>
            The app supports Gemini and DeepSeek providers, with resilient fallbacks for key learner and teacher flows if
            provider calls fail.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>Provider failover and retry strategy</li>
            <li>Offline-safe fallback outputs for core labs</li>
            <li>Local caching for generated learning artifacts</li>
            <li>Adaptive progression tracking per subject and grade</li>
          </ul>
        </div>

        <div className="card">
          <h3>Privacy & Data</h3>
          <p style={{ marginTop: 8 }}>
            Teacher and learner data is stored locally in-browser by default. API keys are user-managed from Settings.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>Local-first storage design</li>
            <li>No required backend user account</li>
            <li>Clear data controls in Settings</li>
          </ul>
        </div>

        <div className="card">
          <h3>Release Notes</h3>
          <p style={{ marginTop: 8 }}>
            Current release includes upgraded professional navigation, improved AI error resilience, and advanced SVG-based
            science/geography learning experiences.
          </p>
          <div className="card-glass" style={{ marginTop: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Version</div>
            <div>v1.2 Professional</div>
          </div>
        </div>
      </div>
    </div>
  )
}
