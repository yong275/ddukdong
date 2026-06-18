const ILLOS = {
  rabbit: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 138 q22 -18 44 0 t44 0 t44 0 t44 0 t44 0 V152 H0 Z" fill="#bfe39a" stroke="none" />
      <ellipse cx="90" cy="46" rx="8" ry="24" fill="#fffdf8" transform="rotate(-8 90 46)" />
      <ellipse cx="110" cy="46" rx="8" ry="24" fill="#fffdf8" transform="rotate(8 110 46)" />
      <ellipse cx="90" cy="48" rx="3.4" ry="14" fill="#f6bcc7" stroke="none" transform="rotate(-8 90 48)" />
      <ellipse cx="110" cy="48" rx="3.4" ry="14" fill="#f6bcc7" stroke="none" transform="rotate(8 110 48)" />
      <ellipse cx="100" cy="96" rx="32" ry="29" fill="#fffdf8" />
      <circle cx="90" cy="92" r="3.6" fill="#3a2e26" stroke="none" />
      <circle cx="110" cy="92" r="3.6" fill="#3a2e26" stroke="none" />
      <circle cx="82" cy="101" r="4.2" fill="#f7c5cf" stroke="none" />
      <circle cx="118" cy="101" r="4.2" fill="#f7c5cf" stroke="none" />
      <circle cx="100" cy="99" r="2.6" fill="#f2913d" stroke="none" />
      <path d="M96 102 q4 4 8 0" />
      <path d="M150 38 l2.6 6.4 6.4 2.6 -6.4 2.6 -2.6 6.4 -2.6 -6.4 -6.4 -2.6 6.4 -2.6 z" fill="#ffd54d" stroke="none" />
    </g>
  ),
  ocean: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 116 q12 -9 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 V152 H0 Z" fill="#a9ddf5" stroke="none" />
      <circle cx="58" cy="50" r="3.6" fill="#cdeefb" />
      <circle cx="67" cy="41" r="2.8" fill="#cdeefb" />
      <circle cx="51" cy="42" r="2.2" fill="#cdeefb" />
      <path d="M120 84 l18 -11 v22 z" fill="#ff9f4d" />
      <ellipse cx="98" cy="84" rx="28" ry="18" fill="#ffb24d" />
      <path d="M92 68 q6 8 0 14" />
      <circle cx="86" cy="80" r="5" fill="#fff" />
      <circle cx="86" cy="80" r="2.3" fill="#3a2e26" stroke="none" />
      <path d="M96 90 q6 4 12 0" />
      <path d="M138 50 l12 -7 v14 z" fill="#6fc3e6" />
      <ellipse cx="124" cy="50" rx="15" ry="10" fill="#7ccbe9" />
      <circle cx="117" cy="48" r="2.8" fill="#fff" />
      <circle cx="117" cy="48" r="1.4" fill="#3a2e26" stroke="none" />
    </g>
  ),
  stars: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M44 46 a14 14 0 1 1 -3 -20 a11 11 0 1 0 3 20 z" fill="#ffe07a" />
      <path d="M85 86 q-12 6 -12 24 q11 -2 16 -11 z" fill="#f4684e" />
      <path d="M115 86 q12 6 12 24 q-11 -2 -16 -11 z" fill="#f4684e" />
      <path d="M100 40 q16 17 16 52 q0 6 -3 9 h-26 q-3 -3 -3 -9 q0 -35 16 -52 z" fill="#ff8d5e" />
      <circle cx="100" cy="72" r="9" fill="#cdeefb" />
      <path d="M91 102 q9 22 18 0 q-3 15 -9 18 q-6 -3 -9 -18 z" fill="#ffd24d" stroke="none" />
      <path d="M150 44 l2.6 6.4 6.4 2.6 -6.4 2.6 -2.6 6.4 -2.6 -6.4 -6.4 -2.6 6.4 -2.6 z" fill="#ffd54d" stroke="none" />
      <path d="M58 96 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#ffd54d" stroke="none" />
    </g>
  ),
  forest: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 120 H200 V152 H0 Z" fill="#bfe39a" stroke="none" />
      <line x1="0" y1="120" x2="200" y2="120" />
      <rect x="45" y="98" width="10" height="22" rx="3" fill="#a9744f" />
      <path d="M50 42 L30 76 H70 Z" fill="#7cc05a" />
      <path d="M50 60 L34 90 H66 Z" fill="#8fce6a" />
      <rect x="150" y="94" width="10" height="26" rx="3" fill="#a9744f" />
      <circle cx="155" cy="74" r="22" fill="#8fce6a" />
      <g fill="#5a4636" stroke="none">
        <circle cx="96" cy="78" r="6" />
        <rect x="100" y="50" width="3.4" height="28" />
        <circle cx="116" cy="86" r="6" />
        <rect x="120" y="58" width="3.4" height="28" />
        <path d="M101.5 50 q12 1 19.5 8 v6 q-8 -7 -19.5 -8 z" />
      </g>
    </g>
  ),
  cloud: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="48" cy="42" r="13" fill="#ffd54d" />
      <g stroke="#ffb300" strokeWidth="2.4">
        <line x1="48" y1="20" x2="48" y2="12" />
        <line x1="29" y1="42" x2="21" y2="42" />
        <line x1="33" y1="27" x2="27" y2="21" />
      </g>
      <path d="M70 98 q-17 0 -17 -15 q0 -13 15 -14 q3 -16 21 -16 q13 0 17 11 q15 -5 23 7 q14 -1 14 13 q0 16 -17 16 z" fill="#fffef9" />
      <path d="M84 104 q16 -15 32 0 q3 13 -5 15 H89 q-8 -2 -5 -15 z" fill="#e3a86a" />
      <path d="M96 105 v13 M104 105 v13" stroke="#c98a4e" />
    </g>
  ),
  castle: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 124 H200 V152 H0 Z" fill="#d7c6a0" stroke="none" />
      <line x1="0" y1="124" x2="200" y2="124" />
      <rect x="54" y="70" width="26" height="54" fill="#d9c2ef" />
      <rect x="120" y="70" width="26" height="54" fill="#d9c2ef" />
      <rect x="84" y="50" width="32" height="74" fill="#e6d6f7" />
      <g fill="#d9c2ef">
        <rect x="54" y="64" width="6" height="8" />
        <rect x="64" y="64" width="6" height="8" />
        <rect x="74" y="64" width="6" height="8" />
        <rect x="120" y="64" width="6" height="8" />
        <rect x="130" y="64" width="6" height="8" />
        <rect x="140" y="64" width="6" height="8" />
        <rect x="84" y="44" width="7" height="8" />
        <rect x="96.5" y="44" width="7" height="8" />
        <rect x="109" y="44" width="7" height="8" />
      </g>
      <path d="M92 124 v-20 a8 8 0 0 1 16 0 v20 z" fill="#6b4f3a" />
      <rect x="63" y="84" width="8" height="10" rx="2" fill="#bba6dd" />
      <rect x="129" y="84" width="8" height="10" rx="2" fill="#bba6dd" />
      <path d="M100 50 v-12" strokeWidth="2.4" />
      <path d="M100 38 h12 l-4 4 4 4 h-12 z" fill="#f4684e" stroke="none" />
    </g>
  ),
  house: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 124 H200 V152 H0 Z" fill="#bfe39a" stroke="none" />
      <line x1="0" y1="124" x2="200" y2="124" />
      <circle cx="158" cy="40" r="12" fill="#ffd54d" />
      <rect x="70" y="80" width="60" height="44" fill="#ffe1b0" />
      <path d="M62 80 L100 48 L138 80 Z" fill="#e07a5f" />
      <rect x="116" y="58" width="9" height="16" fill="#c96a52" />
      <rect x="92" y="98" width="18" height="26" rx="2" fill="#b5734a" />
      <circle cx="105" cy="111" r="1.6" fill="#6b4f3a" stroke="none" />
      <rect x="76" y="90" width="16" height="16" rx="2" fill="#cdeefb" />
      <path d="M84 90 v16 M76 98 h16" strokeWidth="2.2" />
    </g>
  ),
  hanok: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 122 H200 V152 H0 Z" fill="#cfe7b4" stroke="none" />
      <circle cx="158" cy="40" r="11" fill="#ffd54d" />
      <path d="M40 74 q60 -34 120 0 q-10 -10 -26 -13 q-34 -7 -68 0 q-16 3 -26 13 z" fill="#7a5140" />
      <path d="M34 74 h132" />
      <rect x="56" y="76" width="88" height="40" fill="#f0e3cf" />
      <rect x="58" y="76" width="9" height="40" fill="#b98a5a" />
      <rect x="133" y="76" width="9" height="40" fill="#b98a5a" />
      <rect x="88" y="86" width="24" height="30" fill="#caa06d" />
      <path d="M100 86 v30 M88 100 h24" strokeWidth="2.2" />
      <rect x="50" y="114" width="100" height="6" fill="#8a7a66" />
    </g>
  ),
  butterfly: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 138 q22 -16 44 0 t44 0 t44 0 t44 0 t44 0 V152 H0Z" fill="#bfe39a" stroke="none" />
      <ellipse cx="78" cy="70" rx="20" ry="16" fill="#ff9fb0" />
      <ellipse cx="122" cy="70" rx="20" ry="16" fill="#ff9fb0" />
      <ellipse cx="82" cy="96" rx="15" ry="12" fill="#ffd54d" />
      <ellipse cx="118" cy="96" rx="15" ry="12" fill="#ffd54d" />
      <rect x="97.5" y="60" width="5" height="44" rx="2.5" fill="#5a4636" />
      <path d="M98 60 q-6 -10 -12 -12 M102 60 q6 -10 12 -12" />
      <circle cx="85" cy="70" r="3" fill="#fff" stroke="none" />
      <circle cx="115" cy="70" r="3" fill="#fff" stroke="none" />
    </g>
  ),
  book: (
    <g fill="none" stroke="#6b4f3a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M100 58 q-26 -12 -46 -7 v56 q22 -5 46 5 z" fill="#fffaf0" />
      <path d="M100 58 q26 -12 46 -7 v56 q-22 -5 -46 5 z" fill="#fff3e0" />
      <line x1="100" y1="58" x2="100" y2="112" />
      <g stroke="#d8c2a0" strokeWidth="2.2">
        <line x1="64" y1="68" x2="90" y2="64" />
        <line x1="64" y1="78" x2="90" y2="74" />
        <line x1="110" y1="64" x2="136" y2="68" />
        <line x1="110" y1="74" x2="136" y2="78" />
      </g>
      <path d="M100 36 l2.6 6.6 6.6 2.6 -6.6 2.6 -2.6 6.6 -2.6 -6.6 -6.6 -2.6 6.6 -2.6 z" fill="#ffd54d" stroke="none" />
    </g>
  ),
};

export default function Illo({ name, size = 120, className = '' }) {
  const content = ILLOS[name];

  return (
    <svg
      viewBox="0 0 200 150"
      width={size}
      height={size * (150 / 200)}
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {content ?? (
        <rect width="200" height="150" rx="12" fill="#f0f0f0" />
      )}
    </svg>
  );
}
