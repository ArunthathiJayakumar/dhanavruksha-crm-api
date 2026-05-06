// Vercel Serverless Function for Client Management
export default async function handler(req, res) {
  // Enable CORS for GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // In-memory database for demo (replace with real database)
    let clients = [
      {
        id: 1,
        name: 'ABC Corporation',
        email: 'contact@abc.com',
        phone: '+91 9876543210',
        company: 'ABC Corporation',
        status: 'active',
        assignedTo: 'admin@dhanavruksha.com',
        meetings: [
          {
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            type: 'Initial Meeting',
            notes: 'Discussed website requirements and budget of ₹2,50,000',
            nextAction: 'Send detailed proposal'
          }
        ],
        createdBy: 'admin@dhanavruksha.com',
        createdDate: new Date().toISOString()
      },
      {
        id: 2,
        name: 'XYZ Solutions',
        email: 'info@xyz.com',
        phone: '+91 9876543211',
        company: 'XYZ Solutions',
        status: 'lead',
        assignedTo: 'admin@dhanavruksha.com',
        meetings: [],
        createdBy: 'admin@dhanavruksha.com',
        createdDate: new Date().toISOString()
      }
    ];

    const { method } = req;
    const { query } = req;

    switch (method) {
      case 'GET':
        // Get all clients or specific client
        if (query.id) {
          const client = clients.find(c => c.id === parseInt(query.id));
          res.status(200).json(client || null);
        } else {
          res.status(200).json(clients);
        }
        break;

      case 'POST':
        // Create new client
        const { name, email, phone, company, status = 'lead', assignedTo } = req.body;
        const newClient = {
          id: Date.now(),
          name,
          email,
          phone,
          company,
          status,
          assignedTo,
          meetings: [],
          createdBy: 'admin@dhanavruksha.com',
          createdDate: new Date().toISOString()
        };
        clients.push(newClient);
        res.status(201).json(newClient);
        break;

      case 'PUT':
        // Update client
        const { id, ...updateData } = req.body;
        const clientIndex = clients.findIndex(c => c.id === parseInt(id));
        if (clientIndex !== -1) {
          clients[clientIndex] = { ...clients[clientIndex], ...updateData };
          res.status(200).json(clients[clientIndex]);
        } else {
          res.status(404).json({ error: 'Client not found' });
        }
        break;

      case 'DELETE':
        // Delete client
        const { id: deleteId } = req.body;
        const deleteIndex = clients.findIndex(c => c.id === parseInt(deleteId));
        if (deleteIndex !== -1) {
          clients.splice(deleteIndex, 1);
          res.status(204).end();
        } else {
          res.status(404).json({ error: 'Client not found' });
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
