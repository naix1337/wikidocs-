import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useInviteCodeStore } from '../stores/inviteCodeStore';
import { ContentManager } from '../components/admin/ContentManager';
import { UserManager } from '../components/admin/UserManager';
import { SystemSettings } from '../components/admin/SystemSettings';

const AdminPage: React.FC = () => {
  const { user } = useAuthStore();
  const analytics = useAnalyticsStore();
  const inviteStore = useInviteCodeStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'content', label: 'Content Management', icon: '📄' },
    { id: 'invites', label: 'Invite Codes', icon: '🎫' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  // Get real analytics data
  const totalPageViews = analytics.getTotalPageViews(7);
  const uniqueVisitors = analytics.getUniqueVisitors(7);
  const avgSessionDuration = analytics.getAverageSessionDuration(7);
  const totalSearches = analytics.getTotalSearches(7);
  
  // Calculate changes (simplified - comparing with previous week)
  const prevWeekPageViews = analytics.getTotalPageViews(14) - totalPageViews;
  const pageViewsChange = prevWeekPageViews > 0 ? 
    `${((totalPageViews - prevWeekPageViews) / prevWeekPageViews * 100).toFixed(1)}%` : '+100%';
  
  const prevWeekVisitors = analytics.getUniqueVisitors(14) - uniqueVisitors;
  const visitorsChange = prevWeekVisitors > 0 ? 
    `${((uniqueVisitors - prevWeekVisitors) / prevWeekVisitors * 100).toFixed(1)}%` : '+100%';

  const stats = [
    { 
      label: 'Page Views (7d)', 
      value: totalPageViews.toString(), 
      change: pageViewsChange.startsWith('-') ? pageViewsChange : '+' + pageViewsChange,
      color: 'blue' 
    },
    { 
      label: 'Unique Visitors', 
      value: uniqueVisitors.toString(), 
      change: visitorsChange.startsWith('-') ? visitorsChange : '+' + visitorsChange,
      color: 'green' 
    },
    { 
      label: 'Avg Session Time', 
      value: `${Math.floor(avgSessionDuration / 60)}:${(avgSessionDuration % 60).toString().padStart(2, '0')}`, 
      change: '+2.1%', 
      color: 'purple' 
    },
    { 
      label: 'Search Queries', 
      value: totalSearches.toString(), 
      change: '+15.3%', 
      color: 'yellow' 
    },
  ];

  const recentUsers = [
    { name: 'John Doe', email: 'john@company.com', role: 'EDITOR', status: 'active', lastSeen: '2 hours ago' },
    { name: 'Jane Smith', email: 'jane@company.com', role: 'VIEWER', status: 'active', lastSeen: '1 day ago' },
    { name: 'Mike Johnson', email: 'mike@company.com', role: 'EDITOR', status: 'inactive', lastSeen: '1 week ago' },
  ];

  const recentPages = [
    { title: 'API Documentation', author: 'John Doe', modified: '2 hours ago', status: 'published' },
    { title: 'User Guide', author: 'Jane Smith', modified: '1 day ago', status: 'draft' },
    { title: 'Installation Guide', author: 'Mike Johnson', modified: '2 days ago', status: 'published' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="text-sm text-gray-500 dark:text-gray-400">
            <span className="text-blue-600 dark:text-blue-400">WikiDocs</span> &gt; Administration
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Administration Panel</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage users, content, and system settings for your WikiDocs instance.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className={`text-sm text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.change} this month</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                      <div className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}>📊</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Invite Codes Debug Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Invite Codes (Debug)</h3>
              <div className="space-y-2">
                {inviteStore.getActiveInviteCodes().map((code) => (
                  <div key={code.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <code className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                        {code.code}
                      </code>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Created by {code.createdByName} • Uses: {code.currentUses}/{code.maxUses || '∞'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(code.code)}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>
                ))}
                {inviteStore.getActiveInviteCodes().length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No active invite codes found.</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h3>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    View all →
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            user.role === 'ADMIN' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' :
                            user.role === 'EDITOR' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}>
                            {user.role}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.lastSeen}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Pages */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Pages</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View all →
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{page.title}</p>
                          <p className="text-xs text-gray-500">by {page.author} • {page.modified}</p>
                        </div>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {page.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManager />
        )}

        {activeTab === 'content' && (
          <ContentManager />
        )}

        {activeTab === 'invites' && (
          <InviteCodeManager inviteStore={inviteStore} user={user} />
        )}

        {activeTab === 'settings' && (
          <SystemSettings />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics & Reports</h2>
            
            {/* Real Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Page Views (7d)</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPageViews}</p>
                    <p className={`text-xs ${pageViewsChange.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {pageViewsChange} vs last week
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueVisitors}</p>
                    <p className={`text-xs ${visitorsChange.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {visitorsChange} vs last week
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Session</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(avgSessionDuration / 60)}:{(avgSessionDuration % 60).toString().padStart(2, '0')}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">+2.1% vs last week</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Search Queries</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSearches}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">+15.3% vs last week</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Real Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Views Over Time</h3>
                <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="h-full flex items-end justify-between space-x-2">
                    {analytics.getDailyStats(7).map((day, index) => (
                      <div key={day.date} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-blue-500 dark:bg-blue-400 rounded-t w-full"
                          style={{ height: `${Math.max(day.pageViews * 10, 8)}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(day.date).toLocaleDateString('de-DE', { weekday: 'short' })}
                        </span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {day.pageViews}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Popular Pages</h3>
                <div className="space-y-3">
                  {analytics.getPopularPages(5).map((page, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{page.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{page.views} views</p>
                      </div>
                      <span className={`text-xs font-medium ${
                        page.change.startsWith('+') 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {page.change}
                      </span>
                    </div>
                  ))}
                  {analytics.getPopularPages(5).length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-gray-500 dark:text-gray-400">No page views yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start browsing to see analytics</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {analytics.getRecentActivity(5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.action}:</span> {activity.item}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                  </div>
                ))}
                {analytics.getRecentActivity(5).length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Activity will appear as users interact with the system</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// InviteCodeManager Component
interface InviteCodeManagerProps {
  inviteStore: ReturnType<typeof useInviteCodeStore>;
  user: any;
}

const InviteCodeManager: React.FC<InviteCodeManagerProps> = ({ inviteStore, user }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCodeOptions, setNewCodeOptions] = useState({
    description: '',
    maxUses: '',
    expiresInDays: '7'
  });

  const allInviteCodes = inviteStore.inviteCodes;
  const stats = inviteStore.getInviteCodeStats();

  const handleCreateCode = () => {
    const options: any = {
      description: newCodeOptions.description || 'Generated from Admin Panel'
    };

    if (newCodeOptions.maxUses && parseInt(newCodeOptions.maxUses) > 0) {
      options.maxUses = parseInt(newCodeOptions.maxUses);
    }

    if (newCodeOptions.expiresInDays && parseInt(newCodeOptions.expiresInDays) > 0) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(newCodeOptions.expiresInDays));
      options.expiresAt = expiryDate.toISOString();
    }

    inviteStore.generateInviteCode(
      user?.id || 'admin',
      user?.name || user?.email || 'Administrator',
      options
    );

    setNewCodeOptions({ description: '', maxUses: '', expiresInDays: '7' });
    setShowCreateModal(false);
  };

  const getStatusBadge = (code: any) => {
    if (!code.isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Deactivated</span>;
    }
    
    if (code.expiresAt && new Date() > new Date(code.expiresAt)) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>;
    }
    
    if (code.maxUses && code.currentUses >= code.maxUses) {
      return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Used Up</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invite Code Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Generate and manage invite codes for new user registration</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Generate New Code</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Codes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Codes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Used Codes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.used}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Uses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Codes Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Invite Codes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {allInviteCodes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <code className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">
                        {code.code}
                      </code>
                    </div>
                    {code.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{code.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(code)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <span className="font-medium">{code.currentUses}</span>
                      <span className="text-gray-500"> / {code.maxUses || '∞'}</span>
                    </div>
                    {code.currentUses > 0 && (
                      <div className="mt-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Used by: {code.usedBy.map(u => u.userName).join(', ')}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>{formatDate(code.createdAt)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">by {code.createdByName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {code.expiresAt ? formatDate(code.expiresAt) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="Copy code"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      {code.isActive && (
                        <button
                          onClick={() => inviteStore.deactivateInviteCode(code.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Deactivate code"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {allInviteCodes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invite codes</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first invite code.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generate New Invite Code</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., For new team members"
                  value={newCodeOptions.description}
                  onChange={(e) => setNewCodeOptions(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Uses (optional)
                </label>
                <input
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={newCodeOptions.maxUses}
                  onChange={(e) => setNewCodeOptions(prev => ({ ...prev, maxUses: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expires in (days)
                </label>
                <select
                  value={newCodeOptions.expiresInDays}
                  onChange={(e) => setNewCodeOptions(prev => ({ ...prev, expiresInDays: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Never expires</option>
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;