import { useNavigate } from 'react-router-dom';
import { getAuth } from '../utils/auth';
import Breadcrumb from '../components/Breadcrumb';
import { SectionHeader, AdminCard, StatsCard } from '../components/AdminUI';

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
      className={`p-8 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 border border-gray-100 ${color} text-white relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative z-10">
        <div className="text-5xl mb-6">{icon}</div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-sm opacity-90 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Breadcrumb />
      <SectionHeader 
        title="Admin Dashboard" 
        subtitle={`Welcome back, ${user.name}. Manage your system from here.`}
        icon="⚙️"
      />

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        {adminCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

      {/* Quick Stats Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Students" 
            value="Manage" 
            icon="👥" 
            color="blue" 
          />
          <StatsCard 
            title="Teachers" 
            value="Manage" 
            icon="👨‍🏫" 
            color="green" 
          />
          <StatsCard 
            title="Data" 
            value="Manage" 
            icon="📊" 
            color="orange" 
          />
          <StatsCard 
            title="Emails" 
            value="Manage" 
            icon="📧" 
            color="purple" 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 