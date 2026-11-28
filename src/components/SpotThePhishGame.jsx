import React, { useState } from 'react';

const SCENARIOS = [
  {
    id: 1,
    isPhish: true,
    senderDisplay: 'ApexCloud IT Support',
    senderEmail: 'support@apexcloud-security-verify.net',
    date: 'Today, 09:14 AM',
    subject: 'URGENT: Re-authenticate single sign-on token within 90 minutes',
    bodyText: [
      'Your enterprise SSO credentials will expire in 90 minutes due to mandatory identity migration.',
      'To prevent account lockout from email and repository access, click below to verify your current password:'
    ],
    ctaText: 'Verify Credentials Now \u2192',
    linkTarget: 'http://sso-auth-session.org/apexcloud/login',
    clues: [
      {
        id: 'c1',
        label: 'Look-alike domain',
        snippet: 'apexcloud-security-verify.net',
        explanation: 'The sender uses a hyphenated look-alike domain (.net) rather than the legitimate company apexcloud.io.'
      },
      {
        id: 'c2',
        label: 'Artificial urgency',
        snippet: 'expire in 90 minutes',
        explanation: 'High-pressure countdown deadlines are engineered to induce panic so the victim skips security scrutiny.'
      },
      {
        id: 'c3',
        label: 'Insecure link target',
        snippet: 'http://sso-auth-session.org',
        explanation: 'Link points to an unencrypted HTTP URL hosted on an external .org domain, not corporate single sign-on.'
      }
    ],
    explanation: 'Classic credential harvesting lure with typo-squatted domain and false urgency countdown.'
  },
  {
    id: 2,
    isPhish: false,
    senderDisplay: 'Facilities Department',
    senderEmail: 'facilities@solaria-logistics.internal',
    date: 'Yesterday, 04:30 PM',
    subject: 'Scheduled maintenance: Passenger elevator inspection this Thursday',
    bodyText: [
      'Hello team,',
      'Please note that passenger elevators in Tower B will undergo annual safety inspection this Thursday between 2:00 PM and 4:00 PM.',
      'Freight elevators remain fully operational throughout. No action is required on your part.'
    ],
    ctaText: null,
    linkTarget: null,
    clues: [
      {
        id: 'c1',
        label: 'Internal authenticated domain',
        snippet: 'solaria-logistics.internal',
        explanation: 'Email originates from verified internal corporate infrastructure with valid SPF/DKIM headers.'
      },
      {
        id: 'c2',
        label: 'Zero action / credential demands',
        snippet: 'No action is required',
        explanation: 'Informational maintenance notice without links, password requests, or urgent attachments.'
      }
    ],
    explanation: 'Legitimate routine corporate notice with internal origin and no malicious call to action.'
  },
  {
    id: 3,
    isPhish: true,
    senderDisplay: 'NexusHR Payroll Notification',
    senderEmail: 'payroll-alerts@nexus-pay-direct.cc',
    date: 'Oct 24, 11:02 AM',
    subject: 'Action Required: Electronic W-2 compensation summary ready',
    bodyText: [
      'Your electronic W-2 annual tax statement is ready for review.',
      'Download and review your encrypted statement to confirm tax withholding totals before federal filing.'
    ],
    attachment: 'tax_statement_2026.pdf.exe (842 KB)',
    ctaText: 'Download Statement',
    linkTarget: '#attachment',
    clues: [
      {
        id: 'c1',
        label: 'Double extension executable',
        snippet: '.pdf.exe',
        explanation: 'Disguised executable (.exe) hidden behind a double extension to deliver malware.'
      },
      {
        id: 'c2',
        label: 'Unusual offshore TLD',
        snippet: '.cc domain',
        explanation: 'HR payroll systems do not operate on disposable .cc country-code domains.'
      },
      {
        id: 'c3',
        label: 'Impersonal greeting',
        snippet: 'No employee name or ID',
        explanation: 'Legitimate payroll communications reference employee name and employee ID.'
      }
    ],
    explanation: 'Malware delivery lure using tax season timing to trick recipients into launching an executable.'
  },
  {
    id: 4,
    isPhish: false,
    senderDisplay: 'David Vance',
    senderEmail: 'dvance@northwind.dev',
    date: 'Today, 08:45 AM',
    subject: 'Code review: API response caching middleware (PR #412)',
    bodyText: [
      'Hey Kavy,',
      'I pushed the Redis cache layer changes we discussed in yesterday standup. When you get a chance, check PR #412 on GitHub.',
      'No rush at all, tomorrow morning works too.'
    ],
    ctaText: 'View PR #412 on GitHub \u2192',
    linkTarget: 'https://github.com/northwind/api-cache/pull/412',
    clues: [
      {
        id: 'c1',
        label: 'Shared operational context',
        snippet: 'yesterday standup',
        explanation: 'References specific prior conversation and ongoing project without generic boilerplate.'
      },
      {
        id: 'c2',
        label: 'Legitimate platform URL',
        snippet: 'https://github.com/northwind/...',
        explanation: 'Legitimate HTTPS link to verified team GitHub repository, not an intermediary phishing proxy.'
      }
    ],
    explanation: 'Legitimate peer-to-peer engineering collaboration with natural tone and verified repository links.'
  },
  {
    id: 5,
    isPhish: true,
    senderDisplay: 'Elena Rostova (Chief Executive)',
    senderEmail: 'office.elena.rostova@relay-mail-cloud.com',
    date: 'Just now',
    subject: 'Quick confidential favor needed today',
    bodyText: [
      'Are you at your desk right now?',
      'I am in confidential board meetings all morning and cannot take calls. I need you to purchase 5 digital gift cards for client appreciation gifts right away.',
      'Do not discuss this with anyone on the team as it is a surprise. Text me the gift codes as soon as you have them.'
    ],
    ctaText: null,
    linkTarget: null,
    clues: [
      {
        id: 'c1',
        label: 'Free cloud webmail relay',
        snippet: 'relay-mail-cloud.com',
        explanation: 'CEO email arriving from a public mail relay rather than corporate domain.'
      },
      {
        id: 'c2',
        label: 'Communication blackout demand',
        snippet: 'cannot take calls / do not discuss',
        explanation: 'Classic social engineering tactic isolating the victim from verifying with colleagues.'
      },
      {
        id: 'c3',
        label: 'Untraceable gift card demand',
        snippet: 'digital gift cards / text me codes',
        explanation: 'Gift cards are non-refundable and untraceable, making them the primary CEO-fraud payout mechanism.'
      }
    ],
    explanation: 'Business Email Compromise (BEC) / CEO gift card fraud exploiting authority and artificial secrecy.'
  }
];

