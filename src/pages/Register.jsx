import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import AuthLayout from '../components/AuthLayout'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(displayName, email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start collaborating in minutes" cardClassName="max-w-lg" headerAlign="center">
      {error && <div className="alert alert-error text-sm mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <label className="form-control">
          <div className="label"><span className="label-text">Name</span></div>
          <label className="input input-bordered flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <input className="grow" name="register_name" autoComplete="off" value={displayName} onChange={(e)=>setDisplayName(e.target.value)} placeholder="Jane Doe" required />
          </label>
        </label>
        <label className="form-control">
          <div className="label"><span className="label-text">Email</span></div>
          <label className="input input-bordered flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M12 12.713l-11.99-7.213h23.98l-11.99 7.213zm0 2.574l-12-7.287v13h24v-13l-12 7.287z"/></svg>
            <input className="grow" type="email" name="register_email" autoComplete="off" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
        </label>
        <label className="form-control">
          <div className="label"><span className="label-text">Password</span></div>
          <label className="input input-bordered flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M17 8V7a5 5 0 10-10 0v1H5v14h14V8h-2zm-8 0V7a3 3 0 016 0v1H9z"/></svg>
            <input className="grow" type="password" name="register_password" autoComplete="new-password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Create a strong password" required />
          </label>
        </label>
        <button className="btn btn-primary w-full" disabled={loading} type="submit">
          {loading ? <span className="loading loading-spinner" /> : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-center mt-2">
        Already have an account? <Link className="link" to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}


