import { useEffect, useState } from 'react';
import { useCopy } from '../context.jsx';
import { DOCS_PATH } from '../constants.js';
import { GitHubLink, RouteLink, useAnchor } from '../router.jsx';
import { Wordmark } from './Shield.jsx';

/* Where the bar stops being part of the hero. Two thresholds, not one: with a
   single value a scroll that lands on it flips the class back and forth, and the
   compressed padding nudges the page height enough to re-trigger it. Entering
   costs more scroll than leaving. */
const ENTER_AT = 88;
const LEAVE_AT = 48;

export function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const { copied, copy } = useCopy();
  const anchor = useAnchor();

  useEffect(() => {
    let frame = 0;
    let queued = false;

    // One layout read per frame at most. Returning the current value from the
    // updater makes React bail out, so scrolling within a state costs no render.
    const measure = () => {
      queued = false;
      const y = window.scrollY;
      setScrolled((was) => (was ? y > LEAVE_AT : y > ENTER_AT));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    measure(); // reloading mid-page must not start in the hero state
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <header className={`sg-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="sg-container sg-nav__inner">
        <Wordmark className="sg-nav__brand" />

        <nav aria-label="Primary" className="sg-nav__links">
          <RouteLink to={DOCS_PATH}>Docs</RouteLink>
          <GitHubLink>GitHub</GitHubLink>
          <a href={anchor('#how')}>How it works</a>
          <a href={anchor('#install')}>Install</a>
        </nav>

        <div className="sg-nav__controls">
          <button
            type="button"
            className="sg-themetoggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          >
            <span aria-hidden="true" className={isDark ? 'sg-icon-sun' : 'sg-icon-moon'} />
          </button>

          <button
            type="button"
            className="sg-navcopy"
            onClick={() => copy('nav')}
            aria-label="Copy pip install command"
          >
            <span className="sg-navcopy__prompt" aria-hidden="true">
              $
            </span>
            <span>pip install sguard</span>
            <span className="sg-navcopy__label">{copied === 'nav' ? 'copied' : 'copy'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
