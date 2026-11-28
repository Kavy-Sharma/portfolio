import React from 'react';
import statsData from '../../data/stats.json';
import { formatRelativeTime } from '../utils/timeFormat';

export default function Hero() {
  const nowLine = statsData?.nowLine || '';
  const asOf = statsData?.asOf || statsData?.updated;
  const relativeTime = formatRelativeTime(asOf);

  const handleContactClick = (e) => {
    e.preventDefault();
    const ground = document.getElementById('ground') || document.getElementById('contact');
    if (ground) {
      ground.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const doorBtn = ground.querySelector('.dr-leaf, .inline-knock-btn');
      if (doorBtn) {
        setTimeout(() => doorBtn.focus(), 600);
      }
    }
  };

  return (
    <section className="hero-wrap" style={{ marginTop: '16px', marginBottom: '32px' }}>
      <div className="hero-tag-row" style={{ marginBottom: '14px' }}>
        <span className="tag">Cybersecurity &middot; AI security &middot; Jodhpur</span>
      </div>

      <h1 className="hero-headline">
        <span className="hl l1" data-t="I find the way in.">
          I find the way in.
        </span>
        <span className="hl l2" data-t="Then I close it.">
          Then I close it.
        </span>
      </h1>

      {/* ONE plain line under the two big lines */}
      <p className="hero-subline">
        Electronics &amp; Computer Engineering student (MBM University, 2027) focused on web application security, VAPT and AI security.
      </p>

      {/* Three small chips under that */}
      <div className="hero-chips-row" role="group" aria-label="Profile summary and quick actions">
        {/* Chip 1: Roles wanted from about.md */}
        <div className="hero-chip hero-chip-roles" title="Target roles from about.md">
          <span className="hero-chip-label">Seeking:</span>
          <span className="hero-chip-text">
            Cybersecurity &middot; VAPT &middot; AI security &middot; Jr. Pentester
          </span>
        </div>

        {/* Chip 2: City and relocation */}
        <div className="hero-chip hero-chip-location" title="Location & Relocation preferences">
          <span className="hero-chip-label">Location:</span>
          <span className="hero-chip-text">
            Jodhpur, India &middot; <em>Can relocate anywhere</em>
          </span>
        </div>

        {/* Chip 3: Actions - Resume + Contact buttons */}
        <div className="hero-chip hero-chip-actions" aria-label="Quick contact and resume actions">
          <a
            href="/resume"
            className="hero-action-btn hero-resume-btn"
            title="View one-page resume"
          >
            Resume &rarr;
          </a>
          <a
            href="#ground"
            onClick={handleContactClick}
            className="hero-action-btn hero-contact-btn"
            title="Scroll to ground-floor door to leave a note"
          >
            Contact &darr;
          </a>
        </div>
      </div>

      {nowLine && (
        <div className="hero-now-card" role="status" aria-label="Current activity">
          <span className="now-dot" aria-hidden="true" />
          <span className="now-tag">NOW</span>
          <span className="now-text">{nowLine}</span>
          {relativeTime && <span className="now-time">&middot; {relativeTime}</span>}
        </div>
      )}
    </section>
  );
}
