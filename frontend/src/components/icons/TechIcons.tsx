import React, { useState } from 'react';

export interface TechIconProps {
  name: string;
  icon?: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

export const PRESET_TECH_LOGOS = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'react', label: 'React' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'express', label: 'Express' },
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'threejs', label: 'Three.js / WebGL' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'pytorch', label: 'PyTorch / AI' },
  { id: 'docker', label: 'Docker' },
  { id: 'git', label: 'Git' },
  { id: 'linux', label: 'Linux / Bash' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'redis', label: 'Redis' },
  { id: 'graphql', label: 'GraphQL' },
  { id: 'security', label: 'Cyber Security' },
  { id: 'owasp', label: 'OWASP / Pen-Test' },
];

export const TechLogo: React.FC<TechIconProps> = ({ 
  name, 
  icon, 
  logoUrl, 
  size = 28, 
  className = '' 
}) => {
  const [imgError, setImgError] = useState(false);

  // Check if custom uploaded or external logo is specified
  const customImageSrc = (logoUrl && logoUrl.trim()) 
    ? logoUrl.trim() 
    : (icon && (
        icon.startsWith('http://') || 
        icon.startsWith('https://') || 
        icon.startsWith('/uploads') || 
        icon.startsWith('uploads/') || 
        icon.startsWith('data:image/') ||
        /\.(svg|png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(icon)
      ))
      ? icon.trim()
      : null;

  const finalSrc = customImageSrc?.startsWith('uploads/') ? `/${customImageSrc}` : customImageSrc;

  if (finalSrc && !imgError) {
    return (
      <img
        src={finalSrc}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: size, height: size }}
        className={`object-contain rounded ${className}`}
        loading="lazy"
      />
    );
  }

  const normalized = `${name} ${icon || ''}`.toLowerCase().trim();

  // Python
  if (normalized.includes('python')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 255" className={className}>
        <defs>
          <linearGradient id="pythonA" x1="12.96%" y1="-4.63%" x2="79.85%" y2="82.49%">
            <stop offset="0%" stopColor="#387EB8" />
            <stop offset="100%" stopColor="#366994" />
          </linearGradient>
          <linearGradient id="pythonB" x1="19.13%" y1="16.38%" x2="87.25%" y2="108.8%">
            <stop offset="0%" stopColor="#FFE052" />
            <stop offset="100%" stopColor="#FFC331" />
          </linearGradient>
        </defs>
        <path
          fill="url(#pythonA)"
          d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.577 34.475-33.319V28.187S193.593.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"
        />
        <path
          fill="url(#pythonB)"
          d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.71c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.577-34.475 33.32v61.801s4.162 28.107 70.839 28.107zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"
        />
      </svg>
    );
  }

  // TypeScript / TS
  if (normalized.includes('typescript') || normalized === 'ts') {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <rect width="256" height="256" rx="36" fill="#3178C6" />
        <path
          fill="#FFF"
          d="M136.2 165.7v24.6c-4.8 2.5-11.5 4.3-20.2 4.3-26.6 0-39.7-16-39.7-41.9 0-26.5 14.5-43.5 39.8-43.5 8.3 0 15 1.7 19.4 3.9v24.1c-4.5-2.7-10.4-4.5-16.6-4.5-12.7 0-19.4 8.7-19.4 20.2 0 12.3 6.9 20.7 20 20.7 6.4 0 12.3-1.8 16.7-4.1zm51.4-60v19.4h-24v78.4h-25.1v-78.4h-24.1v-19.4h73.2z"
          transform="matrix(1 0 0 1 -10 5)"
        />
        <text
          x="128"
          y="180"
          fill="#FFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          fontSize="130"
          textAnchor="middle"
        >
          TS
        </text>
      </svg>
    );
  }

  // JavaScript / JS
  if (normalized.includes('javascript') || normalized === 'js') {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <rect width="256" height="256" rx="36" fill="#F7DF1E" />
        <text
          x="132"
          y="185"
          fill="#000"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="135"
          letterSpacing="-4"
          textAnchor="middle"
        >
          JS
        </text>
      </svg>
    );
  }

  // React / React 19
  if (normalized.includes('react') && !normalized.includes('reactive')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 228" className={className}>
        <path
          fill="#00D8FF"
          d="M210.48 73.82a171.49 171.49 0 0 0-8.24-2.6c.47-1.9.9-3.77 1.28-5.62 6.23-30.28 2.16-54.67-11.77-62.7-13.36-7.7-35.2.32-57.26 19.52a171.2 171.2 0 0 0-6.37 5.85 155.87 155.87 0 0 0-4.24-3.92C100.76 3.83 77.59-4.82 63.67 3.23c-13.34 7.73-17.3 30.66-11.68 59.36a171 171 0 0 0 1.9 8.48c-3.28.93-6.45 1.92-9.48 2.98C17.3 83.5 0 98.3 0 113.67c0 15.86 18.58 31.78 46.81 41.43a145.5 145.5 0 0 0 6.92 2.16 167.5 167.5 0 0 0-2 9.14c-5.36 28.2-1.18 50.6 12.13 58.27 13.74 7.92 36.81-.22 59.27-19.86a145.6 145.6 0 0 0 5.35-4.92 168 168 0 0 0 6.92 6.31c21.75 18.73 43.24 26.29 56.54 18.59 13.73-7.95 18.2-32 12.4-61.27a145 145 0 0 0-1.54-6.84c1.62-.48 3.21-.98 4.76-1.49 29.35-9.72 48.45-25.44 48.45-41.52 0-15.42-17.87-30.33-45.52-39.85ZM128 90.8a22.86 22.86 0 1 1 0 45.72 22.86 22.86 0 0 1 0-45.72Z"
        />
      </svg>
    );
  }

  // Next.js
  if (normalized.includes('next')) {
    return (
      <svg width={size} height={size} viewBox="0 0 180 180" fill="none" className={className}>
        <mask id="nextMask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style={{ maskType: 'alpha' }}>
          <circle cx="90" cy="90" r="90" fill="#000" />
        </mask>
        <g mask="url(#nextMask)">
          <circle cx="90" cy="90" r="90" fill="#000" stroke="#FFF" strokeWidth="6" />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#nextGrad)"
          />
          <rect x="115" y="54" width="12" height="72" fill="url(#nextGrad2)" />
        </g>
        <defs>
          <linearGradient id="nextGrad" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF" />
            <stop offset="1" stopColor="#FFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nextGrad2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF" />
            <stop offset="1" stopColor="#FFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Node.js / Express
  if (normalized.includes('node')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#5FA04E"
          d="M128 20.33l99.9 57.68v115.36L128 251.05l-99.9-57.68V78.01L128 20.33z"
        />
        <path
          fill="#FFF"
          d="M128 48.66l69.75 40.27v80.54L128 209.74l-69.75-40.27V88.93L128 48.66z"
        />
        <path
          fill="#333"
          d="M128 66l52.5 30.3v60.6L128 187.2l-52.5-30.3V96.3L128 66z"
        />
        <text
          x="128"
          y="136"
          fill="#5FA04E"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          fontSize="36"
          textAnchor="middle"
        >
          node
        </text>
      </svg>
    );
  }

  // Express alone
  if (normalized.includes('express')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <rect width="256" height="256" rx="40" fill="#111" stroke="#333" strokeWidth="8" />
        <text
          x="128"
          y="155"
          fill="#FFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="800"
          fontSize="90"
          textAnchor="middle"
        >
          ex
        </text>
      </svg>
    );
  }

  // Tailwind CSS
  if (normalized.includes('tailwind')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#06B6D4"
          d="M64 80c10.67-16 25.33-24 44-24 28 0 35 20 49 22 9.33 1.33 18-2 26-10 10.67-10.67 19.33-8 26 8-10.67 16-25.33 24-44 24-28 0-35-20-49-22-9.33-1.33-18 2-26 10-10.67 10.67-19.33 8-26-8Zm-40 64c10.67-16 25.33-24 44-24 28 0 35 20 49 22 9.33 1.33 18-2 26-10 10.67-10.67 19.33-8 26 8-10.67 16-25.33 24-44 24-28 0-35-20-49-22-9.33-1.33-18 2-26 10-10.67 10.67-19.33 8-26-8Z"
        />
      </svg>
    );
  }

  // Three.js / WebGL
  if (normalized.includes('three') || normalized.includes('webgl')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#FFF"
          d="M128 32l83.14 144H44.86L128 32zm0 48L72.57 160h110.86L128 80z"
        />
        <path fill="#22D3EE" d="M128 80l55.43 80H72.57L128 80z" opacity="0.4" />
      </svg>
    );
  }

  // MongoDB
  if (normalized.includes('mongo')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#47A248"
          d="M130.6 242.4c-2.4 5.9-9.8 5.7-12.2 0-23.5-56.7-65.7-103.7-65.7-142.1 0-48.4 34.6-88.8 74.8-97.6 1.7-.4 3.4-.4 5.1 0 40.2 8.8 74.8 49.2 74.8 97.6 0 38.4-43.3 85.4-66.8 142.1z"
        />
        <path
          fill="#13AA52"
          d="M124.5 2.7c-40.2 8.8-74.8 49.2-74.8 97.6 0 38.4 42.2 85.4 65.7 142.1 1.2 2.9 4.9 2.9 6.1 0V2.7h-7z"
        />
        <path
          fill="#FFF"
          opacity="0.3"
          d="M124.5 242.4c1.2 2.9 4.9 2.9 6.1 0 1.2-2.9 2.4-5.8 3.6-8.7V17.3c-3.2 2.8-6.4 5.9-9.7 9.4v215.7z"
        />
      </svg>
    );
  }

  // PostgreSQL / Postgres / SQL
  if (normalized.includes('postgres') || normalized.includes('sql') || normalized.includes('database')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#336791"
          d="M128 16C66.1 16 16 66.1 16 128s50.1 112 112 112 112-50.1 112-112S189.9 16 128 16zm49 144.3c-4.9 10.9-14.7 18.5-27 21.6-4.5 1.1-9.2 1.6-13.9 1.6-10.2 0-20.2-2.7-29-7.8-13.1-7.6-21.7-20.6-23.7-35.6-2.5-19 6.2-37.5 22.8-48.4 8.7-5.7 19-8.8 29.5-8.8 6.4 0 12.8 1.1 18.8 3.4 12.7 4.8 22.5 14.5 26.8 27.2l-18.7 6.4c-2.7-7.9-8.7-13.8-16.7-16.8-3.4-1.3-7-1.9-10.7-1.9-6.3 0-12.4 1.8-17.6 5.2-10 6.6-15.3 17.7-13.8 29.3 1.3 9.4 6.7 17.6 15 22.4 5.5 3.2 11.8 4.9 18.2 4.9 2.8 0 5.7-.3 8.4-1 7.7-2 13.9-6.7 17-13.5l14.5 8z"
        />
      </svg>
    );
  }

  // PyTorch / Machine Learning / Deep Learning / AI
  if (normalized.includes('pytorch') || normalized.includes('torch') || normalized.includes('ai') || normalized.includes('ml')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#EE4C2C"
          d="M136.6 28.5L128 20l-8.6 8.5C78.2 69.8 54 116.8 54 159.2 54 200.2 87.1 236 128 236s74-35.8 74-76.8c0-42.4-24.2-89.4-65.4-130.7zM128 213c-28.7 0-52-24.1-52-53.8 0-28.7 17.2-61.9 44.8-93.5l7.2-8.3 7.2 8.3c27.6 31.6 44.8 64.8 44.8 93.5 0 29.7-23.3 53.8-52 53.8z"
        />
        <circle cx="178" cy="74" r="14" fill="#EE4C2C" />
      </svg>
    );
  }

  // Docker / Containers
  if (normalized.includes('docker') || normalized.includes('container')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#2496ED"
          d="M250.3 121.2c-4.4-3.3-15.6-7-29.2-2.3-1.6-8.5-7.7-15.9-15.8-20.2l-7.3-3.9-4.7 6.8c-7.3 10.4-8.8 23.3-4.2 34.6-4.5 2.5-12.7 6.2-24.4 6.2H12.5C5.6 142.4 0 148 0 154.9c0 47.9 38.8 86.8 86.7 86.8 68.7 0 123.6-42.8 143.9-106.8 8.1-.5 19.3-3.6 23.8-11.2l1.9-2.5-6-0.2z"
        />
        <path
          fill="#2496ED"
          d="M48 108h22v22H48zm26 0h22v22H74zm26 0h22v22h-22zm26 0h22v22h-22zm-52-26h22v22H74zm26 0h22v22h-22zm26 0h22v22h-22zm0-26h22v22h-22z"
        />
      </svg>
    );
  }

  // Cyber Security / Network Security / Wireshark
  if (normalized.includes('security') || normalized.includes('wireshark') || normalized.includes('cyber') || normalized.includes('network')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
          fill="#06B6D4"
          fillOpacity="0.2"
          stroke="#22D3EE"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7v5l3 3"
          stroke="#22D3EE"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" fill="#22D3EE" fillOpacity="0.4" />
      </svg>
    );
  }

  // OWASP / Pen-Testing / Ethical Hacking
  if (normalized.includes('owasp') || normalized.includes('pen-test') || normalized.includes('hack') || normalized.includes('audit')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect
          x="3"
          y="10"
          width="18"
          height="12"
          rx="3"
          fill="#EF4444"
          fillOpacity="0.2"
          stroke="#F87171"
          strokeWidth="1.8"
        />
        <path
          d="M7 10V6a5 5 0 0 1 10 0v4"
          stroke="#F87171"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="2" fill="#F87171" />
      </svg>
    );
  }

  // Git / GitHub / Version Control
  if (normalized.includes('git')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#F05032"
          d="M250.9 119.5L136.5 5.1c-6.8-6.8-17.8-6.8-24.6 0L87.5 29.5l31.1 31.1c7.2-2.5 15.6-.8 21.2 4.9 5.7 5.7 7.4 14.1 4.9 21.3l29.9 29.9c7.2-2.5 15.6-.8 21.3 4.9 8.1 8.1 8.1 21.3 0 29.4-8.1 8.1-21.3 8.1-29.4 0-5.9-5.9-7.5-14.6-4.7-22l-27.9-27.9v57.8c2.4 1.2 4.6 2.9 6.4 4.7 8.1 8.1 8.1 21.3 0 29.4-8.1 8.1-21.3 8.1-29.4 0-8.1-8.1-8.1-21.3 0-29.4 2.2-2.2 4.8-3.9 7.7-5v-58.8c-2.9-1.1-5.5-2.8-7.7-5-5.8-5.8-7.5-14.4-5-21.7L75.3 41.7 5.1 111.9c-6.8 6.8-6.8 17.8 0 24.6l114.4 114.4c6.8 6.8 17.8 6.8 24.6 0l106.8-106.8c6.8-6.8 6.8-17.8 0-24.6z"
        />
      </svg>
    );
  }

  // C++ / C / C#
  if (normalized.includes('c++') || normalized.includes('cpp')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <rect width="256" height="256" rx="36" fill="#00599C" />
        <text
          x="128"
          y="170"
          fill="#FFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          fontSize="105"
          textAnchor="middle"
        >
          C++
        </text>
      </svg>
    );
  }

  // Java
  if (normalized.includes('java') && !normalized.includes('script')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#EA2D2E"
          d="M104.2 189.7s-15.6 1.8-8.9 9.3c8.3 9.4 17.2 9.1 30.1 7.2 12.8-1.9 29.7-9.5 29.7-9.5s-7.1 4.5-15.2 6.9c-10.2 3.1-23.8 3.5-33.8-.4-10-3.9-6.3-11.2-1.9-13.5z"
        />
        <path
          fill="#0074BD"
          d="M102.3 147.2s-16.7 3.8-7.8 11.7c10.8 9.7 20.3 8.3 36.1 4.8 15.7-3.5 35.8-13.8 35.8-13.8s-9.1 5.9-19.1 8.7c-13.1 3.6-30.8 3.9-43-1.6-12-5.4-6.4-9.3-2-9.8z"
        />
        <path
          fill="#EA2D2E"
          d="M135.2 79.5c6.5 7.4 4.8 13.9-2.9 22.3-9.4 10.3-15.7 17.8-1.4 30.2 0 0-21.7-11.1-13.9-25.9 8.2-15.5 13.7-18.7 18.2-26.6z"
        />
      </svg>
    );
  }

  // Go / Golang
  if (normalized.includes('go') || normalized.includes('golang')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <rect width="256" height="256" rx="36" fill="#00ADD8" />
        <text
          x="128"
          y="170"
          fill="#FFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="115"
          letterSpacing="-3"
          textAnchor="middle"
        >
          GO
        </text>
      </svg>
    );
  }

  // Rust
  if (normalized.includes('rust')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <rect width="256" height="256" rx="36" fill="#000" stroke="#CE412B" strokeWidth="8" />
        <text
          x="128"
          y="170"
          fill="#CE412B"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          fontSize="120"
          textAnchor="middle"
        >
          R
        </text>
      </svg>
    );
  }

  // Redis
  if (normalized.includes('redis')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <rect width="256" height="256" rx="36" fill="#DC382D" />
        <path
          fill="#FFF"
          d="M60 80l68-35 68 35-68 35-68-35zm0 48l68 35 68-35-68-35-68 35zm0 48l68 35 68-35-68-35-68 35z"
          opacity="0.9"
        />
      </svg>
    );
  }

  // GraphQL
  if (normalized.includes('graphql')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
        <path
          fill="#E10098"
          d="M128 24l90 52v104l-90 52-90-52V76l90-52zm0 24.3L59.1 84.7v86.6L128 211.7l68.9-40.4V84.7L128 48.3z"
        />
        <circle cx="128" cy="24" r="16" fill="#E10098" />
        <circle cx="218" cy="76" r="16" fill="#E10098" />
        <circle cx="218" cy="180" r="16" fill="#E10098" />
        <circle cx="128" cy="232" r="16" fill="#E10098" />
        <circle cx="38" cy="180" r="16" fill="#E10098" />
        <circle cx="38" cy="76" r="16" fill="#E10098" />
      </svg>
    );
  }

  // Linux / Terminal / Bash
  if (normalized.includes('linux') || normalized.includes('bash') || normalized.includes('terminal')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#0D1117" stroke="#22D3EE" strokeWidth="1.5" />
        <path d="M6 9l4 3-4 3" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15h6" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Default Fallback - Tech Chip Emblem with first 2 letters
  const abbr = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'DEV';
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-lg bg-cyan-950/40 border border-cyan-400/30 flex items-center justify-center font-mono font-bold text-cyan-300 ${className}`}
    >
      <span style={{ fontSize: size * 0.42 }}>{abbr}</span>
    </div>
  );
};
