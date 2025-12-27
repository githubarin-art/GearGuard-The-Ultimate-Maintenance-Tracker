import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, { AdminRoute, MemberRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import CalendarView from './pages/CalendarView';
import EquipmentList from './pages/EquipmentList';
import TeamsPage from './pages/TeamsPage';
import RequestsPage from './pages/RequestsPage';
import ActivityPage from './pages/ActivityPage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes - Both Admin and Member */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiredRoles={['admin', 'member']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/requests"
            element={
              <ProtectedRoute requiredRoles={['admin', 'member']}>
                <Layout>
                  <KanbanBoard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/requests-all"
            element={
              <ProtectedRoute requiredRoles={['admin', 'member']}>
                <Layout>
                  <RequestsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/activity"
            element={
              <ProtectedRoute requiredRoles={['admin', 'member']}>
                <Layout>
                  <ActivityPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/calendar"
            element={
              <ProtectedRoute requiredRoles={['admin', 'member']}>
                <Layout>
                  <CalendarView />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/equipment"
            element={
              <AdminRoute>
                <Layout>
                  <EquipmentList />
                </Layout>
              </AdminRoute>
            }
          />
          
          <Route
            path="/teams"
            element={
              <AdminRoute>
                <Layout>
                  <TeamsPage />
                </Layout>
              </AdminRoute>
            }
          />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
