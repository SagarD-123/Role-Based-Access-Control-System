import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import {
  Person as UserIcon,
  Email as EmailIcon,
  Key as KeyIcon,
  Logout as LogoutIcon,
  Security as ShieldIcon,
} from '@mui/icons-material';

function Profile() {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Left Column - User Info */}
            <div className="col-span-1 flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-primary-600">
                  {user.name[0]}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{user.name}</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogoutIcon className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>

            {/* Right Column - User Details */}
            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <EmailIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <ShieldIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user.role}</span>
                  </div>
                </div>

                {/* Edit Notice */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <KeyIcon className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Profile Editing Currently Unavailable
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          The ability to edit profile information is currently disabled. Please contact your administrator for any required changes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 