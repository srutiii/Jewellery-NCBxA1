// Odoo Environment Configuration
// This file contains environment-specific settings for Odoo integration

export const odooEnvConfig = {
  // Enable/disable Odoo synchronization
  syncEnabled: process.env.ODOO_SYNC_ENABLED !== 'false',
  
  // Odoo server configuration
  baseUrl: process.env.ODOO_BASE_URL || 'https://a1-future-crm.odoo.com',
  database: process.env.ODOO_DATABASE || 'a1-future-crm',
  username: process.env.ODOO_USERNAME || 'saugata@a1future.com',
  password: process.env.ODOO_PASSWORD || 'Saugata1000$',
  apiKey: process.env.ODOO_API_KEY || '0cdd3e223ebd96dbbf4e020d0779c5543f716ed6',
  
  // Sync settings
  retryAttempts: parseInt(process.env.ODOO_RETRY_ATTEMPTS) || 3,
  retryDelay: parseInt(process.env.ODOO_RETRY_DELAY) || 1000, // milliseconds
  
  // Logging
  logLevel: process.env.ODOO_LOG_LEVEL || 'info', // debug, info, warn, error
  
  // Timeout settings
  requestTimeout: parseInt(process.env.ODOO_REQUEST_TIMEOUT) || 30000, // 30 seconds
  
  // Custom field mappings (can be overridden via environment)
  customFields: {
    firebaseIdField: process.env.ODOO_FIREBASE_ID_FIELD || 'x_firebase_id',
    customerNotesField: process.env.ODOO_CUSTOMER_NOTES_FIELD || 'comment',
    leadSourceField: process.env.ODOO_LEAD_SOURCE_FIELD || 'lead_source'
  }
};

// Helper function to check if Odoo sync is enabled
export const isOdooSyncEnabled = () => {
  return odooEnvConfig.syncEnabled;
};

// Helper function to get Odoo configuration
export const getOdooConfig = () => {
  return {
    baseUrl: odooEnvConfig.baseUrl,
    database: odooEnvConfig.database,
    username: odooEnvConfig.username,
    password: odooEnvConfig.password,
    apiKey: odooEnvConfig.apiKey
  };
};

export default odooEnvConfig;
