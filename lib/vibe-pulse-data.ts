export type Pulse = {
  id: string
  title: string
  description: string
  category: string
  institute: string
  date: string
  time: string
  location: string
  participants: number
  institutes: number
  blindJoin: boolean
  lookingFor: string
}

export const categories = ['All', 'Music', 'Sports', 'Technology', 'Photography', 'Gaming', 'Entrepreneurship', 'Dance', 'Arts', 'Academic', 'Social']

export const pulses: Pulse[] = [
  { id: 'weekend-jam', title: 'Weekend Jam', description: 'Casual acoustic jam session on the lakeside lawns. Bring a guitar, a cajón, or just your voice. All skill levels welcome — we start slow and build up.', category: 'Music', institute: 'SIDTM', date: '15 Aug 2026', time: '5:30 PM', location: 'Lakeside Lawns, Lavale', participants: 4, institutes: 2, blindJoin: true, lookingFor: 'Guitarists, vocalists and anyone who loves live music.' },
  { id: 'sunrise-trek', title: 'Sunrise Trek to Lavale Hills', description: 'Early morning trek up the ridge behind campus. Moderate difficulty, roughly 2 hours up. We watch the sunrise and grab chai on the way down.', category: 'Sports', institute: 'SIT', date: '17 Aug 2026', time: '5:15 AM', location: 'Main Gate assembly point', participants: 9, institutes: 4, blindJoin: false, lookingFor: 'Anyone up for an early start and a good climb.' },
  { id: 'build-night', title: 'Build Night: Ship a Side Project', description: 'A focused co-working sprint. Bring a project idea, pair up across skill sets, and demo whatever we ship at the end of the night.', category: 'Technology', institute: 'SICSR', date: '16 Aug 2026', time: '6:00 PM', location: 'Innovation Lab, Block C', participants: 11, institutes: 3, blindJoin: true, lookingFor: 'Developers, designers and product-curious folks.' },
  { id: 'golden-hour', title: 'Golden Hour Photowalk', description: 'Slow photowalk through campus and the surrounding fields during golden hour. Phone cameras absolutely count. We share edits afterwards.', category: 'Photography', institute: 'SIMC', date: '18 Aug 2026', time: '5:45 PM', location: 'Amphitheatre steps', participants: 6, institutes: 3, blindJoin: true, lookingFor: 'Anyone who likes taking photos — gear does not matter.' },
  { id: 'founders-circle', title: 'Founders Circle Coffee', description: 'Informal roundtable for anyone building or thinking about a startup. Swap ideas, find co-founders, and get honest feedback over coffee.', category: 'Entrepreneurship', institute: 'SIDTM', date: '19 Aug 2026', time: '4:00 PM', location: 'Cafeteria, Central Block', participants: 7, institutes: 4, blindJoin: true, lookingFor: 'Aspiring founders, builders and curious skeptics.' },
  { id: 'dance-social', title: 'Contemporary Dance Social', description: 'Open floor contemporary and freestyle session. Come to learn, teach, or just move.', category: 'Dance', institute: 'SIMC', date: '20 Aug 2026', time: '7:00 PM', location: 'Studio 2, Arts Wing', participants: 5, institutes: 2, blindJoin: true, lookingFor: 'Dancers and complete beginners alike.' },
]

export const events = [
  { title: 'Symbiosis Cultural Night', date: '22 Aug', type: 'Campus-wide', location: 'Open Air Theatre', attendees: 240 },
  { title: 'Design Futures Workshop', date: '24 Aug', type: 'Workshop', location: 'Innovation Lab', attendees: 48 },
  { title: 'Inter-Institute Sports Meet', date: '29 Aug', type: 'Sports', location: 'University Grounds', attendees: 180 },
]

export const interests = [
  { name: 'Music', count: 284, trend: '+18%' }, { name: 'Technology', count: 231, trend: '+24%' }, { name: 'Sports', count: 198, trend: '+9%' }, { name: 'Photography', count: 142, trend: '+31%' }, { name: 'Entrepreneurship', count: 119, trend: '+14%' },
]

export const adminKpis = [
  { label: 'Verified students', value: '4,286', change: '+12.4%' }, { label: 'Monthly active users', value: '2,840', change: '+8.2%' }, { label: 'Cross-college connections', value: '1,192', change: '+21.7%' }, { label: 'Blind Join adoption', value: '38%', change: '+6.1%' }, { label: 'Cross-college events', value: '86', change: '+14.9%' },
]

export function getPulse(id: string) { return pulses.find((pulse) => pulse.id === id) ?? pulses[0] }

// Temporary UI data boundary. Replace these exports with Supabase queries while preserving their shapes.
export const dataSourceNote = 'Mock data for Phase 1 frontend development. Components consume typed data from this module so Supabase can replace it later.'
