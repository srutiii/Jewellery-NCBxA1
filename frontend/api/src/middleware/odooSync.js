import OdooCustomer from '../models/odooCustomer.js';
import { isOdooSyncEnabled } from '../config/odoo-env.js';

// Middleware for Odoo CRM synchronization
class OdooSyncMiddleware {
  constructor() {
    this.odooCustomer = new OdooCustomer();
    this.syncEnabled = isOdooSyncEnabled();
  }

  // Middleware function to sync customer data to Odoo after Firebase operations
  async syncToOdoo(req, res, next) {
    // Store original response methods
    const originalJson = res.json;
    const originalSend = res.send;
    const originalStatus = res.status;

    // Override res.json to intercept responses
    res.json = async function(data) {
      // Call original method first
      originalJson.call(this, data);

      // Only sync if operation was successful and sync is enabled
      if (this.statusCode >= 200 && this.statusCode < 300 && syncMiddleware.syncEnabled) {
        try {
          await syncMiddleware.handleSync(req, data);
        } catch (error) {
          console.error('Odoo sync error (non-blocking):', error);
          // Don't fail the main request if Odoo sync fails
        }
      }
    };

    // Override res.send for DELETE operations
    res.send = async function(data) {
      originalSend.call(this, data);

      // Handle DELETE operations (status 204)
      if (this.statusCode === 204 && syncMiddleware.syncEnabled) {
        try {
          await syncMiddleware.handleSync(req, null);
        } catch (error) {
          console.error('Odoo sync error (non-blocking):', error);
        }
      }
    };

    next();
  }

  // Handle synchronization based on HTTP method and response
  async handleSync(req, responseData) {
    const method = req.method.toLowerCase();
    const customerId = req.params.id;
    const customerData = req.body;

    console.log('🔄 Starting Odoo sync...');
    console.log('Method:', method);
    console.log('Customer ID:', customerId);
    console.log('Response Data:', responseData);

    try {
      let syncResult;

      switch (method) {
        case 'post':
          // CREATE operation
          if (responseData && responseData.id) {
            console.log('📝 Syncing CREATE operation to Odoo...');
            syncResult = await this.odooCustomer.syncToOdoo(
              'create',
              customerData,
              responseData.id
            );
            console.log('✅ Odoo CREATE sync result:', syncResult);
          } else {
            console.log('❌ No response data or ID for CREATE sync');
          }
          break;

        case 'put':
          // UPDATE operation
          if (responseData && responseData.id) {
            // Try to find existing Odoo customer ID
            const existingCustomer = await this.odooCustomer.searchExistingCustomer(
              customerData.email_address || customerData.email,
              customerData.contact_number || customerData.phone
            );

            syncResult = await this.odooCustomer.syncToOdoo(
              'update',
              customerData,
              responseData.id,
              existingCustomer ? existingCustomer.id : null
            );
            console.log('Odoo UPDATE sync result:', syncResult);
          }
          break;

        case 'delete':
          // DELETE operation
          if (customerId) {
            // Try to find existing Odoo customer ID
            const existingCustomer = await this.odooCustomer.searchExistingCustomer(
              customerData?.email_address || customerData?.email,
              customerData?.contact_number || customerData?.phone
            );

            syncResult = await this.odooCustomer.syncToOdoo(
              'delete',
              customerData,
              customerId,
              existingCustomer ? existingCustomer.id : null
            );
            console.log('Odoo DELETE sync result:', syncResult);
          }
          break;

        default:
          console.log(`No Odoo sync needed for ${method.toUpperCase()} operation`);
      }

      // Log sync results
      if (syncResult) {
        if (syncResult.success) {
          console.log(`✅ Odoo sync successful for ${method.toUpperCase()} operation`);
        } else {
          console.log(`❌ Odoo sync failed for ${method.toUpperCase()} operation:`, syncResult.error);
        }
      }

    } catch (error) {
      console.error('Error in Odoo sync middleware:', error);
    }
  }

  // Static method to create middleware instance
  static create() {
    return new OdooSyncMiddleware().syncToOdoo.bind(new OdooSyncMiddleware());
  }
}

// Create singleton instance
const syncMiddleware = new OdooSyncMiddleware();

export default OdooSyncMiddleware;
