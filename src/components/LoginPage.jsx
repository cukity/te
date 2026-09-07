import { useRef, useState } from 'react'
import './LoginPage.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MIN_PASSWORD_LENGTH = 8

function validateEmail(email) {
  const value = email.trim()
  if (!value) return 'Email is required.'
  if (!EMAIL_REGEX.test(value)) {
    return 'Enter a valid email address, e.g. name@example.com.'
  }
  return ''
}

function validatePassword(password) {
  if (!password) return 'Password is required.'
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  return ''
}

const validators = { email: validateEmail, password: validatePassword }

export default function LoginPage() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success'
  const [loggedInEmail, setLoggedInEmail] = useState('')
  const fieldRefs = useRef({})

  const setFieldValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    // Re-validate live once the field has been visited, so errors clear as you type.
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }))
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validators[field](values[field]) }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (status !== 'idle') return

    const nextErrors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    }
    setErrors(nextErrors)
    setTouched({ email: true, password: true })

    const firstInvalid = ['email', 'password'].find((field) => nextErrors[field])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      return
    }

    setStatus('submitting')
    // Simulated login — there is no backend yet. Replace with a real API call later.
    window.setTimeout(() => {
      setLoggedInEmail(values.email.trim())
      setStatus('success')
    }, 1200)
  }

  const handleReset = () => {
    setValues({ email: '', password: '' })
    setErrors({ email: '', password: '' })
    setTouched({ email: false, password: false })
    setShowPassword(false)
    setLoggedInEmail('')
    setStatus('idle')
  }

  return (
    <div className="login-card">
      <div className="brand" aria-hidden="true">
        <LockIcon />
      </div>

      {status === 'success' ? (
        <div className="success-panel" role="status">
          <div className="success-icon">
            <CheckIcon />
          </div>
          <h1 className="card-title">You&apos;re logged in!</h1>
          <p className="card-subtitle">
            Signed in as <strong>{loggedInEmail}</strong>. This is a local demo, so no
            real account was contacted.
          </p>
          <button type="button" className="submit-btn" onClick={handleReset}>
            Back to login
          </button>
        </div>
      ) : (
        <>
          <h1 className="card-title">Welcome back</h1>
          <p className="card-subtitle">Log in to your account to continue</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  ref={(el) => (fieldRefs.current.email = el)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={status === 'submitting'}
                />
              </div>
              {errors.email && (
                <p className="field-error" id="email-error" role="alert">
                  <AlertIcon />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a
                  className="link link-small"
                  href="#forgot-password"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>
              <div className="input-wrapper has-toggle">
                <input
                  ref={(el) => (fieldRefs.current.password = el)}
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={(e) => setFieldValue('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'password-error' : 'password-hint'
                  }
                  disabled={status === 'submitting'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password ? (
                <p className="field-error" id="password-error" role="alert">
                  <AlertIcon />
                  {errors.password}
                </p>
              ) : (
                <p className="field-hint" id="password-hint">
                  Must be at least {MIN_PASSWORD_LENGTH} characters.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Logging in…
                </>
              ) : (
                'Log in'
              )}
            </button>

            <p className="form-footer">
              Don&apos;t have an account?{' '}
              <a className="link" href="#sign-up" onClick={(e) => e.preventDefault()}>
                Sign up
              </a>
            </p>
          </form>
        </>
      )}
    </div>
  )
}

/* ---- Icons ---- */

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4l16 16M9.9 5.9A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.6 17.6 0 0 1-2.8 3.6M6.1 8.3A16.4 16.4 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 3.5-.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
