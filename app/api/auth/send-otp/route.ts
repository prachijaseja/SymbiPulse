import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(254) })

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ message: 'Enter a valid college email address.' }, { status: 400 })
  const email = parsed.data.email
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !serviceKey || !publishableKey) return NextResponse.json({ message: 'Verification is temporarily unavailable.' }, { status: 503 })

  const admin = createAdminClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  let user = existing.users.find((candidate) => candidate.email?.toLowerCase() === email)
  if (!user) {
    const created = await admin.auth.admin.createUser({ email, email_confirm: true })
    if (created.error || !created.data.user) return NextResponse.json({ message: 'We could not prepare your sign-in. Please try again.' }, { status: 500 })
    user = created.data.user
  } else if (!user.email_confirmed_at) {
    const updated = await admin.auth.admin.updateUserById(user.id, { email_confirm: true })
    if (updated.error) return NextResponse.json({ message: 'We could not prepare your sign-in. Please try again.' }, { status: 500 })
  }

  const auth = createAdminClient(url, publishableKey, { auth: { autoRefreshToken: false, persistSession: false } })
const origin = new URL(request.url).origin

const { error } = await auth.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: false,
    emailRedirectTo: `${origin}/auth/callback`,
  },
})
  if (error) {
  console.error('Supabase OTP error:', error.message)
  return NextResponse.json({ message: error.message }, { status: 502 })
}
}
