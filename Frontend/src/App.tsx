import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register } from './pages/auth';
import { Dashboard, NewAdmission, Staff, NewStaff } from './pages/dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/overview" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/newadmission" 
          element={
            <ProtectedRoute>
              <NewAdmission />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-staff" 
          element={
            <ProtectedRoute>
              <NewStaff />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
