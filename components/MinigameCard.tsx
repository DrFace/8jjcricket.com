import Link from 'next/link'

export default function MinigameCard({ slug, title, desc }: { slug: string, title: string, desc: string }) {
  return (
    <Link href={`/minigames/${slug}`} className="card block hover:shadow-md">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </Link>
  )
}