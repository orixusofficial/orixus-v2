const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://orixus.vercel.app/#website',
      url: 'https://orixus.vercel.app',
      name: 'Orixus',
      description: 'A self-improvement platform combining habit tracking, discipline tracking, journaling, and personal growth into one system.',
      publisher: {
        '@id': 'https://orixus.vercel.app/#organization'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://orixus.vercel.app/?s={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://orixus.vercel.app/#webapplication',
      name: 'Orixus',
      url: 'https://orixus.vercel.app',
      description: 'A personal evolution system for building discipline, tracking habits, and creating measurable personal growth through identity-based progression.',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript enabled',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Core functionality is free for personal use'
      },
      featureList: [
        'Habit tracking with visual discipline matrix',
        'Discipline and consistency tracking',
        'Personal growth journaling',
        'Progress analytics and streak tracking',
        'Identity rank progression system'
      ]
    },
    {
      '@type': 'Organization',
      '@id': 'https://orixus.vercel.app/#organization',
      name: 'Orixus',
      url: 'https://orixus.vercel.app',
      description: 'A self-improvement platform focused on discipline, consistency, and personal growth through habit tracking and journaling.',
      logo: {
        '@type': 'ImageObject',
        url: 'https://orixus.vercel.app/logo.svg'
      }
    }
  ]
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
    />
  );
}
