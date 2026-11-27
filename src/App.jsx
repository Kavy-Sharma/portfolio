import React, { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import ProjectStoryPage from './pages/ProjectStoryPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import ResumePlaceholderPage from './pages/ResumePlaceholderPage';
import './styles/global.css';

/**
 * Ensures that every page navigation resets the scroll position to the top
 * (0, 0) instantly, even when navigating via browser back/forward or hash changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (!window.location.hash) {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.documentElement.style.scrollBehavior = prev;
    }
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
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
