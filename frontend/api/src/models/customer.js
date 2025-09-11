import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file for data storage
const dataFilePath = path.join(__dirname, '../../data/customers.json');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8');
}

// Customer model
class Customer {
  constructor(data) {
    // Auto-generated fields
    this.id = data.id || uuidv4();
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = new Date().toISOString();
    
    // Required fields
    this.full_name = data.full_name;
    this.contact_number = data.contact_number || data.phone; // Support both new and old field name
    this.occasion_for_purchase = data.occasion_for_purchase || data.occasion; // Support both new and old field name
    
    // Optional fields
    this.email_address = data.email_address || data.email || null;
    this.address = data.address || null;
    this.community = data.community || null;
    this.sub_community = data.sub_community || null;
    this.date_of_birth = data.date_of_birth || data.dob || null;
    this.anniversary_date = data.anniversary_date || null;
    this.gender = data.gender || null;
    this.marital_status = data.marital_status || null;
    this.location = data.location || data.city || null;
    
    // Purchase history
    this.purchase_history = data.purchase_history || [];
    
    // Additional customer information
    this.gift_recipient_relationship = data.gift_recipient_relationship || null;
    this.items_shown_or_discussed = data.items_shown_or_discussed || null;
    this.expressed_interest_or_intent = data.expressed_interest_or_intent || null;
    this.in_store_query = data.in_store_query || null;
    this.budget_mentioned = data.budget_mentioned || data.budget || null;
    this.frequency_of_visit = data.frequency_of_visit || null;
    
    // Legacy fields for backward compatibility
    this.phone = this.contact_number;
    this.email = this.email_address;
    this.city = this.location;
    this.dob = this.date_of_birth;
    this.occasion = this.occasion_for_purchase;
    this.budget = this.budget_mentioned;
    
    // These fields will be kept for backward compatibility but may be deprecated in future
    this.diamond_shape = data.diamond_shape || null;
    this.first_visit = data.first_visit || null;
    this.lead_source = data.lead_source || null;
    this.notes = data.notes || null;
  }

  // Get all customers
  static getAll() {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading customers data:', error);
      return [];
    }
  }

  // Get customer by ID
  static getById(id) {
    const customers = this.getAll();
    return customers.find(customer => customer.id === id) || null;
  }

  // Get customer by email address
  static getByEmail(email) {
    if (!email) return null;
    const customers = this.getAll();
    return customers.find(customer => 
      customer.email_address === email || customer.email === email
    ) || null;
  }

  // Check if email already exists (excluding current customer for updates)
  static emailExists(email, excludeId = null) {
    if (!email) return false;
    const customers = this.getAll();
    return customers.some(customer => 
      customer.id !== excludeId && 
      (customer.email_address === email || customer.email === email)
    );
  }

  // Save all customers to file
  static saveAll(customers) {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(customers, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving customers data:', error);
      return false;
    }
  }

  // Create a new customer
  save() {
    const customers = Customer.getAll();
    customers.push(this);
    return Customer.saveAll(customers) ? this : null;
  }

  // Update an existing customer
  update() {
    const customers = Customer.getAll();
    const index = customers.findIndex(customer => customer.id === this.id);
    
    if (index !== -1) {
      customers[index] = this;
      return Customer.saveAll(customers) ? this : null;
    }
    
    return null;
  }

  // Delete a customer
  static delete(id) {
    const customers = this.getAll();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    
    if (filteredCustomers.length < customers.length) {
      return this.saveAll(filteredCustomers);
    }
    
    return false;
  }
}

export default Customer;