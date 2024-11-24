import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeRoles: 0,
    totalPermissions: 0,
    activeSessions: 0,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [usersData, rolesData, permissionsData] = await Promise.all([
        api.getUsers(),
        api.getRoles(),
        api.getPermissions()
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setPermissions(permissionsData);
      
      updateStats(usersData, rolesData, permissionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const updateStats = (currentUsers, currentRoles, currentPermissions) => {
    setStats({
      totalUsers: currentUsers.length,
      activeRoles: currentRoles.length,
      totalPermissions: currentPermissions.length,
      activeSessions: currentUsers.filter(user => user.status === 'Active').length,
    });
  };

  const refreshData = () => {
    loadAllData();
  };

  return (
    <AppContext.Provider value={{
      users,
      setUsers,
      roles,
      setRoles,
      permissions,
      setPermissions,
      stats,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext); 