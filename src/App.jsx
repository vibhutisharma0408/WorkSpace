import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

const LoginPage = lazy(() => import('./pages/Login'))
const RegisterPage = lazy(() => import('./pages/Register'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const WorkspacesPage = lazy(() => import('./pages/Workspaces'))
const DocumentsPage = lazy(() => import('./pages/Documents'))
const DocumentEditorPage = lazy(() => import('./pages/DocumentEditor'))
const WorkspaceHubPage = lazy(() => import('./pages/WorkspaceHub'))
const WorkspaceDocsPage = lazy(() => import('./pages/WorkspaceDocuments'))
const WorkspaceChatPage = lazy(() => import('./pages/WorkspaceChat'))
const WorkspaceTasksPage = lazy(() => import('./pages/WorkspaceTasks'))
const WorkspaceAnalyticsPage = lazy(() => import('./pages/WorkspaceAnalytics'))
const WorkspaceMeetingPage = lazy(() => import('./pages/WorkspaceMeeting'))
const WorkspaceSearchPage = lazy(() => import('./pages/WorkspaceSearch'))

import { AuthProvider, useAuth } from './auth/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="app-container flex items-center justify-center"><span className="loading loading-spinner loading-lg" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Suspense fallback={<div className="card-centered"><span className="loading loading-dots loading-lg" /></div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/workspaces" element={<ProtectedRoute><WorkspacesPage /></ProtectedRoute>} />
              <Route path="/workspaces/:id" element={<ProtectedRoute><WorkspaceHubPage /></ProtectedRoute>} />
              <Route path="/workspaces/:id/documents" element={<ProtectedRoute><WorkspaceDocsPage /></ProtectedRoute>} />
              <Route path="/workspaces/:id/chat" element={<ProtectedRoute><WorkspaceChatPage /></ProtectedRoute>} />
              <Route path="/workspaces/:id/tasks" element={<ProtectedRoute><WorkspaceTasksPage /></ProtectedRoute>} />
              <Route path="/workspaces/:id/analytics" element={<ProtectedRoute><WorkspaceAnalyticsPage /></ProtectedRoute>} />
              <Route path="/workspaces/:id/meeting" element={<ProtectedRoute><WorkspaceMeetingPage /></ProtectedRoute>} />
              <Route path="/workspaces/:id/search" element={<ProtectedRoute><WorkspaceSearchPage /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
              <Route path="/documents/:id" element={<ProtectedRoute><DocumentEditorPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
