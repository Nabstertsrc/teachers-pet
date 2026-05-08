import { useState } from 'react'

const INSTITUTIONS = [
  {
    name: "University of Pretoria (UP)",
    type: "University",
    location: "Pretoria, Gauteng",
    openingDate: "May",
    closingDate: "September 30",
    semesters: "Feb–Jun | Jul–Nov",
    link: "https://www.up.ac.za/online-application",
    tips: "Focus on your Grade 11 results for early admission. UP is known for its strong Veterinary and Engineering programs.",
    color: "#004B87"
  },
  {
    name: "University of Cape Town (UCT)",
    type: "University",
    location: "Cape Town, Western Cape",
    openingDate: "April",
    closingDate: "August 31",
    semesters: "Feb–Jun | Jul–Nov",
    link: "https://applyonline.uct.ac.za/",
    tips: "Highest ranked university in Africa. NBTs (National Benchmark Tests) are often a requirement here.",
    color: "#003366"
  },
  {
    name: "University of the Witwatersrand (Wits)",
    type: "University",
    location: "Johannesburg, Gauteng",
    openingDate: "May",
    closingDate: "September 30",
    semesters: "Feb–Jun | Jul–Nov",
    link: "https://www.wits.ac.za/applications/",
    tips: "Excellent for Health Sciences and Mining Engineering. Located in the heart of Jozi.",
    color: "#003B5C"
  },
  {
    name: "University of Johannesburg (UJ)",
    type: "University",
    location: "Johannesburg, Gauteng",
    openingDate: "April",
    closingDate: "September 30",
    semesters: "Feb–Jun | Jul–Nov",
    link: "https://www.uj.ac.za/admission-aid/undergraduate/",
    tips: "UJ offers a 'No Application Fee' policy for online applications. Very tech-forward campus.",
    color: "#FF6600"
  },
  {
    name: "Stellenbosch University (SU)",
    type: "University",
    location: "Stellenbosch, Western Cape",
    openingDate: "March",
    closingDate: "July 31 (Programs vary)",
    semesters: "Feb–Jun | Jul–Nov",
    link: "https://student.sun.ac.za/erecruit/welcome.jsp",
    tips: "Early applications are critical. Great research facilities and a beautiful campus environment.",
    color: "#7F0031"
  },
  {
    name: "UNISA",
    type: "Distance Learning",
    location: "National (Online)",
    openingDate: "August / January",
    closingDate: "September / February",
    semesters: "Jan–Jun | Jul–Nov",
    link: "https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission",
    tips: "Perfect for working students. You must be self-disciplined as it's 100% distance learning.",
    color: "#000000"
  },
  {
    name: "North-West University (NWU)",
    type: "University",
    location: "Potchefstroom / Mahikeng / Vaal",
    openingDate: "March",
    closingDate: "September 30",
    semesters: "Feb–Jun | Jul–Nov",
    link: "https://studies.nwu.ac.za/studies/apply",
    tips: "Known for its vibrant student life and strong focus on community engagement.",
    color: "#6D226A"
  },
  {
    name: "Tshwane University of Technology (TUT)",
    type: "Technikon / UoT",
    location: "Pretoria / Soshanguve / Ga-Rankuwa",
    openingDate: "May",
    closingDate: "September 30",
    semesters: "Feb–Jun | Jul–Nov",
    link: "https://www.tut.ac.za/admissions/apply",
    tips: "Focuses on practical, vocational training. Great for Art, Design, and Engineering Technology.",
    color: "#E31B23"
  }
]

const STUDY_TIPS = [
  { title: "Time Management", desc: "Use a planner or the 'Auto-Organizer' in this app to schedule your study sessions." },
  { title: "Active Recall", desc: "Test yourself frequently rather than just re-reading notes. Use our 'AI Flashcards'!" },
  { title: "Healthy Habits", desc: "Sleep at least 7-8 hours. A tired brain cannot retain information effectively." },
  { title: "Pomodoro Technique", desc: "Study for 25 minutes, then take a 5-minute break. It keeps your mind fresh." },
  { title: "Past Papers", desc: "Practice with past exam papers to understand the questioning style. Use our 'Question Paper Builder' for practice sets." }
]

export default function Institutions() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredInstitutions = INSTITUTIONS.filter(inst => 
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">🏛️ Universities & Colleges</h1>
          <p className="page-subtitle">Track application dates, semesters, and get tips for your tertiary studies.</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #0078D4, #00B7C3)', color: 'white' }}>
          <h4 style={{ margin: 0, opacity: 0.9 }}>Current Status</h4>
          <h2 style={{ margin: '8px 0' }}>Applications Open</h2>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>Most 2027 applications open between March and May 2026.</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #FFB900, #FF8C00)', color: 'white' }}>
          <h4 style={{ margin: 0, opacity: 0.9 }}>Closing Soon</h4>
          <h2 style={{ margin: '8px 0' }}>August Deadlines</h2>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>UCT and Stellenbosch often close earlier than others.</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #107C10, #32D74B)', color: 'white' }}>
          <h4 style={{ margin: 0, opacity: 0.9 }}>Bursary Tip</h4>
          <h2 style={{ margin: '8px 0' }}>NSFAS 2026</h2>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>Apply for NSFAS at the same time you apply to universities.</p>
        </div>
      </div>

      <div className="card-glass" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            className="form-input" 
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="space-y-4">
          <h3 style={{ marginBottom: 16 }}>🎓 Institutional Directory</h3>
          {filteredInstitutions.map((inst, i) => (
            <div key={i} className="card hover-lift" style={{ borderLeft: `6px solid ${inst.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-secondary" style={{ marginBottom: 8 }}>{inst.type}</span>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem' }}>{inst.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>📍 {inst.location}</p>
                </div>
                <a href={inst.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Apply Now ↗</a>
              </div>
              
              <div className="grid-2" style={{ gap: 12, marginTop: 12, padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Applications</p>
                  <p style={{ fontSize: '0.88rem' }}>📅 {inst.openingDate} — {inst.closingDate}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Semester Cycle</p>
                  <p style={{ fontSize: '0.88rem' }}>🔄 {inst.semesters}</p>
                </div>
              </div>
              
              <div style={{ marginTop: 12, borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  <strong>Pro Tip:</strong> {inst.tips}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 style={{ marginBottom: 16 }}>💡 Study & Application Tips</h3>
          <div className="card" style={{ background: 'var(--primary-light)', color: 'white', marginBottom: 20 }}>
            <h3>The Golden Rule</h3>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>Apply as early as possible! Many universities have limited spaces and offer seats on a 'first-come, first-served' basis for qualified applicants.</p>
          </div>
          
          <div className="space-y-4">
            {STUDY_TIPS.map((tip, i) => (
              <div key={i} className="card-glass">
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary)' }}>{tip.title}</h4>
                <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-secondary)' }}>{tip.desc}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 24, textAlign: 'center' }}>
            <h3>Need help with your choice?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16 }}>Ask our AI Assistant for advice on career paths and which university fits your goals.</p>
            <button className="btn btn-secondary" style={{ width: '100%' }}>Ask AI Career Counselor 🤖</button>
          </div>
        </div>
      </div>
    </div>
  )
}
