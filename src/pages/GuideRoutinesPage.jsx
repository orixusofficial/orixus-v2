import { useEffect } from 'react';
import '../styles/guide-article-page.css';

const ARTICLE = {
  title: 'How to Build a Routine That Actually Works',
  slug: 'how-to-build-a-routine-that-actually-works',
  category: 'Routines',
  publishedDate: '2026-01-15',
  updatedDate: '2026-01-15',
  readingTime: '10 min read',
  description: 'Learn how to build a realistic routine that protects your priorities, works around real-life constraints, includes flexibility, and remains sustainable over time.',
};

const FAQ_ITEMS = [
  {
    question: 'How do I create a routine that I can actually follow?',
    answer: 'Start with your real constraints and priorities. Build around existing anchors like waking up, meals, and returning home. Leave reasonable buffer time instead of scheduling every minute. Create a minimum version for difficult days. Review weekly and remove what does not work. A routine should support your life, not become another thing you constantly fail to maintain.'
  },
  {
    question: 'How many things should I include in my daily routine?',
    answer: 'Include only what genuinely matters. Separate non-negotiables from important actions and optional actions. A routine becomes fragile when everything is treated as equally important. Focus on the few behaviors that create the most value rather than filling every available minute.'
  },
  {
    question: 'Is it better to have a morning or evening routine?',
    answer: 'Neither is universally better. The best routine depends on your actual schedule, energy patterns, and responsibilities. Some people work better in the morning, others in the evening. Match demanding work to your actual capacity when possible rather than following a generic template.'
  },
  {
    question: 'What should I do when I miss my routine?',
    answer: 'Identify what changed, keep the most important elements, temporarily remove optional elements, use the minimum version where necessary, and return to the normal structure when circumstances stabilize. Routine disruption is not personal failure—it is information about what is realistic.'
  },
  {
    question: 'Should my routine be the same every day?',
    answer: 'Not necessarily. Some elements may be daily while others work better on a weekly basis. Separating daily and weekly routines can prevent daily routines from becoming overloaded. Flexibility allows your routine to survive real-life changes.'
  },
  {
    question: 'How often should I change my routine?',
    answer: 'Review your routine weekly. If something consistently fails, remove it or change it. If something works well, keep it. Adjust based on evidence rather than impulse. A routine should evolve as your circumstances and priorities change.'
  }
];

