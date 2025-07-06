import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  SectionHeader, 
  AdminCard, 
  SuccessButton, 
  InputField 
} from '../components/AdminUI';

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
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <SectionHeader 
        title="Student Submissions" 
        subtitle={`Subject: ${subjectId} | Division: ${divisionId}`}
        icon="👥"
      />

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Roll No</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">UT1</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">UT2</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Remark</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu, index) => (
                <tr key={stu.rollNo} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{stu.rollNo}</td>
                  <td className="py-4 px-6 text-gray-700">{stu.name}</td>
                  <td className="py-4 px-6">
                    <input 
                      type="number" 
                      value={stu.ut1} 
                      onChange={(e) => handleChange(index, 'ut1', e.target.value)} 
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </td>
                  <td className="py-4 px-6">
                    <input 
                      type="number" 
                      value={stu.ut2} 
                      onChange={(e) => handleChange(index, 'ut2', e.target.value)} 
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </td>
                  <td className="py-4 px-6">
                    <input 
                      type="text" 
                      value={stu.remark} 
                      onChange={(e) => handleChange(index, 'remark', e.target.value)} 
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </td>
                  <td className="py-4 px-6">
                    <input 
                      type="checkbox" 
                      checked={stu.status} 
                      onChange={(e) => handleChange(index, 'status', e)} 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <SuccessButton 
                      onClick={() => handleSave(stu)}
                      size="sm"
                    >
                      Save
                    </SuccessButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
};

export default SubjectStudents;