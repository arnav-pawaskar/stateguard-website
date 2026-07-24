import { useEffect, useState } from 'react';
import { useCopy } from '../context.jsx';
import { DOCS_PATH } from '../constants.js';
import { GitHubLink, RouteLink, useAnchor } from '../router.jsx';
import { Wordmark } from './Shield.jsx';

export function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const { copied, copy } = useCopy();
  const anchor = useAnchor();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = theme === 'dark';

  return (
    <header className={`sg-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="sg-container sg-nav__inner">
        <Wordmark className="sg-nav__brand" />

        <nav aria-label="Primary" className="sg-nav__links">
          <RouteLink to={DOCS_PATH}>Docs</RouteLink>
          <GitHubLink>GitHub</GitHubLink>
          <a href="#">Benchmarks</a>
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
