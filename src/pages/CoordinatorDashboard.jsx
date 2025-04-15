import { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "../utils/auth";
import toast from "react-hot-toast";

const CoordinatorDashboard = () => {
  const [pivotData, setPivotData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [saveStates, setSaveStates] = useState({});
  const { token } = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/teacher/students/pivot-submission",
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
        `http://localhost:8080/api/teacher/students/${rollNo}/finalize`,
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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Coordinator Responsibilities</h2>
      {pivotData.length === 0 ? (
        <p className="text-gray-600">No student data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Roll No</th>
                {subjects.map((subj) => (
                  <th key={subj} className="px-4 py-2 border">
                    {subj}
                  </th>
                ))}
                <th className="px-4 py-2 border">Finalized</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {pivotData.map((student) => (
                <tr key={student.rollNo}>
                  <td className="px-4 py-2 border text-center">{student.rollNo}</td>
                  {subjects.map((subj) => (
                    <td key={subj} className="px-4 py-2 border text-center">
                      {student.subjectStatuses[subj]?.status ? "✅" : "❌"}{" "}
                      <span className="text-sm text-gray-600">
                        {student.subjectStatuses[subj]?.remark || ""}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={student.finalized}
                      onChange={() => handleToggleFinalized(student.rollNo)}
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      disabled={!saveStates[student.rollNo]}
                      onClick={() => handleSave(student.rollNo)}
                      className={`px-3 py-1 rounded ${
                        saveStates[student.rollNo]
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoordinatorDashboard;