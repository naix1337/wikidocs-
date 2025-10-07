import { create } from 'zustand';

export interface Page {
  id: string;
  title: string;
  content: string;
  spaceId: string;
  spaceName?: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  pageCount: number;
  contributors: string[];
  lastModified: string;
  status: 'active' | 'draft' | 'archived';
}

interface ContentStore {
  pages: Page[];
  spaces: Space[];
  
  // Actions for pages
  addPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  getPagesBySpace: (spaceId: string) => Page[];
  
  // Actions for spaces
  addSpace: (space: Omit<Space, 'id' | 'pageCount' | 'lastModified'>) => void;
  updateSpace: (id: string, updates: Partial<Space>) => void;
  deleteSpace: (id: string) => void;
  
  // Utility functions
  updateSpacePageCount: (spaceId: string) => void;
}

const useContentStore = create<ContentStore>((set, get) => ({
  // Initial mock data
  spaces: [
    {
      id: '1',
      name: 'Documentation',
      description: 'General product documentation and guides',
      pageCount: 3,
      contributors: ['Admin User', 'Editor User'],
      lastModified: '2 hours ago',
      status: 'active'
    },
    {
      id: '2', 
      name: 'User Guides',
      description: 'End-user documentation and tutorials',
      pageCount: 2,
      contributors: ['Editor User'],
      lastModified: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Developer Docs',
      description: 'Technical documentation for developers',
      pageCount: 1,
      contributors: ['Admin User', 'Editor User', 'Tech Lead'],
      lastModified: '3 hours ago',
      status: 'active'
    },
    {
      id: '4',
      name: 'API Reference',
      description: 'Complete API documentation and examples',
      pageCount: 1,
      contributors: ['Admin User'],
      lastModified: '1 week ago',
      status: 'draft'
    }
  ],
  
  pages: [
    {
      id: '1',
      title: 'Getting Started',
      content: 'Welcome to our documentation! This guide will help you get started.',
      spaceId: '1',
      spaceName: 'Documentation',
      tags: ['guide', 'getting-started'],
      status: 'published',
      author: 'Admin User',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Installation Guide',
      content: 'Step-by-step installation instructions.',
      spaceId: '1',
      spaceName: 'Documentation',
      tags: ['installation', 'setup'],
      status: 'published',
      author: 'Admin User',
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    },
    {
      id: '3',
      title: 'User Manual',
      content: 'Complete user manual for end users.',
      spaceId: '2',
      spaceName: 'User Guides',
      tags: ['manual', 'user-guide'],
      status: 'published',
      author: 'Editor User',
      createdAt: '2024-01-16T09:00:00Z',
      updatedAt: '2024-01-16T09:00:00Z'
    }
  ],

  // Page actions
  addPage: (pageData) => set((state) => {
    const newPage: Page = {
      ...pageData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Find space name
    const space = state.spaces.find(s => s.id === pageData.spaceId);
    if (space) {
      newPage.spaceName = space.name;
    }
    
    const newPages = [...state.pages, newPage];
    
    // Update space page count
    const updatedSpaces = state.spaces.map(space => 
      space.id === pageData.spaceId 
        ? { ...space, pageCount: space.pageCount + 1, lastModified: 'Just now' }
        : space
    );
    
    return { pages: newPages, spaces: updatedSpaces };
  }),

  updatePage: (id, updates) => set((state) => ({
    pages: state.pages.map(page => 
      page.id === id 
        ? { ...page, ...updates, updatedAt: new Date().toISOString() }
        : page
    )
  })),

  deletePage: (id) => set((state) => {
    const pageToDelete = state.pages.find(p => p.id === id);
    if (!pageToDelete) return state;
    
    const newPages = state.pages.filter(page => page.id !== id);
    
    // Update space page count
    const updatedSpaces = state.spaces.map(space => 
      space.id === pageToDelete.spaceId 
        ? { ...space, pageCount: Math.max(0, space.pageCount - 1), lastModified: 'Just now' }
        : space
    );
    
    return { pages: newPages, spaces: updatedSpaces };
  }),

  getPagesBySpace: (spaceId) => {
    return get().pages.filter(page => page.spaceId === spaceId);
  },

  // Space actions
  addSpace: (spaceData) => set((state) => {
    const newSpace: Space = {
      ...spaceData,
      id: Date.now().toString(),
      pageCount: 0,
      lastModified: 'Just now'
    };
    return { spaces: [...state.spaces, newSpace] };
  }),

  updateSpace: (id, updates) => set((state) => ({
    spaces: state.spaces.map(space => 
      space.id === id 
        ? { ...space, ...updates, lastModified: 'Just now' }
        : space
    )
  })),

  deleteSpace: (id) => set((state) => {
    // Also delete all pages in this space
    const newPages = state.pages.filter(page => page.spaceId !== id);
    const newSpaces = state.spaces.filter(space => space.id !== id);
    
    return { pages: newPages, spaces: newSpaces };
  }),

  updateSpacePageCount: (spaceId) => set((state) => {
    const pageCount = state.pages.filter(page => page.spaceId === spaceId).length;
    return {
      spaces: state.spaces.map(space => 
        space.id === spaceId 
          ? { ...space, pageCount, lastModified: 'Just now' }
          : space
      )
    };
  }),
}));

export default useContentStore;