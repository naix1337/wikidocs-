import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import useContentStore from '../stores/contentStore';

const CreateContentPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Debug: Check if content store is working
  console.log('useContentStore:', useContentStore);
  const contentStore = useContentStore();
  console.log('contentStore:', contentStore);
  const { spaces, addPage, addSpace } = contentStore;
  
  const [contentType, setContentType] = useState('page');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');

  // Check for preselected space from URL parameters
  useEffect(() => {
    console.log('useEffect triggered, spaces:', spaces);
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedSpace = urlParams.get('space');
    console.log('Preselected space from URL:', preselectedSpace);
    
    if (preselectedSpace && spaces.find(s => s.id === preselectedSpace)) {
      console.log('Setting selected space to:', preselectedSpace);
      setSelectedSpace(preselectedSpace);
    }
  }, [spaces]);

  console.log('CreateContentPage render:', { spaces: spaces.length, selectedSpace });

  // Check permissions
  if (user?.role !== 'ADMIN' && user?.role !== 'EDITOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need editor privileges to create content.</p>
        </div>
      </div>
    );
  }

  const handleSave = (saveStatus: string) => {
    console.log('handleSave called with:', saveStatus);
    console.log('Current state:', { contentType, title, selectedSpace, spaces });
    
    if (contentType === 'page') {
      if (!title.trim()) {
        alert('Please enter a page title.');
        return;
      }
      
      if (!selectedSpace) {
        alert('Please select a space for this page.');
        return;
      }
      
      // Add page to content store
      const newPage = {
        title: title.trim(),
        content: content,
        spaceId: selectedSpace,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        status: saveStatus as 'draft' | 'published',
        author: user?.displayName || 'Unknown User'
      };
      
      console.log('Adding page:', newPage);
      addPage(newPage);
      
      console.log('Page added successfully');
      
      // Show success and redirect
      alert(`Page "${title}" ${saveStatus === 'published' ? 'published' : 'saved as draft'} successfully!`);
      
      // Navigate to the space or pages overview
      setTimeout(() => {
        navigate(`/spaces/${selectedSpace}`);
      }, 500);
      
    } else if (contentType === 'space') {
      if (!title.trim()) {
        alert('Please enter a space name.');
        return;
      }
      
      // Add space to content store
      const newSpace = {
        name: title.trim(),
        description: content || '',
        contributors: [user?.displayName || 'Unknown User'],
        status: 'active' as const
      };
      
      console.log('Adding space:', newSpace);
      addSpace(newSpace);
      
      console.log('Space added successfully');
      
      // Show success and redirect
      alert(`Space "${title}" created successfully!`);
      
      // Navigate to spaces overview
      setTimeout(() => {
        navigate('/spaces');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="text-sm text-gray-500">
            <span className="text-blue-600">WikiDocs</span> &gt; Content Management &gt; Create Content
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Content</h1>
          <p className="text-gray-600">Create pages, documentation, and knowledge base articles.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Content Type Selector */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setContentType('page')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      contentType === 'page' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    📄 Page
                  </button>
                  <button
                    onClick={() => setContentType('space')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      contentType === 'space' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🏢 Space
                  </button>
                </div>
              </div>

              {/* Content Form */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentType === 'page' ? 'Page Title' : 'Space Name'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={contentType === 'page' ? 'Enter page title...' : 'Enter space name...'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>

                {/* Content Editor */}
                {contentType === 'page' && (
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
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button className="p-2 hover:bg-gray-200 rounded">🔗</button>
                        <button className="p-2 hover:bg-gray-200 rounded">📷</button>
                        <button className="p-2 hover:bg-gray-200 rounded">📋</button>
                      </div>
                      
                      {/* Content Textarea */}
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing your content... You can use Markdown syntax."
                        rows={16}
                        className="w-full px-4 py-3 resize-none focus:outline-none focus:ring-0 border-0"
                      />
                    </div>
                    
                    {/* Markdown Help */}
                    <div className="mt-2 text-sm text-gray-500">
                      <span>💡 Tip: Use Markdown syntax for formatting. </span>
                      <button className="text-blue-600 hover:text-blue-800">View Markdown Guide</button>
                    </div>
                  </div>
                )}

                {/* Space Description */}
                {contentType === 'space' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Space Description
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Describe what this space is for..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            {content && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                </div>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{title || 'Untitled'}</h1>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700">{content}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Publishing Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {contentType === 'page' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Space</label>
                    <select
                      value={selectedSpace}
                      onChange={(e) => setSelectedSpace(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a space...</option>
                      {spaces.map((space) => (
                        <option key={space.id} value={space.id}>
                          {space.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSave('draft')}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => handleSave('published')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Publish {contentType === 'page' ? 'Page' : 'Space'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                  <span>📁</span>
                  <span>Upload Files</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                  <span>🖼️</span>
                  <span>Insert Image</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                  <span>📊</span>
                  <span>Insert Table</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                  <span>💾</span>
                  <span>Import from File</span>
                </button>
              </div>
            </div>

            {/* Content Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setContent('# User Guide\n\n## Overview\n\nThis guide will help you...\n\n## Getting Started\n\n1. First step\n2. Second step\n3. Third step\n\n## Common Tasks\n\n### Task 1\n\nDescription of task...\n\n### Task 2\n\nDescription of task...')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📖 User Guide Template
                </button>
                <button
                  onClick={() => setContent('# API Documentation\n\n## Endpoint: /api/example\n\n**Method:** GET\n\n**Description:** This endpoint...\n\n### Parameters\n\n| Parameter | Type | Required | Description |\n|-----------|------|----------|-------------|\n| id | string | Yes | Unique identifier |\n\n### Response\n\n```json\n{\n  "success": true,\n  "data": {}\n}\n```')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  🔧 API Documentation
                </button>
                <button
                  onClick={() => setContent('# Meeting Notes\n\n**Date:** ' + new Date().toLocaleDateString() + '\n**Attendees:** \n\n## Agenda\n\n1. \n2. \n3. \n\n## Discussion\n\n### Topic 1\n\n### Topic 2\n\n## Action Items\n\n- [ ] Task 1\n- [ ] Task 2\n\n## Next Meeting\n\n**Date:** \n**Time:** ')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📝 Meeting Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContentPage;