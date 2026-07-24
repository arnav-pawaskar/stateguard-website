import { useEffect, useState } from 'react';
import { GITHUB_URL } from './constants.js';

/* A ~40-line client-side router. The site is two pages; pulling in a routing
   library for that would cost more than it explains. */

const normalize = (p) => {
  const trimmed = p.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

/** Current pathname, kept in sync with history navigation. */
export function useRoute() {
  const [path, setPath] = useState(() => normalize(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return path;
}

export function navigate(to) {
  if (normalize(window.location.pathname) === normalize(to)) {
    // already here — treat it as "back to the top", which is what a wordmark
    // click means on the page it points at
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState({}, '', to);
  // useRoute listens on popstate, which pushState does not emit
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

/** Internal link — client-side navigation, but still a real href so
    middle-click, ctrl-click and "copy link address" all behave. */
export function RouteLink({ to, children, ...rest }) {
  const onClick = (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}

/** External link to the repo. */
export function GitHubLink({ children, ...rest }) {
  return (
    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

/**
 * In-page anchors only resolve on the landing page. From anywhere else they
 * need to point back home first, or they silently do nothing.
 */
export function useAnchor() {
  const route = useRoute();
  const prefix = route === '/' ? '' : '/';
  return (hash) => `${prefix}${hash}`;
}
