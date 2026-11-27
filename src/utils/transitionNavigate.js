import { flushSync } from 'react-dom';

/**
 * Executes navigation with the View Transitions API and circular reveal animation.
 * Originates from the clicked element's viewport coordinates (or center fallback).
 * Guarantees that any opened page (project story, note detail, or notes table)
 * opens from the top starting position (scrollTop = 0) without preserving scrolled state.
 */
export function navigateWithReveal(navigate, to, event) {
  let x = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  let y = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;

  if (event) {
    if (typeof event.clientX === 'number' && (event.clientX !== 0 || event.clientY !== 0)) {
      x = event.clientX;
      y = event.clientY;
    } else if (event.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function') {
      const rect = event.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (event.target && typeof event.target.getBoundingClientRect === 'function') {
      const rect = event.target.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
  }

  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);
  }

  const performNavigation = () => {
    // Disable smooth scrolling temporarily to prevent delayed scrolling during view transition capture
    const prevHtmlScroll = document.documentElement.style.scrollBehavior;
    const prevBodyScroll = document.body.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    flushSync(() => {
      navigate(to);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    document.documentElement.style.scrollBehavior = prevHtmlScroll;
    document.body.style.scrollBehavior = prevBodyScroll;
  };

  if (
    typeof document !== 'undefined' &&
    document.startViewTransition &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    document.startViewTransition(performNavigation);
  } else {
    performNavigation();
  }
}
