import React, { useState } from 'react';

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxFileSize: number;
  maxUsersPerSpace: number;
  backupFrequency: string;
  debugMode: boolean;
}

const defaultConfig: SystemConfig = {
  siteName: 'WikiDocs',
  siteDescription: 'Modern Documentation Platform',
  logoUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  language: 'en',
  timezone: 'UTC',
  emailNotifications: true,
  maintenanceMode: false,
  registrationEnabled: true,
  maxFileSize: 10,
  maxUsersPerSpace: 50,
  backupFrequency: 'daily',
  debugMode: false
};

export const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const handleBackup = () => {
    // Simulate backup creation
    const backupData = {
      timestamp: new Date().toISOString(),
      config,
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wikidocs-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target?.result as string);
          if (backupData.config) {
            setConfig(backupData.config);
            alert('Settings restored successfully!');
          }
        } catch (error) {
          alert('Invalid backup file');
        }
      };
      reader.readAsText(file);
    }
  };

  const systemInfo = {
    version: '1.0.0',
    buildDate: '2024-10-08',
    nodeVersion: 'v20.x.x',
    platform: 'Linux',
    uptime: '2 days, 14 hours',
    memoryUsage: '245 MB',
    diskSpace: '15.2 GB available',
    lastBackup: '2024-10-07 22:00:00'
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'backup', label: 'Backup', icon: '💾' },
    { id: 'system', label: 'System Info', icon: '💻' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">Configure your WikiDocs installation</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={config.siteName}
                    onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={config.language}
                    onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  rows={3}
                  value={config.siteDescription}
                  onChange={(e) => setConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={config.timezone}
                    onChange={(e) => setConfig(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Europe/Berlin">Europe/Berlin</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={config.maxFileSize}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={config.emailNotifications}
                    onChange={(e) => setConfig(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                    Enable email notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="registrationEnabled"
                    checked={config.registrationEnabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, registrationEnabled: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="registrationEnabled" className="ml-2 text-sm text-gray-700">
                    Allow user registration
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="debugMode"
                    checked={config.debugMode}
                    onChange={(e) => setConfig(prev => ({ ...prev, debugMode: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="debugMode" className="ml-2 text-sm text-gray-700">
                    Enable debug mode
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={config.logoUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="h-10 w-20 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="h-10 w-20 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Color Preview</h4>
                <div className="flex space-x-4">
                  <div
                    className="h-16 w-24 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Primary
                  </div>
                  <div
                    className="h-16 w-24 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: config.secondaryColor }}
                  >
                    Secondary
                  </div>
                </div>
              </div>

              {/* Theme Presets */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Theme Presets</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Blue', primary: '#3B82F6', secondary: '#1E40AF' },
                    { name: 'Green', primary: '#10B981', secondary: '#047857' },
                    { name: 'Purple', primary: '#8B5CF6', secondary: '#5B21B6' },
                    { name: 'Red', primary: '#EF4444', secondary: '#B91C1C' },
                  ].map(theme => (
                    <button
                      key={theme.name}
                      onClick={() => setConfig(prev => ({ 
                        ...prev, 
                        primaryColor: theme.primary, 
                        secondaryColor: theme.secondary 
                      }))}
                      className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex space-x-2 mb-2">
                        <div
                          className="h-4 w-8 rounded"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="h-4 w-8 rounded"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      </div>
                      <div className="text-xs text-gray-700">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Users per Space</label>
                  <input
                    type="number"
                    value={config.maxUsersPerSpace}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxUsersPerSpace: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="240">4 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={config.maintenanceMode}
                    onChange={(e) => setConfig(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
                    Maintenance mode (only admins can access)
                  </label>
                </div>
              </div>

              {/* Security Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Security Features Enabled</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ JWT Authentication</li>
                  <li>✓ Role-based Access Control</li>
                  <li>✓ HTTPS Encryption</li>
                  <li>✓ Content Security Policy</li>
                  <li>✓ Rate Limiting</li>
                </ul>
              </div>
            </div>
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                <select
                  value={config.backupFrequency}
                  onChange={(e) => setConfig(prev => ({ ...prev, backupFrequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="never">Never</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Manual Backup */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Manual Backup</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Create a backup of your system configuration and data.
                </p>
                <button
                  onClick={handleBackup}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>Create Backup</span>
                </button>
              </div>

              {/* Restore Backup */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Restore Backup</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Restore system configuration from a backup file.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Backup Status */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Backup Status</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Last backup: {systemInfo.lastBackup}</div>
                  <div>Backup frequency: {config.backupFrequency}</div>
                  <div>Next backup: {config.backupFrequency === 'daily' ? 'Tomorrow 22:00' : 'Scheduled'}</div>
                </div>
              </div>
            </div>
          )}

          {/* System Info */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              {/* System Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Application Info</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span className="font-medium">{systemInfo.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Build Date:</span>
                      <span>{systemInfo.buildDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span>{systemInfo.uptime}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">System Resources</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Memory Usage:</span>
                      <span>{systemInfo.memoryUsage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disk Space:</span>
                      <span>{systemInfo.diskSpace}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform:</span>
                      <span>{systemInfo.platform}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environment Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Environment</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Node.js:</span> {systemInfo.nodeVersion}
                  </div>
                  <div>
                    <span className="font-medium">Database:</span> SQLite
                  </div>
                  <div>
                    <span className="font-medium">Cache:</span> Memory
                  </div>
                </div>
              </div>

              {/* Health Check */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-3">System Health</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-green-700">
                    <span className="mr-2">🟢</span>
                    <span>Database connection: OK</span>
                  </div>
                  <div className="flex items-center text-sm text-green-700">
                    <span className="mr-2">🟢</span>
                    <span>File system: OK</span>
                  </div>
                  <div className="flex items-center text-sm text-green-700">
                    <span className="mr-2">🟢</span>
                    <span>Memory usage: Normal</span>
                  </div>
                  <div className="flex items-center text-sm text-green-700">
                    <span className="mr-2">🟢</span>
                    <span>API endpoints: Responsive</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Clear Cache
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Restart Services
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  System Reboot
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};