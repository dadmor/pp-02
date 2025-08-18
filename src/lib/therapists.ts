interface Therapist {
    name: string;
    slug: string;
    title: string;
    exp: number;
    spec: string[];
    loc: string;
    price: number[];
    img: string;
    avail: boolean;
  }
  
  interface GetTherapistsOptions {
    ids?: string[];
    limit?: number;
    showAll?: boolean;
  }
  
  export async function getTherapists(options: GetTherapistsOptions = {}): Promise<Therapist[]> {
    const { ids, limit, showAll = false } = options;
    
    try {
      // Import all therapist JSON files
      const modules = import.meta.glob<{ therapist: Therapist }>('/content/terapeuta/*.json');
      
      let therapists: Therapist[] = [];
      
      if (ids && ids.length > 0) {
        // Get specific therapists by IDs
        for (const id of ids) {
          const modulePath = `/content/terapeuta/${id}.json`;
          if (modules[modulePath]) {
            const module = await modules[modulePath]();
            if (module.therapist) {
              therapists.push(module.therapist);
            }
          }
        }
      } else {
        // Get all therapists
        for (const [path, loader] of Object.entries(modules)) {
          try {
            const module = await loader();
            if (module.therapist) {
              therapists.push(module.therapist);
            }
          } catch (error) {
            console.error(`Failed to load therapist from ${path}:`, error);
          }
        }
      }
      
      // Sort by availability (available first) then by experience
      therapists.sort((a, b) => {
        if (a.avail !== b.avail) {
          return a.avail ? -1 : 1;
        }
        return b.exp - a.exp;
      });
      
      // Apply limit if specified
      if (limit && !showAll) {
        therapists = therapists.slice(0, limit);
      }
      
      return therapists;
    } catch (error) {
      console.error('Failed to load therapists:', error);
      return [];
    }
  }
  
  export async function getTherapist(slug: string): Promise<Therapist | null> {
    try {
      const modules = import.meta.glob<{ therapist: Therapist }>('/content/terapeuta/*.json');
      const modulePath = `/content/terapeuta/${slug}.json`;
      
      if (modules[modulePath]) {
        const module = await modules[modulePath]();
        return module.therapist || null;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to load therapist ${slug}:`, error);
      return null;
    }
  }