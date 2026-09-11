import { VibePulseApp } from '@/components/vibe-pulse-app'

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const route = `/${slug.join('/')}`
  const id = slug[0] === 'pulse' ? slug[1] : undefined
  return <VibePulseApp route={route} id={id} />
}
