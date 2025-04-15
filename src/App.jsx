// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AddCourse from './pages/AddCourse';
import SubjectStudents from './pages/SubjectStudents';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import Header from './pages/Header';

function App() {
  const { authUser } = useAuthContext();

  return (
    <div>
      {authUser && <Header/>}
      <Routes>
        <Route path='/' element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/dashboard' element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/add-course' element={authUser ? <AddCourse /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/subject-students" element={authUser ? <SubjectStudents /> : <Navigate to="/login" />} />
        <Route path="/coordinator" element={authUser ?<CoordinatorDashboard /> : <Navigate to="/login" />} />
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
