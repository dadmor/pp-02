// ŚCIEŻKA: src/lib/sectionRegistry.ts

// Import wszystkich sekcji
// Default theme
import DefaultHero from '../themes/default/sections/Hero.astro';
import DefaultProcess from '../themes/default/sections/Process.astro';
import DefaultTherapists from '../themes/default/sections/Therapists.astro';
import DefaultAbout from '../themes/default/sections/About.astro';
import DefaultFaq from '../themes/default/sections/Faq.astro';
import DefaultArticles from '../themes/default/sections/Articles.astro';
import DefaultCta from '../themes/default/sections/Cta.astro';

// Minimal theme
import MinimalHero from '../themes/minimal/sections/Hero.astro';
import MinimalPhilosophy from '../themes/minimal/sections/Philosophy.astro';
import MinimalServices from '../themes/minimal/sections/Services.astro';
import MinimalAbout from '../themes/minimal/sections/About.astro';
import MinimalOffice from '../themes/minimal/sections/Office.astro';
import MinimalContact from '../themes/minimal/sections/Contact.astro';

// Registry map
export const sectionRegistry = {
  default: {
    hero: DefaultHero,
    process: DefaultProcess,
    therapists: DefaultTherapists,
    about: DefaultAbout,
    faq: DefaultFaq,
    articles: DefaultArticles,
    cta: DefaultCta,
  },
  minimal: {
    hero: MinimalHero,
    philosophy: MinimalPhilosophy,
    services: MinimalServices,
    about: MinimalAbout,
    office: MinimalOffice,
    contact: MinimalContact,
  }
};

export function getSection(theme: string, sectionType: string) {
  const themeRegistry = sectionRegistry[theme as keyof typeof sectionRegistry];
  if (!themeRegistry) {
    console.error(`Theme ${theme} not found in registry`);
    return null;
  }
  
  const section = themeRegistry[sectionType as keyof typeof themeRegistry];
  if (!section) {
    console.error(`Section ${sectionType} not found in theme ${theme}`);
    return null;
  }
  
  return section;
}