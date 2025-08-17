// ŚCIEŻKA: src/lib/content.ts

interface ContentModule {
    default?: any;
    [key: string]: any;
  }
  
  interface TherapistContent {
    therapist: {
      name: string;
      slug: string;
      title: string;
      exp: number;
      spec: string[];
      loc: string;
      price: number[];
      img: string;
      avail: boolean;
    };
    [key: string]: any;
  }
  
  export async function getContent(path: string) {
    try {
      // Dla Astro, użyjemy glob import
      const modules = import.meta.glob<ContentModule>('../content/**/*.json');
      const modulePath = `../content/${path}.json`;
      
      if (modules[modulePath]) {
        const module = await modules[modulePath]();
        return module.default || module;
      }
      
      console.error(`Content not found at path: ${modulePath}`);
      console.log('Available paths:', Object.keys(modules));
      return null;
    } catch (error) {
      console.error(`Failed to load content from ${path}:`, error);
      return null;
    }
  }
  
  export async function getTherapists(ids: string[] = [], limit?: number) {
    try {
      const modules = import.meta.glob<TherapistContent>('../content/terapeuci/*.json');
      
      // Jeśli są konkretne IDs, załaduj tylko te
      if (ids.length > 0) {
        const therapists = await Promise.all(
          ids.map(async (id) => {
            const modulePath = `../content/terapeuci/${id}.json`;
            if (modules[modulePath]) {
              const module = await modules[modulePath]();
              return module.therapist;
            }
            return null;
          })
        );
        return therapists.filter((t): t is NonNullable<typeof t> => t !== null).slice(0, limit);
      }
      
      // W przeciwnym razie załaduj wszystkich
      const allTherapists = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          try {
            const module = await loader();
            return module.therapist;
          } catch {
            return null;
          }
        })
      );
      
      return allTherapists.filter((t): t is NonNullable<typeof t> => t !== null).slice(0, limit || 4);
    } catch (error) {
      console.error('Failed to load therapists:', error);
      return [];
    }
  }