import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

type SectionComponent = AstroComponentFactory;

interface ThemeRegistry {
  [theme: string]: {
    [sectionType: string]: SectionComponent;
  };
}

const registry: ThemeRegistry = {};

// Function to register a section component
export function registerSection(theme: string, sectionType: string, component: SectionComponent) {
  if (!registry[theme]) {
    registry[theme] = {};
  }
  registry[theme][sectionType] = component;
}

// Function to get a section component
export function getSection(theme: string, sectionType: string): SectionComponent | null {
  if (!registry[theme] || !registry[theme][sectionType]) {
    console.error(`Section ${sectionType} not found in theme ${theme}`);
    return null;
  }
  return registry[theme][sectionType];
}

// Function to initialize theme registry
export async function initializeThemes() {
  // Import all section components from themes
  const themeModules = import.meta.glob('/src/themes/*/sections/*.astro', { eager: true });
  
  for (const [path, module] of Object.entries(themeModules)) {
    // Extract theme name and section type from path
    const match = path.match(/\/themes\/([^\/]+)\/sections\/([^\/]+)\.astro$/);
    if (match) {
      const [, theme, sectionType] = match;
      const component = (module as any).default;
      if (component) {
        registerSection(theme, sectionType.toLowerCase(), component);
      }
    }
  }
}