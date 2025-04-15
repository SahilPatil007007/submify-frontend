import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const SubjectStudents = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const subjectId = params.get('subjectId');
  const divisionId = params.get('divisionId');

  const [students, setStudents] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/teacher/students/submissions`, {
          params: { subjectId, divisionId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudents(res.data);
      } catch (err) {
        toast.error('Failed to fetch students');
      }
    };
    fetchData();
  }, [subjectId, divisionId]);

  const handleChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = field === 'status' ? value.target.checked : value;
    setStudents(updated);
  };

  const handleSave = async (student) => {
    try {
      await axios.put(`http://localhost:8080/api/teacher/students/update-student`, {
        studentId: student.rollNo,
        subjectId: parseInt(subjectId),
        ut1: parseInt(student.ut1),
        ut2: parseInt(student.ut2),
        status: student.status,
        remark: student.remark
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Student updated!');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Student Submissions</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Roll No</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">UT1</th>
            <th className="p-2 border">UT2</th>
            <th className="p-2 border">Remark</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu, index) => (
            <tr key={stu.rollNo} className="border">
              <td className="p-2 border">{stu.rollNo}</td>
              <td className="p-2 border">{stu.name}</td>
              <td className="p-2 border">
                <input type="number" value={stu.ut1} onChange={(e) => handleChange(index, 'ut1', e.target.value)} className="border px-2 py-1 w-16" />
              </td>
              <td className="p-2 border">
                <input type="number" value={stu.ut2} onChange={(e) => handleChange(index, 'ut2', e.target.value)} className="border px-2 py-1 w-16" />
              </td>
              <td className="p-2 border">
                <input type="text" value={stu.remark} onChange={(e) => handleChange(index, 'remark', e.target.value)} className="border px-2 py-1 w-32" />
              </td>
              <td className="p-2 border text-center">
                <input type="checkbox" checked={stu.status} onChange={(e) => handleChange(index, 'status', e)} />
              </td>
              <td className="p-2 border">
                <button onClick={() => handleSave(stu)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectStudents;