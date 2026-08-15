import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authSchema, type AuthFormValues } from '@/lib/validation'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [resent, setResent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({ resolver: zodResolver(authSchema) })

  async function onSubmit(values: AuthFormValues) {
    setSubmitting(true)
    setError(null)
    setUnconfirmedEmail(null)
    setResent(false)
    const { error } = await supabase.auth.signInWithPassword(values)
    setSubmitting(false)
    if (error) {
      // Supabase returns this specific message when the account exists but
      // hasn't clicked the verification link yet -- surface a resend option
      // instead of a generic "invalid credentials" error.
      if (error.message.toLowerCase().includes('email not confirmed')) {
        setUnconfirmedEmail(values.email)
      } else {
        setError(error.message)
      }
      return
    }
    navigate('/account')
  }

  async function handleResend() {
    if (!unconfirmedEmail) return
    await supabase.auth.resend({ type: 'signup', email: unconfirmedEmail })
    setResent(true)
  }

  return (
    <div className="px-4 py-8">
      <Helmet>
        <title>Log in — Store</title>
      </Helmet>
      <h1 className="mb-5 text-xl font-semibold">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        {error && <p className="text-sm text-ember">{error}</p>}
        {unconfirmedEmail && (
          <div className="rounded-lg border border-line bg-accent-light p-3 text-sm">
            <p>Verify your email before logging in — check the link we sent to {unconfirmedEmail}.</p>
            {resent ? (
              <p className="mt-1 font-medium text-accent-dark">Verification email resent.</p>
            ) : (
              <button type="button" onClick={handleResend} className="mt-1 font-medium text-accent hover:text-accent-dark">
                Resend verification email
              </button>
            )}
          </div>
        )}
        <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        No account? <Link to="/register" className="text-accent">Sign up</Link>
      </p>
    </div>
  )
}
