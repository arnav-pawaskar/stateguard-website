import { useCallback, useEffect, useState } from 'react';
import { CopyProvider, MotionProvider } from './context.jsx';
import { Atmosphere } from './components/Atmosphere.jsx';
import { Nav } from './components/Nav.jsx';
import { Footer } from './components/Footer.jsx';
import { Landing } from './pages/Landing.jsx';
import { Docs } from './pages/Docs.jsx';
import { Suggest } from './pages/Suggest.jsx';
import { DOCS_PATH, SUGGEST_PATH } from './constants.js';
import { useRoute } from './router.jsx';

const THEME_KEY = 'stateguard-theme';

/* Route table. Unknown paths fall back to the landing page, which is also what
   the host's history rewrite serves them. */
const PAGES = {
  '/': { title: 'StateGuard — Self-healing contracts for AI pipelines', view: Landing },
  [DOCS_PATH]: { title: 'Docs — coming soon · StateGuard', view: Docs },
  [SUGGEST_PATH]: { title: 'Suggest a repair · StateGuard', view: Suggest },
};

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* storage blocked (private mode, disabled cookies) — fall through */
  }
  return 'light';
}

export default function App() {
  // dark-mode-first design, but the page loads in light by default
  const [theme, setTheme] = useState(readStoredTheme);
  const route = useRoute();

  const page = PAGES[route] ?? PAGES['/'];

  useEffect(() => {
    document.title = page.title;
  }, [page]);

  // theme + accent live on <html> so the background paints edge to edge
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* non-fatal — the toggle still works for this session */
    }
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  );

  return (
    <MotionProvider>
      <CopyProvider>
        <div id="top" className="sg-root">
          {/* First thing in the tab order — otherwise every page starts with the
              wordmark, four nav links, the theme toggle and the copy button. */}
          <a href="#sg-main" className="sg-skip">
            Skip to content
          </a>
          <Atmosphere />
          <div className="sg-content">
            <Nav theme={theme} onToggleTheme={toggleTheme} />
            {/* tabIndex -1 so the skip link can actually move focus here, not just
                scroll — Safari and Firefox will not focus a plain <main>. */}
            <main id="sg-main" tabIndex={-1}>
              <page.view />
            </main>
            <Footer />
          </div>
        </div>
      </CopyProvider>
    </MotionProvider>
  );
}
