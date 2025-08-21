import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import AuthLayout from '../components/AuthLayout'

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = params.get('redirect') || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your workspace">
      {error && <div className="alert alert-error text-sm mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <label className="form-control">
          <div className="label"><span className="label-text">Email</span></div>
          <label className="input input-bordered flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M12 12.713l-11.99-7.213h23.98l-11.99 7.213zm0 2.574l-12-7.287v13h24v-13l-12 7.287z"/></svg>
            <input className="grow"
              type="email"
              name="login_email"
              inputMode="email"
              autoComplete="off"
              spellCheck={false}
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
        </label>
        <label className="form-control">
          <div className="label"><span className="label-text">Password</span></div>
          <label className="input input-bordered flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M17 8V7a5 5 0 10-10 0v1H5v14h14V8h-2zm-8 0V7a3 3 0 016 0v1H9z"/></svg>
            <input className="grow"
              type="password"
              name="login_password"
              autoComplete="new-password"
              spellCheck={false}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
        </label>
        <button className="btn btn-primary w-full" disabled={loading} type="submit">
          {loading ? <span className="loading loading-spinner" /> : 'Sign In'}
        </button>
      </form>

      <div className="divider">or</div>

      <button className="btn btn-outline w-full" onClick={handleGoogle} disabled={loading}>
        Continue with Google
      </button>

      <p className="text-sm text-center mt-2">
        New here? <Link className="link" to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  )
}


