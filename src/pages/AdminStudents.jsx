import { useState } from 'react';
import { uploadStudentsCSV, findStudent, updateStudent } from '../api/admin';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';

const AdminStudents = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [csvFile, setCsvFile] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  // CSV Upload Section
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsLoading(true);
    try {
      await uploadStudentsCSV(csvFile);
      toast.success('Students uploaded successfully!');
      setCsvFile(null);
    } catch (error) {
      toast.error(error.response?.data || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Student Search Section
  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error('Please enter a student ID');
      return;
    }

    setIsLoading(true);
    try {
      const response = await findStudent(searchId);
      setStudent(response.data);
      setEditData(response.data);
      toast.success('Student found!');
    } catch (error) {
      toast.error(error.response?.data || 'Student not found');
      setStudent(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Student Update Section
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      // Flatten nested fields before sending
      const payload = {
        studentId: editData.studentId,
        name: editData.name,
        rollNo: editData.rollNo,
        division: typeof editData.division === 'string'
          ? editData.division
          : editData.division?.division || '',
  
        batchName: typeof editData.batchName === 'string'
          ? editData.batchName
          : editData.batchName?.batchName || ''
      };
  
      await updateStudent(payload);
      toast.success('Student updated successfully!');
      setEditMode(false);
      setStudent(payload); // Update local display
    } catch (error) {
      toast.error(error.response?.data || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const TabButton = ({ id, title, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {title}
    </button>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
        <p className="text-gray-600">Upload, search, and update student information</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <TabButton id="upload" title="Upload CSV" active={activeTab === 'upload'} />
        <TabButton id="search" title="Search Student" active={activeTab === 'search'} />
      </div>

      {/* Upload CSV Tab */}
      {activeTab === 'upload' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Students CSV</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {csvFile && (
              <p className="text-sm text-gray-600">Selected: {csvFile.name}</p>
            )}
            <button
              onClick={handleUpload}
              disabled={isLoading || !csvFile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Uploading...' : 'Upload Students'}
            </button>
                     </div>

           {/* CSV Format Instructions */}
           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
             <h3 className="text-sm font-semibold text-blue-800 mb-2">CSV Format Requirements:</h3>
             <ul className="text-sm text-blue-700 space-y-1">
               <li>• CSV must have headers: ID, Roll No, Name, Division, Batch</li>
               <li>• Division and Batch must exist in the system</li>
               <li>• Example format:</li>
               <li className="font-mono text-xs bg-white p-2 rounded">
                 ID,Roll No,Name,Division,Batch<br/>
                 STU001,2023001,John Doe,A,2023<br/>
                 STU002,2023002,Jane Smith,B,2023
               </li>
             </ul>
           </div>
         </div>
       )}

      {/* Search Student Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Search Student</h2>
            <div className="flex gap-4">
                           <input
               type="text"
               placeholder="Enter Student ID (not Roll No)"
               value={searchId}
               onChange={(e) => setSearchId(e.target.value)}
               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Student Details */}
          {student && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Student Details</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editMode ? 'Cancel Edit' : 'Edit'}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                       <input
                         type="text"
                         value={editData.studentId || ''}
                         onChange={(e) => handleInputChange('studentId', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                       <input
                         type="text"
                         value={editData.rollNo || ''}
                         onChange={(e) => handleInputChange('rollNo', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                       <input
                         type="text"
                         value={editData.name || ''}
                         onChange={(e) => handleInputChange('name', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                       <input
                         type="text"
                         value={editData.division?.division || ''}
                         onChange={(e) => handleInputChange('division', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                       <input
                         type="text"
                         value={editData.batchName?.batchName || ''}
                         onChange={(e) => handleInputChange('batchName', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                     </div>
                   </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Student'}
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditData(student);
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                     <p className="text-gray-900">{student.studentId}</p>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                     <p className="text-gray-900">{student.rollNo}</p>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                     <p className="text-gray-900">{student.name}</p>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                     <p className="text-gray-900">{student.division?.division}</p>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                     <p className="text-gray-900">{student.batchName?.batchName}</p>
                   </div>
                 </div>
               )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminStudents; 