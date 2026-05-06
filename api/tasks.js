// Vercel Serverless Function for Task Management
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
    // In-memory database for demo
    let tasks = [
      {
        id: 1,
        title: 'Follow up with ABC Corporation',
        description: 'Call client regarding website development proposal',
        assignedTo: 'admin@dhanavruksha.com',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'pending',
        createdBy: 'admin@dhanavruksha.com',
        createdDate: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Prepare sales report',
        description: 'Monthly sales performance report for management',
        assignedTo: 'admin@dhanavruksha.com',
        priority: 'medium',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        status: 'in-progress',
        createdBy: 'admin@dhanavruksha.com',
        createdDate: new Date().toISOString()
      }
    ];

    const { method } = req;
    const { query } = req;

    switch (method) {
      case 'GET':
        // Get all tasks or specific task
        if (query.id) {
          const task = tasks.find(t => t.id === parseInt(query.id));
          res.status(200).json(task || null);
        } else {
          res.status(200).json(tasks);
        }
        break;

      case 'POST':
        // Create new task
        const { title, description, assignedTo, priority, dueDate } = req.body;
        const newTask = {
          id: Date.now(),
          title,
          description,
          assignedTo,
          priority: priority || 'medium',
          dueDate,
          status: 'pending',
          createdBy: 'admin@dhanavruksha.com',
          createdDate: new Date().toISOString()
        };
        tasks.push(newTask);
        res.status(201).json(newTask);
        break;

      case 'PUT':
        // Update task
        const { id, ...updateData } = req.body;
        const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
        if (taskIndex !== -1) {
          tasks[taskIndex] = { ...tasks[taskIndex], ...updateData };
          res.status(200).json(tasks[taskIndex]);
        } else {
          res.status(404).json({ error: 'Task not found' });
        }
        break;

      case 'DELETE':
        // Delete task
        const { id: deleteId } = req.body;
        const deleteIndex = tasks.findIndex(t => t.id === parseInt(deleteId));
        if (deleteIndex !== -1) {
          tasks.splice(deleteIndex, 1);
          res.status(204).end();
        } else {
          res.status(404).json({ error: 'Task not found' });
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
