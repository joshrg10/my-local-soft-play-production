import { supabase } from '../lib/supabase';
import fs from 'fs/promises';
import path from 'path';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

/**
 * Generates a sitemap index file and individual sitemaps for locations and listings
 */
export async function generateSitemap(baseUrl: string = 'https://mylocalsoftplay.com') {
  try {
    // Create sitemaps directory if it doesn't exist
    const sitemapsDir = path.join(process.cwd(), 'public', 'sitemaps');
    await fs.mkdir(sitemapsDir, { recursive: true });

    // Generate static pages sitemap
    const staticSitemap = await generateStaticSitemap(baseUrl);
    await fs.writeFile(path.join(sitemapsDir, 'static.xml'), staticSitemap);

    // Generate locations sitemap
    const locationsSitemap = await generateLocationsSitemap(baseUrl);
    await fs.writeFile(path.join(sitemapsDir, 'locations.xml'), locationsSitemap);

    // Generate listings sitemaps (paginated if needed)
    const listingSitemaps = await generateListingSitemaps(baseUrl);
    for (const [filename, content] of Object.entries(listingSitemaps)) {
      await fs.writeFile(path.join(sitemapsDir, filename), content);
    }

    // Generate sitemap index
    const sitemapIndex = generateSitemapIndex(baseUrl, Object.keys(listingSitemaps));
    await fs.writeFile(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapIndex);

    console.log('Sitemaps generated successfully!');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
  }
}

/**
 * Generates sitemap for static pages
 */
async function generateStaticSitemap(baseUrl: string): Promise<string> {
  const staticPages: SitemapEntry[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/search`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/privacy-policy`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/soft-play-near-me`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/best-soft-play-areas-uk`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8'
    }
  ];

  return generateSitemapXml(staticPages);
}

/**
 * Generates sitemap for locations
 */
async function generateLocationsSitemap(baseUrl: string): Promise<string> {
  const { data: cities, error: citiesError } = await supabase
    .from('playgrounds')
    .select('city')
    .order('city');

  if (citiesError) {
    console.error('Error fetching cities:', citiesError);
    return generateSitemapXml([]);
  }

  const uniqueCities = [...new Set(cities?.map(item => item.city))];
  const locationEntries: SitemapEntry[] = uniqueCities.map(city => ({
    loc: `${baseUrl}/soft-play/${city.toLowerCase().replace(/\s+/g, '-')}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8'
  }));

  return generateSitemapXml(locationEntries);
}

/**
 * Generates paginated sitemaps for listings
 */
async function generateListingSitemaps(baseUrl: string): Promise<Record<string, string>> {
  const ENTRIES_PER_SITEMAP = 1000;
  const sitemaps: Record<string, string> = {};

  const { data: playgrounds, error: playgroundsError } = await supabase
    .from('playgrounds')
    .select('id, name, city, created_at, updated_at')
    .order('id');

  if (playgroundsError) {
    console.error('Error fetching playgrounds:', playgroundsError);
    return { 'listings.xml': generateSitemapXml([]) };
  }

  if (!playgrounds) return { 'listings.xml': generateSitemapXml([]) };

  // Split playgrounds into chunks of 1000
  for (let i = 0; i < playgrounds.length; i += ENTRIES_PER_SITEMAP) {
    const chunk = playgrounds.slice(i, i + ENTRIES_PER_SITEMAP);
    const pageNumber = Math.floor(i / ENTRIES_PER_SITEMAP) + 1;
    const filename = `listings${pageNumber > 1 ? `-${pageNumber}` : ''}.xml`;

    const entries: SitemapEntry[] = chunk.map(playground => {
      const citySlug = playground.city.toLowerCase().replace(/\s+/g, '-');
      const nameSlug = playground.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      return {
        loc: `${baseUrl}/soft-play/${citySlug}/${nameSlug}`,
        lastmod: (playground.updated_at || playground.created_at || new Date().toISOString()).split('T')[0],
        changefreq: 'weekly',
        priority: '0.7'
      };
    });

    sitemaps[filename] = generateSitemapXml(entries);
  }

  return sitemaps;
}

/**
 * Generates sitemap XML from entries
 */
function generateSitemapXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('')}
</urlset>`;
}

/**
 * Generates sitemap index XML
 */
function generateSitemapIndex(baseUrl: string Continuing with the sitemap generator function:
)