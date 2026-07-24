import { Wordmark } from './Shield.jsx';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Docs', href: '#' },
      { label: 'How it works', href: '#how' },
      { label: 'Benchmarks', href: '#' },
    ],
  },
  {
    title: 'Source',
    links: [
      { label: 'GitHub', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Issues', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'License · Apache-2.0', href: '#' },
      { label: 'Install', href: '#install' },
    ],
  },
];

export function Footer() {
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
                {col.links.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
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
