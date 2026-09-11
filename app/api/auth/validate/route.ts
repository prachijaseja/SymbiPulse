import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(254) })

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ ok: false, message: 'Enter a valid college email address.' }, { status: 400 })
  const email = parsed.data.email
  const domain = email.split('@')[1]
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!service || !process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ ok: false, message: 'Verification is temporarily unavailable.' }, { status: 503 })
  const supabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL, service, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: institute } = await supabase.from('institutes').select('id').eq('email_domain', domain).eq('is_active', true).maybeSingle()
  if (!institute) return NextResponse.json({ ok: false, code: 'DOMAIN_NOT_SUPPORTED', message: 'VibePulse is currently available only to participating Symbiosis institutes.' }, { status: 403 })

  // This route never returns verified_students data; it only returns a generic eligibility result.
  const lookup = (await supabase.from('verified_students').select('id, is_active').eq('email', email).eq('institute_id', institute.id).maybeSingle()).data
  if (!lookup) return NextResponse.json({ ok: false, code: 'STUDENT_NOT_VERIFIED', message: 'Your student account could not be verified.' }, { status: 403 })
  if (!lookup.is_active) return NextResponse.json({ ok: false, code: 'STUDENT_INACTIVE', message: 'Your student account is currently inactive.' }, { status: 403 })
  return NextResponse.json({ ok: true })
}
