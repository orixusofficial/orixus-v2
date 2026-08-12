import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import JsonLd from '../components/JsonLd';
import '../styles/faq-page.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    questions: [
      {
        id: 'what-is-orixus',
        question: 'What is Orixus?',
        answer: 'Orixus is a self-improvement operating system focused on discipline, consistency, habits, daily action, journaling, and personal progression. It provides a structured approach to building lasting habits through visual tracking, journaling, and identity-based rank progression.'
      },
      {
        id: 'is-orixus-free',
        question: 'Is Orixus free?',
        answer: 'Yes, Orixus is currently free to use. Create an account to start tracking habits, journaling, and progressing through the rank system.'
      },
      {
        id: 'how-to-get-started',
        question: 'How do I get started with Orixus?',
        answer: 'After creating an account, you will go through onboarding where you can create your first habits and set their durations. Once complete, you can begin tracking daily completions in the Discipline Matrix.'
      },
      {
        id: 'account-required',
        question: 'Do I need an account to use Orixus?',
        answer: 'Yes, an account is required to track your habits, journal entries, and progress. Your data is securely stored and associated with your account.'
      },
      {
        id: 'mobile-support',
        question: 'Can I use Orixus on mobile?',
        answer: 'Yes, Orixus is a responsive web application that works on mobile devices, tablets, and desktop browsers.'
      }
    ]
  },
  {
    id: 'habits-discipline',
    title: 'Habits & Discipline',
    questions: [
      {
        id: 'how-habit-tracking-works',
        question: 'How does habit tracking work?',
        answer: 'Orixus uses a visual Discipline Matrix where each habit is represented as a row with daily checkboxes. You complete habits by marking each day as done. The matrix shows your progress over time with inactive days grayed out based on habit duration.'
      },
      {
        id: 'missed-day-behavior',
        question: 'What happens when I miss a day?',
        answer: 'Missed days remain visible in your matrix. Orixus does not allow retroactive habit completion to encourage honest progress tracking rather than perfect streaks.'
      },
      {
        id: 'previous-day-completion',
        question: 'Can I complete a habit for a previous day?',
        answer: 'No, Orixus does not allow completing habits for previous days. Only today\'s habits can be completed to maintain accurate progress tracking.'
      },
      {
        id: 'streak-calculation',
        question: 'How are habit streaks calculated?',
        answer: 'Streaks are calculated as consecutive days where all active habits were completed. If you miss any habit on a day, the streak resets. The calculation looks at past days to determine your current and best streaks.'
      },
      {
        id: 'change-habit-duration',
        question: 'Can I change a habit\'s duration?',
        answer: 'Yes, you can change a habit\'s duration. However, you cannot set the duration below the number of days you have already progressed. For example, if you are on Day 8 of a habit, you cannot reduce the duration below 8 days.'
      },
      {
        id: 'habit-duration-end',
        question: 'What happens when a habit reaches the end of its duration?',
        answer: 'When a habit reaches its duration end date, future days beyond that date are marked as inactive in the matrix. You can extend the duration at any time to continue tracking.'
      }
    ]
  },
  {
    id: 'daily-checkins',
    title: 'Daily Check-ins',
    questions: [
      {
        id: 'what-is-checkin',
        question: 'What is a daily check-in?',
        answer: 'A daily check-in refers to completing your habits for a given day. Each habit completion counts as a check-in, and completing all active habits for a day contributes to your streak.'
      },
      {
        id: 'checkin-effect',
        question: 'How does a daily check-in affect my progress?',
        answer: 'Daily check-ins contribute to your streak, consistency rate, and rank progression. Completing all active habits on a day maintains or increases your streak, while missing any habit can reset it.'
      },
      {
        id: 'multiple-checkins',
        question: 'Can I complete more than one check-in per day?',
        answer: 'You can complete each of your active habits once per day. Each habit completion is tracked individually, and completing all habits on a day counts as a perfect day for streak purposes.'
      },
      {
        id: 'missed-checkin',
        question: 'What happens if I miss a check-in?',
        answer: 'Missing a check-in (not completing a habit on a given day) will be visible in your matrix. If you miss any habit, it may affect your streak depending on whether all habits were completed that day.'
      }
    ]
  },
  {
    id: 'ranks-progression',
    title: 'Ranks & Progression',
    questions: [
      {
        id: 'how-ranks-work',
        question: 'How do Orixus ranks work?',
        answer: 'Orixus ranks represent your identity progression based on your streak and total habit completions. The ranks are: Initiate (starting rank), Ascendant, Vanguard, Apex, and Sovereign. Each rank requires meeting both a minimum streak and minimum habit completion threshold.'
      },
      {
        id: 'reach-next-rank',
        question: 'How do I reach the next rank?',
        answer: 'To reach the next rank, you must meet both the minimum streak and minimum habit completion requirements for that rank. For example, Ascendant requires a 7-day streak and 20 total habit completions. Progress is calculated based on how close you are to both requirements.'
      },
      {
        id: 'lose-rank',
        question: 'Can I lose a rank?',
        answer: 'No, once you achieve a rank, it is permanent. Ranks represent milestones you have reached and are not lost if your streak decreases later.'
      },
      {
        id: 'rank-ceremony',
        question: 'What is a rank ceremony?',
        answer: 'A rank ceremony is a special celebration that appears when you reach a new rank for the first time. It recognizes your achievement and progression to the next level of identity.'
      },
      {
        id: 'ceremony-once',
        question: 'Why do I only see a rank ceremony once?',
        answer: 'Rank ceremonies are designed as one-time recognition moments when you first achieve a new rank. This keeps the ceremony meaningful as a milestone celebration rather than a repeated notification.'
      }
    ]
  },
  {
    id: 'achievements',
    title: 'Achievements',
    questions: [
      {
        id: 'how-achievements-work',
        question: 'How do achievements work?',
        answer: 'Achievements are unlocked by meeting specific criteria related to your habits, streaks, journal entries, and other activities. There are achievements for streaks, execution milestones, journaling, and secret achievements for special accomplishments.'
      },
      {
        id: 'achievements-permanent',
        question: 'Are achievements permanent?',
        answer: 'Yes, once unlocked, achievements remain on your profile. They represent milestones you have achieved and are not lost.'
      },
      {
        id: 'achievement-not-unlocked',
        question: 'Why haven\'t I unlocked an achievement?',
        answer: 'Check the specific requirements for the achievement. Some require streaks of certain lengths, total habit completions, journal entry counts, or specific conditions like completing habits at particular times of day. Ensure you meet all criteria for the achievement.'
      },
      {
        id: 'secret-achievements',
        question: 'Does Orixus have secret achievements?',
        answer: 'Yes, Orixus has secret achievements that are not visible until unlocked. These include achievements for special behaviors like completing habits at specific times, being an early adopter, or maintaining certain patterns over time.'
      }
    ]
  },
  {
    id: 'journal',
    title: 'Journal',
    questions: [
      {
        id: 'what-is-journal',
        question: 'What is the Journal?',
        answer: 'The Journal is a personal reflection tool where you can capture thoughts, decisions, friction points, and lessons learned. It helps turn raw effort into conscious intelligence and documented progress.'
      },
      {
        id: 'journal-use',
        question: 'What can I use the Journal for?',
        answer: 'Use the Journal to document daily reflections, track what works and what doesn\'t, record decisions and their outcomes, and build a record of your personal growth journey over time.'
      },
      {
        id: 'edit-delete-journal',
        question: 'Can I edit or delete journal entries?',
        answer: 'Yes, you can edit and delete your journal entries. This allows you to correct mistakes, update reflections, or remove entries you no longer want to keep.'
      },
      {
        id: 'journal-privacy',
        question: 'Are my journal entries private?',
        answer: 'Yes, your journal entries are private and linked only to your account. They are not shared with other users.'
      }
    ]
  },
  {
    id: 'progress-analytics',
    title: 'Progress & Analytics',
    questions: [
      {
        id: 'adherence-rate',
        question: 'What is Adherence Rate?',
        answer: 'Adherence Rate is the percentage of completed habits out of all possible habit opportunities. It counts past habits, today\'s habits, and future habits within the active period, but does not count days before a habit was created. This gives you an accurate measure of how consistently you complete your habits.'
      },
      {
        id: 'habit-progress-calculation',
        question: 'How is my habit progress calculated?',
        answer: 'Habit progress is calculated based on your completions relative to the days each habit has been active. It considers when each habit was created and only counts days from that point forward, giving you a fair measure of your consistency.'
      },
      {
        id: 'analytics-show',
        question: 'What does Analytics show?',
        answer: 'Analytics displays your streaks, consistency rate, total habit completions, rank progression, and adherence metrics. It provides a comprehensive view of your progress over time to help you understand patterns and areas for improvement.'
      }
    ]
  },
  {
    id: 'account-privacy',
    title: 'Account & Privacy',
    questions: [
      {
        id: 'change-account-info',
        question: 'How do I change my account information?',
        answer: 'You can change your display name, avatar, and other account settings from the Settings page in the application. Password changes require re-authentication for security.'
      },
      {
        id: 'delete-account',
        question: 'Can I delete my account?',
        answer: 'Account deletion is available through the Settings page. This will permanently remove your data from the system. Consider exporting any important information before deleting.'
      },
      {
        id: 'data-inactivity',
        question: 'What happens to my data if I stop using Orixus?',
        answer: 'Your data remains stored in your account as long as the account exists. If you return after a period of inactivity, your historical progress will still be available.'
      },
      {
        id: 'data-privacy',
        question: 'Is my data private?',
        answer: 'Your data is stored securely and associated with your authenticated account. Journal entries and personal data are not shared with other users.'
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    questions: [
      {
        id: 'progress-not-updating',
        question: 'My habit progress is not updating. What should I do?',
        answer: 'Try refreshing the page. If the issue persists, check your internet connection and ensure you are logged in. If completions are not saving, there may be a temporary service issue.'
      },
      {
        id: 'achievement-not-unlocking',
        question: 'My achievement did not unlock. What should I check?',
        answer: 'Verify that you meet all the criteria for the achievement. Some achievements require specific conditions like streaks, completion counts, or time-based requirements. Check the achievement description and ensure all conditions are met.'
      },
      {
        id: 'rank-progression-incorrect',
        question: 'My rank progression looks incorrect. What should I do?',
        answer: 'Rank progression is based on both streak and total habit completions. Ensure you are meeting both requirements for the next rank. If you believe there is an error, try refreshing the page to recalculate.'
      },
      {
        id: 'something-broken',
        question: 'What should I do if something appears broken?',
        answer: 'Try refreshing the page first. If the issue persists, check your internet connection. For persistent issues, you can contact support through the Contact page with details about what you were doing and what went wrong.'
      }
    ]
  }
];

function FaqCategory({ category, openItems, onToggle }) {
  return (
    <section className="faq-category" aria-labelledby={`category-${category.id}`}>
      <h2 id={`category-${category.id}`} className="faq-category__title">{category.title}</h2>
      <div className="faq-category__questions">
        {category.questions.map((item) => {
          const isOpen = openItems === item.id;
          return (
            <div
              key={item.id}
              className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
            >
              <button
                className="faq-item__trigger"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                onClick={() => onToggle(isOpen ? null : item.id)}
              >
                <h3 className="faq-item__question">{item.question}</h3>
                <span className="faq-item__icon" aria-hidden="true">
                  <ChevronDown size={20} />
                </span>
              </button>
              <div
                id={`faq-answer-${item.id}`}
                className="faq-item__answer"
                aria-hidden={!isOpen}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function FaqPage() {
  const [openItem, setOpenItem] = useState(null);

  const handleToggle = (itemId) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  const handleKeyDown = (event, itemId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(itemId);
    }
  };

  const handleBack = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = '/';
  };

  // Set page metadata
  useEffect(() => {
    document.title = 'Orixus FAQ — Questions About Habits, Discipline & Progress';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find answers about Orixus, including habit tracking, daily check-ins, streaks, ranks, achievements, journaling, and progress tracking.');
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://orixus.vercel.app/faq');
    }
  }, []);

  // Generate JSON-LD structured data
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_CATEGORIES.flatMap(category =>
      category.questions.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    )
  };

  const faqBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orixus.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://orixus.vercel.app/faq' }
    ]
  };

  return (
    <>
      <JsonLd data={faqBreadcrumb} />
      <JsonLd data={faqStructuredData} />
      <div className="faq-page">
        <div className="faq-page__container">
          <button className="faq-page__back" onClick={handleBack}>
            {backArrow}
            Back
          </button>

          <header className="faq-page__header">
            <h1 className="faq-page__title">Questions, answered.</h1>
            <p className="faq-page__subtitle">
              Everything you need to know about Orixus, from habits and consistency to progress, ranks, achievements, and journaling.
            </p>
          </header>
        </div>

        <main className="faq-page__content">
          {FAQ_CATEGORIES.map((category) => (
            <FaqCategory
              key={category.id}
              category={category}
              openItems={openItem}
              onToggle={handleToggle}
            />
          ))}
        </main>
      </div>
    </>
  );
}
