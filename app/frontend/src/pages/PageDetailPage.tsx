import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import useContentStore from '../stores/contentStore';

const PageDetailPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { pages, spaces, updatePage, deletePage } = useContentStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const page = pages.find(p => p.id === pageId);
  const space = page ? spaces.find(s => s.id === page.spaceId) : null;

  const canEdit = user?.role === 'ADMIN' || user?.role === 'EDITOR';
  const canDelete = user?.role === 'ADMIN';

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/pages')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  const startEditing = () => {
    setEditTitle(page.title);
    setEditContent(page.content);
    setEditTags(page.tags.join(', '));
    setIsEditing(true);
  };

  const saveEdits = () => {
    updatePage(page.id, {
      title: editTitle.trim(),
      content: editContent,
      tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    });
    setIsEditing(false);
    alert('Page updated successfully!');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
    setEditTags('');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${page.title}"? This action cannot be undone.`)) {
      deletePage(page.id);
      navigate(space ? `/spaces/${space.id}` : '/pages');
    }
  };

  const toggleStatus = () => {
    const newStatus = page.status === 'draft' ? 'published' : 'draft';
    updatePage(page.id, { status: newStatus });
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
            {space && (
              <>
                <a href={`/spaces/${space.id}`} className="text-blue-600 hover:text-blue-800">{space.name}</a>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{page.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-3xl font-bold text-gray-900 w-full border-b-2 border-blue-500 bg-transparent focus:outline-none"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{page.title}</h1>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {space?.name || 'Unknown Space'}
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
                  Updated {formatDate(page.updatedAt)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  page.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {page.status}
                </span>
              </div>

              {/* Tags */}
              {isEditing ? (
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                page.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {page.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              {canEdit && (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveEdits}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={startEditing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={toggleStatus}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          page.status === 'draft'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                      >
                        {page.status === 'draft' ? 'Publish' : 'Unpublish'}
                      </button>
                    </>
                  )}
                </>
              )}
              {canDelete && !isEditing && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => navigate(space ? `/spaces/${space.id}` : '/pages')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {isEditing ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div className="border border-gray-300 rounded-lg">
                {/* Editor Toolbar */}
                <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
                  <button className="p-2 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                  <button className="p-2 hover:bg-gray-200 rounded text-sm italic">I</button>
                  <button className="p-2 hover:bg-gray-200 rounded text-sm underline">U</button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button className="p-2 hover:bg-gray-200 rounded text-sm">H1</button>
                  <button className="p-2 hover:bg-gray-200 rounded text-sm">H2</button>
                  <button className="p-2 hover:bg-gray-200 rounded text-sm">H3</button>
                </div>
                
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your content..."
                  rows={20}
                  className="w-full px-4 py-3 resize-none focus:outline-none focus:ring-0 border-0"
                />
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              {page.content ? (
                <div className="whitespace-pre-wrap text-gray-800 text-lg leading-relaxed">
                  {page.content}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>This page doesn't have any content yet.</p>
                  {canEdit && (
                    <button
                      onClick={startEditing}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      Add content
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Page Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <span className="ml-2 text-gray-600">{formatDate(page.createdAt)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Updated:</span>
              <span className="ml-2 text-gray-600">{formatDate(page.updatedAt)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Author:</span>
              <span className="ml-2 text-gray-600">{page.author}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                page.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {page.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetailPage;