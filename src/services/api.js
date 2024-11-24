import axios from 'axios';
import { 
  initialPermissions, 
  addPermission, 
  updatePermission as updateMockPermission,
  deletePermission as deleteMockPermission
} from './mockData';

const API_URL = 'http://localhost:3001';

const api = {
  getUsers: () => 
    axios.get('http://localhost:3001/users')
      .then(res => res.data),
      
  createUser: (userData) =>
    axios.post('http://localhost:3001/users', userData)
      .then(res => res.data),
      
  updateUser: (id, userData) =>
    axios.put(`http://localhost:3001/users/${id}`, userData)
      .then(res => res.data),
      
  deleteUser: (id) =>
    axios.delete(`http://localhost:3001/users/${id}`)
      .then(res => res.data),

  getRoles: () =>
    axios.get('http://localhost:3001/roles')
      .then(res => res.data),

  createRole: (roleData) =>
    axios.post('http://localhost:3001/roles', roleData)
      .then(res => res.data),

  updateRole: (id, roleData) =>
    axios.put(`http://localhost:3001/roles/${id}`, roleData)
      .then(res => res.data),

  deleteRole: (id) =>
    axios.delete(`http://localhost:3001/roles/${id}`)
      .then(res => res.data),

  getPermissions: () =>
    axios.get('http://localhost:3001/permissions')
      .then(res => res.data),

  createPermission: (permissionData) =>
    axios.post('http://localhost:3001/permissions', permissionData)
      .then(res => res.data),

  updatePermission: (id, permissionData) =>
    axios.put(`http://localhost:3001/permissions/${id}`, permissionData)
      .then(res => res.data),

  deletePermission: (id) =>
    axios.delete(`http://localhost:3001/permissions/${id}`)
      .then(res => res.data),

  // Bulk delete users
  bulkDeleteUsers: async (ids) => {
    try {
      const response = await axios.delete(`${API_URL}/bulk/users`, {
        data: { ids: ids.map(id => Number(id)) }  // Ensure IDs are numbers
      });
      if (!response.data.success) {
        throw new Error('Failed to delete users');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete users');
    }
  },

  // Bulk delete roles
  bulkDeleteRoles: async (ids) => {
    try {
      const response = await axios.delete(`${API_URL}/bulk/roles`, {
        data: { ids: ids.map(id => Number(id)) }  // Ensure IDs are numbers
      });
      if (!response.data.success) {
        throw new Error('Failed to delete roles');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete roles');
    }
  },
};

export default api; 