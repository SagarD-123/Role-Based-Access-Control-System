export const initialUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'Active',
  },
];

export const initialRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access',
    permissions: ['users_read', 'users_write', 'roles_read', 'roles_write', 'permissions_read', 'permissions_write'],
  },
  {
    id: 2,
    name: 'Editor',
    description: 'Content management access',
    permissions: ['users_read', 'roles_read', 'permissions_read'],
  },
];

export const initialPermissions = [
  { id: 1, name: 'users_read', description: 'View users' },
  { id: 2, name: 'users_write', description: 'Modify users' },
  { id: 3, name: 'roles_read', description: 'View roles' },
  { id: 4, name: 'roles_write', description: 'Modify roles' },
  { id: 5, name: 'permissions_read', description: 'View permissions' },
  { id: 6, name: 'permissions_write', description: 'Modify permissions' },
];

export const roles = initialRoles.map(role => role.name);

export const addPermission = (permission) => {
  const newPermission = { 
    ...permission, 
    id: Date.now() 
  };
  initialPermissions.push(newPermission);
  updateRolesPermissions();
  return newPermission;
};

export const updatePermission = (id, updatedPermission) => {
  const index = initialPermissions.findIndex(p => p.id === id);
  if (index !== -1) {
    const updated = { 
      ...initialPermissions[index], 
      ...updatedPermission,
      id: id
    };
    initialPermissions[index] = updated;
    updateRolesPermissions();
    return updated;
  }
  return null;
};

export const deletePermission = (id) => {
  const index = initialPermissions.findIndex(p => p.id === id);
  if (index !== -1) {
    initialPermissions.splice(index, 1);
    updateRolesPermissions();
    return true;
  }
  return false;
};

const updateRolesPermissions = () => {
  initialRoles.forEach(role => {
    role.permissions = role.permissions.filter(
      permName => initialPermissions.some(p => p.name === permName)
    );
  });
};

export const getAvailableRoles = () => initialRoles.map(role => role.name);

export const getAvailablePermissions = () => initialPermissions.map(permission => ({
  name: permission.name,
  description: permission.description
})); 