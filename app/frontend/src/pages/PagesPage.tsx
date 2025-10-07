import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import useContentStore from '../stores/contentStore';

const PagesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { pages, spaces, deletePage, updatePage } = useContentStore();
  const [selectedSpace, setSelectedSpace] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const canEdit = user?.role === 'ADMIN' || user?.role === 'EDITOR';
  const canDelete = user?.role === 'ADMIN';

  // Filter pages based on selected space and search term
  const filteredPages = pages.filter(page => {
    const matchesSpace = selectedSpace === 'all' || page.spaceId === selectedSpace;
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSpace && matchesSearch;
  });

  const handleDeletePage = (pageId: string, pageTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${pageTitle}"? This action cannot be undone.`)) {
      deletePage(pageId);
    }
  };

  const handleToggleStatus = (pageId: string, currentStatus: 'draft' | 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    updatePage(pageId, { status: newStatus });
  };

  const getSpaceName = (spaceId: string) => {
    const space = spaces.find(s => s.id === spaceId);
    return space?.name || 'Unknown Space';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">All Pages</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Pages</h1>
          <p className="text-gray-600">Manage and organize all your documentation pages</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Space Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Space
                </label>
                <select
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Spaces</option>
                  {spaces.map(space => (
                    <option key={space.id} value={space.id}>{space.name}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Pages
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, content, or tags..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Create Button */}
            {canEdit && (
              <a
                href="/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Page
              </a>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredPages.length} of {pages.length} pages
            {selectedSpace !== 'all' && ` in ${getSpaceName(selectedSpace)}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredPages.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedSpace !== 'all' 
                  ? 'Try adjusting your filters or search term' 
                  : 'Get started by creating your first page'}
              </p>
              {canEdit && (
                <a
                  href="/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Page
                </a>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <div key={page.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <a href={`/pages/${page.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                          {page.title}
                        </a>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {page.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {getSpaceName(page.spaceId)}
                        </span>
                        <span className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {page.author}
                        </span>
                        <span className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(page.updatedAt)}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {page.content.length > 150 
                          ? page.content.substring(0, 150) + '...' 
                          : page.content || 'No content'}
                      </p>

                      {page.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {page.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(page.id, page.status)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${
                              page.status === 'draft'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                          >
                            {page.status === 'draft' ? 'Publish' : 'Unpublish'}
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                        </>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeletePage(page.id, page.title)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesPage;