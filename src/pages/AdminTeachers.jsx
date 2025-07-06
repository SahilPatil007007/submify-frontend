import { useState } from 'react';
import { findTeacher, updateTeacher } from '../api/admin';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';
import { 
  SectionHeader, 
  AdminCard, 
  PrimaryButton, 
  SuccessButton, 
  SecondaryButton, 
  InputField, 
  InfoCard 
} from '../components/AdminUI';

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
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Breadcrumb />
      <SectionHeader 
        title="Teacher Management" 
        subtitle="Search and update teacher information"
        icon="👨‍🏫"
      />

      {/* Search Form */}
      <AdminCard className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Search Teacher</h2>
        <div className="flex gap-4">
          <InputField
            placeholder="Enter Teacher ID"
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

      {/* Teacher Details */}
      {teacher && (
        <AdminCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Teacher Details</h2>
            <PrimaryButton
              onClick={() => {
                setEditMode(!editMode);
                if (!editMode) {
                  setNewPassword(''); // Reset password input when entering edit mode
                }
              }}
            >
              {editMode ? 'Cancel Edit' : 'Edit'}
            </PrimaryButton>
          </div>

          {editMode ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Teacher ID"
                  value={editData.id || ''}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                />
                <InputField
                  label="Name"
                  value={editData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                <InputField
                  label="Email"
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Enter new password (leave blank to keep current)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">Leave password blank to keep the current password</p>

              {/* Roles */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Roles</label>
                <div className="space-y-3">
                  {['TEACHER', 'CLASS_COORDINATOR', 'ADMIN'].map((roleType) => (
                    <label key={roleType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(roleType)}
                        onChange={() => handleRoleChange(roleType)}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{roleType.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <SuccessButton
                  onClick={handleUpdate}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Update Teacher
                </SuccessButton>
                <SecondaryButton
                  onClick={() => {
                    setEditMode(false);
                    setEditData(teacher);
                    setNewPassword('');
                  }}
                >
                  Cancel
                </SecondaryButton>
              </div>
            </div>
                      ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teacher ID</label>
                  <p className="text-lg font-medium text-gray-900">{teacher.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <p className="text-lg font-medium text-gray-900">{teacher.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <p className="text-lg font-medium text-gray-900">{teacher.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Roles</label>
                  <p className="text-lg font-medium text-gray-900">
                    {teacher.roles?.map(role => role.roleType).join(', ') || 'No roles assigned'}
                  </p>
                </div>
              </div>
            )}
          </AdminCard>
        )}

      {!teacher && (
        <InfoCard 
          title="How to use Teacher Management" 
          type="info"
        >
          <ul className="space-y-2">
            <li>• Enter a teacher ID in the search field above</li>
            <li>• Click "Search" to find the teacher</li>
            <li>• Once found, you can view and edit teacher details</li>
            <li>• Click "Edit" to modify teacher information</li>
            <li>• You can update teacher details, password, and roles</li>
          </ul>
        </InfoCard>
      )}
    </div>
  );
};

export default AdminTeachers;