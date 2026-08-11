import { useEffect } from 'react';
import '../styles/guide-article-page.css';

const ARTICLE = {
  title: 'How to Build Discipline When Motivation Fades',
  slug: 'how-to-build-discipline',
  category: 'Discipline',
  publishedDate: '2026-01-15',
  updatedDate: '2026-01-15',
  readingTime: '8 min read',
  description: 'Learn how to build discipline when motivation fades by using clear commitments, practical systems, environmental design, and consistent daily action.',
};

const FAQ_ITEMS = [
  {
    question: 'Can discipline exist without motivation?',
    answer: 'Yes. Discipline is the ability to follow through on chosen actions even when immediate feelings do not encourage you to do them. Motivation can help, but reliable behavior depends on systems and commitments rather than waiting to feel motivated.'
  },
  {
    question: 'How do I stay disciplined when I do not feel like doing something?',
    answer: 'Focus on the minimum viable action—the smallest version of the behavior that still counts as progress. Lower the barrier to starting, not the standard itself. Use specific time-based commitments and environmental design to make the action easier.'
  },
  {
    question: 'What should I do after missing a day?',
    answer: 'Treat a missed day as information, not failure. Identify what caused the miss, decide whether your system was realistic, remove unnecessary friction, and resume the behavior. The problem is not missing one day—it is repeatedly abandoning the system.'
  },
  {
    question: 'Should I build multiple habits at once?',
    answer: 'Start with one meaningful commitment. Trying to completely rebuild your life at once usually creates unnecessary friction. Once one behavior becomes consistent, you can gradually add more.'
  },
  {
    question: 'How long does it take to become disciplined?',
    answer: 'There is no fixed timeframe. Discipline develops through repeated practice and predictable routines. The more consistently you follow through on commitments, the easier it becomes to act regardless of how you feel.'
  }
];

