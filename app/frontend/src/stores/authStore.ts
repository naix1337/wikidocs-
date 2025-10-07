import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // Simple demo login - in production this would call the API
          const demoUsers = {
            'admin@wiki.local': { 
              id: '1', 
              email: 'admin@wiki.local', 
              displayName: 'Admin User', 
              role: 'ADMIN' as const,
              password: 'admin123'
            },
            'editor@wiki.local': { 
              id: '2', 
              email: 'editor@wiki.local', 
              displayName: 'Editor User', 
              role: 'EDITOR' as const,
              password: 'editor123'
            },
            'viewer@wiki.local': { 
              id: '3', 
              email: 'viewer@wiki.local', 
              displayName: 'Viewer User', 
              role: 'VIEWER' as const,
              password: 'viewer123'
            }
          };

          const user = demoUsers[email as keyof typeof demoUsers];
          if (user && user.password === password) {
            const { password: _, ...userWithoutPassword } = user;
            set({ 
              user: userWithoutPassword, 
              token: 'demo-token-' + Date.now(),
              isAuthenticated: true 
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);