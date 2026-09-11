import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const bodySchema = z.object({}).default({})

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  bodySchema.safeParse(await request.json().catch(() => ({})))
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ message: 'Sign in required.' }, { status: 401 })

  const { data: event } = await supabase.from('events').select('id,capacity,host_institute_id').eq('id', id).maybeSingle()
  if (!event) return NextResponse.json({ message: 'Event not found.' }, { status: 404 })
  const { data: profile } = await supabase.from('profiles').select('institute_id').eq('auth_user_id', user.id).maybeSingle()
  const { count } = await supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('event_id', id)
  if (event.capacity && (count ?? 0) >= event.capacity) return NextResponse.json({ message: 'This event is full.' }, { status: 409 })
  const { error } = await supabase.from('event_registrations').insert({ event_id: id, student_id: user.id, institute_id: profile?.institute_id ?? null })
  if (error?.code === '23505') return NextResponse.json({ message: 'You are already registered for this event.' }, { status: 409 })
  if (error) return NextResponse.json({ message: 'Could not register for this event.' }, { status: 500 })
  await supabase.from('activity_logs').insert({ student_id: user.id, institute_id: profile?.institute_id ?? null, event_id: id, action: 'REGISTER_EVENT' })
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ message: 'Sign in required.' }, { status: 401 })
  const { data, error } = await supabase.from('event_registrations').select('id,student_id,institute_id,created_at').eq('event_id', id).order('created_at', { ascending: false })
  if (error) return NextResponse.json({ message: 'Could not load registrations.' }, { status: 500 })
  return NextResponse.json({ registrations: data ?? [] })
}
