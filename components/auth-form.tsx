'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, MailCheck, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  async function sendCode(event?: React.FormEvent) {
    if (cooldown > 0) {
      setMessage(`Please wait ${cooldown}s before requesting another code.`)
      return
    }
    event?.preventDefault()
    setBusy(true)
    setMessage('')
    const normalizedEmail = email.trim().toLowerCase()

    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      })
      const result = await response.json()
      if (!response.ok) {
        setMessage(result.message || 'We could not verify that email.')
        return
      }

      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      })
      const otpResult = await otpResponse.json()
      if (!otpResponse.ok) {
        setMessage(otpResult.message || 'We could not send your OTP. Please try again.')
        if (otpResponse.status === 429) setCooldown(60)
        return
      }
      setEmail(normalizedEmail)
      setSent(true)
      setCooldown(60)
    } catch {
      setMessage('We could not send a verification code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setMessage('Enter the six-digit code from your email.')
      return
    }

    setBusy(true)
    setMessage('')
    const { error } = await createClient().auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    if (error) {
      setMessage('That code is invalid or expired. Request a new code and try again.')
      setBusy(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  if (sent) {
    return (
      <div>
        <div className="mt-8 rounded-2xl border border-primary/15 bg-accent/40 p-5">
          <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <MailCheck className="size-6" />
          </span>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">Enter your email code.</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We sent a six-digit OTP to <span className="font-semibold text-foreground">{email}</span>.
          </p>
        </div>
        <form data-testid="otp-verify-form" onSubmit={verifyCode}>
          <label className="mt-6 block text-sm font-semibold">
            Verification code
            <input
              required
              autoFocus
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="mt-2 h-14 w-full rounded-xl border border-input bg-background px-4 text-center font-mono text-2xl tracking-[0.35em] outline-none ring-primary/20 placeholder:text-muted-foreground/50 focus:ring-4"
            />
          </label>
          {message && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{message}</p>}
          <button disabled={busy} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <>Verify and continue <ArrowRight className="size-4" /></>}
          </button>
        </form>
        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <button type="button" className="font-semibold text-primary" onClick={() => { setSent(false); setCode(''); setMessage('') }}>Use a different email</button>
          <button type="button" className="font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={busy || cooldown > 0} onClick={() => void sendCode()}>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}</button>
        </div>
      </div>
    )
  }

  return (
    <form data-testid="otp-login-form" onSubmit={sendCode}>
      <label className="mt-8 block text-sm font-semibold">
        College email
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@siu.edu.in" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-primary/20 placeholder:text-muted-foreground focus:ring-4" />
      </label>
      {message && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{message}</p>}
      <button disabled={busy} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
        {busy ? <Loader2 className="size-4 animate-spin" /> : <>Send OTP <ArrowRight className="size-4" /></>}
      </button>
      <p className="mt-6 text-center text-xs text-muted-foreground">Only verified participating Symbiosis college emails are accepted.</p>
    </form>
  )
}

export function AuthSuccessIcon() {
  return <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-primary"><ShieldCheck className="size-7" /></span>
}
