import {
  CHANGELOG_URL,
  DOCS_PATH,
  ISSUES_URL,
  LICENSE_URL,
  SUGGEST_PATH,
} from '../constants.js';
import { ExternalLink, GitHubLink, RouteLink, useAnchor } from '../router.jsx';
import { Wordmark } from './Shield.jsx';

export function Footer() {
  const anchor = useAnchor();

  const COLUMNS = [
    {
      title: 'Product',
      links: [
        { label: 'Docs', to: DOCS_PATH },
        { label: 'How it works', href: anchor('#how') },
        { label: 'Install', href: anchor('#install') },
      ],
    },
    {
      title: 'Source',
      links: [
        { label: 'GitHub', github: true },
        { label: 'Changelog', external: CHANGELOG_URL },
        { label: 'Issues', external: ISSUES_URL },
        { label: 'Suggest a repair', to: SUGGEST_PATH },
      ],
    },
    {
      title: 'Legal',
      links: [{ label: 'License', external: LICENSE_URL }],
    },
  ];

  return (
    <footer className="sg-footer">
      <div className="sg-container">
        <div className="sg-footer__grid">
          <div>
            <Wordmark small className="sg-footer__brand" />
            <p className="sg-footer__tagline">
              Self-healing runtime contracts for AI systems.
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
                  if (link.external) {
                    return (
                      <ExternalLink key={link.label} href={link.external}>
                        {link.label}
                      </ExternalLink>
                    );
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
        </div>
      </div>
    </footer>
  );
}
