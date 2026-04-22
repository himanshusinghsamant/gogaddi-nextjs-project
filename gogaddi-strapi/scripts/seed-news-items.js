/**
 * Seed News items (api::news-item.news-item) without images.
 *
 * - Upserts by `slug` (update if exists, create if missing)
 * - Publishes items (sets `publishedAt`)
 *
 * Run:
 *   npm run seed:news
 */

// Load environment variables from ./gogaddi-strapi/.env for this script.
// (Node does not load .env automatically.)
require('dotenv').config();

const NEWS_ITEMS = [
  {
    slug: 'news-item-9',
    title: 'Electric Cars Pipeline Expands in India',
    excerpt: 'Automakers are preparing a strong pipeline of electric vehicles...',
    description:
      'India’s electric vehicle market is witnessing rapid expansion as major automakers like Tata Motors, Mahindra, Hyundai, and Maruti Suzuki accelerate their EV strategies. With government incentives, improving charging infrastructure, and rising fuel costs, manufacturers are planning to launch multiple EV models across different price segments. Industry reports suggest EV penetration in India could reach nearly 9% by FY30, making it one of the fastest-growing EV markets globally.',
  },
  {
    slug: 'news-item-8',
    title: 'SUV Segment Continues to Dominate Indian Market',
    excerpt: 'SUVs remain the most popular vehicle category in India...',
    description:
      'The SUV segment continues to dominate the Indian automobile market, driven by strong demand for models like Tata Nexon, Hyundai Creta, and Kia Seltos. Consumers prefer SUVs for their higher ground clearance, road presence, and improved safety features. Industry data shows SUVs now contribute over 50% of total passenger vehicle sales, making them the most popular segment across urban and rural regions.',
  },
  {
    slug: 'news-item-7',
    title: 'Luxury Car Segment Sees New Launch Momentum',
    excerpt: 'Luxury brands continue to expand their lineup in India...',
    description:
      'Luxury carmakers such as Mercedes-Benz, BMW, and Audi are witnessing renewed momentum in India with multiple new launches planned in 2026. The demand for premium vehicles is rising among high-income consumers, supported by improved financing options and increasing disposable income. Electric luxury cars are also gaining traction, with brands focusing on sustainability and advanced technology features.',
  },
  {
    slug: 'news-item-6',
    title: 'Upcoming Car Launches in April 2026',
    excerpt: 'April 2026 is set to witness multiple car launches in India...',
    description:
      'April 2026 is expected to be a busy month for the Indian automotive industry, with several new car launches across segments. Brands like MG, Tata, and Hyundai are preparing to introduce updated models and new variants. These launches include electric SUVs, facelifted petrol models, and feature-rich compact cars aimed at capturing consumer interest during the festive buying season.',
  },
  {
    slug: 'news-item-5',
    title: 'Auto Industry Faces Supply Challenges Amid Global Tensions',
    excerpt:
      'Rising fuel and raw material costs are impacting vehicle supply chains...',
    description:
      'The global automotive industry is facing supply chain disruptions due to geopolitical tensions and rising raw material costs. Shortages of semiconductors, lithium, and other critical components are affecting production timelines. Indian manufacturers are also experiencing delays and cost pressures, leading to increased vehicle prices and longer waiting periods for customers.',
  },
  {
    slug: 'news-item-4',
    title: 'Maruti Suzuki Plans Major EV Expansion',
    excerpt: 'Maruti Suzuki has announced plans to introduce new electric vehicles...',
    description:
      'Maruti Suzuki has unveiled its long-term electric vehicle strategy, aiming to launch multiple EVs by 2031. The company plans to invest heavily in battery technology, local manufacturing, and charging infrastructure. With increasing competition in the EV space, Maruti’s expansion is expected to significantly impact the Indian electric vehicle ecosystem.',
  },
  {
    slug: 'news-item-3',
    title: 'EV, Hybrid and CNG Cars Capture 30% Market Share',
    excerpt: 'Clean mobility is rapidly gaining traction in India...',
    description:
      'Clean mobility options such as electric, hybrid, and CNG vehicles are rapidly gaining popularity in India. Together, these segments now account for nearly 30% of the total automobile market share. Government incentives, rising fuel costs, and environmental awareness are key factors driving this shift toward sustainable transportation.',
  },
  {
    slug: 'news-item-2',
    title: 'India Auto Sales Hit Record High in FY26',
    excerpt: 'India’s automobile industry achieved record-breaking sales in FY26...',
    description:
      'India’s automobile industry recorded its highest-ever sales in FY26, driven by strong demand across passenger vehicles, SUVs, and commercial vehicles. Improved economic conditions, better financing options, and festive season demand contributed to this growth. Mahindra overtook Tata Motors in market share, marking a significant shift in the industry landscape.',
  },
  {
    slug: 'news-item-1',
    title: 'Volkswagen Taigun Facelift Teased Ahead of Launch',
    excerpt:
      'Volkswagen has teased the updated Taigun facelift with refreshed styling...',
    description:
      'Volkswagen has officially teased the upcoming facelift of the Taigun SUV ahead of its launch in India. The updated model is expected to feature refreshed styling, improved interiors, and enhanced technology features. It will continue to compete with rivals like Hyundai Creta, Kia Seltos, and Skoda Kushaq in the mid-size SUV segment.',
  },
  {
    slug: 'news-item',
    title: 'MG Majestor SUV Set to Launch in India',
    excerpt:
      'MG Motor is gearing up to launch its premium SUV Majestor in India on April 20, 2026...',
    description:
      'MG Motor is preparing to launch its new premium SUV, the Majestor, in India. Positioned as a high-end offering, the SUV is expected to feature advanced driver assistance systems (ADAS), a powerful engine, and a premium interior design. The launch is scheduled for April 20, 2026, and it will compete with models like Toyota Fortuner and Jeep Meridian.',
  },
];

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function httpJson(url, { method, headers, body }) {
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!res.ok) {
    const details = typeof json === 'string' ? json : JSON.stringify(json);
    throw new Error(`[${method}] ${url} failed: ${res.status} ${res.statusText}\n${details}`);
  }

  return json;
}

async function main() {
  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const token = getEnv('STRAPI_API_TOKEN');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  let created = 0;
  let updated = 0;

  for (const item of NEWS_ITEMS) {
    const queryUrl =
      `${STRAPI_URL}/api/news-items?filters[slug][$eq]=` +
      encodeURIComponent(item.slug) +
      `&fields[0]=id&pagination[pageSize]=1`;

    const existingList = await httpJson(queryUrl, { method: 'GET', headers });
    const existing = existingList?.data?.[0];

    const data = {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      description: item.description,
      publishedAt: new Date().toISOString(),
    };

    if (existing?.id) {
      await httpJson(`${STRAPI_URL}/api/news-items/${existing.id}`, {
        method: 'PUT',
        headers,
        body: { data },
      });
      updated += 1;
    } else {
      await httpJson(`${STRAPI_URL}/api/news-items`, {
        method: 'POST',
        headers,
        body: { data },
      });
      created += 1;
    }
  }

  // eslint-disable-next-line no-console
  console.log(`[seed:news] done. created=${created} updated=${updated}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed:news] failed:', err);
  process.exit(1);
});

