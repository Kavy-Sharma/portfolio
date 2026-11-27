Idea: "Poster + Stories". Home is short and alive. Each project, the journey, notes and proof open their own page with a story.
Vibe: calm, confident, a little playful, mature. Not "hacker". Forbidden: matrix, glitch, text-scramble, glassmorphism or blur, neon, hooded imagery, fake typing, sound, holographic sheen, skill percentage bars, Inter, JetBrains Mono, #090A0F, cyan-and-amber.
Modes: Defend = day (default), Attack = night. Toggle top-right (aria-pressed, remembers choice) switches with one slow circular reveal from the switch (View Transitions API, clip-path fallback). It also changes content: Attack view shows how I got in; Defend view shows how it was closed. Same facts, two lenses.
Tokens (CSS variables; text contrast at least 4.5:1):
Defend: bg #E8F0EE, surface #F6FAF9, ink #0C2A33, muted #55717A, line #C9D9D6, accent #0A6670, highlight #F4D35E, alert #D6483A, ok #3E9A68
Attack: bg #160F1E, surface #20172B, ink #F1E9F2, muted #A99BB5, line #3A2B49, accent #FF7A66, highlight rgba(244,211,94,.30) as a band behind text (text stays light), alert #FF7A6B, ok #6FBF8E
Fonts (Google Fonts, verify they load, real fallbacks): Bricolage Grotesque (display, tight tracking), Instrument Sans (text), Geist Mono (labels and numbers only).
Depth: one soft radial light behind the hero that follows the cursor slowly; faint grain; soft shadow only on floating cards (previews, sandbox); hairline borders elsewhere; a subtle cursor-following border light on cards.
Motion: ease-out, 600-800ms, 12-24px reveals, one load sequence, transform and opacity only; static under prefers-reduced-motion.
Highlighter: a highlighter band behind key words (hero "Then I close it."), used sparingly.
