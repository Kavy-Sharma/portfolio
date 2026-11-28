import React, { useState, useEffect, useRef } from 'react';

export default function DoorKnock({ onOpenResume }) {
  const [doorState, setDoorState] = useState('closed'); // 'closed' | 'knocking' | 'open'
  const [selectedChip, setSelectedChip] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hasLeftNote, setHasLeftNote] = useState(false);

  const doorBtnRef = useRef(null);
  const roomRef = useRef(null);
  const firstChipRef = useRef(null);
  const textareaRef = useRef(null);

  // Check if a note was previously left in this session/localStorage
  useEffect(() => {
    try {
      if (localStorage.getItem('door_has_note') === 'true') {
        setHasLeftNote(true);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Keyboard navigation & Esc handler to close room
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (doorState === 'open' && e.key === 'Escape') {
        e.preventDefault();
        setDoorState('closed');
        doorBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [doorState]);

  // Focus management when door opens
  useEffect(() => {
    if (doorState === 'open') {
      // Focus the first chip for keyboard users
      setTimeout(() => {
        if (firstChipRef.current) {
          firstChipRef.current.focus();
        }
      }, 50);
    }
  }, [doorState]);

  // Focus textarea when a chip is selected
  useEffect(() => {
    if (selectedChip && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 60);
    }
  }, [selectedChip]);

  // Door click handler
  const handleDoorClick = () => {
    if (doorState === 'open') {
      setDoorState('closed');
      return;
    }

    if (doorState === 'knocking') return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDoorState('open');
      return;
    }

    // Trigger calm 3-knock animation, then swing open
    setDoorState('knocking');
    setTimeout(() => {
      setDoorState('open');
    }, 650);
  };

  // Copy email helper
  const handleCopy = (emailToCopy = 'kavysharma196@gmail.com') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      });
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  // Dynamic placeholders per chip
  const getPlaceholder = (chip) => {
    switch (chip) {
      case 'Internship':
        return "Tell me about the role, your team, or the security problem you're solving...";
      case 'Full-time role':
        return "Where are you based, and what kind of security work are you building?...";
      case 'Project / collab':
        return "What are you working on, and how can we team up?...";
      case 'Just saying hi':
        return "Say hello, share feedback on the site, or recommend a good lab/CTF...";
      default:
        return 'Write a brief note to leave on the door...';
    }
  };

  // Submit note handler
  const handleSubmitNote = async (e) => {
    e.preventDefault();

    // 1. Honeypot bot check
    if (honeypot && honeypot.trim() !== '') {
      // Silently discard spam submission
      setSubmitState('success');
      return;
    }

    // 2. Client-side rate limiting (60 seconds)
    try {
      const lastSent = localStorage.getItem('door_last_sent');
      if (lastSent && Date.now() - parseInt(lastSent, 10) < 60000) {
        setErrorMessage('A note was recently left on the door. Please wait a minute before leaving another, or email directly.');
        setSubmitState('error');
        return;
      }
    } catch (err) {
      // Ignore localStorage errors
    }

    setSubmitState('sending');
    setErrorMessage('');

    const formKey = import.meta.env.FORM_KEY || import.meta.env.VITE_FORM_KEY;

    // If key is not configured, trigger the graceful fallback
    if (!formKey || formKey.trim() === '' || formKey === 'your_web3forms_access_key_here') {
      setErrorMessage('Automatic note delivery is not configured with an access key yet.');
      setSubmitState('error');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: formKey,
          subject: `Door Note: [${selectedChip}] from ${senderEmail || 'Visitor'}`,
          from_name: 'Portfolio Door Visitor',
          category: selectedChip,
          message: noteText,
          reply_to: senderEmail || undefined,
          email: senderEmail || 'not-provided@kavy.dev'
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitState('success');
        setHasLeftNote(true);
        try {
          localStorage.setItem('door_last_sent', Date.now().toString());
          localStorage.setItem('door_has_note', 'true');
        } catch (e) {
          // ignore
        }
      } else {
        setErrorMessage(data.message || 'Delivery service reported an error.');
        setSubmitState('error');
      }
    } catch (err) {
      setErrorMessage('Network error while leaving note on the door.');
      setSubmitState('error');
    }
  };

  // Reset form to leave another note
  const handleResetForm = () => {
    setSubmitState('idle');
    setSelectedChip(null);
    setNoteText('');
    setSenderEmail('');
    setErrorMessage('');
  };

  return (
    <div className="door-experience-wrap">
      {/* Upper Area: Physical Door + Message / Warm Room */}
      <div className="door-interactive-row">
        {/* Physical 3D Doorway */}
        <div className="doorway-frame" title={doorState === 'open' ? 'Click to close door' : 'Click to knock on door'}>
          {/* Warm room interior glow inside doorway */}
          <div className="doorway-interior" aria-hidden="true">
            <div className="interior-warm-glow" />
            <div className="interior-hallway-floor" />
          </div>

          {/* Hinged 3D Door Leaf */}
          <button
            type="button"
            id="dr"
            ref={doorBtnRef}
            className={`dr dr-leaf ${doorState === 'knocking' ? 'is-knocking' : ''} ${doorState === 'open' ? 'is-open' : ''}`}
            onClick={handleDoorClick}
            aria-label={
              doorState === 'open'
                ? 'Door is open. Click to close.'
                : 'Knock on door to leave a note for Kavy.'
            }
            aria-expanded={doorState === 'open'}
            aria-controls="warm-room-panel"
          >
            {/* Doorknob */}
            <div className="door-knob" aria-hidden="true" />

            {/* Door grain / panel inset */}
            <div className="door-panel-line" aria-hidden="true" />

            {/* Paper note stuck on door if a note was sent */}
            {hasLeftNote && (
              <div className="stuck-paper" title="A note has been left on the door">
                <div className="stuck-paper-tape" aria-hidden="true" />
                <span className="stuck-paper-icon">&#x1F4DD;</span>
                <span className="stuck-paper-text">NOTE</span>
              </div>
            )}
          </button>
        </div>

        {/* Room Area: State A (Door Closed) vs State B (Door Open / Warm Room) */}
        {doorState !== 'open' ? (
          <div className="door-closed-message">
            <p>
              <b style={{ font: "700 20px var(--font-display)", color: 'var(--ink)' }}>
                Open to internships and jobs.
              </b>
              <br />
              <span style={{ color: 'var(--mu)', fontSize: '14px' }}>
                Say hi, or <button type="button" className="inline-knock-btn" onClick={handleDoorClick}>knock on the door</button> to leave a note.
              </span>
            </p>
          </div>
        ) : (
          <div
            id="warm-room-panel"
            ref={roomRef}
            className="warm-room-panel"
            role="region"
            aria-label="Warm room inside"
          >
            <div className="room-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="room-indicator-dot" aria-hidden="true" />
                <h3 className="room-title">Come in.</h3>
              </div>
              <button
                type="button"
                className="room-close-btn"
                onClick={() => {
                  setDoorState('closed');
                  doorBtnRef.current?.focus();
                }}
                aria-label="Close door and return outside"
                title="Close door (Esc)"
              >
                &times; Close
              </button>
            </div>

            {/* Success State */}
            {submitState === 'success' ? (
              <div className="room-success-view">
                <div className="success-badge">&#x2713;</div>
                <p className="success-text">
                  <strong>Got it. I usually reply within a day or two.</strong>
                </p>
                <p style={{ fontSize: '13px', color: 'var(--mu)', marginTop: '4px' }}>
                  Your note is pinned to the door.
                </p>
                <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="room-btn-secondary"
                    onClick={handleResetForm}
                  >
                    Leave another note
                  </button>
                  <button
                    type="button"
                    className="room-btn-primary"
                    onClick={() => {
                      setDoorState('closed');
                      doorBtnRef.current?.focus();
                    }}
                  >
                    Close door
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Form View */
              <div className="room-form-view">
                <p className="room-subtitle">
                  What would you like to talk about?
                </p>

                {/* 4 Topic Chips */}
                <div className="room-chips" role="group" aria-label="Select note topic">
                  {['Internship', 'Full-time role', 'Project / collab', 'Just saying hi'].map((chip, idx) => (
                    <button
                      key={chip}
                      ref={idx === 0 ? firstChipRef : null}
                      type="button"
                      className={`room-chip ${selectedChip === chip ? 'is-active' : ''}`}
                      onClick={() => setSelectedChip(chip)}
                      aria-pressed={selectedChip === chip}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* If a chip is chosen, display text box and email */}
                {selectedChip && (
                  <form onSubmit={handleSubmitNote} className="room-note-form">
                    {/* Honeypot field (hidden from real users) */}
                    <input
                      type="text"
                      name="_gotcha"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      style={{ display: 'none' }}
                      aria-hidden="true"
                    />

                    <div className="form-group">
                      <label htmlFor="door-note-msg" className="sr-only">
                        Your note for {selectedChip}
                      </label>
                      <textarea
                        id="door-note-msg"
                        ref={textareaRef}
                        required
                        rows={3}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder={getPlaceholder(selectedChip)}
                        className="room-textarea"
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: '8px' }}>
                      <label htmlFor="door-note-email" className="sr-only">
                        Your email address
                      </label>
                      <input
                        id="door-note-email"
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="Your email (so I can reply to you)"
                        className="room-input"
                      />
                    </div>

                    {/* Error / Fallback State */}
                    {submitState === 'error' && (
                      <div className="room-fallback-box" role="alert">
                        <p style={{ margin: 0, fontWeight: 600, color: '#e5533f', fontSize: '13px' }}>
                          {errorMessage || 'Could not send note automatically.'}
                        </p>
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--mu)' }}>
                          You can copy my email or open it directly in your mail app:
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                          <span className="mono" style={{ fontSize: '12px', color: 'var(--ink)' }}>
                            kavysharma196@gmail.com
                          </span>
                          <button
                            type="button"
                            className="cp"
                            onClick={() => handleCopy('kavysharma196@gmail.com')}
                          >
                            {copiedEmail ? 'Copied' : 'Copy'}
                          </button>
                          <a
                            href={`mailto:kavysharma196@gmail.com?subject=${encodeURIComponent(
                              `[${selectedChip}] Note from Portfolio Door`
                            )}&body=${encodeURIComponent(noteText)}`}
                            className="room-mailto-link"
                          >
                            Open in Mail &rarr;
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="form-actions" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="submit"
                        disabled={submitState === 'sending' || !noteText.trim()}
                        className="leave-note-btn"
                      >
                        {submitState === 'sending' ? 'Leaving note...' : 'Leave it on the door'}
                      </button>
                      <span className="room-hint">
                        Esc closes
                      </span>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Always Visible Lower Ground Area: Selectable Email & Standard Links */}
      <div className="door-lower-links">
        <p className="email-row">
          <span className="mail" id="mail" tabIndex={0} aria-label="Email address: kavysharma196@gmail.com">
            kavysharma196@gmail.com
          </span>{' '}
          <button
            type="button"
            className="cp"
            id="cp"
            onClick={() => handleCopy('kavysharma196@gmail.com')}
            aria-label="Copy email address"
          >
            {copiedEmail ? 'Copied' : 'Copy'}
          </button>
        </p>

        <p className="ground-links-row">
          <a
            style={{ color: 'var(--ac)' }}
            href="/resume"
            className="rl2"
            onClick={onOpenResume}
          >
            Resume
          </a>{' '}
          (<a style={{ color: 'var(--ac)' }} href="/resume.pdf" download="Kavy_Sharma_Resume.pdf" title="Download Resume PDF">PDF</a>){' '}
          &middot;{' '}
          <a style={{ color: 'var(--ac)' }} href="https://github.com/Kavy-Sharma" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          &middot;{' '}
          <a style={{ color: 'var(--ac)' }} href="https://linkedin.com/in/kavysharma" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>{' '}
          &middot;{' '}
          <a style={{ color: 'var(--ac)' }} href="https://tryhackme.com/p/kavysharma196" target="_blank" rel="noopener noreferrer">
            TryHackMe
          </a>
        </p>
      </div>
    </div>
  );
}
