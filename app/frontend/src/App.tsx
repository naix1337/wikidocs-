import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

// Import layouts
import PublicLayout from './components/layouts/PublicLayout'
import PrivateLayout from './components/layouts/PrivateLayout'

// Import pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SpacesPage from './pages/SpacesPage'
import SpaceDetailPage from './pages/SpaceDetailPage'
import PagesPage from './pages/PagesPage'
import PageDetailPage from './pages/PageDetailPage'
import AdminPage from './pages/AdminPage'
import CreateContentPage from './pages/CreateContentPage'
import TestStorePage from './pages/TestStorePage'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          )
        }
      />

      {/* Private routes */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <DashboardPage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/spaces"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <SpacesPage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/spaces/:spaceId"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <SpaceDetailPage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/pages"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <PagesPage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/pages/:pageId"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <PageDetailPage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <AdminPage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/create"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <CreateContentPage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/settings"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <AdminPage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/test-store"
        element={
          isAuthenticated ? (
            <PrivateLayout>
              <TestStorePage />
            </PrivateLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App