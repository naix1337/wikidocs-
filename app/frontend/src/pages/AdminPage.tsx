import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ContentManager } from '../components/admin/ContentManager';
import { UserManager } from '../components/admin/UserManager';
import { SystemSettings } from '../components/admin/SystemSettings';

const AdminPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'content', label: 'Content Management', icon: '📄' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  const stats = [
    { label: 'Total Users', value: '12', change: '+2', color: 'blue' },
    { label: 'Total Pages', value: '48', change: '+8', color: 'green' },
    { label: 'Active Spaces', value: '6', change: '+1', color: 'purple' },
    { label: 'Storage Used', value: '2.4 GB', change: '+0.3 GB', color: 'yellow' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="text-sm text-gray-500">
            <span className="text-blue-600">WikiDocs</span> &gt; Administration
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration Panel</h1>
          <p className="text-gray-600">Manage users, content, and system settings for your WikiDocs instance.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm text-${stat.color}-600`}>{stat.change} this month</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <div className={`h-6 w-6 text-${stat.color}-600`}>📊</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View all →
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            user.role === 'EDITOR' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{user.lastSeen}</p>
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

        {activeTab === 'settings' && (
          <SystemSettings />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>
            
            {/* Analytics coming soon */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 mb-6">Detailed analytics and reporting features are coming soon.</p>
              <div className="text-sm text-gray-500">
                <p>• Page view statistics</p>
                <p>• User engagement metrics</p>
                <p>• Content performance reports</p>
                <p>• Export capabilities</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;