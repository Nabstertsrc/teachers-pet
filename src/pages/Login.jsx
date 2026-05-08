import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useToast } from '../context/AppContext'

export default function Login() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast('Welcome back! 👋', 'success')
      navigate('/')
    } catch (error) {
      toast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast('Logged in with Google! 🚀', 'success')
      navigate('/')
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade">
        <div className="auth-header">
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🍎</div>
          <h1>Unified Edu-Suite</h1>
          <p>Teacher's Pet + Study Buddy</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@school.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <button className="btn btn-secondary btn-lg" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }} onClick={handleGoogleLogin}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
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
        .auth-form { display: flex; flexDirection: column; gap: 20px; }
        .auth-divider {
          text-align: center;
          position: relative;
          margin: 24px 0;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: var(--border);
        }
        .auth-divider::before { left: 0; }
        .auth-divider::after { right: 0; }
        .auth-footer { text-align: center; margin-top: 24px; font-size: 0.9rem; color: var(--text-muted); }
        .auth-footer a { color: var(--primary); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  )
}
