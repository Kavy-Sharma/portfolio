import React, { useState, useEffect } from 'react';
import rawStats from '../../data/stats.json';

export default function NowStrip() {
  const [githubActivity, setGithubActivity] = useState(null);

  const stats = rawStats || {
    updated: '2026-11-25',
    portswigger: { apprentice: [31, 64], practitioner: [67, 175], expert: [7, 40] },
    tryhackme: { top_percent: 7 },
    client_tests_plus: 20
  };

  useEffect(() => {
    fetch('/data/github.json')
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (data && data.latest_repo) setGithubActivity(data);
      })
      .catch(() => setGithubActivity(null));
  }, []);

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'recently';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  };

  const totalPortSwigger =
    (stats.portswigger?.apprentice?.[0] || 0) +
    (stats.portswigger?.practitioner?.[0] || 0) +
    (stats.portswigger?.expert?.[0] || 0);

  const asOfDate = stats.updated || '2026-11-25';

  return (
    <div className="surface-card" style={{
      padding: '16px 20px',
      margin: '0 auto var(--space-xl)',
      maxWidth: '960px',
      border: 'var(--hairline)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Top Line: Pulsing dot + Latest pushed repo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            position: 'relative',
            display: 'flex',
            height: '8px',
            width: '8px'
          }}>
            <span style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              borderRadius: '50%',
              backgroundColor: 'var(--color-ok)',
              opacity: 0.75,
              animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
            <span style={{
              position: 'relative',
              borderRadius: '50%',
              height: '8px',
              width: '8px',
              backgroundColor: 'var(--color-ok)'
            }} />
          </span>

          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted)' }}>
            NOW:
          </span>

          <span style={{ fontSize: '0.875rem', color: 'var(--color-ink)' }}>
            {githubActivity && githubActivity.latest_repo ? (
              <>
                Latest push to <strong className="mono">{githubActivity.latest_repo.name}</strong>{' '}
                <span className="mono" style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                  ({timeAgo(githubActivity.latest_repo.pushed_at)})
                </span>
              </>
            ) : (
              <>Researching LLM gateway defenses and DVWA SafeLine WAF reverse proxy lab.</>
            )}
          </span>
        </div>

        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          as of {asOfDate}
        </div>
      </div>

      {/* 3 Key Numbers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        paddingTop: '12px',
        borderTop: 'var(--hairline)'
      }}>
        <div>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)' }}>
            {totalPortSwigger}
          </div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
            PortSwigger Labs Cleared
          </div>
        </div>

        <div>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)' }}>
            Top {stats.tryhackme?.top_percent || 7}%
          </div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
            Global TryHackMe Standing
          </div>
        </div>

        <div>
          <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)' }}>
            {stats.client_tests_plus || 20}+
          </div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
            Target Security Audits
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
