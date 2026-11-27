import { flushSync } from 'react-dom';

/**
 * Executes navigation with the View Transitions API and circular reveal animation.
 * Behavior matching prototype.html:
 * - When clicking to open something (forward): the transition expands OUTWARDS (circle 0% -> 150%).
 * - When closing something (back): the transition collapses INWARDS (circle 150% -> 0%)
 *   right back into the window or tile that originally opened it.
 * - Opens every page from top starting position (scrollTop = 0).
 */
export function navigateWithReveal(navigate, to, event, options = {}) {
  let isBack = options.direction === 'back';
  if (!options.direction && typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    // Auto-detect return/close if navigating to home '/' from any subpage or to '/notes' from '/notes/:slug'
    if (to === '/' && currentPath !== '/') {
      isBack = true;
    } else if (to === '/notes' && currentPath.startsWith('/notes/')) {
      isBack = true;
    }
  }

  let x = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  let y = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;

  if (isBack) {
    // If closing, retrieve the stored origin of the window/tile that opened it (matching prototype.html)
    try {
      const saved = sessionStorage.getItem('lastOpenOrigin');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          x = parsed.x;
          y = parsed.y;
        }
      }
    } catch {}
  }

  // If not back or if no saved origin was found, extract from the event
  if (!isBack || (x === window.innerWidth / 2 && y === window.innerHeight / 2)) {
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
  }

  // Save the origin when opening forward so return transitions collapse right back into it
  if (!isBack && typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('lastOpenOrigin', JSON.stringify({ x, y }));
    } catch {}
  }

  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);
    if (isBack) {
      document.documentElement.classList.add('vt-back');
    } else {
      document.documentElement.classList.remove('vt-back');
    }
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
    const vt = document.startViewTransition(performNavigation);
    vt.finished.finally(() => {
      document.documentElement.classList.remove('vt-back');
    });
  } else {
    performNavigation();
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('vt-back');
    }
  }
}
