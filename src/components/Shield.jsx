import { RouteLink } from '../router.jsx';

/** Hexagonal gradient shield glyph with an inset checkmark. Decorative. */
export function Shield({ small = false }) {
  return (
    <span aria-hidden="true" className={`sg-shield${small ? ' sg-shield--sm' : ''}`}>
      <span className="sg-shield__check" />
    </span>
  );
}

/** Shield + "StateGuard" lockup. Always routes home. */
export function Wordmark({ small = false, className = '', ...rest }) {
  return (
    <RouteLink
      to="/"
      className={`sg-wordmark ${className}`.trim()}
      aria-label="StateGuard home"
      {...rest}
    >
      <Shield small={small} />
      <span>
        State<span className="sg-grad-text">Guard</span>
      </span>
    </RouteLink>
  );
}
