import { useId } from 'react';
import { RouteLink } from '../router.jsx';

/**
 * The "Keyed G" mark: a C-ring (the contract — closed, with one opening) and a
 * bar entering through it (the payload, seating like a key). The bar overshoots
 * the ring on purpose — it is mid-seat, not seated.
 *
 * The ring takes `currentColor` so it inherits the wordmark's `--fg`; the bar
 * uses `--accent`/`--accent-2`, which flip with the theme in tokens.css.
 * Decorative — the surrounding link carries the label.
 */
export function Logo({ small = false }) {
  // useId's raw output contains characters that are not safe inside url(#…), so
  // strip to word chars. One gradient per instance keeps the two lockups (nav +
  // footer) from colliding on a single document-level id.
  const gradId = `sg-mark-${useId().replace(/\W/g, '')}`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 32 32"
      className={`sg-mark${small ? ' sg-mark--sm' : ''}`}
    >
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1="15.5"
          y1="13.6"
          x2="30"
          y2="18"
        >
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <path
        d="M24.17 8.64A11 11 0 1 0 24.17 23.36"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.8"
        strokeLinecap="round"
      />
      <rect x="15.5" y="13.6" width="14.5" height="4.8" rx="2.4" fill={`url(#${gradId})`} />
    </svg>
  );
}

/** Mark + "StateGuard" lockup. Always routes home. */
export function Wordmark({ small = false, className = '', ...rest }) {
  return (
    <RouteLink
      to="/"
      className={`sg-wordmark ${className}`.trim()}
      aria-label="StateGuard home"
      {...rest}
    >
      <Logo small={small} />
      <span>
        State<span className="sg-grad-text">Guard</span>
      </span>
    </RouteLink>
  );
}
