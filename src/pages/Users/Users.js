import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotification } from '../../context/NotificationContext';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/common/DataTable';
import UserForm from '../../components/UserTable/UserForm';
import LoadingState from '../../components/LoadingState';
import api from '../../services/api';

function Users() {
  const { showNotification } = useNotification();
  const { users, setUsers } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  console.log(users,'users');

  const columns = [
    { 
      id: 'name', 
      label: 'Name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-medium">{row.name[0]}</span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      id: 'role', 
      label: 'Role',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.role}
        </span>
      )
    },
    { 
      id: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${row.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
          }`}>
          <span className={`h-1.5 w-1.5 rounded-full mr-1.5
            ${row.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'}`}
          />
          {row.status}
        </span>
      )
    }
  ];

  const handleAddUser = async (userData) => {
    try {
      setLoading(true);
      const newUser = {
        ...userData,
        status: 'Active',
        createdAt: Date.now()
      };
      const savedUser = await api.createUser(newUser);
      setUsers(prevUsers => [...prevUsers, savedUser]);
      setOpenDialog(false);
      showNotification('User added successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      setLoading(true);
      const savedUser = await api.updateUser(updatedUser.id, updatedUser);
      setUsers(users.map(user => user.id === savedUser.id ? savedUser : user));
      setOpenDialog(false);
      setEditingUser(null);
      showNotification('User updated successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await api.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedUsers.length) return;

    try {
      setLoading(true);
      const result = await api.bulkDeleteUsers(selectedUsers);
      if (result.success) {
        setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        showNotification('Selected users deleted successfully', 'success');
      }
    } catch (error) {
      showNotification(error.message || 'Failed to delete users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectOne = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await api.getUsers();
        setUsers(data);
      } catch (error) {
        setError(error.message);
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Users Management
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            {selectedUsers.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <DeleteIcon className="h-4 w-4 mr-2" />
                Delete Selected ({selectedUsers.length})
              </button>
            )}
            <button
              onClick={() => setOpenDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <AddIcon className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <LoadingState type="table" count={5} />
          ) : (
            <DataTable
              data={users}
              columns={columns}
              onEdit={(user) => {
                setEditingUser(user);
                setOpenDialog(true);
              }}
              onDelete={handleDeleteUser}
              searchable
              selectable
              selected={selectedUsers}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
            />
          )}
        </div>
      </div>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingUser(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <UserForm
          onSubmit={editingUser ? handleEditUser : handleAddUser}
          onCancel={() => {
            setOpenDialog(false);
            setEditingUser(null);
          }}
          initialData={editingUser}
        />
      </Dialog>
    </div>
  );
}

export default Users; 