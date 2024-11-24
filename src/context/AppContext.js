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
    setupRealtimeUpdates();
  }, []);

  const setupRealtimeUpdates = () => {
    const eventSource = new EventSource('http://localhost:3001/api/events');
    
    eventSource.onmessage = (event) => {
      const { type, path, data } = JSON.parse(event.data);
      
      switch (type) {
        case 'INITIAL':
          updateData(data);
          break;
        case 'CREATED':
        case 'UPDATED':
        case 'DELETED':
          if (path.includes('/users')) {
            setUsers(data);
          } else if (path.includes('/roles')) {
            setRoles(data);
          } else if (path.includes('/permissions')) {
            setPermissions(data);
          }
          break;
        default:
          console.log('Unknown event type:', type);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
      // Retry connection after 5 seconds
      setTimeout(setupRealtimeUpdates, 5000);
    };

    return () => eventSource.close();
  };

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

  const updateData = (data) => {
    if (data.users) setUsers(data.users);
    if (data.roles) setRoles(data.roles);
    if (data.permissions) setPermissions(data.permissions);
    updateStats(
      data.users || users,
      data.roles || roles,
      data.permissions || permissions
    );
  };

  const updateStats = (currentUsers, currentRoles, currentPermissions) => {
    setStats({
      totalUsers: currentUsers.length,
      activeRoles: currentRoles.length,
      totalPermissions: currentPermissions.length,
      activeSessions: currentUsers.filter(user => user.status === 'Active').length,
    });
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext); 