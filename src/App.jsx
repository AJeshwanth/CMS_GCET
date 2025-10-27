//App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import DeptDashboard from './pages/DeptDashboard';
import Home from './pages/Home';
import NewComplaint from './pages/NewComplaint';
import UserComplaints from './pages/UserComplaints';
import ActiveComplaints from './pages/ActiveComplaints';
import ResolvedComplaints from './pages/ResolvedComplaints';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import { NotificationProvider } from './components/NotificationProvider';

function App() {
  const role = localStorage.getItem("role");
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/active-complaints" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <ActiveComplaints />
            </ProtectedRoute>
          } />

          <Route path="/admin/resolved-complaints" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <ResolvedComplaints />
            </ProtectedRoute>
          } />
          <Route path="/user/active-complaints" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <ActiveComplaints />
            </ProtectedRoute>
          } />

          <Route path="/user/resolved-complaints" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <ResolvedComplaints />
            </ProtectedRoute>
          } />

          <Route path="/user" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/department" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <DeptDashboard />
            </ProtectedRoute>
          } />
          <Route path="/department/active-complaints" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <ActiveComplaints />
            </ProtectedRoute>
          } />

          <Route path="/department/resolved-complaints" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <ResolvedComplaints />
            </ProtectedRoute>
          } />

          <Route path="/user/complaints" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <UserComplaints />
            </ProtectedRoute>
          } />

          <Route path="/new-complaint" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <NewComplaint />
            </ProtectedRoute>
          } />
          <Route path="/my-complaints" element={
            <ProtectedRoute>
              <Navbar role={role} />
              <UserComplaints />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
