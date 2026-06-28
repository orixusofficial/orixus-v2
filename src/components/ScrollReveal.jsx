import { useEffect, useRef, useMemo } from 'react';
import './ScrollReveal.css';

let gsapLib = null;
let scrollTriggerPlugin = null;
let gsapReady = null;

function loadGsap() {
  if (gsapReady) return gsapReady;
  gsapReady = (async () => {
    const gsap = (await import('gsap')).default || (await import('gsap'));
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  })();
  return gsapReady;
}

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return <span className="word" key={index}>{word}</span>;
    });
  }, [children]);

  useEffect(() => {
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      gsapLib = gsap;
      scrollTriggerPlugin = ScrollTrigger;

      const el = containerRef.current;
      if (!el) return;
      const scroller = scrollContainerRef?.current ?? window;

      const tweens = [];

      tweens.push(
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom',
              end: rotationEnd,
              scrub: 0.5,
              toggleActions: 'play none none reset',
            },
          }
        )
      );

      const wordElements = el.querySelectorAll('.word');

      tweens.push(
        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity, willChange: 'opacity' },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: 0.5,
              toggleActions: 'play none none reset',
            },
          }
        )
      );

      if (enableBlur) {
        tweens.push(
          gsap.fromTo(
            wordElements,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: 'none',
              filter: 'blur(0px)',
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                scroller,
                start: 'top bottom-=20%',
                end: wordAnimationEnd,
                scrub: 0.5,
                toggleActions: 'play none none reset',
              },
            }
          )
        );
      }
      setTimeout(() => ScrollTrigger.refresh(), 100);

      return () => {
        tweens.forEach((tween) => {
          if (tween.scrollTrigger) tween.scrollTrigger.kill();
          tween.kill();
        });
        ScrollTrigger.refresh();
      };
    });

    return () => {
      cancelled = true;
      if (gsapLib && scrollTriggerPlugin) {
        scrollTriggerPlugin.refresh();
      }
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;