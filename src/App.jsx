import { useCallback, useEffect, useState } from 'react';
import { CopyProvider, MotionProvider } from './context.jsx';
import { Atmosphere } from './components/Atmosphere.jsx';
import { Nav } from './components/Nav.jsx';
import { Footer } from './components/Footer.jsx';
import { Landing } from './pages/Landing.jsx';
import { Docs } from './pages/Docs.jsx';
import { DOCS_PATH } from './constants.js';
import { useRoute } from './router.jsx';

const THEME_KEY = 'stateguard-theme';

const TITLES = {
  '/': 'StateGuard — Self-healing contracts for AI pipelines',
  [DOCS_PATH]: 'Docs — coming soon · StateGuard',
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

  useEffect(() => {
    document.title = TITLES[route] ?? TITLES['/'];
  }, [route]);

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
          <Atmosphere />
          <div className="sg-content">
            <Nav theme={theme} onToggleTheme={toggleTheme} />
            <main>{route === DOCS_PATH ? <Docs /> : <Landing />}</main>
            <Footer />
          </div>
        </div>
      </CopyProvider>
    </MotionProvider>
  );
}
