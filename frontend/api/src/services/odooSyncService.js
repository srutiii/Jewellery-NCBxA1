import { db } from '../config/firebase-admin.js';
import OdooService from './odooService.js';
import { isOdooSyncEnabled } from '../config/odoo-env.js';

/**
 * Clean Odoo Sync Service
 * - Tracks which Firebase customers are synced to Odoo
 * - Prevents duplicate syncs
 * - Handles create vs update logic
 */
class OdooSyncService {
  constructor() {
    this.odooService = new OdooService();
    this.syncEnabled = isOdooSyncEnabled();
  }

  /**
   * Sync a single customer from Firebase to Odoo
   * @param {string} firebaseId - Firebase customer ID
   * @returns {Promise<{success: boolean, odooId?: number, error?: string}>}
   */
  async syncCustomer(firebaseId) {
    if (!this.syncEnabled) {
      return { success: false, error: 'Odoo sync is disabled' };
    }

    try {
      // Get customer from Firebase
      const customerDoc = await db.collection('customers').doc(firebaseId).get();
      
      if (!customerDoc.exists) {
        return { success: false, error: 'Customer not found in Firebase' };
      }

      const customerData = customerDoc.data();
      const odooId = customerData.odoo_id; // Check if already synced

      if (odooId) {
        // Customer already exists in Odoo - UPDATE
        console.log(`📝 Updating existing Odoo customer ${odooId} for Firebase ID: ${firebaseId}`);
        await this.updateOdooCustomer(odooId, customerData);
        return { success: true, odooId, action: 'updated' };
      } else {
        // New customer - CREATE
        console.log(`✨ Creating new Odoo customer for Firebase ID: ${firebaseId}`);
        const newOdooId = await this.createOdooCustomer(customerData, firebaseId);
        
        // Store Odoo ID in Firebase for future updates
        await db.collection('customers').doc(firebaseId).update({
          odoo_id: newOdooId,
          odoo_synced_at: new Date()
        });
        
        return { success: true, odooId: newOdooId, action: 'created' };
      }
    } catch (error) {
      console.error(`❌ Error syncing customer ${firebaseId}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a new CRM lead in Odoo
   */
  async createOdooCustomer(customerData, firebaseId) {
    // Create CRM Lead/Opportunity
    const leadData = {
      name: `${customerData.full_name || 'Unknown'} - ${customerData.occasion_for_purchase || 'Inquiry'}`,
      contact_name: customerData.full_name || customerData.name || 'Unknown',
      phone: customerData.contact_number || customerData.phone,
      email_from: customerData.email_address || customerData.email,
      street: customerData.address,
      city: customerData.location || customerData.community || customerData.city,
      description: this.buildDescription(customerData),
      type: 'opportunity',
      expected_revenue: this.extractBudget(customerData.budget_mentioned),
      probability: 10,
      priority: '1'
    };

    // Remove undefined/null values
    Object.keys(leadData).forEach(key => {
      if (leadData[key] === undefined || leadData[key] === null) {
        delete leadData[key];
      }
    });

    const odooId = await this.odooService.makeRpcCall(
      'crm.lead',
      'create',
      [leadData]
    );

    console.log(`✅ Created Odoo CRM lead with ID: ${odooId}`);
    return odooId;
  }

  /**
   * Update existing CRM lead in Odoo
   */
  async updateOdooCustomer(odooId, customerData) {
    const leadData = {
      name: `${customerData.full_name || 'Unknown'} - ${customerData.occasion_for_purchase || 'Inquiry'}`,
      contact_name: customerData.full_name || customerData.name || 'Unknown',
      phone: customerData.contact_number || customerData.phone,
      email_from: customerData.email_address || customerData.email,
      street: customerData.address,
      city: customerData.location || customerData.community || customerData.city,
      description: this.buildDescription(customerData),
      expected_revenue: this.extractBudget(customerData.budget_mentioned)
    };

    // Remove undefined/null values
    Object.keys(leadData).forEach(key => {
      if (leadData[key] === undefined || leadData[key] === null) {
        delete leadData[key];
      }
    });

    await this.odooService.makeRpcCall(
      'crm.lead',
      'write',
      [[odooId], leadData]
    );

    console.log(`✅ Updated Odoo CRM lead ID: ${odooId}`);
  }

  /**
   * Build description field with all customer details
   */
  buildDescription(customerData) {
    const lines = [];
    
    lines.push(`Customer: ${customerData.full_name || 'Unknown'}`);
    
    if (customerData.contact_number || customerData.phone) {
      lines.push(`Phone: ${customerData.contact_number || customerData.phone}`);
    }
    if (customerData.email_address || customerData.email) {
      lines.push(`Email: ${customerData.email_address || customerData.email}`);
    }
    if (customerData.occasion_for_purchase) {
      lines.push(`Occasion: ${customerData.occasion_for_purchase}`);
    }
    if (customerData.budget_mentioned) {
      lines.push(`Budget: ${customerData.budget_mentioned}`);
    }
    if (customerData.gender) {
      lines.push(`Gender: ${customerData.gender}`);
    }
    if (customerData.date_of_birth) {
      lines.push(`DOB: ${customerData.date_of_birth}`);
    }
    if (customerData.community) {
      lines.push(`Community: ${customerData.community}`);
    }
    if (customerData.location) {
      lines.push(`Location: ${customerData.location}`);
    }
    if (customerData.items_shown_or_discussed) {
      lines.push(`\nItems Discussed:\n${customerData.items_shown_or_discussed}`);
    }
    if (customerData.expressed_interest_or_intent) {
      lines.push(`\nInterest/Intent:\n${customerData.expressed_interest_or_intent}`);
    }
    if (customerData.notes) {
      lines.push(`\nNotes:\n${customerData.notes}`);
    }

    return lines.join('\n');
  }

  /**
   * Extract budget amount from budget string
   */
  extractBudget(budgetString) {
    if (!budgetString) return 0;
    
    // Try to extract first number from string like "50000-100000 AED" or "50 Lakhs"
    const numbers = budgetString.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const firstNumber = parseFloat(numbers[0]);
      
      // If it mentions "Lakhs", multiply by 100000
      if (budgetString.toLowerCase().includes('lakh')) {
        return firstNumber * 100000;
      }
      
      // If it's a small number (< 1000), assume it's in thousands
      if (firstNumber < 1000) {
        return firstNumber * 1000;
      }
      
      return firstNumber;
    }
    
    return 0;
  }

  /**
   * Sync all customers from Firebase to Odoo
   * Use this for initial migration or periodic full sync
   */
  async syncAllCustomers() {
    if (!this.syncEnabled) {
      console.log('❌ Odoo sync is disabled');
      return { success: false, error: 'Sync disabled' };
    }

    console.log('🔄 Starting full sync of all customers...');
    
    const snapshot = await db.collection('customers').get();
    const results = {
      total: snapshot.size,
      created: 0,
      updated: 0,
      failed: 0,
      errors: []
    };

    for (const doc of snapshot.docs) {
      const result = await this.syncCustomer(doc.id);
      
      if (result.success) {
        if (result.action === 'created') {
          results.created++;
        } else {
          results.updated++;
        }
      } else {
        results.failed++;
        results.errors.push({ id: doc.id, error: result.error });
      }

      // Small delay to avoid overwhelming Odoo
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('✅ Full sync completed:', results);
    return results;
  }
}

export default new OdooSyncService();
