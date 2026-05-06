// Vercel Serverless Function for User Management
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // In-memory database for demo (replace with real database in production)
    const users = [
      {
        id: 'USR-001',
        name: 'Admin User',
        email: 'admin@dhanavruksha.com',
        role: 'admin',
        status: 'active',
        password: 'admin123',
        createdDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    ];

    const { method } = req;
    const { query } = req;

    switch (method) {
      case 'GET':
        // Get all users or specific user
        if (query.id) {
          const user = users.find(u => u.id === query.id);
          res.status(200).json(user || null);
        } else {
          res.status(200).json(users);
        }
        break;

      case 'POST':
        // Create new user
        const { name, email, password, role } = req.body;
        const newUser = {
          id: `USR-${Date.now()}`,
          name,
          email,
          password,
          role: role || 'user',
          status: 'active',
          createdDate: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        users.push(newUser);
        res.status(201).json(newUser);
        break;

      case 'PUT':
        // Update user
        const { id, ...updateData } = req.body;
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updateData };
          res.status(200).json(users[userIndex]);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
        break;

      case 'DELETE':
        // Delete user
        const { id: deleteId } = req.body;
        const deleteIndex = users.findIndex(u => u.id === deleteId);
        if (deleteIndex !== -1) {
          users.splice(deleteIndex, 1);
          res.status(204).end();
        } else {
          res.status(404).json({ error: 'User not found' });
        }
        break;

      default:
        res.setHeader('Allow', 'GET, POST, PUT, DELETE');
        res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
