import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import PermissionForm from './PermissionForm';
import DataTable from '../../components/common/DataTable';
import api from '../../services/api';
import LoadingState from '../../components/LoadingState';
import { useApp } from '../../context/AppContext';
import { AddOutlined as AddIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';

function Permissions() {
  const { permissions, setPermissions } = useApp();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await api.getPermissions();
      setPermissions(data);
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async (newPermission) => {
    try {
      setLoading(true);
      const savedPermission = await api.createPermission(newPermission);
      setPermissions(prev => [...prev, savedPermission]);
      setOpenDialog(false);
      showNotification('Permission created successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPermission = async (updatedPermission) => {
    try {
      setLoading(true);
      const savedPermission = await api.updatePermission(updatedPermission.id, updatedPermission);
      setPermissions(permissions.map(permission => 
        permission.id === savedPermission.id ? savedPermission : permission
      ));
      setOpenDialog(false);
      setEditingPermission(null);
      showNotification('Permission updated successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermission = async (permissionId) => {
    try {
      setLoading(true);
      await api.deletePermission(permissionId);
      setPermissions(prev => prev.filter(permission => permission.id !== permissionId));
      showNotification('Permission deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedPermissions(permissions.map(permission => permission.id));
    } else {
      setSelectedPermissions([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      setLoading(true);
      await Promise.all(selectedPermissions.map(id => api.deletePermission(id)));
      setPermissions(prev => prev.filter(permission => !selectedPermissions.includes(permission.id)));
      setSelectedPermissions([]);
      showNotification('Permissions deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Name',
      render: (row) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-900 tracking-wide">
            {row.name}
          </span>
        </div>
      )
    },
    { 
      id: 'description', 
      label: 'Description',
      render: (row) => (
        <span className="text-gray-600 font-medium tracking-wide">
          {row.description}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
              Permissions Management
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium tracking-wide">
              Manage system permissions and access controls
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            {selectedPermissions.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <DeleteIcon className="h-4 w-4 mr-2" />
                Delete Selected ({selectedPermissions.length})
              </button>
            )}
            <button
              onClick={() => setOpenDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <AddIcon className="h-4 w-4 mr-2" />
              Add Permission
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <LoadingState type="table" count={5} />
          ) : (
            <DataTable
              data={permissions}
              columns={columns}
              onEdit={(permission) => {
                setEditingPermission(permission);
                setOpenDialog(true);
              }}
              onDelete={handleDeletePermission}
              onSelectAll={handleSelectAll}
              onSelectOne={(id) => {
                setSelectedPermissions(prev => 
                  prev.includes(id) 
                    ? prev.filter(permId => permId !== id)
                    : [...prev, id]
                );
              }}
              selectedItems={selectedPermissions}
              searchable
              className="font-inter"
            />
          )}
        </div>

        {openDialog && (
          <PermissionForm
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
              setEditingPermission(null);
            }}
            onSubmit={editingPermission ? handleEditPermission : handleAddPermission}
            initialData={editingPermission}
          />
        )}
      </div>
    </div>
  );
}

export default Permissions;