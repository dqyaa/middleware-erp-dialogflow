const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API key
const API_KEY = 'e6bb4ee8968f63c';

// API secret
const API_SECRET = 'a47b875be0846be';

//  route for the root path "/"
app.get('/', (req, res) => {
  res.send('Hello from the middleware!');
});

// Endpoint to handle requests from Dialogflow
app.post('/webhook', async (req, res) => {
  try {
    // Extract lead information from the request body
    const { first_name, status, company_name } = req.body.queryResult.parameters;

    // Make a request to ERPNext API to create a new lead record
    const response = await axios.post('http://128.199.233.173:8002/api/resource/Lead', {
      data: {
        first_name,
        status,
        company_name
        
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}:${API_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    // Handle successful response from ERPNext
    console.log('Lead created successfully:', response.data);
    res.json({ fulfillmentText: 'Lead created successfully!' });
  } catch (error) {
    // Handle errors
    console.error('Error creating lead:', error);
    res.status(500).json({ fulfillmentText: 'An error occurred while creating the lead.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
