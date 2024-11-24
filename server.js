const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Store connected clients
const clients = new Set();

server.use(middlewares);

// Custom route for SSE
server.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial data
  const initialData = router.db.getState();
  res.write(`data: ${JSON.stringify({ type: 'INITIAL', data: initialData })}\n\n`);

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  // Add client to connected clients
  clients.add(res);

  // Clean up on connection close
  req.on('close', () => {
    clearInterval(keepAlive);
    clients.delete(res);
  });
});

// Middleware to broadcast changes
router.render = (req, res) => {
  const data = res.locals.data;
  const path = req.path;
  const method = req.method;

  // Broadcast to all clients
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({
      type: method === 'POST' ? 'CREATED' : method === 'PUT' ? 'UPDATED' : 'DELETED',
      path,
      data
    })}\n\n`);
  });

  return res.json(data);
};

// Add this before server.use(router)
server.delete('/bulk/:resource', jsonServer.bodyParser, (req, res) => {
  const { resource } = req.params;
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'ids must be an array' });
  }

  try {
    const db = router.db;
    const collection = db.get(resource);
    
    // Convert string IDs to numbers if necessary
    const numericIds = ids.map(id => Number(id));
    
    // Remove items
    numericIds.forEach(id => {
      collection.remove({ id }).write();
    });

    // Get updated collection
    const updatedCollection = collection.value();

    // Notify clients about the change
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify({
        type: 'BULK_DELETED',
        resource,
        ids: numericIds,
        data: updatedCollection
      })}\n\n`);
    });

    return res.json({ success: true, deletedIds: numericIds });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return res.status(500).json({ error: 'Failed to delete items' });
  }
});

server.use(router);

server.listen(3001, () => {
  console.log('JSON Server with SSE is running on port 3001');
}); 