import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
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
        <MailCheck size={40} className="text-gray-800" />
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="max-w-xs text-sm text-gray-500">
          We sent a verification link to <span className="font-medium text-gray-900">{sentTo}</span>. Click it to
          activate your account, then come back and log in.
        </p>
        <Link to="/login" className="mt-2 text-sm text-blue-600">Back to log in</Link>
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
      </p>
    </div>
  )
}
