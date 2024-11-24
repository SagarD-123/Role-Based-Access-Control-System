module.exports = (req, res, next) => {
  if (req.method === 'POST') {
    if (req.path === '/users') {
      const { name, email, role } = req.body;
      
      if (!name || !email || !role) {
        return res.status(400).json({
          error: 'Name, email and role are required'
        });
      }

      req.body.status = req.body.status || 'Active';
      req.body.createdAt = Date.now();
    }
    
    if (req.path === '/roles') {
      const { name, permissions } = req.body;
      
      if (!name || !permissions) {
        return res.status(400).json({
          error: 'Name and permissions are required'
        });
      }
    }
    
    if (req.path === '/permissions') {
      const { name, description } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({
          error: 'Name and description are required'
        });
      }
      
      // Ensure permission name follows the convention
      if (!/^[a-z_]+$/.test(name)) {
        return res.status(400).json({
          error: 'Permission name must be lowercase with underscores only'
        });
      }

      // Check for duplicate permission names
      const permissions = router.db.get('permissions').value();
      if (permissions.some(p => p.name === name && p.id !== req.params.id)) {
        return res.status(400).json({
          error: 'Permission name must be unique'
        });
      }
    }
  }
  next();
}; 