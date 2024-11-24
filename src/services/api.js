import axios from 'axios';

const API_BASE_URL = 'https://json-server-rbac.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const api = {
  // Users endpoints
  getUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  bulkDeleteUsers: async (ids) => {
    try {
      const response = await axiosInstance.delete('/users', {
        data: { ids: ids.map(id => Number(id)) }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      throw error;
    }
  },

  // Roles endpoints
  getRoles: async () => {
    try {
      const response = await axiosInstance.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await axiosInstance.post('/roles', roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const response = await axiosInstance.put(`/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await axiosInstance.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },

  // Permissions endpoints
  getPermissions: async () => {
    try {
      const response = await axiosInstance.get('/permissions');
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },

  createPermission: async (permissionData) => {
    try {
      const response = await axiosInstance.post('/permissions', permissionData);
      return response.data;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  },

  updatePermission: async (id, permissionData) => {
    try {
      const response = await axiosInstance.put(`/permissions/${id}`, permissionData);
      return response.data;
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  },

  deletePermission: async (id) => {
    try {
      const response = await axiosInstance.delete(`/permissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting permission:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkDeleteRoles: async (ids) => {
    try {
      const response = await axiosInstance.delete('/roles', {
        data: { ids: ids.map(id => Number(id)) }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting roles:', error);
      throw error;
    }
  },

  bulkDeletePermissions: async (ids) => {
    try {
      const response = await axiosInstance.delete('/permissions', {
        data: { ids: ids.map(id => Number(id)) }
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting permissions:', error);
      throw error;
    }
  }
};

export default api; 