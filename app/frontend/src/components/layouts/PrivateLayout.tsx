import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import useContentStore from '../../stores/contentStore';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { spaces } = useContentStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Docker-style blue header */}
      <header className="bg-blue-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">WikiDocs</h1>
                </div>
              </div>

              {/* Docker-style navigation menu */}
              <nav className="hidden md:flex space-x-8">
                <a href="/dashboard" className="text-blue-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Get started
                </a>
                <a href="/spaces" className="text-blue-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Guides
                </a>
                <a href="#" className="text-blue-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Manuals
                </a>
                <a href="#" className="text-blue-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Reference
                </a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search bar like Docker */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    placeholder="Search"
                    className="block w-64 pl-10 pr-3 py-2 border border-blue-500 rounded-md leading-5 bg-blue-500 text-white placeholder-blue-200 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.displayName}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white ${user?.role === 'ADMIN' ? 'text-red-700' : user?.role === 'EDITOR' ? 'text-blue-700' : 'text-green-700'}`}>
                    {user?.role}
                  </span>
                </div>
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-blue-400 text-sm font-medium rounded-md text-white bg-transparent hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all duration-200"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-6">
            {/* Get WikiDocs section */}
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Get WikiDocs</h2>
              <ul className="space-y-1">
                <li>
                  <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">What is WikiDocs?</a>
                </li>
                <li>
                  <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Introduction</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">WikiDocs concepts</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">WikiDocs workshop</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Educational resources</a>
                </li>
              </ul>
            </div>

            {/* Content Management section */}
            <div className="mb-6">
              <button className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3">
                <span>Content Management</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul className="space-y-1 ml-3 border-l border-gray-200 pl-3">
                <li>
                  <a href="/spaces" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Documentation spaces</a>
                </li>
                <li>
                  <a href="/pages" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">All pages</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Version control</a>
                </li>
                {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
                  <>
                    <li>
                      <a href="/create" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Create content</a>
                    </li>
                    <li>
                      <a href="/test-store" className="text-sm text-orange-600 hover:text-orange-800 transition-colors">🔧 Test Store</a>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* User Management section - Admin only */}
            {user?.role === 'ADMIN' && (
              <div className="mb-6">
                <button className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3">
                  <span>Administration</span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className="space-y-1 ml-3 border-l border-gray-200 pl-3">
                  <li>
                    <a href="/admin" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Admin Panel</a>
                  </li>
                  <li>
                    <a href="/settings" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">System settings</a>
                  </li>
                  <li>
                    <a href="/admin" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">User management</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Permissions</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Backup & restore</a>
                  </li>
                </ul>
              </div>
            )}

            {/* Spaces section */}
            <div className="mb-6">
              <button className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3">
                <span>Your Spaces</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul className="space-y-1 ml-3 border-l border-gray-200 pl-3">
                {spaces.slice(0, 5).map(space => (
                  <li key={space.id}>
                    <a 
                      href={`/spaces/${space.id}`} 
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-between"
                    >
                      <span>{space.name}</span>
                      <span className="text-xs text-gray-400">{space.pageCount}</span>
                    </a>
                  </li>
                ))}
                {spaces.length > 5 && (
                  <li>
                    <a href="/spaces" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      View all spaces →
                    </a>
                  </li>
                )}
                {spaces.length === 0 && (
                  <li>
                    <a href="/spaces" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      Create your first space →
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Help & Support section */}
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Help & Support</h2>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Contact support</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;