import { DOCS_PATH } from '../constants.js';
import { GitHubLink, RouteLink, useAnchor } from '../router.jsx';
import { Wordmark } from './Shield.jsx';

export function Footer() {
  const anchor = useAnchor();

  const COLUMNS = [
    {
      title: 'Product',
      links: [
        { label: 'Docs', to: DOCS_PATH },
        { label: 'How it works', href: anchor('#how') },
        { label: 'Benchmarks', href: '#' },
      ],
    },
    {
      title: 'Source',
      links: [
        { label: 'GitHub', github: true },
        { label: 'Changelog', href: '#' },
        { label: 'Issues', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'License · Apache-2.0', href: '#' },
        { label: 'Install', href: anchor('#install') },
      ],
    },
  ];

  return (
    <footer className="sg-footer">
      <div className="sg-container">
        <div className="sg-footer__grid">
          <div>
            <Wordmark small className="sg-footer__brand" />
            <p className="sg-footer__tagline">
              Self-healing runtime contracts for AI systems. Apache 2.0.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="sg-footer__coltitle">{col.title}</div>
              <div className="sg-footer__links">
                {col.links.map((link) => {
                  if (link.to) {
                    return (
                      <RouteLink key={link.label} to={link.to}>
                        {link.label}
                      </RouteLink>
                    );
                  }
                  if (link.github) {
                    return <GitHubLink key={link.label}>{link.label}</GitHubLink>;
                  }
                  return (
                    <a key={link.label} href={link.href}>
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sg-footer__bottom">
          <span>© 2026 StateGuard contributors</span>
          <span>Apache-2.0 · Python 3.11+ · zero runtime deps</span>
        </div>
      </div>
    </footer>
  );
}
