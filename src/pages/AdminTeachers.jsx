import { useState } from 'react';
import { findTeacher, updateTeacher } from '../api/admin';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';

const AdminTeachers = () => {
  const [searchId, setSearchId] = useState('');
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [newPassword, setNewPassword] = useState(''); // ✅ New password state

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error('Please enter a teacher ID');
      return;
    }

    setIsLoading(true);
    try {
      const response = await findTeacher(searchId);
      setTeacher(response.data);
      setEditData(response.data);
      setSelectedRoles(response.data.roles?.map(role => role.roleType) || []);
      setNewPassword(''); // Clear password field
      toast.success('Teacher found!');
    } catch (error) {
      toast.error('Teacher not found');
      setTeacher(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        id: editData.id,
        name: editData.name,
        email: editData.email,
        roles: selectedRoles,
      };

      if (newPassword.trim() !== '') {
        updateData.password = newPassword;
      }

      await updateTeacher(updateData);
      toast.success('Teacher updated successfully!');
      setEditMode(false);
      setTeacher({ ...editData, roles: selectedRoles });
    } catch (error) {
      toast.error(error.response?.data || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (roleType) => {
    setSelectedRoles(prev =>
      prev.includes(roleType)
        ? prev.filter(role => role !== roleType)
        : [...prev, roleType]
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Management</h1>
        <p className="text-gray-600">Search and update teacher information</p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Search Teacher</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Teacher ID"
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

      {/* Teacher Details */}
      {teacher && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Teacher Details</h2>
            <button
              onClick={() => {
                setEditMode(!editMode);
                if (!editMode) {
                  setNewPassword(''); // Reset password input when entering edit mode
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {editMode ? 'Cancel Edit' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                  <input
                    type="text"
                    value={editData.id || ''}
                    onChange={(e) => handleInputChange('id', e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password (leave blank to keep current)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to keep the current password</p>
                </div>
              </div>

              {/* Roles */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                <div className="space-y-2">
                  {['TEACHER', 'CLASS_COORDINATOR', 'ADMIN'].map((roleType) => (
                    <label key={roleType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(roleType)}
                        onChange={() => handleRoleChange(roleType)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{roleType.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Teacher'}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditData(teacher);
                    setNewPassword('');
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                <p className="text-gray-900">{teacher.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{teacher.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{teacher.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
                <p className="text-gray-900">
                  {teacher.roles?.map(role => role.roleType).join(', ') || 'No roles assigned'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {!teacher && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How to use</h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Enter a teacher ID in the search field above</li>
            <li>• Click "Search" to find the teacher</li>
            <li>• Once found, you can view and edit teacher details</li>
            <li>• Click "Edit" to modify teacher information</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;