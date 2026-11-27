import React, { useEffect } from 'react';
import { Route, Switch } from 'wouter';
import Lenis from 'lenis';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import AegisStoryPage from './pages/AegisStoryPage';
import './styles/global.css';

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="portfolio-app">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/projects/aegis" component={AegisStoryPage} />
          <Route component={HomePage} />
        </Switch>
      </div>
    </ThemeProvider>
  );
}
