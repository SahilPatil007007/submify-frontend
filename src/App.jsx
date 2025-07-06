// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddCourse from './pages/AddCourse';
import SubjectStudents from './pages/SubjectStudents';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminTeachers from './pages/AdminTeachers';
import AdminDataManagement from './pages/AdminDataManagement';
import AdminEmails from './pages/AdminEmails';
import Header from './pages/Header';
import AdminRoute from './utils/AdminRoute';
import UserRoute from './utils/UserRoute';

function App() {
  const { authUser } = useAuthContext();

  return (
    <div>
      {authUser && <Header/>}
      <Routes>
        <Route path='/' element={authUser ? <UserRoute><Dashboard /></UserRoute> : <Navigate to="/login" />} />
        <Route path='/dashboard' element={authUser ? <UserRoute><Dashboard /></UserRoute> : <Navigate to="/login" />} />
        <Route path='/add-course' element={authUser ? <UserRoute><AddCourse /></UserRoute> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/subject-students" element={authUser ? <UserRoute><SubjectStudents /></UserRoute> : <Navigate to="/login" />} />
        <Route path="/coordinator" element={authUser ? <UserRoute><CoordinatorDashboard /></UserRoute> : <Navigate to="/login" />} />
        <Route path="/admin" element={authUser ? <AdminRoute><AdminDashboard /></AdminRoute> : <Navigate to="/login" />} />
        <Route path="/admin/students" element={authUser ? <AdminRoute><AdminStudents /></AdminRoute> : <Navigate to="/login" />} />
        <Route path="/admin/teachers" element={authUser ? <AdminRoute><AdminTeachers /></AdminRoute> : <Navigate to="/login" />} />
        <Route path="/admin/data" element={authUser ? <AdminRoute><AdminDataManagement /></AdminRoute> : <Navigate to="/login" />} />
        <Route path="/admin/emails" element={authUser ? <AdminRoute><AdminEmails /></AdminRoute> : <Navigate to="/login" />} />
        <Route path='*' element={
          authUser ? (
            authUser.roles?.some(role => role.roleType === 'ADMIN') ? 
              <Navigate to="/admin" /> : 
              <Navigate to="/" />
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
