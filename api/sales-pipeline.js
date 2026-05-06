// Vercel Serverless Function for Sales Pipeline
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
    // In-memory database for demo
    let deals = [
      {
        id: 1,
        clientName: 'ABC Corporation',
        dealName: 'Website Development',
        value: 250000,
        probability: 75,
        stage: 'proposal',
        expectedCloseDate: new Date(Date.now() + 2592000000).toISOString().split('T')[0],
        assignedTo: 'admin@dhanavruksha.com',
        createdBy: 'admin@dhanavruksha.com',
        createdDate: new Date().toISOString()
      },
      {
        id: 2,
        clientName: 'XYZ Solutions',
        dealName: 'Mobile App Development',
        value: 150000,
        probability: 50,
        stage: 'negotiation',
        expectedCloseDate: new Date(Date.now() + 5184000000).toISOString().split('T')[0],
        assignedTo: 'admin@dhanavruksha.com',
        createdBy: 'admin@dhanavruksha.com',
        createdDate: new Date().toISOString()
      }
    ];

    const { method } = req;
    const { query } = req;

    switch (method) {
      case 'GET':
        // Get all deals or specific deal
        if (query.id) {
          const deal = deals.find(d => d.id === parseInt(query.id));
          res.status(200).json(deal || null);
        } else {
          res.status(200).json(deals);
        }
        break;

      case 'POST':
        // Create new deal
        const { clientName, dealName, value, probability = 25, stage = 'qualification', expectedCloseDate, assignedTo } = req.body;
        const newDeal = {
          id: Date.now(),
          clientName,
          dealName,
          value,
          probability,
          stage,
          expectedCloseDate,
          assignedTo,
          createdBy: 'admin@dhanavruksha.com',
          createdDate: new Date().toISOString()
        };
        deals.push(newDeal);
        res.status(201).json(newDeal);
        break;

      case 'PUT':
        // Update deal
        const { id, ...updateData } = req.body;
        const dealIndex = deals.findIndex(d => d.id === parseInt(id));
        if (dealIndex !== -1) {
          deals[dealIndex] = { ...deals[dealIndex], ...updateData };
          res.status(200).json(deals[dealIndex]);
        } else {
          res.status(404).json({ error: 'Deal not found' });
        }
        break;

      case 'DELETE':
        // Delete deal
        const { id: deleteId } = req.body;
        const deleteIndex = deals.findIndex(d => d.id === parseInt(deleteId));
        if (deleteIndex !== -1) {
          deals.splice(deleteIndex, 1);
          res.status(204).end();
        } else {
          res.status(404).json({ error: 'Deal not found' });
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
