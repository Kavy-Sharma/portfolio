import React from 'react';
import statsData from '../../data/stats.json';
import { formatRelativeTime } from '../utils/timeFormat';

export default function Hero() {
  const nowLine = statsData?.nowLine || '';
  const asOf = statsData?.asOf || statsData?.updated;
  const relativeTime = formatRelativeTime(asOf);

  return (
    <section className="hero-wrap" style={{ marginTop: '20px' }}>
      <span className="tag">Cybersecurity &middot; AI security &middot; Jodhpur</span>

      <h1 className="hero-headline">
        <span className="hl l1" data-t="I find the way in.">
          I find the way in.
        </span>
        <span className="hl l2" data-t="Then I close it.">
          Then I close it.
        </span>
      </h1>

      <p className="lead">
        Hi, I'm Kavy. I break things on purpose, then build the lock that stops it. Walk up the building, every floor is a different part of my work. Hover a window to peek in, click to step inside.
      </p>

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
