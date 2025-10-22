// Odoo Configuration
export const odooConfig = {
  // Odoo server details
  baseUrl: 'https://a1-future-crm.odoo.com',
  database: 'a1-future-crm', // Usually same as subdomain
  
  // Authentication credentials
  username: 'saugata@a1future.com',
  password: 'Saugata1000$',
  apiKey: '0cdd3e223ebd96dbbf4e020d0779c5543f716ed6',
  
  // API endpoints
  endpoints: {
    authenticate: '/web/session/authenticate',
    jsonRpc: '/web/dataset/call_kw',
    create: '/web/dataset/call_kw',
    update: '/web/dataset/call_kw',
    delete: '/web/dataset/call_kw',
    search: '/web/dataset/call_kw'
  },
  
  // Model mappings
  models: {
    customers: 'res.partner', // Odoo uses res.partner for customers/contacts
    leads: 'crm.lead',
    opportunities: 'crm.lead'
  },
  
  // Field mappings from our customer model to Odoo fields
  fieldMappings: {
    // Basic contact information
    full_name: 'name',
    contact_number: 'phone',
    email_address: 'email',
    address: 'street',
    community: 'city',
    location: 'city',
    
    // Additional fields (will be stored in custom fields or notes)
    occasion_for_purchase: 'comment', // Store in comment field
    date_of_birth: 'comment',
    anniversary_date: 'comment',
    gender: 'comment',
    marital_status: 'comment',
    budget_mentioned: 'comment',
    gift_recipient_relationship: 'comment',
    items_shown_or_discussed: 'comment',
    expressed_interest_or_intent: 'comment',
    in_store_query: 'comment',
    frequency_of_visit: 'comment',
    lead_source: 'comment',
    notes: 'comment',
    purchase_history: 'comment',
    
    // Legacy fields
    phone: 'phone',
    email: 'email',
    city: 'city',
    dob: 'comment',
    occasion: 'comment',
    budget: 'comment',
    diamond_shape: 'comment',
    first_visit: 'comment'
  },
  
  // Default values for Odoo fields
  defaults: {
    is_company: false,
    customer_rank: 1, // Make it a customer
    supplier_rank: 0, // Not a supplier
    active: true,
    country_id: 105, // UAE country ID (adjust as needed)
    state_id: false,
    zip: false,
    website: false,
    category_id: false,
    function: false,
    title: false,
    parent_id: false,
    child_ids: false,
    ref: false,
    lang: 'en_US',
    tz: false,
    user_id: false,
    vat: false,
    bank_ids: false,
    credit_limit: 0.0,
    barcode: false,
    active_lang_count: 0,
    message_main_attachment_id: false,
    message_follower_ids: false,
    activity_ids: false,
    message_ids: false,
    message_partner_ids: false,
    message_channel_ids: false,
    message_is_follower: false,
    message_follower_count: 0,
    message_partner_count: 0,
    message_channel_count: 0,
    message_has_error: false,
    message_has_error_counter: 0,
    message_needaction: false,
    message_needaction_counter: 0,
    message_has_sms_error: false,
    message_unread: false,
    message_unread_counter: 0,
    message_attachment_count: 0,
    activity_state: false,
    activity_type_id: false,
    activity_date_deadline: false,
    activity_summary: false,
    activity_user_id: false,
    activity_ids_count: 0,
    message_is_follower: false,
    message_follower_count: 0,
    message_partner_count: 0,
    message_channel_count: 0,
    message_has_error: false,
    message_has_error_counter: 0,
    message_needaction: false,
    message_needaction_counter: 0,
    message_has_sms_error: false,
    message_unread: false,
    message_unread_counter: 0,
    message_attachment_count: 0,
    activity_state: false,
    activity_type_id: false,
    activity_date_deadline: false,
    activity_summary: false,
    activity_user_id: false,
    activity_ids_count: 0
  }
};

// Helper function to format customer data for Odoo
export const formatCustomerForOdoo = (customerData) => {
  const odooData = {
    ...odooConfig.defaults
  };
  
  // Map basic fields
  Object.keys(odooConfig.fieldMappings).forEach(ourField => {
    const odooField = odooConfig.fieldMappings[ourField];
    const value = customerData[ourField];
    
    if (value !== null && value !== undefined && value !== '') {
      if (odooField === 'comment') {
        // Append to comment field
        if (!odooData.comment) {
          odooData.comment = '';
        }
        odooData.comment += `${ourField}: ${value}\n`;
      } else {
        odooData[odooField] = value;
      }
    }
  });
  
  // Add purchase history to comment
  if (customerData.purchase_history && customerData.purchase_history.length > 0) {
    if (!odooData.comment) {
      odooData.comment = '';
    }
    odooData.comment += '\nPurchase History:\n';
    customerData.purchase_history.forEach((purchase, index) => {
      odooData.comment += `${index + 1}. ${purchase.item_description} - ${purchase.price} (${purchase.purchase_date})\n`;
    });
  }
  
  return odooData;
};

export default odooConfig;
