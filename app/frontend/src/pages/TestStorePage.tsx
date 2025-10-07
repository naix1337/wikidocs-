import React from 'react';
import useContentStore from '../stores/contentStore';

const TestStorePage: React.FC = () => {
  const { pages, spaces, addPage, addSpace } = useContentStore();

  const testAddSpace = () => {
    addSpace({
      name: 'Test Space',
      description: 'This is a test space',
      contributors: ['Test User'],
      status: 'active'
    });
    alert('Test space added!');
  };

  const testAddPage = () => {
    if (spaces.length === 0) {
      alert('Please add a space first!');
      return;
    }
    
    addPage({
      title: 'Test Page',
      content: 'This is test content',
      spaceId: spaces[0].id,
      tags: ['test'],
      status: 'published',
      author: 'Test User'
    });
    alert('Test page added!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Content Store Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spaces */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Spaces ({spaces.length})</h2>
            <button 
              onClick={testAddSpace}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Test Space
            </button>
            <div className="space-y-2">
              {spaces.map(space => (
                <div key={space.id} className="p-3 border rounded">
                  <h3 className="font-medium">{space.name}</h3>
                  <p className="text-sm text-gray-600">{space.description}</p>
                  <p className="text-xs text-gray-500">Pages: {space.pageCount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pages ({pages.length})</h2>
            <button 
              onClick={testAddPage}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Test Page
            </button>
            <div className="space-y-2">
              {pages.map(page => (
                <div key={page.id} className="p-3 border rounded">
                  <h3 className="font-medium">{page.title}</h3>
                  <p className="text-sm text-gray-600">{page.content.substring(0, 50)}...</p>
                  <p className="text-xs text-gray-500">Space: {page.spaceName} | Status: {page.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Store Debug */}
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Store Debug</h2>
          <pre className="text-sm bg-white p-4 rounded overflow-auto">
            {JSON.stringify({ 
              spacesCount: spaces.length, 
              pagesCount: pages.length,
              spaces: spaces.map(s => ({ id: s.id, name: s.name, pageCount: s.pageCount })),
              pages: pages.map(p => ({ id: p.id, title: p.title, spaceId: p.spaceId }))
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestStorePage;