import { format } from 'date-fns';
import { CustomerData } from '../services/api';

export interface FrontendFormData {
  full_name: string;
  contact_number: string;
  email_address: string;
  address: string;
  community: string;
  sub_community: string;
  location: string;
  
  // Purchase History
  transaction_id: string;
  sku_product_id: string;
  product_category: string;
  product_subcategory: string;
  metal_type: string;
  metal_purity: string;
  gemstone_type: string;
  gemstone_details: string;
  design_style: string;
  purchase_date_time: string;
  purchase_value: string;
  discount_applied: boolean;
  discount_value: string;
  
  // Personal Information
  date_of_birth: Date | undefined;
  anniversary_date: Date | undefined;
  gender: string;
  marital_status: string;
  
  // Occasion and Relationship
  occasion_for_purchase: string;
  gift_recipient_relationship: string;
  
  // Business Intelligence
  items_shown_or_discussed: string;
  expressed_interest_or_intent: string;
  in_store_query: string;
  budget_mentioned: string;
  frequency_of_visit: string;
}

export function transformFormDataToApiData(formData: FrontendFormData): CustomerData {
  // Transform purchase history if transaction details are provided
  const purchaseHistory = [];
  if (formData.transaction_id || formData.sku_product_id || formData.product_category) {
    const historyItem: any = {};
    
    if (formData.transaction_id) historyItem.purchase_id = formData.transaction_id;
    if (formData.purchase_date_time) historyItem.purchase_date = formData.purchase_date_time;
    
    const itemDescription = `${formData.product_category || ''} ${formData.product_subcategory || ''}`.trim();
    if (itemDescription) historyItem.item_description = itemDescription;
    
    if (formData.product_category) historyItem.item_category = formData.product_category;
    if (formData.product_subcategory) historyItem.item_type = formData.product_subcategory;
    
    if (formData.purchase_value) {
      const price = parseFloat(formData.purchase_value);
      if (!isNaN(price)) historyItem.price = price;
    }
    
    if (formData.metal_type) historyItem.metal_type = formData.metal_type;
    if (formData.metal_purity) historyItem.metal_purity = formData.metal_purity;
    
    if (formData.gemstone_type && formData.gemstone_details) {
      historyItem.gemstone_details = {
        type: formData.gemstone_type
      };
    }
    
    if (formData.discount_applied && formData.discount_value) {
      const discountValue = parseFloat(formData.discount_value);
      if (!isNaN(discountValue)) {
        historyItem.discount_applied = {
          type: 'percentage',
          percentage: discountValue
        };
      }
    }
    
    if (Object.keys(historyItem).length > 0) {
      purchaseHistory.push(historyItem);
    }
  }

  const result: any = {
    // Required fields
    full_name: formData.full_name,
    contact_number: formData.contact_number,
    occasion_for_purchase: formData.occasion_for_purchase,
    
    // Legacy fields for backward compatibility
    phone: formData.contact_number,
    occasion: formData.occasion_for_purchase,
  };

  // Optional fields - only add if they have values
  if (formData.email_address) result.email_address = formData.email_address;
  if (formData.address) result.address = formData.address;
  if (formData.community) result.community = formData.community;
  if (formData.sub_community) result.sub_community = formData.sub_community;
  if (formData.location) result.location = formData.location;
  if (formData.date_of_birth) result.date_of_birth = format(formData.date_of_birth, 'yyyy-MM-dd');
  if (formData.anniversary_date) result.anniversary_date = format(formData.anniversary_date, 'yyyy-MM-dd');
  if (formData.gender) result.gender = formData.gender;
  if (formData.marital_status) result.marital_status = formData.marital_status;
  
  // Purchase history
  if (purchaseHistory.length > 0) result.purchase_history = purchaseHistory;
  
  // Additional customer information
  if (formData.gift_recipient_relationship) result.gift_recipient_relationship = formData.gift_recipient_relationship;
  if (formData.items_shown_or_discussed) result.items_shown_or_discussed = formData.items_shown_or_discussed;
  if (formData.expressed_interest_or_intent) result.expressed_interest_or_intent = formData.expressed_interest_or_intent;
  if (formData.in_store_query) result.in_store_query = formData.in_store_query;
  if (formData.budget_mentioned) result.budget_mentioned = formData.budget_mentioned;
  if (formData.frequency_of_visit) result.frequency_of_visit = formData.frequency_of_visit;
  
  // Legacy fields for backward compatibility
  if (formData.email_address) result.email = formData.email_address;
  if (formData.location) result.city = formData.location;
  if (formData.date_of_birth) result.dob = format(formData.date_of_birth, 'yyyy-MM-dd');
  if (formData.budget_mentioned) result.budget = formData.budget_mentioned;

  return result;
}
