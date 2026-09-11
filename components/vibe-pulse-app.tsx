'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Bell, CalendarDays, Check, ChevronDown, Compass, Heart, Home as HomeIcon, LayoutDashboard, MapPin, Menu, MessageCircle, Plus, Search, ShieldCheck, Sparkles, Users, X, Zap } from 'lucide-react'
import { adminKpis, categories, events, getPulse, interests, pulses, type Pulse } from '@/lib/vibe-pulse-data'
import { AuthForm } from '@/components/auth-form'
import { createClient } from '@/lib/supabase/client'
import { CreatePulseForm } from '@/components/create-pulse-form'

const navItems = [
  { href: '/home', label: 'Home', icon: HomeIcon }, { href: '/discover', label: 'Discover', icon: Compass }, { href: '/events', label: 'Events', icon: CalendarDays }, { href: '/connections', label: 'Connections', icon: Users }, { href: '/profile', label: 'Profile', icon: Heart },
]
const adminItems = [{ href: '/admin', label: 'Overview', icon: LayoutDashboard }, { href: '/admin/interests', label: 'Interests', icon: Sparkles }, { href: '/admin/network', label: 'Network', icon: Users }, { href: '/admin/activity', label: 'Activity', icon: Zap }]

function Logo({ dark = false }: { dark?: boolean }) { return <Link href="/" className={`flex items-center gap-2.5 font-semibold tracking-tight ${dark ? 'text-primary-foreground' : 'text-foreground'}`}><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Zap className="size-4 fill-current" /></span><span className="text-lg">Symbi<span className="text-primary">Pulse</span></span></Link> }

function Pill({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'primary' | 'soft' }) { return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone === 'primary' ? 'bg-primary text-primary-foreground' : tone === 'soft' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>{children}</span> }

