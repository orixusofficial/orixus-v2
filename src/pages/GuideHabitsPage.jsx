import { useEffect } from 'react';
import '../styles/guide-article-page.css';

const ARTICLE = {
  title: 'How to Build Habits That Actually Stick',
  slug: 'how-to-build-habits-that-actually-stick',
  category: 'Habits',
  publishedDate: '2026-01-15',
  updatedDate: '2026-01-15',
  readingTime: '10 min read',
  description: 'Learn how to build habits that actually stick by designing realistic behaviors, reliable triggers, low-friction environments, and practical recovery plans.',
};

const FAQ_ITEMS = [
  {
    question: 'How do I make a habit stick?',
    answer: 'Make the habit specific, attach it to a reliable trigger, start with a version you can realistically repeat, reduce friction, track completion honestly, and have a recovery plan for difficult days. A habit becomes easier when the behavior is designed to fit your actual life.'
  },
  {
    question: 'Why do I keep failing at new habits?',
    answer: 'Common reasons include vague goals, unrealistic targets, trying too many habits at once, no clear trigger, too much friction, relying on motivation, expecting immediate results, and having no plan for difficult days. Designing the habit system around reality rather than ideal circumstances improves sustainability.'
  },
  {
    question: 'Should I start one habit at a time?',
    answer: 'Starting with one or a small number of meaningful habits allows you to focus your attention and energy. Once those behaviors become consistent, you can gradually add more. Trying to change too many behaviors simultaneously often leads to abandoning all of them.'
  },
  {
    question: 'How small should a new habit be?',
    answer: 'Start with a version you can realistically repeat even on difficult days. The purpose is to create a behavior that can be sustained, not to impress yourself. You can increase difficulty over time as consistency improves. The minimum version protects continuity.'
  },
  {
    question: 'What should I do when I miss a habit?',
    answer: 'Identify why it was missed, avoid turning one miss into abandonment, resume as soon as realistically possible, adjust the system if the target was unrealistic, and avoid compensating with excessive effort. The difference is between missing a behavior and giving up on the behavior.'
  },
  {
    question: 'How long does it take for a habit to become automatic?',
    answer: 'There is no universal timeframe. Automatic behavior develops through repeated practice and predictable routines. The more consistently you follow through on a behavior in a reliable context, the more automatic it becomes over time. The timeline varies by person and behavior.'
  }
];

