import { InstallBox } from '../components/InstallBox.jsx';
import { GitHubLink, RouteLink } from '../router.jsx';

export function Docs() {
  return (
    <section className="sg-docs">
      <div className="sg-docs__panel">
        <div aria-hidden="true" className="sg-hairline" />

        <div className="sg-eyebrow">Documentation</div>

        <h1 className="sg-docs__h1">
          <span className="sg-grad-text">Coming soon.</span>
        </h1>

        <p className="sg-docs__lede">
          The docs aren&apos;t published yet. In the meantime the README covers install,
          the four repair strategies and the CLI, and the source is the reference.
        </p>

        <InstallBox id="docs" className="sg-docs__install" />

        <div className="sg-docs__buttons">
          <GitHubLink className="sg-btn sg-btn--primary">
            Read the README{' '}
            <span aria-hidden="true" className="sg-btn__ext">
              ↗
            </span>
          </GitHubLink>
          <RouteLink to="/" className="sg-btn sg-btn--secondary">
            <span aria-hidden="true">←</span> Back to home
          </RouteLink>
        </div>
      </div>
    </section>
  );
}
