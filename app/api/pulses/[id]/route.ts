// // import { NextResponse } from 'next/server'
// // import { createAdminClient } from '@/lib/supabase/server'

// // export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
// //   const { id } = await params
// //   const supabase = await createAdminClient()
// //   const { data: pulse, error } = await supabase.from('pulses').select('*, institutes(name,short_name)').eq('id', id).eq('status', 'ACTIVE').maybeSingle()
// //   if (error || !pulse) return NextResponse.json({ message: 'Pulse not found.' }, { status: 404 })
// //   const { data: participants } = await supabase.from('pulse_participants').select('id,student_id,institute_id,join_type').eq('pulse_id', id)
// //   const { data: { user } } = await supabase.auth.getUser()
// //   const safeParticipants = (participants ?? []).map((participant) => ({
// //     id: participant.id,
// //     joinType: participant.join_type,
// //     isAnonymous: participant.join_type === 'BLIND' && participant.student_id !== user?.id,
// //     label: participant.join_type === 'BLIND' && participant.student_id !== user?.id ? 'Anonymous student' : 'Joined student',
// //   }))
// //   return NextResponse.json({ pulse: { ...pulse, institute: pulse.institutes?.short_name ?? pulse.institutes?.name ?? '' }, participants: safeParticipants, stats: { total: safeParticipants.length, blind: safeParticipants.filter((item) => item.joinType === 'BLIND').length, institutes: new Set((participants ?? []).map((item) => item.institute_id).filter(Boolean)).size } })
// // }

// import { NextResponse } from 'next/server'

// import { createAdminClient } from '@/lib/supabase/server'

// const DEMO_JOINER_ID =
//   '0aaa8b63-cc0d-4b65-a623-0af2777c0812'
  

// export async function GET(
//   _request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params

//   const supabase = await createAdminClient()

//   // Get Pulse
//   // const { data: pulse, error: pulseError } = await supabase
//   //   .from('pulses')
//   //   .select('*, institutes(name,short_name)')
//   //   .eq('id', id)
//   //   .eq('status', 'ACTIVE')
//   //   .maybeSingle()
//   let pulseQuery = supabase
//   .from('pulses')
//   .select('*, institutes(name, short_name)')
//   .eq('status', 'ACTIVE')

// let pulse

// if (id === 'weekend-jam') {
//   const { data, error } = await supabase
//     .from('pulses')
//     .select('*, institutes(name, short_name)')
//     .eq('title', 'Weekend Jam')
//     .eq('status', 'ACTIVE')
//     .maybeSingle()

//   pulse = data

//   if (error) {
//     console.error('PULSE ERROR:', error)
//   }
// } else {
//   const { data, error } = await supabase
//     .from('pulses')
//     .select('*, institutes(name, short_name)')
//     .eq('id', id)
//     .eq('status', 'ACTIVE')
//     .maybeSingle()

//   pulse = data

//   if (error) {
//     console.error('PULSE ERROR:', error)
//   }
// }

// if (!pulse) {
//   return NextResponse.json(
//     { message: 'Pulse not found.' },
//     { status: 404 }
//   )
// }

// const pulseId = pulse.id
//   // if (pulseError) {
//   //   console.error('GET PULSE ERROR:', pulseError)

//   //   return NextResponse.json(
//   //     { message: pulseError.message },
//   //     { status: 500 }
//   //   )
//   // }


//   // if (!pulse) {
//   //   return NextResponse.json(
//   //     { message: 'Pulse not found.' },
//   //     { status: 404 }
//   //   )
//   // }

  
//   // Get participants
//   const { data: participants, error: participantError } =
//     await supabase
//       .from('pulse_participants')
//       .select(
//         'id,student_id,institute_id,join_type,joined_at'
//       )
//       .eq('pulse_id', pulseId)

//   if (participantError) {
//     console.error(
//       'GET PARTICIPANTS ERROR:',
//       participantError
//     )

//     return NextResponse.json(
//       { message: participantError.message },
//       { status: 500 }
//     )
//   }

//   // Build participant data
//   const safeParticipants = (participants ?? []).map(
//     (participant) => ({
//       id: participant.id,
//       studentId: participant.student_id,
//       instituteId: participant.institute_id,
//       joinType: participant.join_type,

//       isAnonymous:
//         participant.join_type === 'BLIND' &&
//         participant.student_id !== DEMO_JOINER_ID,

//       label:
//         participant.join_type === 'BLIND' &&
//         participant.student_id !== DEMO_JOINER_ID
//           ? 'Anonymous student'
//           : 'Joined student',
//     })
//   )

//   // Calculate live statistics
//   const total = participants?.length ?? 0

//   const blind =
//     participants?.filter(
//       (participant) => participant.join_type === 'BLIND'
//     ).length ?? 0

//   const institutes = new Set(
//     (participants ?? [])
//       .map((participant) => participant.institute_id)
//       .filter(Boolean)
//   ).size

//   return NextResponse.json({
//     pulse: {
//       ...pulse,
//       institute:
//         pulse.institutes?.short_name ??
//         pulse.institutes?.name ??
//         '',
//     },

//     participants: safeParticipants,

