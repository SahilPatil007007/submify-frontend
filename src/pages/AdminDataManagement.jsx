import { useState } from 'react';
import { uploadDivisionsCSV, uploadBatchesCSV, uploadSubjectsCSV, assignCoordinator } from '../api/admin';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';

const AdminDataManagement = () => {
  const [activeTab, setActiveTab] = useState('divisions');
  const [isLoading, setIsLoading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  
  // Coordinator assignment
  const [divisionId, setDivisionId] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async (uploadFunction, successMessage) => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsLoading(true);
    try {
      const response = await uploadFunction(csvFile);
      toast.success(response.data);
      setCsvFile(null);
    } catch (error) {
      toast.error(error.response?.data || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoordinatorAssignment = async () => {
    if (!divisionId.trim() || !teacherId.trim()) {
      toast.error('Please enter both division ID and teacher ID');
      return;
    }

    setIsLoading(true);
    try {
      await assignCoordinator(divisionId, teacherId);
      toast.success('Coordinator assigned successfully!');
      setDivisionId('');
      setTeacherId('');
    } catch (error) {
      toast.error(error.response?.data || 'Assignment failed');
    } finally {
      setIsLoading(false);
    }
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

  const UploadSection = ({ title, description, uploadFunction, successMessage, csvFormat }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      
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
          onClick={() => handleUpload(uploadFunction, successMessage)}
          disabled={isLoading || !csvFile}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Uploading...' : `Upload ${title}`}
        </button>
      </div>

      {/* CSV Format Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">CSV Format Requirements:</h3>
        <div className="text-sm text-blue-700 space-y-1">
          {csvFormat}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Management</h1>
        <p className="text-gray-600">Upload divisions, batches, subjects and manage coordinator assignments</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <TabButton id="divisions" title="Divisions" active={activeTab === 'divisions'} />
        <TabButton id="batches" title="Batches" active={activeTab === 'batches'} />
        <TabButton id="subjects" title="Subjects" active={activeTab === 'subjects'} />
        <TabButton id="coordinator" title="Assign Coordinator" active={activeTab === 'coordinator'} />
      </div>

      {/* Divisions Tab */}
      {activeTab === 'divisions' && (
        <UploadSection
          title="Upload Divisions"
          description="Upload division data with division ID."
          uploadFunction={uploadDivisionsCSV}
          successMessage="Divisions uploaded successfully!"
          csvFormat={
            <ul className="space-y-1">
              <li>• CSV must have header: division</li>
              <li>• division: Division ID (e.g., A, B, C)</li>
              <li>• Example format:</li>
              <li className="font-mono text-xs bg-white p-2 rounded">
                division<br/>
                A<br/>
                B<br/>
                C
              </li>
            </ul>
          }
        />
      )}

      {/* Batches Tab */}
      {activeTab === 'batches' && (
        <UploadSection
          title="Upload Batches"
          description="Upload batch data with associated divisions."
          uploadFunction={uploadBatchesCSV}
          successMessage="Batches uploaded successfully!"
          csvFormat={
            <ul className="space-y-1">
              <li>• CSV must have headers: batchName, division</li>
              <li>• batchName: Batch name (e.g., 2023, 2024)</li>
              <li>• division: Division ID (must exist in system)</li>
              <li>• Example format:</li>
              <li className="font-mono text-xs bg-white p-2 rounded">
                batchName,division<br/>
                2023,A<br/>
                2023,B<br/>
                2024,A
              </li>
            </ul>
          }
        />
      )}

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <UploadSection
          title="Upload Subjects"
          description="Upload subject data including subject code, name, and semester."
          uploadFunction={uploadSubjectsCSV}
          successMessage="Subjects uploaded successfully!"
          csvFormat={
            <ul className="space-y-1">
              <li>• CSV must have headers: subjectCode, subjectName, semester</li>
              <li>• subjectCode: Unique subject code (integer)</li>
              <li>• subjectName: Subject name</li>
              <li>• semester: Semester number</li>
              <li>• Example format:</li>
              <li className="font-mono text-xs bg-white p-2 rounded">
                subjectCode,subjectName,semester<br/>
                101,Mathematics,1<br/>
                102,Physics,1<br/>
                201,Advanced Math,2
              </li>
            </ul>
          }
        />
      )}

      {/* Coordinator Assignment Tab */}
      {activeTab === 'coordinator' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Assign Coordinator</h2>
          <p className="text-gray-600 mb-4">Assign a teacher as coordinator for a specific division.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division ID
              </label>
              <input
                type="text"
                placeholder="Enter division ID (e.g., A, B, C)"
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher ID
              </label>
              <input
                type="text"
                placeholder="Enter teacher ID"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCoordinatorAssignment}
              disabled={isLoading || !divisionId.trim() || !teacherId.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Assigning...' : 'Assign Coordinator'}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-semibold text-green-800 mb-2">Instructions:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Enter the division ID (must exist in the system)</li>
              <li>• Enter the teacher ID (must exist in the system)</li>
              <li>• The teacher will be assigned as coordinator for that division</li>
              <li>• Only one coordinator per division</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDataManagement; 