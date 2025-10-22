import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import customerRoutes from './routes/customers.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/customers', customerRoutes);

// Serve Swagger documentation
app.get('/api-docs', (req, res) => {
  const swaggerPath = path.join(__dirname, '../swagger.json');
  const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  res.json(swaggerDoc);
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Jewellery Customer API',
    endpoints: [
      { method: 'GET', path: '/customers', description: 'Get all customers' },
      { method: 'GET', path: '/customers/:id', description: 'Get a specific customer by ID' },
      { method: 'POST', path: '/customers', description: 'Create a new customer' },
      { method: 'PUT', path: '/customers/:id', description: 'Update a customer' },
      { method: 'DELETE', path: '/customers/:id', description: 'Delete a customer' }
    ],
    documentation: '/api-docs'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});