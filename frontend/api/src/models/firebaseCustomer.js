import { db } from '../config/firebase-admin.js';

// Firebase Customer model
class FirebaseCustomer {
  constructor(data) {
    // Auto-generated fields
    this.id = data.id || null;
    this.created_at = data.created_at || new Date();
    this.updated_at = new Date();
    
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
  static async getAll() {
    try {
      const snapshot = await db.collection('customers').orderBy('created_at', 'desc').get();
      const customers = [];
      snapshot.forEach(doc => {
        customers.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return customers;
    } catch (error) {
      console.error('Error reading customers data:', error);
      return [];
    }
  }

  // Get customer by ID
  static async getById(id) {
    try {
      const doc = await db.collection('customers').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  }

  // Create a new customer
  async save() {
    try {
      const customerData = {
        full_name: this.full_name,
        contact_number: this.contact_number,
        occasion_for_purchase: this.occasion_for_purchase,
        email_address: this.email_address,
        address: this.address,
        community: this.community,
        sub_community: this.sub_community,
        location: this.location,
        date_of_birth: this.date_of_birth,
        anniversary_date: this.anniversary_date,
        gender: this.gender,
        marital_status: this.marital_status,
        purchase_history: this.purchase_history,
        gift_recipient_relationship: this.gift_recipient_relationship,
        items_shown_or_discussed: this.items_shown_or_discussed,
        expressed_interest_or_intent: this.expressed_interest_or_intent,
        in_store_query: this.in_store_query,
        budget_mentioned: this.budget_mentioned,
        frequency_of_visit: this.frequency_of_visit,
        phone: this.phone,
        email: this.email,
        city: this.city,
        dob: this.dob,
        occasion: this.occasion,
        budget: this.budget,
        diamond_shape: this.diamond_shape,
        first_visit: this.first_visit,
        lead_source: this.lead_source,
        notes: this.notes,
        created_at: this.created_at,
        updated_at: this.updated_at
      };

      const docRef = await db.collection('customers').add(customerData);
      this.id = docRef.id;
      return this;
    } catch (error) {
      console.error('Error saving customer:', error);
      return null;
    }
  }

  // Update an existing customer
  async update() {
    try {
      if (!this.id) {
        throw new Error('Customer ID is required for update');
      }

      const updateData = {
        full_name: this.full_name,
        contact_number: this.contact_number,
        occasion_for_purchase: this.occasion_for_purchase,
        email_address: this.email_address,
        address: this.address,
        community: this.community,
        sub_community: this.sub_community,
        location: this.location,
        date_of_birth: this.date_of_birth,
        anniversary_date: this.anniversary_date,
        gender: this.gender,
        marital_status: this.marital_status,
        purchase_history: this.purchase_history,
        gift_recipient_relationship: this.gift_recipient_relationship,
        items_shown_or_discussed: this.items_shown_or_discussed,
        expressed_interest_or_intent: this.expressed_interest_or_intent,
        in_store_query: this.in_store_query,
        budget_mentioned: this.budget_mentioned,
        frequency_of_visit: this.frequency_of_visit,
        phone: this.phone,
        email: this.email,
        city: this.city,
        dob: this.dob,
        occasion: this.occasion,
        budget: this.budget,
        diamond_shape: this.diamond_shape,
        first_visit: this.first_visit,
        lead_source: this.lead_source,
        notes: this.notes,
        updated_at: this.updated_at
      };

      await db.collection('customers').doc(this.id).update(updateData);
      return this;
    } catch (error) {
      console.error('Error updating customer:', error);
      return null;
    }
  }

  // Delete a customer
  static async delete(id) {
    try {
      await db.collection('customers').doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
  }

  // Check if email already exists (excluding current customer for updates)
  static async emailExists(email, excludeId = null) {
    if (!email) return false;
    
    try {
      const snapshot = await db.collection('customers').where('email_address', '==', email).get();
      
      // If we're updating, exclude the current customer
      if (excludeId) {
        return snapshot.docs.some(doc => doc.id !== excludeId);
      }
      
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  }

  // Search customers
  static async search(searchTerm) {
    try {
      const snapshot = await db.collection('customers').orderBy('created_at', 'desc').get();
      const customers = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (
          data.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.contact_number?.includes(searchTerm) ||
          data.phone?.includes(searchTerm)
        ) {
          customers.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      return customers;
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  }
}

export default FirebaseCustomer;
