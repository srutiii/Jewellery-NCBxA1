import fetch from 'node-fetch';
import { odooConfig, formatCustomerForOdoo } from '../config/odoo-config.js';
import { getOdooConfig } from '../config/odoo-env.js';

class OdooService {
  constructor() {
    this.sessionId = null;
    const envConfig = getOdooConfig();
    this.baseUrl = envConfig.baseUrl;
    this.database = envConfig.database;
    this.username = envConfig.username;
    this.password = envConfig.password;
    this.apiKey = envConfig.apiKey;
  }

  // Authenticate with Odoo
  async authenticate() {
    try {
      console.log('🔐 Authenticating with Odoo...');
      console.log('Base URL:', this.baseUrl);
      console.log('Database:', this.database);
      console.log('Username:', this.username);
      
      const authData = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: this.database,
          login: this.username,
          password: this.password
        },
        id: Math.floor(Math.random() * 1000000)
      };

      const response = await fetch(`${this.baseUrl}/web/session/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(authData)
      });

      const result = await response.json();
      console.log('Odoo auth response:', result);
      
      if (result.result && result.result.uid) {
        // Extract session ID from cookies
        const cookies = response.headers.get('set-cookie');
        if (cookies) {
          const sessionMatch = cookies.match(/session_id=([^;]+)/);
          if (sessionMatch) {
            this.sessionId = sessionMatch[1];
            console.log('✅ Odoo authentication successful');
            return true;
          }
        }
      }
      
      console.error('❌ Odoo authentication failed:', result);
      return false;
    } catch (error) {
      console.error('❌ Error authenticating with Odoo:', error);
      return false;
    }
  }

  // Make JSON-RPC call to Odoo
  async makeRpcCall(model, method, args = [], kwargs = {}) {
    try {
      // Ensure we're authenticated
      if (!this.sessionId) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          throw new Error('Failed to authenticate with Odoo');
        }
      }

      const rpcData = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: model,
          method: method,
          args: args,
          kwargs: kwargs
        },
        id: Math.floor(Math.random() * 1000000)
      };

      const response = await fetch(`${this.baseUrl}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `session_id=${this.sessionId}`
        },
        body: JSON.stringify(rpcData)
      });

      const result = await response.json();
      
      if (result.error) {
        console.error('Odoo RPC error:', result.error);
        throw new Error(result.error.message || 'Odoo RPC call failed');
      }
      
      return result.result;
    } catch (error) {
      console.error('Error making RPC call to Odoo:', error);
      throw error;
    }
  }

  // Create a customer in Odoo
  async createCustomer(customerData) {
    try {
      const odooData = formatCustomerForOdoo(customerData);
      
      const result = await this.makeRpcCall(
        odooConfig.models.customers,
        'create',
        [odooData]
      );
      
      console.log('Customer created in Odoo with ID:', result);
      return result;
    } catch (error) {
      console.error('Error creating customer in Odoo:', error);
      throw error;
    }
  }

  // Update a customer in Odoo
  async updateCustomer(odooId, customerData) {
    try {
      const odooData = formatCustomerForOdoo(customerData);
      
      const result = await this.makeRpcCall(
        odooConfig.models.customers,
        'write',
        [[odooId], odooData]
      );
      
      console.log('Customer updated in Odoo:', result);
      return result;
    } catch (error) {
      console.error('Error updating customer in Odoo:', error);
      throw error;
    }
  }

  // Delete a customer in Odoo
  async deleteCustomer(odooId) {
    try {
      const result = await this.makeRpcCall(
        odooConfig.models.customers,
        'unlink',
        [[odooId]]
      );
      
      console.log('Customer deleted from Odoo:', result);
      return result;
    } catch (error) {
      console.error('Error deleting customer from Odoo:', error);
      throw error;
    }
  }

  // Search for a customer in Odoo by email or phone
  async searchCustomer(email, phone) {
    try {
      const domain = [];
      
      if (email) {
        domain.push(['email', '=', email]);
      }
      
      if (phone) {
        domain.push(['phone', '=', phone]);
      }
      
      if (domain.length === 0) {
        return [];
      }
      
      const result = await this.makeRpcCall(
        odooConfig.models.customers,
        'search_read',
        [],
        {
          domain: domain,
          fields: ['id', 'name', 'email', 'phone', 'comment']
        }
      );
      
      return result;
    } catch (error) {
      console.error('Error searching customer in Odoo:', error);
      return [];
    }
  }

  // Get customer by ID from Odoo
  async getCustomerById(odooId) {
    try {
      const result = await this.makeRpcCall(
        odooConfig.models.customers,
        'read',
        [[odooId]],
        {
          fields: ['id', 'name', 'email', 'phone', 'comment', 'street', 'city']
        }
      );
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting customer from Odoo:', error);
      return null;
    }
  }

  // Create a lead/opportunity in Odoo CRM
  async createLead(customerData, firebaseId) {
    try {
      const leadData = {
        name: `${customerData.full_name} - ${customerData.occasion_for_purchase}`,
        partner_name: customerData.full_name,
        email_from: customerData.email_address || '',
        phone: customerData.contact_number || '',
        street: customerData.address || '',
        city: customerData.location || customerData.community || '',
        description: this.formatLeadDescription(customerData),
        lead_source: customerData.lead_source || 'Website',
        type: 'opportunity',
        stage_id: 1, // New stage (adjust based on your Odoo setup)
        user_id: false, // Assign to current user or specific user
        team_id: false, // Assign to specific team
        priority: '1', // Normal priority
        probability: 10, // 10% probability
        expected_revenue: this.extractBudget(customerData.budget_mentioned),
        date_deadline: this.calculateDeadline(customerData.occasion_for_purchase),
        tag_ids: false,
        campaign_id: false,
        source_id: false,
        medium_id: false,
        x_firebase_id: firebaseId // Custom field to store Firebase ID
      };

      const result = await this.makeRpcCall(
        odooConfig.models.leads,
        'create',
        [leadData]
      );
      
      console.log('Lead created in Odoo CRM with ID:', result);
      return result;
    } catch (error) {
      console.error('Error creating lead in Odoo CRM:', error);
      throw error;
    }
  }

  // Format lead description from customer data
  formatLeadDescription(customerData) {
    let description = `Customer Details:\n`;
    description += `Name: ${customerData.full_name}\n`;
    description += `Contact: ${customerData.contact_number}\n`;
    description += `Email: ${customerData.email_address || 'N/A'}\n`;
    description += `Occasion: ${customerData.occasion_for_purchase}\n`;
    description += `Budget: ${customerData.budget_mentioned || 'N/A'}\n`;
    description += `Location: ${customerData.location || customerData.community || 'N/A'}\n`;
    
    if (customerData.items_shown_or_discussed) {
      description += `\nItems Discussed: ${customerData.items_shown_or_discussed}\n`;
    }
    
    if (customerData.expressed_interest_or_intent) {
      description += `Interest/Intent: ${customerData.expressed_interest_or_intent}\n`;
    }
    
    if (customerData.notes) {
      description += `\nNotes: ${customerData.notes}\n`;
    }
    
    return description;
  }

  // Extract budget amount from budget string
  extractBudget(budgetString) {
    if (!budgetString) return 0;
    
    const numbers = budgetString.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return parseFloat(numbers[0]) * 1000; // Convert to actual amount
    }
    
    return 0;
  }

  // Calculate deadline based on occasion
  calculateDeadline(occasion) {
    const today = new Date();
    let deadline = new Date(today);
    
    switch (occasion.toLowerCase()) {
      case 'engagement':
        deadline.setDate(today.getDate() + 30);
        break;
      case 'wedding':
        deadline.setDate(today.getDate() + 60);
        break;
      case 'anniversary':
        deadline.setDate(today.getDate() + 14);
        break;
      case 'birthday':
        deadline.setDate(today.getDate() + 7);
        break;
      default:
        deadline.setDate(today.getDate() + 14);
    }
    
    return deadline.toISOString().split('T')[0];
  }
}

export default OdooService;
