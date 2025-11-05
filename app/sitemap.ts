import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE.url}/minigames`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]
  return urls
}