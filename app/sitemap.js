export default function sitemap() {
  const base = 'https://www.lemuradegliangeli.it';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/strutture`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/strutture/sternatia`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/strutture/corigliano`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/spa`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/galleria`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/esperienze`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/recensioni`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contatti`, lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
  ];
}