export default function SpotThePhishGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [index]: { choice: boolean, correct: boolean } }
  const [discoveredClues, setDiscoveredClues] = useState({}); // { [index]: Set<clueId> }

  const current = SCENARIOS[currentIndex];
  const answered = answers[currentIndex];
  const discoveredForThis = discoveredClues[currentIndex] || new Set();

  const handleChoose = (isPhishChoice) => {
    if (answered) return;
    const isCorrect = isPhishChoice === current.isPhish;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { choice: isPhishChoice, correct: isCorrect }
    }));

    // Auto-discover all clues upon answering
    const allClueIds = new Set(current.clues.map((c) => c.id));
    setDiscoveredClues((prev) => ({
      ...prev,
      [currentIndex]: allClueIds
    }));
  };

  const handleToggleClue = (clueId) => {
    setDiscoveredClues((prev) => {
      const currentSet = new Set(prev[currentIndex] || []);
      if (currentSet.has(clueId)) {
        currentSet.delete(clueId);
      } else {
        currentSet.add(clueId);
      }
      return { ...prev, [currentIndex]: currentSet };
    });
  };

  const score = Object.values(answers).filter((a) => a.correct).length;
  const answeredCount = Object.keys(answers).length;

  return (
    <section className="phish-game-container" aria-label="Spot the Phish Interactive Training Game">
      <div className="phish-game-header">
        <div>
          <span className="mono tag" style={{ borderColor: 'var(--ac)', color: 'var(--ac)' }}>
            MINI GAME &middot; SPOT THE PHISH
          </span>
          <h3 style={{ margin: '8px 0 4px', font: '800 22px var(--font-display)', color: 'var(--ink)' }}>
            Can you spot the security red flags?
          </h3>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--mu)', lineHeight: 1.45 }}>
            5 fictional emails (no real brands or individuals). Tap highlighted clues to inspect headers, or evaluate directly:
          </p>
        </div>

        {/* Live In-Page Score Indicator */}
        <div className="game-score-card">
          <span className="mono score-label">SCORE</span>
          <div className="score-number">
            <span style={{ color: 'var(--ac)' }}>{score}</span> / {SCENARIOS.length}
          </div>
          <span className="mono score-sub">
            {answeredCount} of {SCENARIOS.length} completed
          </span>
        </div>
      </div>

      {/* Card Carousel & Header Pagination */}
      <div className="game-pagination-bar">
        {SCENARIOS.map((s, idx) => {
          const ans = answers[idx];
          let statusClass = '';
          if (ans) {
            statusClass = ans.correct ? 'is-correct' : 'is-wrong';
          } else if (idx === currentIndex) {
            statusClass = 'is-active';
          }
          return (
            <button
              key={s.id}
              type="button"
              className={`nav-pill-btn ${statusClass}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to scenario ${idx + 1}`}
            >
              #{idx + 1}
              {ans && (ans.correct ? ' \u2713' : ' \u2715')}
            </button>
          );
        })}
      </div>

      {/* Email Simulation Card */}
      <div className="email-client-card" role="region" aria-label="Simulated email client preview">
        {/* Email Header Chrome */}
        <div className="email-header-chrome">
          <div className="email-meta-field">
            <span className="mono field-name">FROM:</span>
            <span className="field-value sender">
              <strong>{current.senderDisplay}</strong> &lt;{current.senderEmail}&gt;
            </span>
          </div>
          <div className="email-meta-field">
            <span className="mono field-name">DATE:</span>
            <span className="field-value">{current.date}</span>
          </div>
          <div className="email-meta-field">
            <span className="mono field-name">SUBJECT:</span>
            <span className="field-value subject">{current.subject}</span>
          </div>
        </div>

        {/* Email Body */}
        <div className="email-body-content">
          {current.bodyText.map((p, i) => (
            <p key={i} style={{ margin: '0 0 12px', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.5 }}>
              {p}
            </p>
          ))}

          {current.attachment && (
            <div className="email-attachment-box">
              <span className="mono" style={{ fontSize: '11px', color: 'var(--color-alert, #D6483A)', fontWeight: 600 }}>
                &#128206; ATTACHMENT: {current.attachment}
              </span>
            </div>
          )}

          {current.ctaText && (
            <div style={{ marginTop: '14px' }}>
              <span className="fake-cta-button">{current.ctaText}</span>
              {current.linkTarget && (
                <span className="mono fake-link-preview">Link: {current.linkTarget}</span>
              )}
            </div>
          )}
        </div>

        {/* Tappable Clues Strip */}
        <div className="clues-discovery-bar">
          <span className="mono clues-label">TAP TO INSPECT CLUES ({discoveredForThis.size}/{current.clues.length}):</span>
          <div className="clues-list">
            {current.clues.map((clue) => {
              const isFound = discoveredForThis.has(clue.id);
              return (
                <button
                  key={clue.id}
                  type="button"
                  className={`clue-chip-btn ${isFound ? 'found' : ''}`}
                  onClick={() => handleToggleClue(clue.id)}
                  aria-pressed={isFound}
                >
                  {isFound ? '\u2713 ' : '+ '}
                  {clue.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discovered Clues Expanded Explanations */}
        {discoveredForThis.size > 0 && (
          <div className="clues-detail-panel" role="region" aria-label="Clue details">
            {current.clues
              .filter((c) => discoveredForThis.has(c.id))
              .map((c) => (
                <div key={c.id} className="clue-item">
                  <strong className="mono" style={{ fontSize: '11px', color: 'var(--ac)' }}>
                    {c.label} ({c.snippet}):
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--ink)', marginLeft: '6px' }}>
                    {c.explanation}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Verdict Choice Action Buttons */}
        {!answered ? (
          <div className="game-actions-bar">
            <span className="mono action-prompt">IS THIS EMAIL PHISHING OR LEGITIMATE?</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="verdict-btn phish"
                onClick={() => handleChoose(true)}
              >
                &#9888; Phishing Lure
              </button>
              <button
                type="button"
                className="verdict-btn legit"
                onClick={() => handleChoose(false)}
              >
                &#10003; Legitimate Notice
              </button>
            </div>
          </div>
        ) : (
          <div className={`answer-feedback-banner ${answered.correct ? 'success' : 'alert'}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '13px' }}>
                {answered.correct
                  ? `\u2713 Correct! This is ${current.isPhish ? 'Phishing' : 'Legitimate'}.`
                  : `\u2715 Incorrect. This is actually ${current.isPhish ? 'Phishing' : 'Legitimate'}.`}
              </strong>
              {currentIndex < SCENARIOS.length - 1 ? (
                <button
                  type="button"
                  className="next-card-btn"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                >
                  Next scenario &rarr;
                </button>
              ) : (
                <span className="mono" style={{ fontSize: '11px', fontWeight: 600 }}>
                  Game Complete ({score}/{SCENARIOS.length})
                </span>
              )}
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '12px', opacity: 0.95 }}>
              {current.explanation}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

