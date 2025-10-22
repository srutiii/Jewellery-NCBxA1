import OdooService from '../services/odooService.js';

// Odoo Customer model for CRM synchronization
class OdooCustomer {
  constructor() {
    this.odooService = new OdooService();
  }

  // Create customer in Odoo CRM
  async createCustomer(customerData, firebaseId) {
    try {
      // Create customer/partner in Odoo
      const customerId = await this.odooService.createCustomer(customerData);
      
      // Create lead/opportunity in CRM
      const leadId = await this.odooService.createLead(customerData, firebaseId);
      
      return {
        customerId,
        leadId,
        success: true
      };
    } catch (error) {
      console.error('Error creating customer in Odoo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update customer in Odoo CRM
  async updateCustomer(odooCustomerId, customerData, firebaseId) {
    try {
      // Update customer/partner in Odoo
      const updateResult = await this.odooService.updateCustomer(odooCustomerId, customerData);
      
      // Search for existing lead with Firebase ID
      const existingLeads = await this.odooService.makeRpcCall(
        'crm.lead',
        'search_read',
        [],
        {
          domain: [['x_firebase_id', '=', firebaseId]],
          fields: ['id', 'name', 'description']
        }
      );
      
      let leadId = null;
      if (existingLeads.length > 0) {
        // Update existing lead
        const leadData = {
          name: `${customerData.full_name} - ${customerData.occasion_for_purchase}`,
          partner_name: customerData.full_name,
          email_from: customerData.email_address || '',
          phone: customerData.contact_number || '',
          street: customerData.address || '',
          city: customerData.location || customerData.community || '',
          description: this.odooService.formatLeadDescription(customerData),
          expected_revenue: this.odooService.extractBudget(customerData.budget_mentioned),
          date_deadline: this.odooService.calculateDeadline(customerData.occasion_for_purchase)
        };
        
        await this.odooService.makeRpcCall(
          'crm.lead',
          'write',
          [[existingLeads[0].id], leadData]
        );
        
        leadId = existingLeads[0].id;
      } else {
        // Create new lead if none exists
        leadId = await this.odooService.createLead(customerData, firebaseId);
      }
      
      return {
        customerId: odooCustomerId,
        leadId,
        success: true
      };
    } catch (error) {
      console.error('Error updating customer in Odoo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete customer from Odoo CRM
  async deleteCustomer(odooCustomerId, firebaseId) {
    try {
      // Delete customer/partner
      const deleteResult = await this.odooService.deleteCustomer(odooCustomerId);
      
      // Find and delete associated leads
      const existingLeads = await this.odooService.makeRpcCall(
        'crm.lead',
        'search',
        [['x_firebase_id', '=', firebaseId]]
      );
      
      if (existingLeads.length > 0) {
        await this.odooService.makeRpcCall(
          'crm.lead',
          'unlink',
          [existingLeads]
        );
      }
      
      return {
        success: true,
        deletedLeads: existingLeads.length
      };
    } catch (error) {
      console.error('Error deleting customer from Odoo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for existing customer in Odoo
  async searchExistingCustomer(email, phone) {
    try {
      const customers = await this.odooService.searchCustomer(email, phone);
      return customers.length > 0 ? customers[0] : null;
    } catch (error) {
      console.error('Error searching customer in Odoo:', error);
      return null;
    }
  }

  // Get customer by Odoo ID
  async getCustomerById(odooId) {
    try {
      return await this.odooService.getCustomerById(odooId);
    } catch (error) {
      console.error('Error getting customer from Odoo:', error);
      return null;
    }
  }

  // Sync customer data to Odoo (used by middleware)
  async syncToOdoo(operation, customerData, firebaseId, odooCustomerId = null) {
    try {
      switch (operation) {
        case 'create':
          return await this.createCustomer(customerData, firebaseId);
          
        case 'update':
          if (!odooCustomerId) {
            // Try to find existing customer
            const existingCustomer = await this.searchExistingCustomer(
              customerData.email_address || customerData.email,
              customerData.contact_number || customerData.phone
            );
            
            if (existingCustomer) {
              odooCustomerId = existingCustomer.id;
            } else {
              // Create new customer if not found
              return await this.createCustomer(customerData, firebaseId);
            }
          }
          
          return await this.updateCustomer(odooCustomerId, customerData, firebaseId);
          
        case 'delete':
          if (odooCustomerId) {
            return await this.deleteCustomer(odooCustomerId, firebaseId);
          }
          return { success: true, message: 'No Odoo customer ID provided' };
          
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      console.error(`Error syncing ${operation} operation to Odoo:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default OdooCustomer;
