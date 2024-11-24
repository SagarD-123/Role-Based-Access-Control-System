import axios from 'axios';
import { 
  initialPermissions, 
  addPermission, 
  updatePermission as updateMockPermission,
  deletePermission as deleteMockPermission
} from './mockData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://json-server-rbac.onrender.com';

const api = {
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },
  createUser: (userData) =>
    axios.post(`${API_BASE_URL}/users`, userData)
      .then(res => res.data),
      
  updateUser: (id, userData) =>
    axios.put(`${API_BASE_URL}/users/${id}`, userData)
      .then(res => res.data),
      
  deleteUser: (id) =>
    axios.delete(`${API_BASE_URL}/users/${id}`)
      .then(res => res.data),

  getRoles: () =>
    axios.get(`${API_BASE_URL}/roles`)
      .then(res => res.data),

  createRole: (roleData) =>
    axios.post(`${API_BASE_URL}/roles`, roleData)
      .then(res => res.data),

  updateRole: (id, roleData) =>
    axios.put(`${API_BASE_URL}/roles/${id}`, roleData)
      .then(res => res.data),

  deleteRole: (id) =>
    axios.delete(`${API_BASE_URL}/roles/${id}`)
      .then(res => res.data),

  getPermissions: () =>
    axios.get(`${API_BASE_URL}/permissions`)
      .then(res => res.data),

  createPermission: (permissionData) =>
    axios.post(`${API_BASE_URL}/permissions`, permissionData)
      .then(res => res.data),

  updatePermission: (id, permissionData) =>
    axios.put(`${API_BASE_URL}/permissions/${id}`, permissionData)
      .then(res => res.data),

  deletePermission: (id) =>
    axios.delete(`${API_BASE_URL}/permissions/${id}`)
      .then(res => res.data),

  // Bulk delete users
  bulkDeleteUsers: async (ids) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/bulk/users`, {
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
      const response = await axios.delete(`${API_BASE_URL}/bulk/roles`, {
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