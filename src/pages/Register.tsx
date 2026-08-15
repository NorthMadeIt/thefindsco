import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authSchema, type AuthFormValues } from '@/lib/validation'

export default function Register() {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({ resolver: zodResolver(authSchema) })

  async function onSubmit(values: AuthFormValues) {
    setSubmitting(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp(values)
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    // With "Confirm email" required (see README), signUp never returns an
    // active session -- the account exists but is unusable until the person
    // clicks the link Supabase just emailed them. Don't navigate anywhere
    // that assumes they're logged in; show the "check your email" state
    // instead. If confirmations are somehow off, data.session will be set
    // and we can skip straight past this.
    if (data.session) {
      window.location.href = '/account'
      return
    }
    setSentTo(values.email)
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
        <Helmet>
          <title>Check your email — Store</title>
        </Helmet>
        <MailCheck size={40} className="text-accent" />
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="max-w-xs text-sm text-muted">
          We sent a verification link to <span className="font-medium text-ink">{sentTo}</span>. Click it to
          activate your account, then come back and log in.
        </p>
        <Link to="/login" className="mt-2 text-sm text-accent">Back to log in</Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <Helmet>
        <title>Create account — Store</title>
      </Helmet>
      <h1 className="mb-5 text-xl font-semibold">Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" {...registerField('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...registerField('password')} error={errors.password?.message} />
        {error && <p className="text-sm text-ember">{error}</p>}
        <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account? <Link to="/login" className="text-accent">Log in</Link>
      </p>
    </div>
  )
}
