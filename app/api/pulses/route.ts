import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'

const pulseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  category: z.string().trim().min(1).max(50),
  location: z.string().trim().min(2).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  max_participants: z.number().int().positive().max(500).nullable().optional(),
  blind_join_enabled: z.boolean().default(false),
})

export async function POST(request: Request) {
  const supabase = await createAdminClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) return NextResponse.json({ message: 'Sign in required.' }, { status: 401 })
const DEMO_CREATOR_ID =
  "daefc4bb-fa4c-4b02-98d1-2e54dcf746fd"
  const parsed = pulseSchema.safeParse(await request.json().catch(() => null))
  // if (!parsed.success) return NextResponse.json({ message: 'Check the Pulse details and try again.' }, { status: 400 })
  if (!parsed.success) {
  console.error('PULSE VALIDATION ERROR:', parsed.error.flatten())

  return NextResponse.json(
    {
      message: 'Pulse validation failed.',
      errors: parsed.error.flatten(),
    },
    { status: 400 }
  )
}

  const { data: profile } = await supabase.from('profiles').select('institute_id').eq('id', DEMO_CREATOR_ID).maybeSingle()
  const { data: pulse, error } = await supabase.from('pulses').insert({
    ...parsed.data,
    created_by: DEMO_CREATOR_ID,
    institute_id: profile?.institute_id ?? null,
    status: 'ACTIVE',
  }).select('id').single()
  // if (error) return NextResponse.json({ message: 'Could not create this Pulse.' }, { status: 500 })
if (error) {
  console.error('PULSE CREATION ERROR:', error)

  return NextResponse.json(
    {
      message: 'Could not create this Pulse.',
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    },
    { status: 500 }
  )
}
  await supabase.from('activity_logs').insert({ student_id: DEMO_CREATOR_ID, institute_id: profile?.institute_id ?? null, pulse_id: pulse.id, action: 'CREATE_PULSE', metadata: { category: parsed.data.category } })
  return NextResponse.json({ id: pulse.id }, { status: 201 })
}

export async function GET(request: Request) {
  const supabase = await createAdminClient()
  const url = new URL(request.url)
  let query = supabase.from('pulses').select('*, profiles:created_by(name, institute_id, institutes:institute_id(name, short_name)), pulse_participants(student_id, institute_id)').eq('status', 'ACTIVE')
  const category = url.searchParams.get('category')
  const institute = url.searchParams.get('institute')
  const date = url.searchParams.get('date')
  const location = url.searchParams.get('location')
  const sort = url.searchParams.get('sort') ?? 'recommended'
  if (category && category !== 'All') query = query.eq('category', category)
  if (institute) query = query.eq('institute_id', institute)
  if (date) query = query.eq('date', date)
  if (location) query = query.ilike('location', `%${location}%`)
  if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (sort === 'upcoming') query = query.order('date', { ascending: true }).order('time', { ascending: true })
  else query = query.order('created_at', { ascending: false })
  const { data, error } = await query
  if (error) return NextResponse.json({ message: 'Could not load Pulses.' }, { status: 500 })
  return NextResponse.json({ pulses: (data ?? []).map((pulse) => ({ ...pulse, institute: pulse.profiles?.institutes?.short_name ?? '', date: pulse.date ?? pulse.starts_at, time: pulse.time ?? '', participants: pulse.pulse_participants?.length ?? 0, institutes: new Set((pulse.pulse_participants ?? []).map((item: { institute_id: string | null }) => item.institute_id).filter(Boolean)).size, blindJoin: pulse.blind_join_enabled, lookingFor: pulse.description })) })
}
