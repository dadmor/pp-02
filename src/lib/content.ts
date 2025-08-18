interface ContentModule {
    default?: any;
    [key: string]: any;
  }
  
  interface PageContent {
    theme: string;
    meta: {
      title: string;
      description: string;
      canonical?: string;
      image?: string;
      noindex?: boolean;
      structuredData?: object;
    };
    sections: Array<{
      type: string;
      data: any;
      settings?: any;
    }>;
    [key: string]: any;
  }
  
  export async function getContent(path: string): Promise<PageContent | null> {
    try {
      const modules = import.meta.glob<ContentModule>('/content/**/*.json');
      const modulePath = `/content/${path}.json`;
      
      if (modules[modulePath]) {
        const module = await modules[modulePath]();
        return module.default || module;
      }
      
      console.error(`Content not found at path: ${modulePath}`);
      return null;
    } catch (error) {
      console.error(`Failed to load content from ${path}:`, error);
      return null;
    }
  }
  
  export async function getAllContentPaths(): Promise<string[]> {
    const modules = import.meta.glob('/content/**/*.json');
    const paths: string[] = [];
    
    for (const path of Object.keys(modules)) {
      // Remove /content/ prefix and .json suffix
      const cleanPath = path
        .replace('/content/', '')
        .replace('.json', '');
      
      paths.push(cleanPath);
    }
    
    return paths;
  }