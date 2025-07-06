import { useState } from 'react';
import { allowEmail, uploadAllowedEmailsCSV } from '../api/admin';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';

const AdminEmails = () => {
  const [activeTab, setActiveTab] = useState('individual');
  const [email, setEmail] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Individual Email Section
  const handleAddEmail = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await allowEmail(email);
      toast.success('Email added to allowed list successfully!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to add email');
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await uploadAllowedEmailsCSV(csvFile);
      toast.success(response.data);
      setCsvFile(null);
    } catch (error) {
      toast.error(error.response?.data || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton = ({ id, title, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        active ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
        <h1 className="text-3xl font-bold text-gray-800">Email Management</h1>
        <p className="text-gray-600">Manage allowed email addresses for registration</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <TabButton id="individual" title="Add Individual Email" active={activeTab === 'individual'} />
        <TabButton id="upload" title="Upload CSV" active={activeTab === 'upload'} />
      </div>

      {/* Individual Email Tab */}
      {activeTab === 'individual' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Individual Email</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleAddEmail}
              disabled={isLoading || !email.trim()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Email'}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">Instructions:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Enter a valid email address</li>
              <li>• The email will be added to the allowed list</li>
              <li>• Users with allowed emails can register for the system</li>
              <li>• Duplicate emails will be rejected</li>
            </ul>
          </div>
        </div>
      )}

      {/* Upload CSV Tab */}
      {activeTab === 'upload' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Allowed Emails CSV</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
            {csvFile && (
              <p className="text-sm text-gray-600">Selected: {csvFile.name}</p>
            )}
            <button
              onClick={handleUpload}
              disabled={isLoading || !csvFile}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Uploading...' : 'Upload Emails'}
            </button>
          </div>

          {/* CSV Format Instructions */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">CSV Format Requirements:</h3>
                         <ul className="text-sm text-purple-700 space-y-1">
               <li>• CSV must have a header row with column name "email"</li>
               <li>• One email per row</li>
               <li>• Example format:</li>
               <li className="font-mono text-xs bg-white p-2 rounded">
                 email<br/>
                 user1@example.com<br/>
                 user2@example.com<br/>
                 user3@example.com
               </li>
             </ul>
          </div>
        </div>
      )}

      {/* General Information */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">About Email Management</h3>
        <div className="text-blue-700 space-y-2">
          <p>This feature allows you to control which email addresses can register for the system. Only users with allowed email addresses will be able to create accounts.</p>
          <p>You can either add emails individually or upload a CSV file containing multiple email addresses.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminEmails; 