import React from 'react';
import statsData from '../../data/stats.json';

/**
 * ProofStrip Component
 * Displays verified proof of achievements and certifications:
 * 1. AI Security cert
 * 2. CTF result (solo)
 * 3. TryHackMe percentile
 * 4. PortSwigger labs completed
 * Each item links to proof or its respective detail window.
 */
export default function ProofStrip() {
  const totalLabs = statsData?.portswiggerLabs || 105;
  const thmRank = statsData?.thmRank || 'top 8%';
  const thmUrl = statsData?.tryhackme?.profile_url || 'https://tryhackme.com/p/kavysharma196';
  
  const ctf = (statsData?.ctf && statsData.ctf[0]) || {
    name: 'Sea of Secrets (HackItUp)',
    date: '2026-10',
    mode: 'solo',
    rank_under: 150
  };

  const cert = (statsData?.certificates && statsData.certificates[0]) || {
    name: 'Introduction to AI Security',
    issuer: 'AI Security University',
    date: '2026-09'
  };

  return (
    <section className="proof-strip-section" aria-label="Certifications and verified achievements">
      <div className="proof-strip-header">
        <h2 className="proof-strip-heading mono" style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--mu)', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
          VERIFIED PROOF &middot; CREDENTIALS &amp; LABS
        </h2>
      </div>

      <div className="proof-strip-grid">
        {/* 1. AI Security Cert */}
        <a
          href="/project/aegis"
          className="proof-card"
          title="View AI Security implementation in AegisAgent"
        >
          <div className="proof-card-top">
            <span className="proof-card-badge">CERTIFICATION</span>
            <span className="proof-card-date">{cert.date}</span>
          </div>
          <h3 className="proof-card-title">{cert.name}</h3>
          <p className="proof-card-sub">{cert.issuer}</p>
          <span className="proof-card-link">View project &rarr;</span>
        </a>

        {/* 2. CTF Result */}
        <a
          href="/project/ctf"
          className="proof-card"
          title="View CTF write-up and challenge record"
        >
          <div className="proof-card-top">
            <span className="proof-card-badge">CTF &middot; {ctf.mode.toUpperCase()}</span>
            <span className="proof-card-date">{ctf.date}</span>
          </div>
          <h3 className="proof-card-title">{ctf.name}</h3>
          <p className="proof-card-sub">Rank under {ctf.rank_under} worldwide</p>
          <span className="proof-card-link">View write-up &rarr;</span>
        </a>

        {/* 3. TryHackMe Percentile */}
        <a
          href={thmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="proof-card"
          title="Open verified TryHackMe public profile (external link)"
        >
          <div className="proof-card-top">
            <span className="proof-card-badge">TRYHACKME</span>
            <span className="proof-card-tag">VERIFIED</span>
          </div>
          <h3 className="proof-card-title">{thmRank.toUpperCase()} Worldwide</h3>
          <p className="proof-card-sub">Silver League &middot; 68-day streak</p>
          <span className="proof-card-link">thm.com profile &#x2197;</span>
        </a>

        {/* 4. PortSwigger Labs */}
        <a
          href="/project/ps"
          className="proof-card"
          title="Inspect PortSwigger Academy progress breakdown"
        >
          <div className="proof-card-top">
            <span className="proof-card-badge">PORTSWIGGER</span>
            <span className="proof-card-tag">ACADEMY</span>
          </div>
          <h3 className="proof-card-title">{totalLabs} Labs Solved</h3>
          <p className="proof-card-sub">31 Apprentice &middot; 67 Practitioner &middot; 7 Expert</p>
          <span className="proof-card-link">Inspect breakdown &rarr;</span>
        </a>
      </div>
    </section>
  );
}
