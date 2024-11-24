import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import DataTable from '../../components/common/DataTable';
import RoleForm from './RoleForm';
import LoadingState from '../../components/LoadingState';
import api from '../../services/api';
import { Box, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Roles() {
  const { showNotification } = useNotification();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setOpenDialog(true);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        setLoading(true);
        await api.deleteRole(roleId);
        setRoles(roles.filter(role => role.id !== roleId));
        setSelectedRoles(selectedRoles.filter(id => id !== roleId));
        showNotification('Role deleted successfully', 'success');
      } catch (error) {
        showNotification(error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Name',
      render: (row) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      )
    },
    { 
      id: 'description', 
      label: 'Description',
      render: (row) => (
        <span className="text-gray-500">{row.description}</span>
      )
    },
    { 
      id: 'permissions', 
      label: 'Permissions',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(Array.isArray(row.permissions) ? row.permissions : []).map((permission) => (
            <span
              key={permission}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {permission}
            </span>
          ))}
        </div>
      )
    }
  ];

  const handleAddRole = async (newRole) => {
    try {
      setLoading(true);
      const createdRole = await api.createRole(newRole);
      setRoles([...roles, createdRole]);
      setOpenDialog(false);
      showNotification('Role created successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async (updatedRole) => {
    try {
      setLoading(true);
      const savedRole = await api.updateRole(updatedRole.id, updatedRole);
      setRoles(roles.map(role => role.id === savedRole.id ? savedRole : role));
      setOpenDialog(false);
      setEditingRole(null);
      showNotification('Role updated successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      setLoading(true);
      await api.deleteRole(roleId);
      setRoles(roles.filter(role => role.id !== roleId));
      setSelectedRoles(selectedRoles.filter(id => id !== roleId));
      showNotification('Role deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedRoles.length) return;

    try {
      setLoading(true);
      const result = await api.bulkDeleteRoles(selectedRoles);
      if (result.success) {
        setRoles(prevRoles => prevRoles.filter(role => !selectedRoles.includes(role.id)));
        setSelectedRoles([]);
        showNotification('Selected roles deleted successfully', 'success');
      }
    } catch (error) {
      showNotification(error.message || 'Failed to delete roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRoles(roles.map(role => role.id));
    } else {
      setSelectedRoles([]);
    }
  };

  const handleSelectOne = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      }
      return [...prev, roleId];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Roles Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage roles and their permissions
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            {selectedRoles.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <DeleteIcon className="h-4 w-4 mr-2" />
                Delete Selected ({selectedRoles.length})
              </button>
            )}
            <button
              onClick={() => setOpenDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <AddIcon className="h-4 w-4 mr-2" />
              Add Role
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <LoadingState type="table" count={5} />
          ) : (
            <DataTable
              data={roles}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchable
              selectable
              selected={selectedRoles}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
            />
          )}
        </div>

        {openDialog && (
          <RoleForm
            onSubmit={editingRole ? handleEditRole : handleAddRole}
            onCancel={() => {
              setOpenDialog(false);
              setEditingRole(null);
            }}
            initialData={editingRole}
          />
        )}
      </div>
    </div>
  );
}

export default Roles; 