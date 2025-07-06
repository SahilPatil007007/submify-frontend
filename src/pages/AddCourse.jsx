import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAuth } from '../utils/auth';
import { 
  SectionHeader, 
  AdminCard, 
  PrimaryButton, 
  InputField 
} from '../components/AdminUI';

const AddCourse = () => {
  const navigate = useNavigate();

  const [semester, setSemester] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [loading, setLoading] = useState(false);

  const token = getAuth().token;
  console.log("Addcourese => "+token);
  
  const handleSemesterChange = async (e) => {
    const sem = parseInt(e.target.value);
    setSemester(sem);
    setSelectedDiv('');
    setSelectedSub('');
    setSubjects([]);

    if ([3, 4].includes(sem)) setDivisions(['SE1', 'SE2', 'SE3', 'SE4']);
    else if ([5, 6].includes(sem)) setDivisions(['TE1', 'TE2', 'TE3', 'TE4']);
    else if ([7, 8].includes(sem)) setDivisions(['BE1', 'BE2', 'BE3', 'BE4']);
    else setDivisions([]);
    try {
        console.log("http://localhost:8080/api/teacher/form/subs "+ sem + " " + token);
      const res = await axios.post("http://localhost:8080/api/teacher/form/subs",{ sem },{headers:{Authorization: `Bearer ${token}`}});
      setSubjects(res.data);
    } catch (err) {
      toast.error('Failed to fetch subjects');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedDiv || !selectedSub || !semester) {
      toast.error('Please fill all fields');
      return;
    }
  
    const isConfirmed = window.confirm(
      `Are you sure you want to add this course?\n\nSemester: ${semester}\nDivision: ${selectedDiv}\nSubject: ${selectedSub}`
    );
  
    if (!isConfirmed) return;
  
    try {
      setLoading(true);
      await axios.post(
        'http://localhost:8080/api/teacher/form',
        { sub: selectedSub, div: selectedDiv },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Course added successfully');
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error(err.response.data || 'Subject already assigned to this division.');
      } else {
        toast.error('Failed to add course');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <SectionHeader 
        title="Add Course" 
        subtitle="Create a new course assignment"
        icon="📚"
      />
      
      <div className="max-w-2xl mx-auto">
        <AdminCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">Course Details</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Semester</label>
              <select
                value={semester}
                onChange={handleSemesterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Select Semester --</option>
                {[3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Division</label>
              <select
                value={selectedDiv}
                onChange={(e) => setSelectedDiv(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!divisions.length}
              >
                <option value="">-- Select Division --</option>
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Subject</label>
              <select
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!subjects.length}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <PrimaryButton
              type="submit"
              disabled={loading}
              loading={loading}
              className="w-full"
            >
              Save Course
            </PrimaryButton>
          </form>
        </AdminCard>
      </div>
    </div>
  );
};

export default AddCourse;