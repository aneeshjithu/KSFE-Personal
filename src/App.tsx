
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import Login from './components/features/Login';
import Dashboard from './components/features/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

import ChittyList from './components/features/ChittyList';
import ChittyForm from './components/features/ChittyForm';
import ChittyDetails from './components/features/ChittyDetails';
import Properties from './components/features/Properties';
import AppSettings from './components/features/AppSettings';
import Reminders from './components/features/Reminders';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="chitties" element={<ChittyList />} />
                <Route path="auctioned" element={<ChittyList statusFilter={['running+auctioned', 'completed']} />} />
                <Route path="to-be-auctioned" element={<ChittyList statusFilter={['running']} />} />
                <Route path="reminders" element={<Reminders />} />
                <Route path="chitties/new" element={<ChittyForm />} />
                <Route path="chitties/:id/edit" element={<ChittyForm />} />
                <Route path="chitties/:id" element={<ChittyDetails />} />
                <Route path="properties" element={<Properties />} />
                <Route path="settings" element={<AppSettings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
