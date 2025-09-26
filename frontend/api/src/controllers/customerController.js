import FirebaseCustomer from '../models/firebaseCustomer.js';

// Controller for customer operations
const customerController = {
  // Get all customers
  getAllCustomers: async (req, res) => {
    try {
      const customers = await FirebaseCustomer.getAll();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  },

  // Get a specific customer by ID
  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await FirebaseCustomer.getById(id);
      
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
  createCustomer: async (req, res) => {
    try {

      const { email_address, email } = req.body;
      const emailToCheck = email_address || email;
      
      // Check if email already exists
      if (emailToCheck && await FirebaseCustomer.emailExists(emailToCheck)) {
        return res.status(400).json({ 
          error: 'Email address already exists',
          field: 'email_address',
          message: 'A customer with this email address already exists. Please use a different email or leave it empty.'
        });
      }
      
      const newCustomer = new FirebaseCustomer(req.body);
      const savedCustomer = await newCustomer.save();
      
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
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const existingCustomer = await FirebaseCustomer.getById(id);
      
      if (!existingCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      const { email_address, email } = req.body;
      const emailToCheck = email_address || email;
      
      // Check if email already exists (excluding current customer)
      if (emailToCheck && await FirebaseCustomer.emailExists(emailToCheck, id)) {
        return res.status(400).json({ 
          error: 'Email address already exists',
          field: 'email_address',
          message: 'A customer with this email address already exists. Please use a different email or leave it empty.'
        });
      }
      
      // Merge existing customer with updates
      const updatedCustomer = new FirebaseCustomer({
        ...existingCustomer,
        ...req.body,
        id // Ensure ID remains the same
      });
      
      const result = await updatedCustomer.update();
      
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
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const existingCustomer = await FirebaseCustomer.getById(id);
      
      if (!existingCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      const deleted = await FirebaseCustomer.delete(id);
      
      if (!deleted) {
        return res.status(500).json({ error: 'Failed to delete customer' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  },

  // Check email availability
  checkEmailAvailability: async (req, res) => {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.json({ available: true });
      }
      
      const emailExists = await FirebaseCustomer.emailExists(email);
      res.json({ available: !emailExists });
    } catch (error) {
      console.error('Error checking email availability:', error);
      res.status(500).json({ error: 'Failed to check email availability' });
    }
  }
};

export default customerController;