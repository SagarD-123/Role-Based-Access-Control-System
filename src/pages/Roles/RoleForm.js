import React, { useState, useEffect } from 'react';
import { BadgeOutlined, DescriptionOutlined, SecurityOutlined, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxBlankIcon } from '@mui/icons-material';
import api from '../../services/api';
import { FormControlLabel, Checkbox } from '@mui/material';

function RoleForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPermissions();
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const loadPermissions = async () => {
    try {
      const permissions = await api.getPermissions();
      setAvailablePermissions(permissions);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Role name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.permissions.length === 0) newErrors.permissions = 'At least one permission is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'permissions' ? (Array.isArray(value) ? value : [value]) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePermissionChange = (permissionName) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionName)
        ? prev.permissions.filter(p => p !== permissionName)
        : [...prev.permissions, permissionName]
    }));
    if (errors.permissions) {
      setErrors(prev => ({ ...prev, permissions: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-5">
                  {initialData ? 'Edit Role' : 'Add New Role'}
                </h3>
                
                <div className="space-y-4">
                  {/* Role Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BadgeOutlined className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.name ? 'border-red-300 ring-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        placeholder="Enter role name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute top-0 left-0 pl-3 pt-1 pointer-events-none">
                        <DescriptionOutlined className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.description ? 'border-red-300 ring-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        placeholder="Enter role description"
                      />
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* New Permissions Checkbox Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </label>
                    <div className="bg-white rounded-md border border-gray-300 p-4 max-h-60 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-2">
                        {availablePermissions.map((permission) => (
                          <FormControlLabel
                            key={permission.name}
                            control={
                              <Checkbox
                                checked={formData.permissions.includes(permission.name)}
                                onChange={() => handlePermissionChange(permission.name)}
                                icon={<CheckBoxBlankIcon />}
                                checkedIcon={<CheckBoxIcon />}
                                className="text-primary-600"
                              />
                            }
                            label={
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                  {permission.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {permission.description}
                                </span>
                              </div>
                            }
                            className="m-0"
                          />
                        ))}
                      </div>
                    </div>
                    {errors.permissions && (
                      <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                >
                  {initialData ? 'Save Changes' : 'Add Role'}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleForm; 