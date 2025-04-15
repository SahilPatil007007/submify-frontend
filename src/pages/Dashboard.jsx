import { useEffect, useState } from 'react';
import { fetchSubjects, fetchCoordinatorDivision } from '../api/teacher';
import { getAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

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

  const Card = ({ title, subtitle, onClick }) => (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer transition"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
        <div className="flex gap-3">
          <button
            onClick={handleAddCourse}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Course
          </button>
        </div>
      </div>

      {/* Subject-Division Cards */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Your Subjects</h3>
        {subjects.length === 0 ? (
          <p className="text-gray-600">No subjects assigned.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((item) => (
              <Card
                key={item.id}
                title={`${item.subject.subjectName} (${item.subject.subjectCode})`}
                subtitle={`Division: ${item.division.division} | Semester: ${item.subject.semester}`}
                onClick={() =>
                  navigate(
                    `/subject-students?subjectId=${item.subject.subjectCode}&divisionId=${item.division.division}`
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      {isCoordinator && (
        <>
          <hr className="my-8 border-gray-300" />
          <div>
            <h3 className="text-xl font-semibold mb-3">Coordinator Responsibilities</h3>
            {coordinatorInfo ? (
              <Card
                title={`Division: ${coordinatorInfo.division}`}
                subtitle={`Year: ${coordinatorInfo.year} | Semester: ${coordinatorInfo.semester}`}
                onClick={() => navigate('/coordinator')}
              />
            ) : (
              <p className="text-gray-600">No coordinator role assigned.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
