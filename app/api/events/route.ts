import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('id,title,description,category,date,time,starts_at,location,capacity,host_institute_id,institutes:host_institute_id(name,short_name)')
    .order('date', { ascending: true, nullsFirst: false })
    .order('time', { ascending: true, nullsFirst: false })

  if (error) return NextResponse.json({ message: error.message, events: [] }, { status: 500 })

  return NextResponse.json({
    events: (data ?? []).map((event) => ({
      ...event,
      type: event.category,
      institute: Array.isArray(event.institutes) ? event.institutes[0]?.short_name ?? '' : event.institutes?.short_name ?? '',
      attendees: event.capacity ?? 0,
    })),
  })
}
