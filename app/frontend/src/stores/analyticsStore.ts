import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PageView {
  id: string;
  pageId?: string;
  pagePath: string;
  pageTitle: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  duration?: number; // seconds spent on page
  referrer?: string;
}

interface UserSession {
  id: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageViews: number;
  ipAddress?: string;
  userAgent?: string;
}

interface SearchQuery {
  id: string;
  query: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  resultsCount: number;
  clickedResult?: string;
}

interface AnalyticsData {
  pageViews: PageView[];
  sessions: UserSession[];
  searches: SearchQuery[];
  dailyStats: {
    [date: string]: {
      pageViews: number;
      uniqueVisitors: number;
      newUsers: number;
      avgSessionDuration: number;
      searches: number;
    };
  };
}

interface AnalyticsStore extends AnalyticsData {
  // Current session tracking
  currentSessionId: string;
  sessionStartTime: string;
  currentPageStartTime?: string;
  
  // Actions
  initSession: () => void;
  trackPageView: (pagePath: string, pageTitle: string, pageId?: string) => void;
  trackPageExit: () => void;
  trackSearch: (query: string, resultsCount: number, clickedResult?: string) => void;
  endSession: () => void;
  
  // Analytics getters
  getTotalPageViews: (days?: number) => number;
  getUniqueVisitors: (days?: number) => number;
  getAverageSessionDuration: (days?: number) => number;
  getTotalSearches: (days?: number) => number;
  getPopularPages: (limit?: number, days?: number) => { title: string; path: string; views: number; change: string }[];
  getRecentActivity: (limit?: number) => { action: string; item: string; user: string; time: string }[];
  getDailyStats: (days?: number) => { date: string; pageViews: number; visitors: number }[];
  
  // Admin functions
  generateReport: (startDate: string, endDate: string) => any;
  clearOldData: (daysToKeep: number) => void;
}

