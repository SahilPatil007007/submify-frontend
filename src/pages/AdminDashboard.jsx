import { useNavigate } from 'react-router-dom';
import { getAuth } from '../utils/auth';
import Breadcrumb from '../components/Breadcrumb';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = getAuth();

  const adminCards = [
    {
      title: 'Student Management',
      subtitle: 'Upload CSV, find and update student information',
      icon: '👥',
      path: '/admin/students',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Teacher Management',
      subtitle: 'Find and update teacher information',
      icon: '👨‍🏫',
      path: '/admin/teachers',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Data Management',
      subtitle: 'Upload divisions, batches, subjects and assign coordinators',
      icon: '📊',
      path: '/admin/data',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Email Management',
      subtitle: 'Manage allowed email addresses',
      icon: '📧',
      path: '/admin/emails',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const Card = ({ title, subtitle, icon, path, color }) => (
    <div
      onClick={() => navigate(path)}
      className={`p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all transform hover:scale-105 ${color} text-white`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{subtitle}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb />
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}. Manage your system from here.</p>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600">Students</div>
            <div className="text-sm text-gray-600">Manage student data</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600">Teachers</div>
            <div className="text-sm text-gray-600">Manage teacher data</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-orange-600">Data</div>
            <div className="text-sm text-gray-600">Manage system data</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-purple-600">Emails</div>
            <div className="text-sm text-gray-600">Manage allowed emails</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 