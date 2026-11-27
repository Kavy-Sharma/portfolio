import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import ProjectStoryPage from './pages/ProjectStoryPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import ResumePlaceholderPage from './pages/ResumePlaceholderPage';
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
      <BrowserRouter>
        <div className="portfolio-app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:id" element={<ProjectStoryPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/:slug" element={<NoteDetailPage />} />
            <Route path="/resume" element={<ResumePlaceholderPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