function Button({ children, href, variant = 'primary', className = '', onClick }: { children: React.ReactNode; href?: string; variant?: 'primary' | 'outline' | 'ghost'; className?: string; onClick?: () => void }) { const styles = variant === 'primary' ? 'bg-primary text-primary-foreground shadow-sm hover:opacity-90' : variant === 'outline' ? 'border border-border bg-card text-foreground hover:bg-muted' : 'text-muted-foreground hover:bg-muted hover:text-foreground'; const content = <span className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition ${styles} ${className}`}>{children}</span>; return href ? <Link href={href}>{content}</Link> : <button onClick={onClick}>{content}</button> }

function PublicShell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen bg-background"><header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"><Logo /><div className="flex items-center gap-3"><Link href="/login" className="hidden px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground sm:block">Sign in</Link><Button href="/login" className="min-h-10 px-4">Get started <ArrowRight className="size-4" /></Button></div></header>{children}</div> }

function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) { const pathname = usePathname(); const items = admin ? adminItems : navItems; const [open, setOpen] = useState(false); return <div className="min-h-screen bg-background"><aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-card px-5 py-6 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between"><Logo /><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X className="size-5" /></button></div><div className="mt-10 rounded-2xl bg-accent p-4"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent-foreground"><ShieldCheck className="size-4" /> Verified student</div><p className="text-xs leading-5 text-muted-foreground">Symbiosis Lavale community access</p></div><nav className="mt-8 flex flex-col gap-1">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${pathname === href || (href !== '/home' && pathname.startsWith(href)) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="size-4" />{label}</Link>)}</nav><div className="mt-auto rounded-2xl border border-border p-4"><p className="text-xs font-semibold text-foreground">Need a hand?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Reach out to the SymbiPulse team.</p><button className="mt-3 text-xs font-bold text-primary">Contact support</button></div></aside><div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur lg:px-10"><button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu className="size-5" /></button><div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex"><span>{admin ? 'Admin workspace' : 'Symbiosis Lavale'}</span><ChevronDown className="size-3" /></div><div className="ml-auto flex items-center gap-3"><button aria-label="Search" className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted"><Search className="size-4" /></button><button aria-label="Notifications" className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-muted"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" /></button><div className="flex items-center gap-2 border-l border-border pl-3"><div className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">PJ</div><div className="hidden sm:block"><p className="text-xs font-semibold">Prachi Jaseja</p><p className="text-[11px] text-muted-foreground">SIDTM · Year 2</p></div></div></div></header><main className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-10">{children}</main></div></div> }

function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) { return <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>{action}</div> }

function PulseCard({ pulse }: { pulse: Pulse }) { return <Link data-testid={`pulse-card-${pulse.id}`} href={`/pulse/${pulse.id}`} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><div className="flex items-start justify-between gap-3"><Pill tone="soft">{pulse.category}</Pill>{pulse.blindJoin && <span className="flex items-center gap-1 text-[11px] font-semibold text-primary"><ShieldCheck className="size-3.5" /> Blind Join</span>}</div><h3 className="mt-5 text-lg font-semibold tracking-tight group-hover:text-primary">{pulse.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{pulse.description}</p><div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><span className="flex items-center gap-2"><CalendarDays className="size-3.5" />{pulse.date} · {pulse.time}</span><span className="flex items-center gap-2"><MapPin className="size-3.5" />{pulse.location}</span></div><div className="mt-auto flex items-center justify-between pt-5 text-xs font-medium text-muted-foreground"><span>{pulse.participants} students interested</span><span>{pulse.institutes} institutes</span></div></Link> }

function Landing() { return <PublicShell><main className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-20"><div><Pill tone="soft"><Sparkles className="mr-1.5 size-3.5" /> Built for campus communities</Pill><h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">Find your people <span className="text-primary">beyond</span> your college.</h1><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">Discover activities, events and communities across Symbiosis Lavale. The best parts of campus life are the ones you do not plan alone.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button href="/login">Continue with College ID <ArrowRight className="size-4" /></Button><Button href="/discover" variant="outline">Explore SymbiPulse</Button></div><div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground"><div className="flex -space-x-2">{['PJ', 'RS', 'NP', 'JM'].map((initials) => <span key={initials} className="grid size-8 place-items-center rounded-full border-2 border-background bg-accent text-[10px] font-bold text-accent-foreground">{initials}</span>)}</div><span>Join 4,000+ verified students finding their crowd.</span></div></div><div className="relative"><div className="absolute -inset-4 rounded-[2rem] bg-primary/5" /><div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-xl sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Your next vibe</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Make plans that travel.</h2></div><span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"><Compass className="size-5" /></span></div><div className="mt-7 rounded-2xl bg-muted p-4"><div className="flex items-center justify-between"><Pill tone="soft">Music</Pill><span className="text-xs font-semibold text-primary">Blind Join available</span></div><h3 className="mt-4 text-xl font-semibold">Weekend Jam</h3><p className="mt-1 text-sm text-muted-foreground">Lakeside Lawns, Lavale</p><div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span>15 Aug · 5:30 PM</span><span>4 students interested</span></div></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-border p-4"><p className="text-2xl font-semibold">18</p><p className="mt-1 text-xs text-muted-foreground">active communities</p></div><div className="rounded-2xl border border-border p-4"><p className="text-2xl font-semibold">7</p><p className="mt-1 text-xs text-muted-foreground">institutes connected</p></div></div></div></div></main></PublicShell> }

function Login() { return <PublicShell><main className="mx-auto flex min-h-[calc(100vh-100px)] max-w-xl items-center justify-center px-5 pb-16"><div className="w-full rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10"><Pill tone="soft">Verified access</Pill><h1 className="mt-5 text-3xl font-semibold tracking-tight">Welcome to SymbiPulse.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Use your verified college email. Your institute, program and year are assigned automatically.</p><AuthForm /></div></main></PublicShell> }

function Verify() { return <PublicShell><main className="mx-auto flex min-h-[calc(100vh-100px)] max-w-xl items-center justify-center px-5 pb-16"><div className="w-full rounded-3xl border border-border bg-card p-7 text-center shadow-sm sm:p-10"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-primary"><ShieldCheck className="size-7" /></span><h1 className="mt-6 text-3xl font-semibold tracking-tight">Check your inbox.</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">We sent a secure verification link to your college email. Click it to enter your campus network.</p><Button href="/home" className="mt-8 w-full">Open student space <ArrowRight className="size-4" /></Button><Link href="/login" className="mt-5 inline-block text-xs font-semibold text-primary">Use a different email</Link></div></main></PublicShell> }
function RecommendedPulses() {
  const [livePulses, setLivePulses] = useState<Pulse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPulses() {
      try {
        const response = await fetch('/api/pulses?category=All&sort=recommended')
        const result = await response.json()

        if (response.ok) {
          setLivePulses(result.pulses ?? [])
        }
      } catch (error) {
        console.error('Failed to load recommended Pulses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPulses()
  }, [])

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading recommended Pulses...
      </p>
    )
  }

  if (!livePulses.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No active Pulses available right now.
      </p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {livePulses.slice(0, 3).map((pulse) => (
        <PulseCard key={pulse.id} pulse={pulse} />
      ))}
    </div>
  )
}
function Home() { return <AppShell><PageHeading eyebrow="Good afternoon, Prachi" title="What are you in the mood for?" description="There is a lot happening around Lavale. Here is what matches your interests this week." action={<Button href="/create-pulse"><Plus className="size-4" /> Create Pulse</Button>} /><section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]"><div className="rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8"><div className="flex items-start justify-between gap-4"><div><Pill tone="soft">Your weekly signal</Pill><h2 className="mt-5 max-w-lg text-3xl font-semibold tracking-tight">Small plans make the biggest campus memories.</h2><p className="mt-3 max-w-md text-sm leading-6 text-primary-foreground/75">You have 3 interests in common with people joining Weekend Jam.</p></div><Heart className="hidden size-9 opacity-60 sm:block" /></div><Button href="/pulse/weekend-jam" variant="outline" className="mt-7 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">See the pulse <ArrowRight className="size-4" /></Button></div><div className="rounded-3xl border border-border bg-card p-6"><div className="flex items-center justify-between"><h3 className="font-semibold">Trending interests</h3><Link href="/discover" className="text-xs font-bold text-primary">View all</Link></div><div className="mt-5 flex flex-wrap gap-2">{['Live music', 'Startups', 'Street food', 'Badminton', 'Design', 'Photography'].map((interest) => <Pill key={interest} tone="soft">{interest}</Pill>)}</div><div className="mt-7 flex items-center gap-3 border-t border-border pt-5"><span className="grid size-10 place-items-center rounded-xl bg-muted"><Users className="size-4 text-primary" /></span><div><p className="text-sm font-semibold">Meet across institutes</p><p className="mt-1 text-xs text-muted-foreground">12 new connections this week</p></div></div></div></section><section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Picked for you</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Recommended Pulses</h2></div><Link href="/discover" className="text-sm font-semibold text-primary">Explore all <ArrowRight className="ml-1 inline size-4" /></Link></div><RecommendedPulses /></section><section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Coming up</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Upcoming events</h2></div><Link href="/events" className="text-sm font-semibold text-primary">View calendar <ArrowRight className="ml-1 inline size-4" /></Link></div><div className="grid gap-4 md:grid-cols-3">{events.map((event) => <div key={event.title} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between"><Pill tone="soft">{event.type}</Pill><span className="text-xs font-bold text-primary">{event.date}</span></div><h3 className="mt-5 font-semibold">{event.title}</h3><p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-3.5" />{event.location}</p><p className="mt-4 text-xs text-muted-foreground">{event.attendees} expected attendees</p></div>)}</div></section></AppShell> }

function Discover() { const [selected, setSelected] = useState('All'); const [sort, setSort] = useState('recommended'); const [livePulses, setLivePulses] = useState<Pulse[]>([]); const [loading, setLoading] = useState(true); useEffect(() => { fetch(`/api/pulses?category=${encodeURIComponent(selected)}&sort=${sort}`).then((response) => response.json()).then((result) => setLivePulses(result.pulses ?? [])).finally(() => setLoading(false)) }, [selected, sort]); return <AppShell><PageHeading eyebrow="Find your next thing" title="Discover Pulses" description="Activities made by students, for students — across every institute." action={<Button href="/create-pulse"><Plus className="size-4" /> Create Pulse</Button>} /><div data-testid="pulse-category-filters" className="flex gap-2 overflow-x-auto pb-2">{categories.map((category) => <button key={category} onClick={() => setSelected(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${selected === category ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{category}</button>)}</div><div className="mt-6 flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold"><Sparkles className="size-3.5 text-primary" /> Sort<select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent font-semibold outline-none"><option value="recommended">Recommended</option><option value="newest">Newest</option><option value="upcoming">Upcoming</option><option value="popular">Popular</option></select></label><span className="text-xs text-muted-foreground">Real-time campus Pulses</span></div><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{loading ? <p className="text-sm text-muted-foreground">Loading live Pulses...</p> : livePulses.length ? livePulses.map((pulse) => <PulseCard key={pulse.id} pulse={pulse} />) : <p className="text-sm text-muted-foreground">No active Pulses match these filters.</p>}</div></AppShell> }

function PulseDetails({ id }: { id: string }) { const pulse = getPulse(id); const [joined, setJoined] = useState(false); return <AppShell><Link href="/discover" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">← Back to discover</Link><div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr]"><div><div className="flex flex-wrap items-center gap-2"><Pill tone="soft">{pulse.category}</Pill>{pulse.blindJoin && <Pill tone="primary"><ShieldCheck className="mr-1.5 size-3.5" /> Blind Join available</Pill>}</div><h1 className="mt-5 text-4xl font-semibold tracking-tight lg:text-5xl">{pulse.title}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">{pulse.description}</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">When</p><p className="mt-3 font-semibold">{pulse.date}</p><p className="mt-1 text-sm text-muted-foreground">{pulse.time}</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Where</p><p className="mt-3 font-semibold">{pulse.location}</p><p className="mt-1 text-sm text-muted-foreground">{pulse.institute} creator institute</p></div></div><div className="mt-8 rounded-2xl bg-muted p-6"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Looking for</p><p className="mt-3 text-sm leading-6">{pulse.lookingFor}</p></div></div><aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-sm"><p className="text-sm font-semibold">Join this Pulse</p><div className="mt-5 flex items-center justify-between border-b border-border pb-5"><div><p className="text-2xl font-semibold">{pulse.participants}</p><p className="text-xs text-muted-foreground">students interested</p></div><div className="text-right"><p className="text-2xl font-semibold">{pulse.institutes}</p><p className="text-xs text-muted-foreground">institutes represented</p></div></div><Button onClick={() => setJoined(true)} className="mt-5 w-full">{joined ? <><Check className="size-4" /> You are in</> : <>Join Normally <ArrowRight className="size-4" /></>}</Button>{pulse.blindJoin && <Button onClick={() => setJoined(true)} variant="outline" className="mt-3 w-full"><ShieldCheck className="size-4 text-primary" /> Blind Join</Button>}<p className="mt-5 text-center text-xs leading-5 text-muted-foreground">Blind Join keeps your profile private until you both choose to connect.</p></aside></div></AppShell> }

function CreatePulse() { return <AppShell><PageHeading eyebrow="Make something happen" title="Create a Pulse" description="Bring people together around an idea, activity or moment." /><div className="max-w-3xl rounded-3xl border border-border bg-card p-6 sm:p-8"><div className="grid gap-6 sm:grid-cols-2"><label className="sm:col-span-2 text-sm font-semibold">Pulse title<input className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm" placeholder="e.g. Sunday football at the grounds" /></label><label className="sm:col-span-2 text-sm font-semibold">Description<textarea className="mt-2 min-h-28 w-full rounded-xl border border-input bg-background p-4 text-sm" placeholder="What should people know?" /></label><label className="text-sm font-semibold">Category<select className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm"><option>Select category</option>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label><label className="text-sm font-semibold">Location<input className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm" placeholder="Where is it happening?" /></label><label className="text-sm font-semibold">Date<input type="date" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm" /></label><label className="text-sm font-semibold">Time<input type="time" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm" /></label><label className="text-sm font-semibold">Maximum participants<input type="number" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm" placeholder="12" /></label><label className="text-sm font-semibold">What are you looking for?<input className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm" placeholder="People who love music..." /></label></div><label className="mt-6 flex items-center gap-3 rounded-2xl bg-accent p-4 text-sm font-semibold"><input type="checkbox" className="size-4 accent-primary" /> Enable Blind Join <span className="ml-auto text-xs font-normal text-muted-foreground">Privacy-first matching</span></label><div className="mt-7 flex justify-end gap-3"><Button href="/home" variant="outline">Save draft</Button><Button href="/home">Publish Pulse <ArrowRight className="size-4" /></Button></div></div></AppShell> }

function EventsList() { const [liveEvents, setLiveEvents] = useState<Array<{ id: string; title: string; description: string; category: string; date: string | null; time: string | null; location: string; capacity: number | null; institute: string }>>([]); const [loading, setLoading] = useState(true); useEffect(() => { fetch('/api/events').then((response) => response.json()).then((result) => setLiveEvents(result.events ?? [])).finally(() => setLoading(false)) }, []); return <AppShell><PageHeading eyebrow="Across campus" title="Events" description="Meet people and make plans around what is happening next." /><div data-testid="events-list" className="grid gap-4 md:grid-cols-2">{loading ? <p className="text-sm text-muted-foreground">Loading live events...</p> : liveEvents.length ? liveEvents.map((event, index) => <EventCard key={event.id} event={event} index={index} />) : <p className="text-sm text-muted-foreground">No upcoming events found.</p>}</div></AppShell> }

function EventCard({ event, index }: { event: { id: string; title: string; description: string; category: string; date: string | null; time: string | null; location: string; capacity: number | null; institute: string }; index: number }) { const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); async function register() { setBusy(true); const response = await fetch(`/api/events/${event.id}/register`, { method: 'POST' }); const result = await response.json(); setMessage(response.ok ? 'You are registered for this event.' : result.message); setBusy(false) } return <article data-testid={`event-card-${index + 1}`} className="rounded-2xl border border-border bg-card p-5"><Pill tone="soft">{event.category}</Pill><h2 className="mt-4 text-xl font-semibold">{event.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{event.description}</p><div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground"><span><CalendarDays className="mr-2 inline size-3.5" />{event.date ?? 'Date to be announced'}{event.time ? ` · ${event.time}` : ''}</span><span><MapPin className="mr-2 inline size-3.5" />{event.location}</span>{event.institute && <span>{event.institute} · {event.capacity ?? 'Open'} spots</span>}</div><button data-testid={`register-event-${event.id}`} type="button" onClick={register} disabled={busy} className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? 'Registering...' : 'Join event'}</button>{message && <p role="status" className="mt-3 text-xs text-muted-foreground">{message}</p>}</article> }

function SimpleList({ type }: { type: 'events' | 'connections' | 'profile' }) { if (type === 'events') return <EventsList />; if (type === 'profile') return <AppShell><PageHeading eyebrow="Your space" title="Prachi Jaseja" description="Your profile is built from your verified college identity and the things you choose to explore." /><div className="grid gap-6 lg:grid-cols-[.65fr_1.35fr]"><div className="rounded-3xl border border-border bg-card p-6"><div className="grid size-20 place-items-center rounded-3xl bg-primary text-2xl font-semibold text-primary-foreground">PJ</div><h2 className="mt-5 text-xl font-semibold">Prachi Jaseja</h2><p className="mt-1 text-sm text-muted-foreground">SIDTM · MBA · Year 2</p><div className="mt-6 flex flex-wrap gap-2">{['Technology', 'Music', 'Photography', 'Startups'].map((item) => <Pill key={item} tone="soft">{item}</Pill>)}</div><div className="mt-7 rounded-2xl bg-muted p-4 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mb-2 size-4 text-primary" /> Your institute is linked to your verified college ID and cannot be edited here.</div></div><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-border bg-card p-5"><p className="text-3xl font-semibold">8</p><p className="mt-2 text-xs text-muted-foreground">Pulses joined</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-3xl font-semibold">3</p><p className="mt-2 text-xs text-muted-foreground">Events attended</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-3xl font-semibold">24</p><p className="mt-2 text-xs text-muted-foreground">Connections</p></div><div className="rounded-3xl border border-border bg-card p-6 sm:col-span-3"><h3 className="font-semibold">Your recent Pulses</h3><div className="mt-5 flex flex-col gap-3">{pulses.slice(0, 3).map((pulse) => <Link href={`/pulse/${pulse.id}`} key={pulse.id} className="flex items-center justify-between rounded-xl bg-muted p-4"><div><p className="text-sm font-semibold">{pulse.title}</p><p className="mt-1 text-xs text-muted-foreground">{pulse.category} · {pulse.date}</p></div><ArrowRight className="size-4 text-muted-foreground" /></Link>)}</div></div></div></div></AppShell>; const isEvent = type === 'events'; return <AppShell><PageHeading eyebrow={isEvent ? 'Plan ahead' : 'Your network'} title={isEvent ? 'Events around campus' : 'Connections'} description={isEvent ? 'Keep an eye on the moments bringing Symbiosis Lavale together.' : 'People you met through shared interests and cross-institute plans.'} /><div className="grid gap-4 md:grid-cols-2">{(isEvent ? events : ['Riya Sharma · SICSR', 'Neel Patel · SIDTM', 'Meera Joshi · SIMC', 'Kabir Mehta · SLS']).map((item, index) => <div key={typeof item === 'string' ? item : item.title} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-accent text-primary">{isEvent ? <CalendarDays className="size-5" /> : <Users className="size-5" />}</span><Pill tone="soft">{isEvent ? (item as typeof events[number]).date : 'Connected'}</Pill></div><h3 className="mt-5 font-semibold">{isEvent ? (item as typeof events[number]).title : item}</h3><p className="mt-2 text-sm text-muted-foreground">{isEvent ? `${(item as typeof events[number]).location} · ${(item as typeof events[number]).attendees} attendees` : 'Met through a shared SymbiPulse interest'}</p><Button variant="ghost" className="mt-4 px-0">{isEvent ? 'View event' : 'View profile'} <ArrowRight className="size-4" /></Button></div>)}</div></AppShell> }

function Admin({ section = 'overview' }: { section?: string }) { const title = section === 'interests' ? 'Popular interests' : section === 'network' ? 'Institute network' : section === 'activity' ? 'Campus activity' : 'Community overview'; return <AppShell admin><PageHeading eyebrow="Admin workspace" title={title} description="Anonymized community signals for the Symbiosis Lavale team." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{adminKpis.map((kpi) => <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5"><p className="text-xs leading-5 text-muted-foreground">{kpi.label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{kpi.value}</p><p className="mt-2 text-xs font-semibold text-primary">{kpi.change} this month</p></div>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-3xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">{section === 'network' ? 'Institute participation' : 'Weekly movement'}</p><h2 className="mt-2 text-xl font-semibold">Community momentum</h2></div><Pill tone="soft">Last 30 days</Pill></div><div className="mt-8 flex h-48 items-end gap-2">{[34, 48, 42, 63, 55, 76, 68, 82, 75, 91, 84, 100].map((height, index) => <div key={index} className="group flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-primary/80 transition group-hover:bg-primary" style={{ height: `${height}%` }} /><span className="text-[10px] text-muted-foreground">{index + 1}</span></div>)}</div></div><div className="rounded-3xl border border-border bg-card p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">{section === 'interests' ? 'Top interests' : 'Quick insights'}</h2><Sparkles className="size-4 text-primary" /></div><div className="mt-6 flex flex-col gap-4">{interests.map((interest) => <div key={interest.name}><div className="flex justify-between text-sm"><span className="font-medium">{interest.name}</span><span className="text-muted-foreground">{interest.count}</span></div><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, interest.count / 3)}%` }} /></div><p className="mt-1 text-right text-[11px] font-semibold text-primary">{interest.trend}</p></div>)}</div></div></div><p className="mt-8 text-xs text-muted-foreground">UI preview only — dashboard values are mock data and should be replaced by Supabase aggregation queries.</p></AppShell> }

