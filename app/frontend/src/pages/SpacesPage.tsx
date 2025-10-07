import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import useContentStore from '../stores/contentStore';

const SpacesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { spaces, addSpace, updateSpace, deleteSpace } = useContentStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSpace, setEditingSpace] = useState<any>(null);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');

  // Mock data - in a real app this would come from your API
  const canEdit = user?.role === 'ADMIN' || user?.role === 'EDITOR';
  const canDelete = user?.role === 'ADMIN';

  const handleCreateSpace = () => {
    if (newSpaceName.trim()) {
      addSpace({
        name: newSpaceName.trim(),
        description: newSpaceDescription.trim(),
        contributors: [user?.displayName || 'Unknown User'],
        status: 'active'
      });
      setNewSpaceName('');
      setNewSpaceDescription('');
      setShowCreateModal(false);
    }
  };

  const handleEditSpace = (space: any) => {
    setEditingSpace(space);
    setNewSpaceName(space.name);
    setNewSpaceDescription(space.description);
    setShowCreateModal(true);
  };

  const handleUpdateSpace = () => {
    if (editingSpace && newSpaceName.trim()) {
      updateSpace(editingSpace.id, {
        name: newSpaceName.trim(),
        description: newSpaceDescription.trim()
      });
      setEditingSpace(null);
      setNewSpaceName('');
      setNewSpaceDescription('');
      setShowCreateModal(false);
    }
  };

  const handleDeleteSpace = (spaceId: string) => {
    if (window.confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      deleteSpace(spaceId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="text-sm text-gray-500">
            <span className="text-blue-600">WikiDocs</span> &gt; Documentation Spaces
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation Spaces</h1>
            <p className="text-gray-600">Organize your documentation into logical spaces and categories.</p>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Space</span>
            </button>
          )}
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div key={space.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Space Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{space.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      space.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {space.status}
                    </span>
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSpace(space)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit space"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteSpace(space.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete space"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Space Description */}
              <p className="text-gray-600 mb-4">{space.description}</p>

              {/* Space Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{space.pageCount} pages</span>
                <span>Modified {space.lastModified}</span>
              </div>

              {/* Contributors */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-500">Contributors:</span>
                <div className="flex -space-x-1">
                  {space.contributors.slice(0, 3).map((contributor, index) => (
                    <div
                      key={index}
                      className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white"
                      title={contributor}
                    >
                      <span className="text-xs font-medium text-blue-600">
                        {contributor.charAt(0)}
                      </span>
                    </div>
                  ))}
                  {space.contributors.length > 3 && (
                    <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-xs font-medium text-gray-600">
                        +{space.contributors.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <a 
                  href={`/spaces/${space.id}`}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
                >
                  View Space
                </a>
                {canEdit && (
                  <a 
                    href={`/create?space=${space.id}`}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Add Page
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {spaces.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No spaces yet</h3>
            <p className="text-gray-600 mb-6">Create your first documentation space to get started.</p>
            {canEdit && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Space
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Space Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingSpace ? 'Edit Space' : 'Create New Space'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Space Name
                </label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="Enter space name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                  placeholder="Describe what this space is for..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingSpace(null);
                  setNewSpaceName('');
                  setNewSpaceDescription('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingSpace ? handleUpdateSpace : handleCreateSpace}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingSpace ? 'Update Space' : 'Create Space'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacesPage;