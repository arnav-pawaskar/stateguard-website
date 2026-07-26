import { Hero } from '../components/Hero.jsx';
import { Problem } from '../components/Problem.jsx';
import { HowItWorks } from '../components/HowItWorks.jsx';
import { Features } from '../components/Features.jsx';
import { Showcase } from '../components/Showcase.jsx';
import { SuggestionCTA } from '../components/SuggestionCTA.jsx';
import { FinalCTA } from '../components/FinalCTA.jsx';

export function Landing() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Showcase />
      <SuggestionCTA />
      <FinalCTA />
    </>
  );
}
