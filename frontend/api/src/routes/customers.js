import express from 'express';
import customerController from '../controllers/customerController.js';
import { validateCustomer } from '../middleware/validation.js';

const router = express.Router();

// GET all customers
router.get('/', customerController.getAllCustomers);

// GET a specific customer by ID
router.get('/:id', customerController.getCustomerById);

// POST create a new customer
router.post('/', validateCustomer, customerController.createCustomer);

// PUT update a customer
router.put('/:id', validateCustomer, customerController.updateCustomer);

// DELETE a customer
router.delete('/:id', customerController.deleteCustomer);

// GET check email availability
router.get('/email/check/:email', customerController.checkEmailAvailability);

export default router;