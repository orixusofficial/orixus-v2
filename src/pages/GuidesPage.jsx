import { useEffect, useState } from 'react';
import JsonLd from '../components/JsonLd';
import '../styles/guides-page.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const GUIDE_CATEGORIES = [
  { id: 'discipline', label: 'Discipline' },
  { id: 'consistency', label: 'Consistency' },
  { id: 'habits', label: 'Habits' },
  { id: 'personal-growth', label: 'Personal Growth' },
  { id: 'routines', label: 'Routines' },
];

const GUIDES = [
  {
    slug: 'how-to-build-discipline',
    title: 'How to Build Discipline When Motivation Fades',
    category: 'discipline',
    description: 'Learn how to build discipline when motivation fades by using clear commitments, practical systems, environmental design, and consistent daily action.',
    readingTime: '8 min read',
  },
  {
    slug: 'how-to-stay-consistent-with-your-habits',
    title: 'How to Stay Consistent With Your Habits',
    category: 'consistency',
    description: 'Learn how to stay consistent with your habits by building realistic routines, reducing friction, tracking progress, and recovering effectively after missed days.',
    readingTime: '9 min read',
  },
  {
    slug: 'how-to-build-habits-that-actually-stick',
    title: 'How to Build Habits That Actually Stick',
    category: 'habits',
    description: 'Learn how to build habits that actually stick by designing realistic behaviors, reliable triggers, low-friction environments, and practical recovery plans.',
    readingTime: '10 min read',
  },
  {
    slug: 'how-to-make-real-progress-in-personal-growth',
    title: 'How to Make Real Progress in Personal Growth',
    category: 'personal-growth',
    description: 'Learn how to make real progress in personal growth by identifying weaknesses, choosing meaningful priorities, taking action, measuring evidence, and reviewing your system.',
    readingTime: '11 min read',
  },
  {
    slug: 'how-to-build-a-routine-that-actually-works',
    title: 'How to Build a Routine That Actually Works',
    category: 'routines',
    description: 'Learn how to build a realistic routine that protects your priorities, works around real-life constraints, includes flexibility, and remains sustainable over time.',
    readingTime: '10 min read',
  },
];

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    document.title = 'Orixus Guides — Discipline, Habits & Personal Growth';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Practical guides on discipline, consistency, habits, routines, and personal growth from Orixus.');
    }
  }, []);

  const handleBack = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = '/';
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const filteredGuides = selectedCategory
    ? GUIDES.filter((guide) => guide.category === selectedCategory)
    : GUIDES;

  return (
    <div className="guides-page">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orixus.vercel.app/' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://orixus.vercel.app/guides' }
        ]
      }} />
      <div className="guides-page__container">
        <button className="guides-page__back" onClick={handleBack}>
          {backArrow}
          Back
        </button>

        <header className="guides-page__header">
          <h1 className="guides-page__title">Orixus Guides</h1>
          <p className="guides-page__subtitle">Practical frameworks for building discipline, consistency, habits, and personal growth.</p>
        </header>

        <section className="guides-page__categories">
          <h2 className="guides-page__section-title">Browse by Category</h2>
          <div className="guides-page__category-list">
            {GUIDE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`guides-page__category-button${selectedCategory === category.id ? ' guides-page__category-button--active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        <section className="guides-page__content">
          {filteredGuides.length === 0 ? (
            <div className="guides-page__empty-state">
              <h2 className="guides-page__empty-title">No guides found.</h2>
              <p className="guides-page__empty-description">
                Try selecting a different category or check back later.
              </p>
            </div>
          ) : (
            <div className="guides-page__guide-list">
              {filteredGuides.map((guide) => (
                <a
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="guides-page__guide-card"
                >
                  <div className="guides-page__guide-card-header">
                    <span className="guides-page__guide-category">
                      {GUIDE_CATEGORIES.find((cat) => cat.id === guide.category)?.label}
                    </span>
                    <span className="guides-page__guide-reading-time">{guide.readingTime}</span>
                  </div>
                  <h3 className="guides-page__guide-title">{guide.title}</h3>
                  <p className="guides-page__guide-description">{guide.description}</p>
                  <span className="guides-page__guide-link">Read guide →</span>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="guides-page__links">
          <p className="guides-page__links-text">
            Learn more about <a href="/about" className="guides-page__link">Orixus</a>, explore our <a href="/faq" className="guides-page__link">FAQ</a>, or <a href="/contact" className="guides-page__link">contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