export default function GuideRoutinesPage() {
  useEffect(() => {
    document.title = 'How to Build a Routine That Actually Works | Orixus';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', ARTICLE.description);
    }

    // JSON-LD Structured Data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: ARTICLE.title,
      description: ARTICLE.description,
      datePublished: ARTICLE.publishedDate,
      dateModified: ARTICLE.updatedDate,
      author: {
        '@type': 'Organization',
        name: 'Orixus'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Orixus',
        url: 'https://orixus.com'
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://orixus.com/guides/${ARTICLE.slug}`
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <article className="guide-article-page">
      <div className="guide-article-page__container">
        <button className="guide-article-page__back" onClick={handleBack}>
          ← Back to Guides
        </button>

        <header className="guide-article-page__header">
          <div className="guide-article-page__meta">
            <span className="guide-article-page__category">{ARTICLE.category}</span>
            <span className="guide-article-page__separator">•</span>
            <span className="guide-article-page__reading-time">{ARTICLE.readingTime}</span>
          </div>
          <h1 className="guide-article-page__title">{ARTICLE.title}</h1>
          <p className="guide-article-page__description">{ARTICLE.description}</p>
        </header>

        <div className="guide-article-page__content">
          <p className="guide-article-page__lead">
            Many routines fail because they look good on paper but contain too many tasks, unrealistic time estimates, no buffer, no flexibility, no prioritization, and no recovery plan. A good routine is not the most impressive schedule you can design. It is a structure that helps you consistently do the things that matter while remaining flexible enough to survive real life. A routine should support your life, not become another thing you constantly fail to maintain.
          </p>

          <h2 className="guide-article-page__section-title">What a Routine Actually Is</h2>
          <p>
            A routine is a repeatable structure for when and how certain actions happen. There is a difference between a habit, a routine, and a schedule.
          </p>
          <ul className="guide-article-page__list">
            <li><strong>Habit:</strong> A repeated behavior, such as brushing your teeth or journaling before bed.</li>
            <li><strong>Routine:</strong> A structured sequence or pattern that can contain multiple behaviors, such as a morning routine that includes waking, washing, eating, and planning.</li>
            <li><strong>Schedule:</strong> A broader allocation of time and events throughout the day or week.</li>
          </ul>
          <p>
            Understanding these distinctions helps you design the right structure for your goals.
          </p>

          <h2 className="guide-article-page__section-title">Start With Your Real Life</h2>
          <p>
            Before designing a routine, identify your actual constraints. Ask yourself:
          </p>
          <ul className="guide-article-page__list">
            <li>When do I need to wake up?</li>
            <li>When do I have school or work?</li>
            <li>When am I commuting?</li>
            <li>When do I normally have the most energy?</li>
            <li>What responsibilities are non-negotiable?</li>
            <li>How much free time actually exists?</li>
            <li>What regularly disrupts my plans?</li>
          </ul>
          <p>
            Design around reality first. Optimize second. Do not try to completely redesign your life around an ideal routine that ignores your actual circumstances.
          </p>

          <h2 className="guide-article-page__section-title">Choose Your Priorities</h2>
          <p>
            Routines should protect important actions rather than fill every available minute. Separate your activities into categories:
          </p>
          <ul className="guide-article-page__list">
            <li><strong>Non-negotiables:</strong> Things that genuinely must happen, such as sleep, school, work, or family responsibilities.</li>
            <li><strong>Important actions:</strong> Things that move meaningful goals forward, such as exercise, focused work, or studying.</li>
            <li><strong>Optional actions:</strong> Useful when time and energy allow, such as extra reading, side projects, or additional learning.</li>
          </ul>
          <p>
            A routine becomes fragile when everything is treated as equally important. Prioritize what actually matters.
          </p>

          <h2 className="guide-article-page__section-title">Build Around Anchors</h2>
          <p>
            Use existing parts of your day as stable reference points. These "routine anchors" provide structure without requiring you to remember everything.
          </p>
          <p>
            Common anchors include waking up, breakfast, leaving for work, returning home, dinner, and preparing for bed. Important behaviors can be placed around these anchors.
          </p>
          <p>
            Examples:
          </p>
          <ul className="guide-article-page__list">
            <li><strong>Morning:</strong> Wake → wash → breakfast → review priorities.</li>
            <li><strong>After work:</strong> Return home → change clothes → workout → shower.</li>
            <li><strong>Evening:</strong> Dinner → prepare tomorrow → journal → sleep routine.</li>
          </ul>
          <p>
            The specific sequence depends on your life. The principle is to attach new behaviors to things that already happen reliably.
          </p>

          <h2 className="guide-article-page__section-title">Don't Schedule Every Minute</h2>
          <p>
            Overly detailed schedules often fail because unexpected tasks appear, activities take longer than expected, energy changes, interruptions happen, and transitions take time. Scheduling every minute pretends that life is predictable when it is not.
          </p>
          <p>
            Instead of:
         </p>
          <ul className="guide-article-page__list">
            <li>8:00–8:30 study</li>
            <li>8:30–9:00 workout</li>
            <li>9:00–9:15 shower</li>
            <li>9:15–9:45 reading</li>
            <li>9:45–10:00 journal</li>
          </ul>
          <p>
            Use broader blocks:
          </p>
          <ul className="guide-article-page__list">
            <li>Morning focus block</li>
            <li>Workout</li>
            <li>Evening reading</li>
            <li>Short reflection</li>
          </ul>
          <p>
            The second approach provides structure without pretending every minute is predictable. Leave reasonable buffer time.
          </p>

          <h2 className="guide-article-page__section-title">Build a Minimum Version of Your Routine</h2>
          <p>
            Routines should have a fallback version for difficult days. When energy is low, circumstances are difficult, or time is limited, the minimum version keeps the structure alive.
          </p>
          <p>
            Example:
          </p>
          <ul className="guide-article-page__list">
            <li><strong>Normal day:</strong> Full workout, focused study, reading, journal.</li>
            <li><strong>Difficult day:</strong> Short movement, 15-minute study session, 5 pages, brief reflection.</li>
          </ul>
          <p>
            The fallback routine is not an excuse to permanently lower standards. It is a way to prevent one difficult day from completely destroying the structure.
          </p>

          <h2 className="guide-article-page__section-title">Separate Daily and Weekly Routines</h2>
          <p>
            Not everything needs to happen every day. Separating daily and weekly routines can prevent daily routines from becoming overloaded.
          </p>
          <p>
            <strong>Daily:</strong> Core habits, basic planning, essential responsibilities, recovery.
          </p>
          <p>
            <strong>Weekly:</strong> Reviewing goals, cleaning workspace, planning upcoming tasks, evaluating habits, adjusting priorities.
          </p>
          <p>
            Weekly structure allows you to handle important but less frequent tasks without crowding your daily routine.
          </p>

          <h2 className="guide-article-page__section-title">Protect Your High-Value Time</h2>
          <p>
            Some tasks require more attention than others. Identify when you personally work best and protect that time for demanding work.
          </p>
          <p>
            If mornings are productive, use mornings for demanding work. If evenings are better, protect evening focus time. Avoid claiming that mornings are inherently more productive—the important point is to match demanding work to your actual capacity when possible.
          </p>

          <h2 className="guide-article-page__section-title">Remove Friction From the Routine</h2>
          <p>
            Preparation can make routines easier. Prepare clothes beforehand, keep workout equipment accessible, prepare study materials, decide tomorrow's first task, organize the workspace, and reduce unnecessary notifications.
          </p>
          <p>
            When the first step is easy, you are more likely to follow through even on difficult days.
          </p>

          <h2 className="guide-article-page__section-title">What to Do When Your Routine Breaks</h2>
          <p>
            Real life will interrupt routines. Travel, exams, deadlines, illness, family responsibilities, unexpected work, and low-energy days will happen. A sustainable routine accounts for this.
          </p>
          <p>
            Recovery process:
          </p>
          <ol className="guide-article-page__list">
            <li>Identify what changed.</li>
            <li>Keep the most important elements.</li>
            <li>Temporarily remove optional elements.</li>
            <li>Use the minimum version where necessary.</li>
            <li>Return to the normal structure when circumstances stabilize.</li>
          </ol>
          <p>
            Routine disruption is not personal failure. It is information about what is realistic.
          </p>

          <h2 className="guide-article-page__section-title">Avoid the "Perfect Routine" Trap</h2>
          <p>
            Unrealistic routines commonly seen online include extreme early wake-up schedules, hours of meditation, multiple workouts, endless reading, perfectly optimized calendars, zero leisure, and zero interruptions. These routines are designed to look impressive, not to be lived.
          </p>
          <p>
            Evaluate a routine by asking: <strong>Can you actually live with it?</strong> not <strong>Does it look impressive?</strong> The best routine is the one you can maintain, not the one that looks perfect on paper.
          </p>

          <h2 className="guide-article-page__section-title">Review Your Routine Every Week</h2>
          <p>
            A weekly review helps you identify what works and what does not. Ask yourself:
          </p>
          <ul className="guide-article-page__list">
            <li>What worked?</li>
            <li>What consistently failed?</li>
            <li>Where did the routine feel unrealistic?</li>
            <li>Which tasks created unnecessary friction?</li>
            <li>What repeatedly got pushed aside?</li>
            <li>Which parts actually helped?</li>
            <li>What should be removed?</li>
            <li>What should be changed?</li>
          </ul>
          <p>
            Removing something from a routine can be an improvement rather than a failure. Keep what works and remove what does not.
          </p>

          <h2 className="guide-article-page__section-title">A Simple Routine-Building Framework</h2>
          <div className="guide-article-page__day-plan">
            <h3>Step 1 — List Your Fixed Commitments</h3>
            <p>School, work, family, sleep, travel, and other non-negotiable responsibilities.</p>
            
            <h3>Step 2 — Identify Your Priorities</h3>
            <p>What genuinely deserves recurring time? Choose the few actions that matter most.</p>
            
            <h3>Step 3 — Choose Your Anchors</h3>
            <p>Use existing parts of the day as stable reference points for new behaviors.</p>
            
            <h3>Step 4 — Add Essential Behaviors</h3>
            <p>Build the routine around the few actions that actually move your goals forward.</p>
            
            <h3>Step 5 — Add Realistic Buffers</h3>
            <p>Leave room for real life. Don't schedule every minute.</p>
            
            <h3>Step 6 — Create a Minimum Version</h3>
            <p>Decide what the routine looks like on difficult days.</p>
            
            <h3>Step 7 — Review Weekly</h3>
            <p>Keep what works and remove what does not. Adjust based on evidence.</p>
          </div>

          <h2 className="guide-article-page__section-title">Your Routine Should Make Important Actions Easier</h2>
          <p>
            A routine is not supposed to control every minute. It should reduce unnecessary decisions, protect important actions, and create a repeatable structure. The best routine is not the most complicated one. It is the one you can actually live with.
          </p>
          <p>
            Orixus can help make recurring habits and daily actions visible, giving users a clearer picture of whether their routine is actually being followed. Visibility helps identify patterns and adjust systems accordingly.
          </p>
          <p>
            Build a routine around your real life, protect what matters, leave room for flexibility, and adjust based on what actually happens. That is how you build a routine that works.
          </p>
        </div>

        <section className="guide-article-page__faq">
          <h2 className="guide-article-page__section-title">Frequently Asked Questions</h2>
          <div className="guide-article-page__faq-list">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="guide-article-page__faq-item">
                <h3 className="guide-article-page__faq-question">{item.question}</h3>
                <p className="guide-article-page__faq-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="guide-article-page__footer">
          <p className="guide-article-page__footer-text">
            Explore more guides on <a href="/guides/how-to-build-discipline" className="guide-article-page__link">discipline</a>, <a href="/guides/how-to-stay-consistent-with-your-habits" className="guide-article-page__link">consistency</a>, <a href="/guides/how-to-build-habits-that-actually-stick" className="guide-article-page__link">habits</a>, <a href="/guides/how-to-make-real-progress-in-personal-growth" className="guide-article-page__link">personal growth</a>, and <a href="/guides" className="guide-article-page__link">routines</a>. Learn more about <a href="/about" className="guide-article-page__link">Orixus</a> or visit our <a href="/faq" className="guide-article-page__link">FAQ</a>.
          </p>
        </footer>
      </div>
    </article>
  );
}