export default function GuideArticlePage() {
  useEffect(() => {
    document.title = 'How to Build Discipline When Motivation Fades | Orixus';
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
            Motivation naturally fluctuates. Some days you feel ready to take on anything. Other days, even small tasks feel difficult. Waiting to feel motivated before taking action creates inconsistency. Discipline is developed through repeated behavior and systems—not by waiting for the right feeling. The goal is not perfection, but reliable action.
          </p>

          <h2 className="guide-article-page__section-title">Why Motivation Is Not Enough</h2>
          <p>
            Motivation changes from day to day. Your energy levels, emotional state, and circumstances all affect your willingness to act. When you rely entirely on motivation, your behavior becomes unpredictable. You act when you feel like it and avoid action when you don't.
          </p>
          <p>
            Disciplined behavior needs to continue even when motivation is low. This does not mean forcing yourself through every situation without regard for rest or well-being. It means having systems in place that make the desired action clear, repeatable, and easier to execute regardless of how you feel in the moment.
          </p>

          <h2 className="guide-article-page__section-title">What Discipline Actually Means</h2>
          <p>
            Discipline is the ability to follow through on chosen actions even when immediate feelings do not encourage you to do them. It is not punishment, perfectionism, extreme routines, or constant productivity.
          </p>
          <p>
            Discipline is not about becoming a completely different person. It is about building systems that make your chosen behaviors clear, repeatable, measurable, and easier to execute. When you remove unnecessary friction and create predictable cues, taking action requires less willpower.
          </p>

          <h2 className="guide-article-page__section-title">Start With One Non-Negotiable</h2>
          <p>
            Trying to completely rebuild your life at once usually creates unnecessary friction. When you attempt to change everything simultaneously, you increase cognitive load and make it harder to follow through on any single commitment.
          </p>
          <p>
            Instead, choose one meaningful behavior. Make it specific. Give it a clear time or trigger. Keep the minimum version achievable. Repeat it consistently.
          </p>
          <p>
            Instead of vague commitments like "become healthier" or "be more productive," use specific actions tied to time or context:
          </p>
          <ul className="guide-article-page__list">
            <li>Walk for 20 minutes after dinner.</li>
            <li>Write for 30 minutes after breakfast.</li>
            <li>Review tomorrow's priorities before going to sleep.</li>
            <li>Train on Monday, Wednesday, and Friday at 7:00 AM.</li>
          </ul>

          <h2 className="guide-article-page__section-title">Make the Right Action Easier</h2>
          <p>
            Environmental design plays a significant role in whether you follow through. The more friction between you and the desired action, the less likely you are to do it—especially on low-motivation days.
          </p>
          <p>
            Reduce friction for the behavior you want and increase friction for the behavior you want to avoid. Practical examples include:
          </p>
          <ul className="guide-article-page__list">
            <li>Prepare gym clothes the night before.</li>
            <li>Keep your phone in another room during focused work.</li>
            <li>Keep required tools visible and accessible.</li>
            <li>Prepare tomorrow's priorities the night before.</li>
            <li>Remove unnecessary decisions from recurring routines.</li>
          </ul>
          <p>
            When the right action requires less effort, you rely less on willpower and more on the structure you have created.
          </p>

          <h2 className="guide-article-page__section-title">Lower the Barrier, Not the Standard</h2>
          <p>
            There is a difference between lowering your expectations permanently and creating a minimum viable action. The minimum is not the final goal—it is a safeguard against difficult days automatically becoming zero days.
          </p>
          <p>
            If your normal target is to study for 60 minutes, your minimum might be to open the material and study for 10 minutes. On a difficult day, completing the minimum still counts as progress. On a good day, you can extend beyond the minimum.
          </p>
          <p>
            This approach prevents one difficult day from breaking your streak while maintaining a realistic standard over time.
          </p>

          <h2 className="guide-article-page__section-title">Use Commitments Instead of Feelings</h2>
          <p>
            Define actions beforehand rather than deciding in the moment based on how you feel. The difference between "I'll do it when I feel motivated" and "This is what I do at this time" is significant.
          </p>
          <p>
            Time-based commitments remove the need for daily decision-making. Examples include:
          </p>
          <ul className="guide-article-page__list">
            <li>I train Monday, Wednesday, and Friday at 7:00 AM.</li>
            <li>I write for 30 minutes after breakfast.</li>
            <li>I review tomorrow's priorities before going to sleep.</li>
            <li>I walk for 20 minutes after dinner.</li>
          </ul>
          <p>
            When the commitment is clear, you do not need to decide whether to act—you simply follow the system you have created.
          </p>

          <h2 className="guide-article-page__section-title">Track What You Actually Do</h2>
          <p>
            Visible tracking can help with accountability and awareness. When you record completed actions, missed actions, streaks, and consistency, you gain a clearer picture of your patterns.
          </p>
          <p>
            Tracking is a tool, not the goal. The purpose is to provide information that helps you adjust your systems—not to create pressure or shame. Reviewing your patterns over time helps you identify what makes certain behaviors easier or harder.
          </p>
          <p>
            Orixus provides habit tracking and progress tracking as one example of this approach. By recording daily actions and reviewing consistency, you can see where your systems are working and where they need adjustment.
          </p>

          <h2 className="guide-article-page__section-title">Learn From Missed Days</h2>
          <p>
            Missing one day should not become "I failed, so the system is pointless." A missed day is information. Repeatedly abandoning the system is the bigger problem.
          </p>
          <p>
            When you miss a day, follow this process:
          </p>
          <ol className="guide-article-page__list">
            <li>Identify what caused the miss.</li>
            <li>Decide whether the system was unrealistic.</li>
            <li>Remove unnecessary friction.</li>
            <li>Resume the behavior.</li>
            <li>Continue.</li>
          </ol>
          <p>
            The goal is not to never miss a day. The goal is to miss fewer days over time and to return to your system quickly when you do.
          </p>

          <h2 className="guide-article-page__section-title">Build Discipline Through Repetition</h2>
          <p>
            Discipline becomes easier when actions become familiar and predictable. Repetition, consistent cues, and predictable routines all contribute to this process.
          </p>
          <p>
            When a behavior is tied to a specific time or trigger, you do not need to decide whether to act—you simply follow the pattern. Over time, this reduces the mental effort required and makes the behavior more automatic.
          </p>
          <p>
            As consistency improves, you can gradually increase difficulty. The key is to build a foundation of reliable action before adding complexity.
          </p>

          <h2 className="guide-article-page__section-title">A Simple 7-Day Discipline Reset</h2>
          <div className="guide-article-page__day-plan">
            <h3>Day 1: Choose One Commitment</h3>
            <p>Select one meaningful behavior you want to make consistent. Make it specific and tie it to a time or trigger.</p>
            
            <h3>Day 2: Remove One Source of Friction</h3>
            <p>Identify one obstacle that makes the behavior harder and remove it. Prepare tools, change your environment, or adjust your schedule.</p>
            
            <h3>Day 3: Set a Specific Time or Trigger</h3>
            <p>Define exactly when you will perform the behavior. Tie it to an existing routine or a specific time of day.</p>
            
            <h3>Day 4: Complete the Minimum Version</h3>
            <p>On a difficult day, complete the minimum viable version of the behavior. Count it as progress and continue.</p>
            
            <h3>Day 5: Track Completion Honestly</h3>
            <p>Record whether you completed the behavior. Note what made it easier or harder.</p>
            
            <h3>Day 6: Review Patterns</h3>
            <p>Review the past five days. What made the behavior easier? What made it harder? Adjust your system accordingly.</p>
            
            <h3>Day 7: Review and Adjust</h3>
            <p>Review the entire week. Decide whether to continue the current commitment, adjust the difficulty, or add a second behavior.</p>
          </div>

          <h2 className="guide-article-page__section-title">Discipline Is a System, Not a Personality Trait</h2>
          <p>
            You do not need to become a completely different person before you can act consistently. Build systems that make the desired behavior clear, repeatable, measurable, and easier to execute. Discipline grows through practice.
          </p>
          <p>
            The more consistently you follow through on commitments, the easier it becomes to act regardless of how you feel. Start small, remove friction, and let repetition do the rest.
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
            Explore more guides on <a href="/guides" className="guide-article-page__link">discipline</a>, <a href="/guides" className="guide-article-page__link">consistency</a>, and <a href="/guides" className="guide-article-page__link">personal growth</a>. Learn more about <a href="/about" className="guide-article-page__link">Orixus</a> or visit our <a href="/faq" className="guide-article-page__link">FAQ</a>.
          </p>
        </footer>
      </div>
    </article>
  );
}