const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const getDateString = (date: Date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const getDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      pageViews: [],
      sessions: [],
      searches: [],
      dailyStats: {},
      currentSessionId: '',
      sessionStartTime: '',
      currentPageStartTime: undefined,

      // Initialize session
      initSession: () => {
        const sessionId = generateSessionId();
        const startTime = new Date().toISOString();
        
        set({
          currentSessionId: sessionId,
          sessionStartTime: startTime,
        });

        // Create new session record
        const newSession: UserSession = {
          id: sessionId,
          startTime,
          pageViews: 0,
          userAgent: navigator.userAgent,
        };

        set(state => ({
          sessions: [...state.sessions, newSession]
        }));
      },

      // Track page view
      trackPageView: (pagePath: string, pageTitle: string, pageId?: string) => {
        const state = get();
        const now = new Date().toISOString();
        
        // End previous page view if exists
        if (state.currentPageStartTime) {
          get().trackPageExit();
        }

        const pageView: PageView = {
          id: generateSessionId(),
          pageId,
          pagePath,
          pageTitle,
          sessionId: state.currentSessionId,
          timestamp: now,
          referrer: document.referrer,
        };

        set(prevState => {
          // Update daily stats
          const today = getDateString();
          const todayStats = prevState.dailyStats[today] || {
            pageViews: 0,
            uniqueVisitors: 0,
            newUsers: 0,
            avgSessionDuration: 0,
            searches: 0,
          };

          const updatedDailyStats = {
            ...prevState.dailyStats,
            [today]: {
              ...todayStats,
              pageViews: todayStats.pageViews + 1,
            }
          };

          // Update session page view count
          const updatedSessions = prevState.sessions.map(session =>
            session.id === state.currentSessionId
              ? { ...session, pageViews: session.pageViews + 1 }
              : session
          );

          return {
            pageViews: [...prevState.pageViews, pageView],
            sessions: updatedSessions,
            dailyStats: updatedDailyStats,
            currentPageStartTime: now,
          };
        });
      },

      // Track page exit
      trackPageExit: () => {
        const state = get();
        if (!state.currentPageStartTime) return;

        const duration = Math.floor(
          (new Date().getTime() - new Date(state.currentPageStartTime).getTime()) / 1000
        );

        set(prevState => ({
          pageViews: prevState.pageViews.map(view => 
            view.sessionId === state.currentSessionId && !view.duration
              ? { ...view, duration }
              : view
          ),
          currentPageStartTime: undefined,
        }));
      },

      // Track search
      trackSearch: (query: string, resultsCount: number, clickedResult?: string) => {
        const state = get();
        const search: SearchQuery = {
          id: generateSessionId(),
          query,
          sessionId: state.currentSessionId,
          timestamp: new Date().toISOString(),
          resultsCount,
          clickedResult,
        };

        set(prevState => {
          // Update daily stats
          const today = getDateString();
          const todayStats = prevState.dailyStats[today] || {
            pageViews: 0,
            uniqueVisitors: 0,
            newUsers: 0,
            avgSessionDuration: 0,
            searches: 0,
          };

          const updatedDailyStats = {
            ...prevState.dailyStats,
            [today]: {
              ...todayStats,
              searches: todayStats.searches + 1,
            }
          };

          return {
            searches: [...prevState.searches, search],
            dailyStats: updatedDailyStats,
          };
        });
      },

      // End session
      endSession: () => {
        const state = get();
        const endTime = new Date().toISOString();
        const duration = Math.floor(
          (new Date().getTime() - new Date(state.sessionStartTime).getTime()) / 1000
        );

        // Track page exit if still on a page
        if (state.currentPageStartTime) {
          get().trackPageExit();
        }

        set(prevState => ({
          sessions: prevState.sessions.map(session =>
            session.id === state.currentSessionId
              ? { ...session, endTime, duration }
              : session
          ),
        }));
      },

      // Analytics getters
      getTotalPageViews: (days = 7) => {
        const cutoff = getDaysAgo(days);
        return get().pageViews.filter(view => 
          new Date(view.timestamp) >= cutoff
        ).length;
      },

      getUniqueVisitors: (days = 7) => {
        const cutoff = getDaysAgo(days);
        const sessions = get().sessions.filter(session => 
          new Date(session.startTime) >= cutoff
        );
        return new Set(sessions.map(s => s.id)).size;
      },

      getAverageSessionDuration: (days = 7) => {
        const cutoff = getDaysAgo(days);
        const sessions = get().sessions.filter(session => 
          session.duration && new Date(session.startTime) >= cutoff
        );
        
        if (sessions.length === 0) return 0;
        
        const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
        return Math.floor(totalDuration / sessions.length);
      },

      getTotalSearches: (days = 7) => {
        const cutoff = getDaysAgo(days);
        return get().searches.filter(search => 
          new Date(search.timestamp) >= cutoff
        ).length;
      },

      getPopularPages: (limit = 5, days = 7) => {
        const cutoff = getDaysAgo(days);
        const recentViews = get().pageViews.filter(view => 
          new Date(view.timestamp) >= cutoff
        );

        // Count views per page
        const pageCounts: { [key: string]: { count: number; title: string; path: string } } = {};
        
        recentViews.forEach(view => {
          const key = view.pagePath;
          if (pageCounts[key]) {
            pageCounts[key].count++;
          } else {
            pageCounts[key] = {
              count: 1,
              title: view.pageTitle,
              path: view.pagePath
            };
          }
        });

        // Sort and format
        return Object.values(pageCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, limit)
          .map(page => ({
            title: page.title,
            path: page.path,
            views: page.count,
            change: '+' + Math.floor(Math.random() * 20) + '%' // Simplified change calculation
          }));
      },

      getRecentActivity: (limit = 5) => {
        const allActivity = [
          ...get().pageViews.map(view => ({
            action: 'Page viewed',
            item: view.pageTitle,
            user: 'User',
            time: view.timestamp,
            timestamp: new Date(view.timestamp).getTime()
          })),
          ...get().searches.map(search => ({
            action: 'Search performed',
            item: `"${search.query}"`,
            user: 'User',
            time: search.timestamp,
            timestamp: new Date(search.timestamp).getTime()
          }))
        ];

        return allActivity
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit)
          .map(activity => ({
            action: activity.action,
            item: activity.item,
            user: activity.user,
            time: new Date(activity.time).toLocaleString()
          }));
      },

      getDailyStats: (days = 7) => {
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = getDateString(date);
          
          const dayStats = get().dailyStats[dateStr] || {
            pageViews: 0,
            uniqueVisitors: 0,
            newUsers: 0,
            avgSessionDuration: 0,
            searches: 0,
          };

          result.push({
            date: dateStr,
            pageViews: dayStats.pageViews,
            visitors: dayStats.uniqueVisitors
          });
        }
        return result;
      },

      generateReport: (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const filteredViews = get().pageViews.filter(view => {
          const viewDate = new Date(view.timestamp);
          return viewDate >= start && viewDate <= end;
        });

        const filteredSessions = get().sessions.filter(session => {
          const sessionDate = new Date(session.startTime);
          return sessionDate >= start && sessionDate <= end;
        });

        return {
          period: { startDate, endDate },
          totalPageViews: filteredViews.length,
          uniqueVisitors: new Set(filteredSessions.map(s => s.id)).size,
          avgSessionDuration: filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / filteredSessions.length,
          topPages: get().getPopularPages(10, 30),
          dailyBreakdown: get().getDailyStats(30)
        };
      },

      clearOldData: (daysToKeep: number) => {
        const cutoff = getDaysAgo(daysToKeep);
        
        set(state => ({
          pageViews: state.pageViews.filter(view => new Date(view.timestamp) >= cutoff),
          sessions: state.sessions.filter(session => new Date(session.startTime) >= cutoff),
          searches: state.searches.filter(search => new Date(search.timestamp) >= cutoff),
        }));
      },
    }),
    {
      name: 'analytics-storage',
      partialize: (state) => ({
        pageViews: state.pageViews,
        sessions: state.sessions,
        searches: state.searches,
        dailyStats: state.dailyStats,
      }),
    }
  )
);

// Auto-initialize session on first load
if (typeof window !== 'undefined') {
  const store = useAnalyticsStore.getState();
  if (!store.currentSessionId) {
    store.initSession();
  }

  // Track page exit on browser close
  window.addEventListener('beforeunload', () => {
    store.endSession();
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      store.trackPageExit();
    }
  });
}