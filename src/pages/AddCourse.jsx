import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAuth } from '../utils/auth';

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

    // Double check confirmation
    const isConfirmed = window.confirm(
      `Are you sure you want to add this course?\n\nSemester: ${semester}\nDivision: ${selectedDiv}\nSubject: ${selectedSub}`
    );

    if (!isConfirmed) {
      return;
    }

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
      toast.error('Failed to add course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Add Course</h2>

        <div>
          <label className="block font-medium mb-1">Select Semester</label>
          <select
            value={semester}
            onChange={handleSemesterChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
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
          <label className="block font-medium mb-1">Select Division</label>
          <select
            value={selectedDiv}
            onChange={(e) => setSelectedDiv(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
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
          <label className="block font-medium mb-1">Select Subject</label>
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Saving...' : 'Save Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;