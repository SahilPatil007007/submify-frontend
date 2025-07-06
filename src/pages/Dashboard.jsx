import { useEffect, useState } from 'react';
import { fetchSubjects, fetchCoordinatorDivision } from '../api/teacher';
import { getAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { 
  SectionHeader, 
  AdminCard, 
  PrimaryButton, 
  StatsCard 
} from '../components/AdminUI';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [coordinatorInfo, setCoordinatorInfo] = useState(null);
  const { user } = getAuth();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const isCoordinator = user.roles.some(role => role.roleType === 'CLASS_COORDINATOR');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectRes, coordinatorRes] = await Promise.all([
          fetchSubjects(),
          isCoordinator ? fetchCoordinatorDivision() : Promise.resolve({ data: null }),
        ]);

        setSubjects(subjectRes.data || []);
        if (coordinatorRes.data) setCoordinatorInfo(coordinatorRes.data);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      }
    };

    loadData();
  }, [isCoordinator]);

  const handleAddCourse = () => {
    navigate('/add-course');
  };



  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <SectionHeader 
        title={`Welcome, ${user.name}`} 
        subtitle="Manage your courses and view student information"
        icon="👋"
      />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Subjects" 
          value={subjects.length} 
          icon="📚"
          color="blue"
        />
        <StatsCard 
          title="Active Courses" 
          value={subjects.length} 
          icon="🎯"
          color="green"
        />
        {isCoordinator && (
          <StatsCard 
            title="Coordinator Role" 
            value="Active" 
            icon="👨‍💼"
            color="purple"
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="mb-8">
        <PrimaryButton onClick={handleAddCourse}>
          Add Course
        </PrimaryButton>
      </div>

      {/* Subject-Division Cards */}
      <AdminCard>
        <h3 className="text-2xl font-bold mb-6">Your Subjects</h3>
        {subjects.length === 0 ? (
          <p className="text-gray-600 text-lg">No subjects assigned.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate(
                    `/subject-students?subjectId=${item.subject.subjectCode}&divisionId=${item.division.division}`
                  )
                }
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {item.subject.subjectName} ({item.subject.subjectCode})
                </h4>
                <p className="text-gray-600">
                  <span className="font-semibold">Division:</span> {item.division.division}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Semester:</span> {item.subject.semester}
                </p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Coordinator Section */}
      {isCoordinator && (
        <AdminCard className="mt-8">
          <h3 className="text-2xl font-bold mb-6">Coordinator Responsibilities</h3>
          {coordinatorInfo ? (
            <div
              onClick={() => navigate('/coordinator')}
              className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Division: {coordinatorInfo.division}
              </h4>
              <p className="text-gray-600">
                <span className="font-semibold">Year:</span> {coordinatorInfo.year}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Semester:</span> {coordinatorInfo.semester}
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-lg">No coordinator role assigned.</p>
          )}
        </AdminCard>
      )}
    </div>
  );
};

export default Dashboard;