//     stats: {
//       total,
//       blind,
//       institutes,
//     },
//   })
// }
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const DEMO_JOINER_ID =
  '0aaa8b63-cc0d-4b65-a623-0af2777c0812'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createAdminClient()

  // --------------------------------------------------
  // 1. Find the Pulse
  // --------------------------------------------------

  let pulseQuery = supabase
    .from('pulses')
    .select('*, institutes(name, short_name)')
    .eq('status', 'ACTIVE')

  if (id === 'weekend-jam') {
    pulseQuery = pulseQuery.eq('title', 'Weekend Jam')
  } else {
    pulseQuery = pulseQuery.eq('id', id)
  }

  const { data: pulse, error: pulseError } =
    await pulseQuery.maybeSingle()

  if (pulseError) {
    console.error('PULSE ERROR:', pulseError)

    return NextResponse.json(
      { message: pulseError.message },
      { status: 500 }
    )
  }

  if (!pulse) {
    return NextResponse.json(
      { message: 'Pulse not found.' },
      { status: 404 }
    )
  }

  const pulseId = pulse.id

  // --------------------------------------------------
  // 2. Get participants
  // --------------------------------------------------

  const { data: participants, error: participantError } =
    await supabase
      .from('pulse_participants')
      .select(
        'id, student_id, institute_id, join_type, joined_at'
      )
      .eq('pulse_id', pulseId)
      .order('joined_at', { ascending: true })

  if (participantError) {
    console.error(
      'GET PARTICIPANTS ERROR:',
      participantError
    )

    return NextResponse.json(
      { message: participantError.message },
      { status: 500 }
    )
  }

  const participantRows = participants ?? []

  // --------------------------------------------------
  // 3. Fetch participant profiles
  // --------------------------------------------------

  const studentIds = [
    ...new Set(
      participantRows.map(
        (participant) => participant.student_id
      )
    ),
  ]

  let profiles: any[] = []

  if (studentIds.length > 0) {
    const { data: profileData, error: profileError } =
      await supabase
        .from('profiles')
        .select(
          'id, name, first_name, last_name, institute, institute_id'
        )
        .in('id', studentIds)

    if (profileError) {
      console.error(
        'GET PARTICIPANT PROFILES ERROR:',
        profileError
      )
    }

    profiles = profileData ?? []
  }

  // --------------------------------------------------
  // 4. Fetch institute names
  // --------------------------------------------------

  const instituteIds = [
    ...new Set(
      participantRows
        .map((participant) => participant.institute_id)
        .filter(Boolean)
    ),
  ]

  let institutes: any[] = []

  if (instituteIds.length > 0) {
    const { data: instituteData, error: instituteError } =
      await supabase
        .from('institutes')
        .select('id, name, short_name')
        .in('id', instituteIds)

    if (instituteError) {
      console.error(
        'GET PARTICIPANT INSTITUTES ERROR:',
        instituteError
      )
    }

    institutes = instituteData ?? []
  }

  // --------------------------------------------------
  // 5. Build participant display data
  // --------------------------------------------------

  const safeParticipants = participantRows.map(
    (participant) => {
      const profile = profiles.find(
        (item) => item.id === participant.student_id
      )

      const institute = institutes.find(
        (item) => item.id === participant.institute_id
      )

      const isBlind =
        participant.join_type === 'BLIND'

      const isDemoJoiner =
        participant.student_id === DEMO_JOINER_ID

      // Blind Join hides identity from other students.
      // Backend still retains institute_id for KPI calculation.
      const isAnonymous =
        isBlind && !isDemoJoiner

      const studentName =
        profile?.name ||
        [profile?.first_name, profile?.last_name]
          .filter(Boolean)
          .join(' ') ||
        'Joined student'

      const instituteName =
        institute?.short_name ||
        institute?.name ||
        profile?.institute ||
        ''

      return {
        id: participant.id,

        studentId: participant.student_id,

        joinType: participant.join_type,

        joinedAt: participant.joined_at,

        isAnonymous,

        label: isAnonymous
          ? 'Anonymous student'
          : studentName,

        // Only expose institute to the UI for NORMAL joins.
        // The database still retains institute_id for BLIND joins.
        institute: isAnonymous
          ? null
          : instituteName,

        // Useful for KPI/admin calculations.
        instituteId: participant.institute_id,
      }
    }
  )

  // --------------------------------------------------
  // 6. Live statistics
  // --------------------------------------------------

  const total = participantRows.length

  const blind = participantRows.filter(
    (participant) =>
      participant.join_type === 'BLIND'
  ).length

  const uniqueInstitutes = new Set(
    participantRows
      .map(
        (participant) =>
          participant.institute_id
      )
      .filter(Boolean)
  )

  const instituteCount = uniqueInstitutes.size

  // --------------------------------------------------
  // 7. Return response
  // --------------------------------------------------

  return NextResponse.json({
    pulse: {
      ...pulse,

      institute:
        pulse.institutes?.short_name ??
        pulse.institutes?.name ??
        '',
    },

    participants: safeParticipants,

    stats: {
      total,

      blind,

      institutes: instituteCount,
    },
  })
}