export default function GuideHabitsPage() {
  useEffect(() => {
    document.title = 'How to Build Habits That Actually Stick | Orixus';
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
            Deciding to build a habit is different from designing a habit that can realistically be repeated. Enthusiasm at the beginning does not automatically produce a sustainable routine. A habit becomes easier to maintain when the behavior is specific, realistic, connected to a reliable context, easy to start, and supported by an environment that reduces friction.
          </p>

          <h2 className="guide-article-page__section-title">Why Most New Habits Don't Stick</h2>
          <p>
            New habits fail for practical reasons. Vague goals make it unclear what to actually do. Unrealistic targets create unnecessary difficulty. Trying too many habits at once spreads attention too thin. No clear trigger makes it easy to forget. Too much friction means the behavior requires effort before it even begins. Relying on motivation means the behavior depends on how you feel each day. Expecting immediate results leads to disappointment when progress is gradual. Having no plan for difficult days means one miss can turn into complete abandonment.
          </p>
          <p>
            Understanding these failure points helps you design habits that work with reality rather than against it.
          </p>

          <h2 className="guide-article-page__section-title">Choose a Behavior, Not Just a Goal</h2>
          <p>
            There is a difference between an outcome and a repeatable behavior. Goals provide direction, while habits define repeated action. A goal describes what you want to achieve. A habit describes what you will do repeatedly to move toward it.
          </p>
          <p>
            Examples of goals versus behaviors:
          </p>
          <ul className="guide-article-page__list">
            <li><strong>Goal:</strong> Get fit. <strong>Behavior:</strong> Walk for 20 minutes after dinner.</li>
            <li><strong>Goal:</strong> Read more. <strong>Behavior:</strong> Read 10 pages before bed.</li>
            <li><strong>Goal:</strong> Become better at programming. <strong>Behavior:</strong> Practice coding for 30 minutes after lunch.</li>
            <li><strong>Goal:</strong> Improve focus. <strong>Variable:</strong> Work without distractions for 25 minutes after breakfast.</li>
          </ul>
          <p>
            The behavior is the specific action you will repeat. The goal is the direction the repeated action moves you toward.
          </p>

          <h2 className="guide-article-page__section-title">Make the Habit Specific</h2>
          <p>
            Specific habits are easier to execute because they remove ambiguity. When you know exactly what you will do, when you will do it, where you will do it, and how much you will do, the behavior requires less decision-making.
          </p>
          <p>
            Compare vague intentions with specific definitions:
          </p>
          <ul className="guide-article-page__list">
            <li><strong>Vague:</strong> "I'll study more." <strong>Specific:</strong> "I'll study mathematics at my desk for 30 minutes after dinner."</li>
            <li><strong>Vague:</strong> "I'll exercise." <strong>Specific:</strong> "I'll do a 20-minute workout in the living room at 7:00 AM."</li>
            <li><strong>Vague:</strong> "I'll write." <strong>Specific:</strong> "I'll write for 15 minutes at my computer after breakfast."</li>
            <li><strong>Vague:</strong> "I'll journal." <strong>Specific:</strong> "I'll write three reflections in my notebook before bed."</li>
          </ul>
          <p>
            The more specific the habit, the less mental effort required to execute it.
          </p>

          <h2 className="guide-article-page__section-title">Start With a Version You Can Actually Repeat</h2>
          <p>
            The first version of a habit should be realistic enough to repeat even on difficult days. When you start with an ambitious target, ordinary obstacles can turn a difficult day into a zero day. A smaller target that you can realistically complete keeps the behavior alive.
          </p>
          <p>
            Examples of starting smaller:
          </p>
          <ul className="guide-article-page__list">
            <li>Instead of "Run 5 km every morning," start with "Put on running shoes and walk for 10 minutes."</li>
            <li>Instead of "Write every day for two hours," start with "Write for 15 minutes."</li>
            <li>Instead of "Read an entire chapter every night," start with "Read five pages."</li>
            <li>Instead of "Study for three hours," start with "Study for 30 minutes."</li>
          </ul>
          <p>
            The smaller version is a starting point, not necessarily the permanent target. You can increase difficulty over time as consistency improves.
          </p>

          <h2 className="guide-article-page__section-title">Give the Habit a Reliable Trigger</h2>
          <p>
            Existing routines can help remind you to perform a behavior. When you attach a new habit to something you already do regularly, the existing routine serves as a trigger. Consistency becomes easier when the habit has a predictable context.
          </p>
          <p>
            Examples of attaching habits to existing routines:
          </p>
          <ul className="guide-article-page__list">
            <li>After waking up → drink a glass of water.</li>
            <li>After breakfast → review today's priorities.</li>
            <li>After school → study for 30 minutes.</li>
            <li>After dinner → walk for 15 minutes.</li>
            <li>Before bed → journal for 5 minutes.</li>
          </ul>
          <p>
            The trigger should be something that already happens reliably in your routine.
          </p>

          <h2 className="guide-article-page__section-title">Design Your Environment</h2>
          <p>
            The environment can either support or obstruct a habit. When the desired behavior requires effort before you even begin, you are more likely to skip it. When unwanted behaviors are easily accessible, you are more likely to engage in them.
          </p>
          <p>
            For desired habits:
          </p>
          <ul className="guide-article-page__list">
            <li>Keep necessary tools visible and accessible.</li>
            <li>Prepare equipment beforehand.</li>
            <li>Make the first step obvious.</li>
            <li>Keep the workspace ready.</li>
          </ul>
          <p>
            For unwanted behaviors:
          </p>
          <ul className="guide-article-page__list">
            <li>Add friction to make starting harder.</li>
            <li>Remove easy access.</li>
            <li>Disable unnecessary notifications.</li>
            <li>Move distracting apps away from immediate access.</li>
          </ul>
          <p>
            Make good habits easier to start and unwanted behaviors harder to start.
          </p>

          <h2 className="guide-article-page__section-title">Define the Minimum Version</h2>
          <p>
            A minimum version of a habit protects continuity during difficult days. It is not the final goal—it is a safeguard that prevents temporary disruption from becoming complete abandonment.
          </p>
          <p>
            Examples of normal versus minimum versions:
          </p>
          <ul className="guide-article-page__list">
            <li><strong>Workout:</strong> Normal → 45-minute workout. Minimum → 10-minute movement session.</li>
            <li><strong>Study:</strong> Normal → 60 minutes. Minimum → 15 minutes.</li>
            <li><strong>Reading:</strong> Normal → 20 pages. Minimum → 5 pages.</li>
            <li><strong>Writing:</strong> Normal → 1,000 words. Minimum → 100 words.</li>
          </ul>
          <p>
            The minimum version keeps the behavior alive when circumstances are difficult. It does not mean that minimum effort is always enough for every goal—it means the behavior does not disappear entirely on bad days.
          </p>

          <h2 className="guide-article-page__section-title">Track the Behavior Honestly</h2>
          <p>
            Tracking can reveal how often the behavior actually happens, patterns in missed days, whether the target is realistic, and whether consistency is improving. When you record completion, streaks, completion percentages, and habit history, you gain a clearer picture of what works.
          </p>
          <p>
            The purpose of tracking is feedback, not perfection. It provides information that helps you adjust your systems—not to create pressure or shame.
          </p>
          <p>
            Orixus is designed to make daily habit completion visible so users can see whether their intended behavior is actually happening. This visibility helps identify patterns and adjust systems accordingly.
          </p>

          <h2 className="guide-article-page__section-title">Plan for Missed Days</h2>
          <p>
            A habit system should account for real life. Circumstances will interfere. Energy will fluctuate. Plans will change. The question is whether you have a plan for when things do not go as expected.
          </p>
          <p>
            Recovery framework:
          </p>
          <ol className="guide-article-page__list">
            <li>Identify why the habit was missed.</li>
            <li>Avoid turning one miss into abandonment.</li>
            <li>Resume as soon as realistically possible.</li>
            <li>Adjust the system if the target was unrealistic.</li>
            <li>Avoid compensating with excessive effort.</li>
          </ol>
          <p>
            The difference is between missing a behavior and giving up on the behavior.
          </p>

          <h2 className="guide-article-page__section-title">Don't Build Your Entire Life at Once</h2>
          <p>
            Adding a large collection of habits simultaneously can create unnecessary complexity. When you try to change everything at once, your attention spreads too thin and nothing receives enough focus.
          </p>
          <p>
            Instead of simultaneously trying to wake at 5 AM, exercise daily, read 50 pages, meditate, journal, study three hours, and eliminate social media, start with the few behaviors that matter most.
          </p>
          <p>
            Prioritize depth over breadth. Focus on making a small number of meaningful habits consistent before adding more.
          </p>

          <h2 className="guide-article-page__section-title">Review and Adjust the Habit</h2>
          <p>
            After several weeks, review whether the habit is working. Ask yourself:
          </p>
          <ul className="guide-article-page__list">
            <li>Is the behavior still realistic?</li>
            <li>Is the trigger reliable?</li>
            <li>What keeps causing missed days?</li>
            <li>Is there unnecessary friction?</li>
            <li>Does the habit still support the original goal?</li>
            <li>Should the target increase, decrease, or stay the same?</li>
          </ul>
          <p>
            Changing the design does not mean failure. Sometimes the system needs adjustment based on what actually happens in practice.
          </p>

          <h2 className="guide-article-page__section-title">A Practical Habit-Building Framework</h2>
          <div className="guide-article-page__day-plan">
            <h3>Step 1 — Choose the Goal</h3>
            <p>What are you trying to improve? Be specific about the direction you want to move.</p>
            
            <h3>Step 2 — Choose the Behavior</h3>
            <p>What repeated action moves you toward that goal? Define the specific behavior you will perform.</p>
            
            <h3>Step 3 — Define the Minimum</h3>
            <p>What is the smallest meaningful version you can realistically repeat even on difficult days?</p>
            
            <h3>Step 4 — Choose the Trigger</h3>
            <p>When and where will it happen? Attach it to an existing routine or a specific time.</p>
            
            <h3>Step 5 — Remove Friction</h3>
            <p>What can make starting easier? Prepare your environment, tools, and workspace beforehand.</p>
            
            <h3>Step 6 — Track It</h3>
            <p>How will you know whether you actually did it? Record completion to see patterns over time.</p>
            
            <h3>Step 7 — Review It</h3>
            <p>What should change based on real experience? Adjust the system based on what actually works.</p>
          </div>

          <h2 className="guide-article-page__section-title">Build Habits That Fit Your Real Life</h2>
          <p>
            A habit does not need to look impressive. It needs to be realistic enough to repeat and meaningful enough to matter. The goal is not to create the perfect routine. The goal is to create a system that survives ordinary life.
          </p>
          <p>
            Design habits around your actual circumstances, your actual energy, and your actual constraints. Make them specific, attach them to reliable triggers, reduce friction, track honestly, and adjust based on experience. That is how habits stick.
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
            Explore more guides on <a href="/guides/how-to-build-discipline" className="guide-article-page__link">discipline</a>, <a href="/guides/how-to-stay-consistent-with-your-habits" className="guide-article-page__link">consistency</a>, and <a href="/guides" className="guide-article-page__link">personal growth</a>. Learn more about <a href="/about" className="guide-article-page__link">Orixus</a> or visit our <a href="/faq" className="guide-article-page__link">FAQ</a>.
          </p>
        </footer>
      </div>
    </article>
  );
}
