import { useState } from 'react';
import { uploadStudentsCSV, findStudent, updateStudent } from '../api/admin';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';
import { 
  SectionHeader, 
  AdminCard, 
  TabButton, 
  PrimaryButton, 
  SuccessButton, 
  SecondaryButton, 
  InputField, 
  FileUpload, 
  InfoCard 
} from '../components/AdminUI';

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



  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Breadcrumb />
      <SectionHeader 
        title="Student Management" 
        subtitle="Upload, search, and update student information"
        icon="👥"
      />

      {/* Tab Navigation */}
      <div className="flex gap-3 mb-8">
        <TabButton 
          id="upload" 
          title="Upload CSV" 
          active={activeTab === 'upload'} 
          onClick={() => setActiveTab('upload')}
        />
        <TabButton 
          id="search" 
          title="Search Student" 
          active={activeTab === 'search'} 
          onClick={() => setActiveTab('search')}
        />
      </div>

            {/* Upload CSV Tab */}
      {activeTab === 'upload' && (
        <AdminCard>
          <h2 className="text-2xl font-bold mb-6">Upload Students CSV</h2>
          <div className="space-y-6">
            <FileUpload 
              label="Select CSV File"
              onChange={handleFileChange}
              selectedFile={csvFile}
            />
            <PrimaryButton
              onClick={handleUpload}
              disabled={isLoading || !csvFile}
              loading={isLoading}
            >
              Upload Students
            </PrimaryButton>
                    </div>

          {/* CSV Format Instructions */}
          <InfoCard 
            title="CSV Format Requirements" 
            type="info"
          >
            <ul className="space-y-1">
              <li>• CSV must have headers: ID, Roll No, Name, Division, Batch</li>
              <li>• Division and Batch must exist in the system</li>
              <li>• Example format:</li>
              <li className="font-mono text-xs bg-white p-2 rounded">
                ID,Roll No,Name,Division,Batch<br/>
                STU001,2023001,John Doe,A,2023<br/>
                STU002,2023002,Jane Smith,B,2023
              </li>
            </ul>
          </InfoCard>
        </AdminCard>
      )}

            {/* Search Student Tab */}
      {activeTab === 'search' && (
        <div className="space-y-8">
          {/* Search Form */}
          <AdminCard>
            <h2 className="text-2xl font-bold mb-6">Search Student</h2>
            <div className="flex gap-4">
              <InputField
                placeholder="Enter Student ID (not Roll No)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1"
              />
              <SuccessButton
                onClick={handleSearch}
                disabled={isLoading}
                loading={isLoading}
              >
                Search
              </SuccessButton>
            </div>
          </AdminCard>

          {/* Student Details */}
          {student && (
            <AdminCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Student Details</h2>
                <PrimaryButton
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancel Edit' : 'Edit'}
                </PrimaryButton>
              </div>

              {editMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Student ID"
                      value={editData.studentId || ''}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                    />
                    <InputField
                      label="Roll No"
                      value={editData.rollNo || ''}
                      onChange={(e) => handleInputChange('rollNo', e.target.value)}
                    />
                    <InputField
                      label="Name"
                      value={editData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    <InputField
                      label="Division"
                      value={editData.division?.division || ''}
                      onChange={(e) => handleInputChange('division', e.target.value)}
                    />
                    <InputField
                      label="Batch"
                      value={editData.batchName?.batchName || ''}
                      onChange={(e) => handleInputChange('batchName', e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <SuccessButton
                      onClick={handleUpdate}
                      disabled={isLoading}
                      loading={isLoading}
                    >
                      Update Student
                    </SuccessButton>
                    <SecondaryButton
                      onClick={() => {
                        setEditMode(false);
                        setEditData(student);
                      }}
                    >
                      Cancel
                    </SecondaryButton>
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
            </AdminCard>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminStudents; 