const onboardingInterests = ['Music', 'Sports', 'Technology', 'Photography', 'Gaming', 'Entrepreneurship', 'Dance', 'Arts', 'Academic Projects', 'Volunteering', 'Fitness', 'Travel', 'Other']

function Onboarding() {
  const [profile, setProfile] = useState({ first_name: 'Student', institute: 'Symbiosis Institute of Digital and Telecom Management', program: 'MBA', year: 'Year 2' })
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('activity_logs').insert({ student_id: user.id, event_type: 'LOGIN' })
      await supabase.from('profiles').upsert({ id: user.id, last_active_at: new Date().toISOString() }, { onConflict: 'id' })
      const { data } = await supabase.from('profiles').select('first_name,institute,program,year').eq('id', user.id).maybeSingle()
      if (data) setProfile({ first_name: data.first_name || user.user_metadata?.first_name || 'Student', institute: data.institute || 'Symbiosis Institute of Technology', program: data.program || 'B.Tech Computer Science', year: data.year || 'Year 2' })
    }
    loadProfile()
  }, [])

  async function finish() {
    if (!selected.length) { setError('Choose at least one interest to continue.'); return }
    setSaving(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Your session has expired. Please sign in again.'); setSaving(false); return }
    const { error: interestError } = await supabase.from('student_interests').upsert(selected.map((interest) => ({ student_id: user.id, interest })))
    if (interestError) { setError(interestError.message); setSaving(false); return }
    await supabase.from('activity_logs').insert([
      { student_id: user.id, event_type: 'INTEREST_SELECTED', metadata: { interests: selected } },
      { student_id: user.id, event_type: 'ONBOARDING_COMPLETE' },
    ])
    await supabase.from('profiles').upsert({ id: user.id, last_active_at: new Date().toISOString() }, { onConflict: 'id' })
    window.location.href = '/home'
  }

  return <PublicShell><main className="mx-auto flex min-h-[calc(100vh-100px)] max-w-2xl items-center justify-center px-5 pb-16"><div className="w-full rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10"><Pill tone="soft"><Sparkles className="mr-1.5 size-3.5" /> Personalise your space</Pill><h1 className="mt-5 text-3xl font-semibold tracking-tight">Welcome to SymbiPulse, {profile.first_name}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Your verified student record is ready. Tell us what you are into so we can make your campus feed feel like yours.</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-muted p-4"><p className="text-xs text-muted-foreground">Institute</p><p className="mt-2 text-sm font-semibold">{profile.institute}</p></div><div className="rounded-2xl bg-muted p-4"><p className="text-xs text-muted-foreground">Program</p><p className="mt-2 text-sm font-semibold">{profile.program}</p></div><div className="rounded-2xl bg-muted p-4"><p className="text-xs text-muted-foreground">Year</p><p className="mt-2 text-sm font-semibold">{profile.year}</p></div></div><h2 className="mt-9 text-xl font-semibold">What are you into?</h2><p className="mt-2 text-sm text-muted-foreground">Pick all that sound like you.</p><div className="mt-5 flex flex-wrap gap-2">{onboardingInterests.map((interest) => { const active = selected.includes(interest); return <button key={interest} type="button" onClick={() => setSelected((current) => active ? current.filter((item) => item !== interest) : [...current, interest])} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'}`} aria-pressed={active}>{active && <Check className="mr-1.5 inline size-3.5" />}{interest}</button> })}</div>{error && <p role="alert" className="mt-4 text-sm font-medium text-destructive">{error}</p>}<Button onClick={finish} className="mt-8 w-full">{saving ? 'Saving your interests...' : 'Enter my student space'} {!saving && <ArrowRight className="size-4" />}</Button></div></main></PublicShell>
}

