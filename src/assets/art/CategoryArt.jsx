import React from 'react';

/**
 * 7 Original Building-Themed SVG Illustrations for Portfolio Categories
 *
 * Metaphor: Physical objects in an architectural building
 * - Access:    Arched building door swinging open with doorway light
 * - Injection: Building conduit pipes with turning valve wheel & flow signal
 * - Files:     Architectural flat-file blueprint drawer sliding open
 * - Auth:      Brass room key turning in an escutcheon keyhole
 * - Logic:     Interlocking elevator clockwork gears & switch lever
 * - Network:   Conduit cable trunking with pulsed wire signals & modular jacks
 * - Machines:  Server equipment chassis with ventilation louvers & gauge dial
 *
 * All SVGs:
 * - Use site CSS variables (--ink, --surf, --bg, --ln, --ac, --mu, --h1, --h2)
 * - Work seamlessly in Day ("Defend") and Night ("Attack") modes
 * - Animate subtly on hover
 * - Strictly respect prefers-reduced-motion (no movement)
 * - Under 3KB each
 */

// 1. Access: Arched Door & Light
export function AccessSvg({ size = 48, ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cat-art-svg art-access"
      aria-label="Access illustration: building doorway"
      {...props}
    >
      {/* Doorway Frame Molding */}
      <path
        d="M14 56V26C14 16.0589 22.0589 8 32 8C41.9411 8 50 16.0589 50 26V56"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Threshold Floor Line */}
      <line x1="8" y1="56" x2="56" y2="56" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Interior Doorway Glow (Revealed when open) */}
      <path
        d="M17 55V26C17 17.7157 23.7157 11 32 11C40.2843 11 47 17.7157 47 26V55H17Z"
        fill="var(--ac)"
        fillOpacity="0.16"
        className="art-door-interior"
      />
      <polygon
        points="22,55 42,55 52,61 12,61"
        fill="var(--ac)"
        fillOpacity="0.22"
        className="art-door-light-beam"
      />

      {/* Door Leaf (Swings on Hover) */}
      <g className="art-door-leaf">
        {/* Door Body */}
        <path
          d="M17 55V26C17 17.7157 23.7157 11 32 11C40.2843 11 47 17.7157 47 26V55H17Z"
          fill="var(--surf)"
          stroke="var(--ink)"
          strokeWidth="2"
        />
        {/* Door Panels / Transom Detail */}
        <circle cx="32" cy="24" r="5" stroke="var(--ln)" strokeWidth="1.5" fill="var(--bg)" />
        <rect x="22" y="34" width="20" height="16" rx="2" stroke="var(--ln)" strokeWidth="1.5" fill="var(--bg)" />
        {/* Doorknob */}
        <circle cx="42" cy="38" r="2.5" fill="var(--ac)" stroke="var(--ink)" strokeWidth="1" className="art-doorknob" />
      </g>
    </svg>
  );
}

