import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/landing.css';

const FAQ_ITEMS = [
  {
    question: 'Can I edit habits after creating them?',
    answer: 'Yes. You can add, rename, change the duration or remove habits whenever you want while keeping your current tracking cycle consistent.',
  },
  {
    question: 'What happens if I miss a day?',
    answer: 'Orixus does not allow retroactive habit completion. Missed days remain visible to encourage honest progress rather than perfect streaks.',
  },
  {
    question: 'Can I keep a private journal?',
    answer: 'Yes. Your journal entries remain private and are linked only to your account.',
  },
  {
    question: 'Why can\'t I complete yesterday\'s habits?',
    answer: 'Orixus focuses on accountability. Only today\'s habits can be completed to prevent editing past progress.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. Your data is protected through authenticated user accounts and secure cloud storage.',
  },
  {
    question: 'What features are coming next?',
    answer: 'Future updates may include AI insights, advanced analytics, mobile apps, focus sessions and additional productivity tools while keeping the core experience minimal.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(index);
    }
  };

  return (
    <div className="orixus-faq-accordion">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`orixus-faq-item ${isOpen ? 'orixus-faq-item--open' : ''}`}
          >
            <button
              className="orixus-faq-trigger"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              onClick={() => handleToggle(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <span className="orixus-faq-question">{item.question}</span>
              <span className="orixus-faq-icon" aria-hidden="true">
                <ChevronDown size={20} />
              </span>
            </button>
            <div
              id={`faq-answer-${index}`}
              className="orixus-faq-answer"
              aria-hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
