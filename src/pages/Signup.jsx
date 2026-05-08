import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, db as firestoreDB } from '../lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useToast } from '../context/AppContext'

export default function Signup() {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Learner' })
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(user, { displayName: form.name })
      
      // Create Firestore profile
      await setDoc(doc(firestoreDB, 'users', user.uid), {
        uid: user.uid,
        email: form.email,
        name: form.name,
        role: form.role,
        createdAt: new Date().toISOString()
      })

      toast('Account created! Welcome 🚀', 'success')
      navigate('/')
    } catch (error) {
      toast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade">
        <div className="auth-header">
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎓</div>
          <h1>Create Account</h1>
          <p>Join the Unified Edu-Suite</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="John Doe" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@school.com" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select 
              className="form-select" 
              value={form.role} 
              onChange={e => setForm({...form, role: e.target.value})}
            >
              <option value="Learner">Student / Learner</option>
              <option value="Teacher">Teacher / Educator</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--bg-surface), var(--bg-card));
          padding: 20px;
        }
        .auth-card {
          background: var(--bg-card);
          padding: 40px;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 420px;
          border: 1px solid var(--border-light);
        }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-header h1 { font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 4px; }
        .auth-header p { color: var(--text-muted); font-size: 0.9rem; }
        .auth-form { display: flex; flexDirection: column; gap: 16px; }
        .auth-footer { text-align: center; margin-top: 24px; font-size: 0.9rem; color: var(--text-muted); }
        .auth-footer a { color: var(--primary); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  )
}
