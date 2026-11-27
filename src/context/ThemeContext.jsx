import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryTheme = params.get('theme') || params.get('mode');
        if (queryTheme === 'attack' || queryTheme === 'defend') return queryTheme;
        const saved = localStorage.getItem('portfolio-theme') || localStorage.getItem('mode');
        if (saved === 'attack' || saved === 'defend') return saved;
      } catch (e) {
        // Fallback gracefully if localStorage is restricted
      }
    }
    return 'defend';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', theme);
    try {
      localStorage.setItem('portfolio-theme', theme);
      localStorage.setItem('mode', theme);
    } catch (e) {
      // Ignore localStorage write failures (e.g. private mode)
    }
  }, [theme]);

  // Track cursor position for subtle radial light behind elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const setMode = (nextTheme, event) => {
    if (nextTheme === theme) return;

    let x = window.innerWidth / 2;
    let y = 30;
    if (event && event.clientX !== undefined) {
      x = event.clientX;
      y = event.clientY;
    } else if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const apply = () => {
      setTheme(nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      document.documentElement.setAttribute('data-mode', nextTheme);
    };

    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const transition = document.startViewTransition(apply);
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 700,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    } else {
      apply();
    }
  };

  const toggleTheme = (event) => {
    setMode(theme === 'defend' ? 'attack' : 'defend', event);
  };

  const isAttack = theme === 'attack';

  return (
    <ThemeContext.Provider value={{ theme, isAttack, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
