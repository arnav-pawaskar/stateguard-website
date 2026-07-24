import { useCallback, useEffect, useState } from 'react';
import { CopyProvider, MotionProvider } from './context.jsx';
import { Atmosphere } from './components/Atmosphere.jsx';
import { Nav } from './components/Nav.jsx';
import { Hero } from './components/Hero.jsx';
import { Problem } from './components/Problem.jsx';
import { HowItWorks } from './components/HowItWorks.jsx';
import { Features } from './components/Features.jsx';
import { Showcase } from './components/Showcase.jsx';
import { SuggestionBox } from './components/SuggestionBox.jsx';
import { FinalCTA } from './components/FinalCTA.jsx';
import { Footer } from './components/Footer.jsx';

const THEME_KEY = 'stateguard-theme';

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
            <main>
              <Hero />
              <Problem />
              <HowItWorks />
              <Features />
              <Showcase />
              <SuggestionBox />
              <FinalCTA />
            </main>
            <Footer />
          </div>
        </div>
      </CopyProvider>
    </MotionProvider>
  );
}