// 2. Injection: Conduit Pipe & Valve Wheel
export function InjectionSvg({ size = 48, ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cat-art-svg art-injection"
      aria-label="Injection illustration: conduit pipes and valve"
      {...props}
    >
      {/* Horizontal Pipe Main */}
      <rect x="8" y="27" width="48" height="10" rx="2" fill="var(--surf)" stroke="var(--ink)" strokeWidth="2" />
      {/* Vertical Pipe Junction */}
      <rect x="27" y="14" width="10" height="38" rx="2" fill="var(--surf)" stroke="var(--ink)" strokeWidth="2" />

      {/* Flange Collars */}
      <line x1="14" y1="25" x2="14" y2="39" stroke="var(--ln)" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="25" x2="50" y2="39" stroke="var(--ln)" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="46" x2="39" y2="46" stroke="var(--ln)" strokeWidth="2" strokeLinecap="round" />

      {/* Flow Signal Pulse along the Pipe */}
      <line x1="10" y1="32" x2="54" y2="32" stroke="var(--ac)" strokeWidth="2.5" strokeDasharray="6 8" className="art-pipe-pulse" />

      {/* Valve Wheel on Top (Rotates on Hover) */}
      <g className="art-valve-wheel">
        <circle cx="32" cy="14" r="8" fill="var(--bg)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="32" cy="14" r="2" fill="var(--ac)" />
        <line x1="32" y1="6" x2="32" y2="22" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="24" y1="14" x2="40" y2="14" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// 3. Files: Blueprint Cabinet & Sliding Drawer
export function FilesSvg({ size = 48, ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cat-art-svg art-files"
      aria-label="Files illustration: blueprint drawer cabinet"
      {...props}
    >
      {/* Cabinet Frame */}
      <rect x="12" y="16" width="40" height="36" rx="4" fill="var(--bg)" stroke="var(--ink)" strokeWidth="2" />
      {/* Bottom Drawer */}
      <rect x="15" y="36" width="34" height="13" rx="2" fill="var(--surf)" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="28" y1="42.5" x2="36" y2="42.5" stroke="var(--mu)" strokeWidth="2" strokeLinecap="round" />

      {/* Blueprint Sheet (Lifts when drawer opens) */}
      <path
        d="M20 23L38 18L44 26L26 31Z"
        fill="var(--ac)"
        fillOpacity="0.25"
        stroke="var(--ac)"
        strokeWidth="1.5"
        className="art-file-sheet"
      />

      {/* Top Sliding Drawer (Slides out on Hover) */}
      <g className="art-drawer-top">
        <rect x="15" y="21" width="34" height="13" rx="2" fill="var(--surf)" stroke="var(--ink)" strokeWidth="1.5" />
        {/* Drawer Pull Handle */}
        <rect x="27" y="26" width="10" height="3" rx="1.5" fill="var(--ac)" stroke="var(--ink)" strokeWidth="1" />
        {/* Label slot */}
        <line x1="20" y1="27.5" x2="23" y2="27.5" stroke="var(--ln)" strokeWidth="1.5" />
        <line x1="41" y1="27.5" x2="44" y2="27.5" stroke="var(--ln)" strokeWidth="1.5" />
      </g>

      {/* Cabinet Base Legs */}
      <line x1="16" y1="52" x2="16" y2="56" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="52" x2="48" y2="56" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 4. Auth: Brass Room Key & Escutcheon Keyhole
export function AuthSvg({ size = 48, ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cat-art-svg art-auth"
      aria-label="Auth illustration: brass room key and keyhole"
      {...props}
    >
      {/* Architectural Keyhole Plate / Escutcheon */}
      <rect x="38" y="16" width="16" height="32" rx="8" fill="var(--surf)" stroke="var(--ink)" strokeWidth="2" />
      {/* Screw Rivets */}
      <circle cx="46" cy="21" r="1.5" fill="var(--ln)" />
      <circle cx="46" cy="43" r="1.5" fill="var(--ln)" />
      {/* Keyhole */}
      <path
        d="M46 28C44.3431 28 43 29.3431 43 31C43 32.1 43.6 33.05 44.5 33.55L44 38H48L47.5 33.55C48.4 33.05 49 32.1 49 31C49 29.3431 47.6569 28 46 28Z"
        fill="var(--ink)"
      />

      {/* Brass Room Key (Rotates on Hover) */}
      <g className="art-room-key">
        {/* Key Shaft */}
        <path d="M22 36L41 36" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Key Bit / Teeth */}
        <path d="M37 36V42H40V36" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" fill="var(--ac)" />
        <path d="M32 36V40H34V36" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" fill="var(--ac)" />
        {/* Key Bow / Head */}
        <circle cx="16" cy="36" r="7.5" fill="var(--ac)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="16" cy="36" r="3" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// 5. Logic: Elevator Gears & Clockwork Switch
export function LogicSvg({ size = 48, ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cat-art-svg art-logic"
      aria-label="Logic illustration: interlocking gears and mechanism"
      {...props}
    >
      {/* Switchboard Backplate */}
      <rect x="8" y="10" width="48" height="44" rx="6" fill="var(--bg)" stroke="var(--ln)" strokeWidth="1.5" />

      {/* Large Interlocking Gear (Rotates on Hover) */}
      <g className="art-gear-large">
        <circle cx="28" cy="32" r="13" fill="var(--surf)" stroke="var(--ink)" strokeWidth="2" />
        {/* Gear Teeth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect
            key={angle}
            x="26.5"
            y="16"
            width="3"
            height="4"
            rx="1"
            fill="var(--ink)"
            transform={`rotate(${angle} 28 32)`}
          />
        ))}
        <circle cx="28" cy="32" r="4.5" fill="var(--bg)" stroke="var(--ac)" strokeWidth="2" />
      </g>

      {/* Small Interlocking Gear (Counter-rotates on Hover) */}
      <g className="art-gear-small">
        <circle cx="44" cy="42" r="8" fill="var(--surf)" stroke="var(--ink)" strokeWidth="1.5" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <rect
            key={angle}
            x="43"
            y="32"
            width="2"
            height="3"
            rx="0.5"
            fill="var(--ink)"
            transform={`rotate(${angle} 44 42)`}
          />
        ))}
        <circle cx="44" cy="42" r="2.5" fill="var(--h1)" />
      </g>

      {/* Logic Indicator Light */}
      <circle cx="48" cy="18" r="3" fill="var(--ac)" className="art-logic-led" />
    </svg>
  );
}

// 6. Network: Conduit Cables & Patch Junction
export function NetworkSvg({ size = 48, ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cat-art-svg art-network"
      aria-label="Network illustration: conduit cables and patch box"
      {...props}
    >
      {/* Junction Enclosure Box */}
      <rect x="10" y="14" width="44" height="24" rx="4" fill="var(--surf)" stroke="var(--ink)" strokeWidth="2" />

      {/* Modular Ports */}
      <rect x="16" y="21" width="8" height="10" rx="1.5" fill="var(--bg)" stroke="var(--ln)" strokeWidth="1.5" />
      <rect x="28" y="21" width="8" height="10" rx="1.5" fill="var(--bg)" stroke="var(--ln)" strokeWidth="1.5" />
      <rect x="40" y="21" width="8" height="10" rx="1.5" fill="var(--bg)" stroke="var(--ln)" strokeWidth="1.5" />

      {/* Active Port Indicator LEDs */}
      <circle cx="20" cy="17" r="1.5" fill="var(--ac)" className="art-net-led-1" />
      <circle cx="32" cy="17" r="1.5" fill="var(--ac)" className="art-net-led-2" />
      <circle cx="44" cy="17" r="1.5" fill="var(--ln)" />

      {/* 3 Routed Conduit Cables Heading Downward */}
      <path
        d="M20 31V45C20 49 24 53 28 53H36"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="art-cable-1"
      />
      <path
        d="M32 31V48C32 52 36 55 40 55H48"
        stroke="var(--ac)"
        strokeWidth="2"
        strokeLinecap="round"
        className="art-cable-2"
      />
      <path
        d="M44 31V40C44 44 40 48 36 48H16"
        stroke="var(--mu)"
        strokeWidth="2"
        strokeLinecap="round"
        className="art-cable-3"
      />
    </svg>
  );
}

// 7. Machines: Server Rack Chassis & Status Dial
export function MachinesSvg({ size = 48, ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cat-art-svg art-machines"
      aria-label="Machines illustration: server chassis and gauge"
      {...props}
    >
      {/* Machine Rack Cabinet Chassis */}
      <rect x="10" y="12" width="44" height="40" rx="4" fill="var(--surf)" stroke="var(--ink)" strokeWidth="2" />

      {/* Mounting Ear Rails */}
      <line x1="7" y1="18" x2="10" y2="18" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="46" x2="10" y2="46" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="18" x2="57" y2="18" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="46" x2="57" y2="46" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />

      {/* Horizontal Ventilation Louvers */}
      <line x1="16" y1="36" x2="34" y2="36" stroke="var(--ln)" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="41" x2="34" y2="41" stroke="var(--ln)" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="46" x2="34" y2="46" stroke="var(--ln)" strokeWidth="2" strokeLinecap="round" />

      {/* Drive Tray Slot */}
      <rect x="16" y="18" width="18" height="10" rx="1.5" fill="var(--bg)" stroke="var(--ln)" strokeWidth="1.5" />
      <circle cx="20" cy="23" r="1.5" fill="var(--ac)" />
      <line x1="24" y1="23" x2="30" y2="23" stroke="var(--mu)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Analog Gauge Dial */}
      <g className="art-machine-gauge">
        <circle cx="44" cy="38" r="7" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M40 42C39 40 40 35 44 34C48 35 49 40 48 42" stroke="var(--ln)" strokeWidth="1" strokeDasharray="1 2" />
        {/* Dial Needle (Ticks on Hover) */}
        <line x1="44" y1="38" x2="47" y2="34" stroke="var(--ac)" strokeWidth="1.5" strokeLinecap="round" className="art-dial-needle" />
        <circle cx="44" cy="38" r="1" fill="var(--ink)" />
      </g>

      {/* Status LEDs */}
      <circle cx="42" cy="20" r="1.5" fill="var(--ac)" className="art-mac-led-1" />
      <circle cx="47" cy="20" r="1.5" fill="#2fbf71" className="art-mac-led-2" />
    </svg>
  );
}

/**
 * Unified CategoryArt Component
 * Usage: <CategoryArt category="Access" size={48} animated={true} />
 */
export default function CategoryArt({
  category = 'Access',
  size = 48,
  animated = true,
  className = '',
  style = {},
  ...props
}) {
  const norm = String(category || '').trim().toLowerCase();

  const getSvg = () => {
    switch (norm) {
      case 'access':
        return <AccessSvg size={size} {...props} />;
      case 'injection':
        return <InjectionSvg size={size} {...props} />;
      case 'files':
        return <FilesSvg size={size} {...props} />;
      case 'auth':
        return <AuthSvg size={size} {...props} />;
      case 'logic':
        return <LogicSvg size={size} {...props} />;
      case 'network':
        return <NetworkSvg size={size} {...props} />;
      case 'machines':
        return <MachinesSvg size={size} {...props} />;
      default:
        return <FilesSvg size={size} {...props} />;
    }
  };

  return (
    <span
      className={`category-art cat-${norm} ${animated ? 'is-animated' : ''} ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        verticalAlign: 'middle',
        ...style
      }}
      aria-hidden="true"
    >
      {getSvg()}
    </span>
  );
}
