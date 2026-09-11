import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'


const DEMO_JOINER_ID =
  '0aaa8b63-cc0d-4b65-a623-0af2777c0812'
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) return NextResponse.json({ message: 'Sign in required.' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const joinType = body.joinType === 'BLIND' ? 'BLIND' : 'NORMAL'
  const { data: pulse } = await supabase.from('pulses').select('id,max_participants,blind_join_enabled,status').eq('id', id).eq('status', 'ACTIVE').maybeSingle()
  if (!pulse) return NextResponse.json({ message: 'Pulse not found.' }, { status: 404 })
  if (joinType === 'BLIND' && !pulse.blind_join_enabled) return NextResponse.json({ message: 'Blind Join is not available for this Pulse.' }, { status: 400 })
  const { count } = await supabase.from('pulse_participants').select('id', { count: 'exact', head: true }).eq('pulse_id', id)
  if (pulse.max_participants && (count ?? 0) >= pulse.max_participants) return NextResponse.json({ message: 'This Pulse is full.' }, { status: 409 })
  const { data: profile } = await supabase.from('profiles').select('institute_id').eq('id', DEMO_JOINER_ID).maybeSingle()
  const { error } = await supabase.from('pulse_participants').insert({ pulse_id: id, student_id: DEMO_JOINER_ID, institute_id: profile?.institute_id ?? null, join_type: joinType })
  if (error?.code === '23505') return NextResponse.json({ message: 'You already joined this Pulse.' }, { status: 409 })
  if (error) {
  console.error('JOIN PULSE ERROR:', error)

  return NextResponse.json(
    {
      message: error instanceof Error ? error.message : 'Cannot join the Pulse',
    },
    { status: 500 }
  )
}
  // if (error) return NextResponse.json({ message: 'Could not join this Pulse.' }, { status: 500 })
  await supabase.from('activity_logs').insert({ student_id: DEMO_JOINER_ID, institute_id: profile?.institute_id ?? null, pulse_id: id, action: joinType === 'BLIND' ? 'BLIND_JOIN' : 'JOIN_PULSE', metadata: { join_type: joinType } })
}
