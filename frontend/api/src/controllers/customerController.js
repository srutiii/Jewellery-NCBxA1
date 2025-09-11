import Customer from '../models/customer.js';

// Controller for customer operations
const customerController = {
  // Get all customers
  getAllCustomers: (req, res) => {
    try {
      const customers = Customer.getAll();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  },

  // Get a specific customer by ID
  getCustomerById: (req, res) => {
    try {
      const { id } = req.params;
      const customer = Customer.getById(id);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      res.json(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  },

  // Create a new customer
  createCustomer: (req, res) => {
    try {
      const { email_address, email } = req.body;
      const emailToCheck = email_address || email;
      
      // Check if email already exists
      if (emailToCheck && Customer.emailExists(emailToCheck)) {
        return res.status(400).json({ 
          error: 'Email address already exists',
          field: 'email_address',
          message: 'A customer with this email address already exists. Please use a different email or leave it empty.'
        });
      }
      
      const newCustomer = new Customer(req.body);
      const savedCustomer = newCustomer.save();
      
      if (!savedCustomer) {
        return res.status(500).json({ error: 'Failed to save customer' });
      }
      
      res.status(201).json(savedCustomer);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  },

  // Update an existing customer
  updateCustomer: (req, res) => {
    try {
      const { id } = req.params;
      const existingCustomer = Customer.getById(id);
      
      if (!existingCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      const { email_address, email } = req.body;
      const emailToCheck = email_address || email;
      
      // Check if email already exists (excluding current customer)
      if (emailToCheck && Customer.emailExists(emailToCheck, id)) {
        return res.status(400).json({ 
          error: 'Email address already exists',
          field: 'email_address',
          message: 'A customer with this email address already exists. Please use a different email or leave it empty.'
        });
      }
      
      // Merge existing customer with updates
      const updatedCustomer = new Customer({
        ...existingCustomer,
        ...req.body,
        id // Ensure ID remains the same
      });
      
      const result = updatedCustomer.update();
      
      if (!result) {
        return res.status(500).json({ error: 'Failed to update customer' });
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: 'Failed to update customer' });
    }
  },

  // Delete a customer
  deleteCustomer: (req, res) => {
    try {
      const { id } = req.params;
      const existingCustomer = Customer.getById(id);
      
      if (!existingCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      const deleted = Customer.delete(id);
      
      if (!deleted) {
        return res.status(500).json({ error: 'Failed to delete customer' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  }
};

export default customerController;