function PulseDetailsLive({ id }: { id: string }) { const [data, setData] = useState<any>(null); const [choice, setChoice] = useState<'NORMAL' | 'BLIND'>('NORMAL'); const [message, setMessage] = useState(''); const [joining, setJoining] = useState(false); useEffect(() => { fetch(`/api/pulses/${id}`).then((response) => response.json()).then(setData) }, [id]); async function join() { setJoining(true); const response = await fetch(`/api/pulses/${id}/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ joinType: choice }) }); const result = await response.json(); setMessage(response.ok ? choice === 'BLIND' ? 'You joined privately. Other students see Anonymous student.' : 'You joined this Pulse.' : result.message); setJoining(false); if (response.ok) fetch(`/api/pulses/${id}`).then((res) => res.json()).then(setData) } 
// if (!data) return <AppShell><p className="text-sm text-muted-foreground">Loading Pulse...</p></AppShell>; 
if (!data) {
  return (
    <AppShell>
      <p className="text-sm text-muted-foreground">
        Loading Pulse...
      </p>
    </AppShell>
  )
}

if (!data.pulse) {
  return (
    <AppShell>
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <h2 className="font-semibold">
          Unable to load this Pulse
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {data.message ?? 'The Pulse could not be loaded.'}
        </p>

        <Link
          href="/discover"
          className="mt-4 inline-block text-sm font-semibold text-primary"
        >
          ← Back to Discover
        </Link>
      </div>
    </AppShell>
  )
}

const { pulse, stats } = data; return <AppShell><Link href="/discover" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">← Back to discover</Link><div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr]"><div><div className="flex flex-wrap items-center gap-2"><Pill tone="soft">{pulse.category}</Pill>{pulse.blind_join_enabled && <Pill tone="primary"><ShieldCheck className="mr-1.5 size-3.5" /> Blind Join available</Pill>}</div><h1 className="mt-5 text-4xl font-semibold tracking-tight lg:text-5xl">{pulse.title}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">{pulse.description}</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">When</p><p className="mt-3 font-semibold">{pulse.date}</p><p className="mt-1 text-sm text-muted-foreground">{pulse.time}</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Where</p><p className="mt-3 font-semibold">{pulse.location}</p><p className="mt-1 text-sm text-muted-foreground">{pulse.institute}</p></div></div><div className="mt-8 rounded-2xl bg-muted p-6"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Participant signal</p><div className="mt-4 grid gap-4 sm:grid-cols-3"><div><p className="text-2xl font-semibold">{stats.total}</p><p className="text-xs text-muted-foreground">students joined</p></div><div><p className="text-2xl font-semibold">{stats.institutes}</p><p className="text-xs text-muted-foreground">institutes</p></div><div><p className="text-2xl font-semibold">{stats.total ? Math.round((stats.blind / stats.total) * 100) : 0}%</p><p className="text-xs text-muted-foreground">joined privately</p></div></div></div></div><aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-sm"><p className="text-sm font-semibold">Join this Pulse</p><div className="mt-5 grid gap-3"><button type="button" onClick={() => setChoice('NORMAL')} className={`rounded-2xl border p-4 text-left ${choice === 'NORMAL' ? 'border-primary bg-accent' : 'border-border'}`}><p className="font-semibold">Join openly</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Your participation is visible as a joined student.</p></button>{pulse.blind_join_enabled && <button type="button" onClick={() => setChoice('BLIND')} className={`rounded-2xl border p-4 text-left ${choice === 'BLIND' ? 'border-primary bg-accent' : 'border-border'}`}><p className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-primary" /> Join privately</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Other students see Anonymous student. You can reveal yourself later.</p></button>}</div><button data-testid="join-pulse" type="button" disabled={joining} onClick={join} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{joining ? 'Joining...' : choice === 'BLIND' ? 'Join privately' : 'Join Pulse'}</button>{message && <p role="status" className="mt-4 text-xs leading-5 text-muted-foreground">{message}</p>}</aside></div></AppShell> }



export function VibePulseApp({
  route,
  id,
}: {
  route: string
  id?: string
}) {
  if (route === '/') return <Landing />

  if (route === '/login') return <Login />

  if (route === '/verify') return <Verify />

  if (route === '/onboarding') return <Onboarding />

  if (route === '/home') return <Home />

  if (route === '/discover') return <Discover />

  if (route === '/create-pulse') return <CreatePulseLive />

  if (route === '/events') return <SimpleList type="events" />

  if (route === '/connections') return <SimpleList type="connections" />

  if (route === '/profile') return <SimpleList type="profile" />

  // Pulse details — supports /pulse/<pulse-id>
  if (route === '/pulse' || route.startsWith('/pulse/')) {
    return <PulseDetailsLive id={id ?? 'weekend-jam'} />
  }

  if (route.startsWith('/admin')) {
    return <Admin section={route.split('/')[2]} />
  }

  return <Landing />
}
// export function VibePulseApp({ route, id }: { route: string; id?: string }) {
// // { if (route === '/') return <Landing />; if (route === '/login') return <Login />; if (route === '/verify') return <Verify />; if (route === '/onboarding') return <Onboarding />; if (route === '/login') return <Login />; if (route === '/verify') return <Verify />; if (route === '/home') return <Home />; if (route === '/discover') return <Discover />; if (route === '/create-pulse') return <CreatePulseLive />; if (route === '/events') return <SimpleList type="events" />; if (route === '/connections') return <SimpleList type="connections" />; if (route === '/profile') return <SimpleList type="profile" />; if (route === '/pulse') return <PulseDetailsLive id={id ?? 'weekend-jam'} />; if (route.startsWith('/admin')) return <Admin section={route.split('/')[2]} />; return <Landing /> }
// if (route === '/pulse' || route.startsWith('/pulse/')) {
//   return <PulseDetailsLive id={id ?? 'weekend-jam'} />
// }
// export function VibePulseApp({ route, id }: { route: string; id?: string }) {
//   if (route === '/') return <Landing />
//   if (route === '/login') return <Login />
//   if (route === '/verify') return <Verify />
//   if (route === '/onboarding') return <Onboarding />
//   if (route === '/home') return <Home />
//   if (route === '/discover') return <Discover />
//   if (route === '/create-pulse') return <CreatePulseLive />
//   if (route === '/events') return <SimpleList type="events" />
//   if (route === '/connections') return <SimpleList type="connections" />
//   if (route === '/profile') return <SimpleList type="profile" />

//   // FIX
//   if (route.startsWith('/pulse/')) {
//     return <PulseDetailsLive id={id!} />
//   }

//   if (route.startsWith('/admin')) {
//     return <Admin section={route.split('/')[2]} />
//   }

//   return <Landing />
// }
// }
