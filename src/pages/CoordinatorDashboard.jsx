import { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "../utils/auth";
import toast from "react-hot-toast";
import { 
  SectionHeader, 
  AdminCard, 
  SuccessButton, 
  StatsCard 
} from "../components/AdminUI";

const CoordinatorDashboard = () => {
  const [pivotData, setPivotData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [saveStates, setSaveStates] = useState({});
  const { token } = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://submify-backend.onrender.com/api/teacher/students/pivot-submission",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPivotData(res.data);

        // Extract subjects from the first record if available
        if (res.data.length > 0) {
          const first = res.data[0];
          setSubjects(Object.keys(first.subjectStatuses));
        }

        // Initialize save states
        const initialSaveStates = {};
        res.data.forEach((student) => {
          initialSaveStates[student.rollNo] = false;
        });
        setSaveStates(initialSaveStates);
      } catch (err) {
        toast.error("Failed to fetch pivot data");
      }
    };

    fetchData();
  }, [token]);

  const handleToggleFinalized = (rollNo) => {
    setPivotData((prev) =>
      prev.map((student) =>
        student.rollNo === rollNo
          ? { ...student, finalized: !student.finalized }
          : student
      )
    );
    setSaveStates((prev) => ({
      ...prev,
      [rollNo]: true,
    }));
  };

  const handleSave = async (rollNo) => {
    const student = pivotData.find((s) => s.rollNo === rollNo);
    try {
      await axios.put(
        `https://submify-backend.onrender.com/api/teacher/students/${rollNo}/finalize`,
        { finalized: student.finalized },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Finalized status updated");
      setSaveStates((prev) => ({ ...prev, [rollNo]: false }));
    } catch (err) {
      toast.error("Failed to save finalized status");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <SectionHeader 
        title="Coordinator Responsibilities" 
        subtitle="Manage student finalization status across all subjects"
        icon="👨‍💼"
      />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Students" 
          value={pivotData.length} 
          icon="👥"
          color="blue"
        />
        <StatsCard 
          title="Finalized Students" 
          value={pivotData.filter(s => s.finalized).length} 
          icon="✅"
          color="green"
        />
        <StatsCard 
          title="Pending Students" 
          value={pivotData.filter(s => !s.finalized).length} 
          icon="⏳"
          color="orange"
        />
      </div>

      {pivotData.length === 0 ? (
        <AdminCard>
          <p className="text-gray-600 text-lg text-center">No student data available.</p>
        </AdminCard>
      ) : (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Roll No</th>
                  {subjects.map((subj) => (
                    <th key={subj} className="text-left py-4 px-6 font-semibold text-gray-700">
                      {subj}
                    </th>
                  ))}
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Finalized</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {pivotData.map((student) => (
                  <tr key={student.rollNo} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{student.rollNo}</td>
                    {subjects.map((subj) => (
                      <td key={subj} className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {student.subjectStatuses[subj]?.status ? "✅" : "❌"}
                          </span>
                          <span className="text-sm text-gray-600">
                            {student.subjectStatuses[subj]?.remark || ""}
                          </span>
                        </div>
                      </td>
                    ))}
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={student.finalized}
                        onChange={() => handleToggleFinalized(student.rollNo)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <SuccessButton
                        disabled={!saveStates[student.rollNo]}
                        onClick={() => handleSave(student.rollNo)}
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
      )}
    </div>
  );
};

export default CoordinatorDashboard;