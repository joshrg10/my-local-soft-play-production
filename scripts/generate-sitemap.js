import { supabase } from './supabase.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the base URL for your production site
const baseUrl = process.env.SITE_URL || 'https://mylocalsoftplay.com';

async function generateSitemap() {
  try {
    // Create sitemaps directory if it doesn't exist
    const sitemapsDir = join(dirname(__dirname), 'public', 'sitemaps');
    await fs.mkdir(sitemapsDir, { recursive: true });

    // Generate static pages sitemap
    const staticSitemap = await generateStaticSitemap();
    await fs.writeFile(join(sitemapsDir, 'static.xml'), staticSitemap);

    // Generate locations sitemap
    const locationsSitemap = await generateLocationsSitemap();
    await fs.writeFile(join(sitemapsDir, 'locations.xml'), locationsSitemap);

    // Generate listings sitemaps (paginated if needed)
    const listingSitemaps = await generateListingSitemaps();
    for (const [filename, content] of Object.entries(listingSitemaps)) {
      await fs.writeFile(join(sitemapsDir, filename), content);
    }

    // Generate sitemap index
    const sitemapIndex = generateSitemapIndex(Object.keys(listingSitemaps));
    await fs.writeFile(join(dirname(__dirname), 'public', 'sitemap.xml'), sitemapIndex);

    console.log('Sitemaps generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    process.exit(1);
  }
}

async function generateStaticSitemap() {
  const staticPages = [
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

async function generateLocationsSitemap() {
  const { data: cities, error: citiesError } = await supabase
    .from('playgrounds')
    .select('city')
    .order('city');

  if (citiesError) {
    console.error('Error fetching cities:', citiesError);
    return generateSitemapXml([]);
  }

  const uniqueCities = [...new Set(cities?.map(item => item.city))];
  const locationEntries = uniqueCities.map(city => ({
    loc: `${baseUrl}/soft-play/${city.toLowerCase().replace(/\s+/g, '-')}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8'
  }));

  return generateSitemapXml(locationEntries);
}

async function generateListingSitemaps() {
  const ENTRIES_PER_SITEMAP = 1000;
  const sitemaps = {};

  try {
    // First get all playgrounds
    const { data: playgrounds, error } = await supabase
      .from('playgrounds')
      .select('*');

    if (error) {
      throw error;
    }

    if (!playgrounds || playgrounds.length === 0) {
      return { 'listings.xml': generateSitemapXml([]) };
    }

    // Split playgrounds into chunks of 1000
    for (let i = 0; i < playgrounds.length; i += ENTRIES_PER_SITEMAP) {
      const chunk = playgrounds.slice(i, i + ENTRIES_PER_SITEMAP);
      const pageNumber = Math.floor(i / ENTRIES_PER_SITEMAP) + 1;
      const filename = `listings${pageNumber > 1 ? `-${pageNumber}` : ''}.xml`;

      const entries = chunk.map(playground => {
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
  } catch (error) {
    console.error('Error generating listings sitemap:', error);
    return { 'listings.xml': generateSitemapXml([]) };
  }
}

function generateSitemapXml(entries) {
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

function generateSitemapIndex(listingSitemapFiles) {
  const today = new Date().toISOString().split('T')[0];
  const sitemaps = [
    'sitemaps/static.xml',
    'sitemaps/locations.xml',
    ...listingSitemapFiles.map(file => `sitemaps/${file}`)
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${baseUrl}/${sitemap}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;
}

// Run the sitemap generation
generateSitemap();