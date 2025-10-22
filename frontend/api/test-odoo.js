import OdooService from './src/services/odooService.js';
import OdooCustomer from './src/models/odooCustomer.js';
import { isOdooSyncEnabled } from './src/config/odoo-env.js';

// Test Odoo Integration
const testOdooIntegration = async () => {
  console.log('🧪 Testing Odoo CRM Integration...\n');
  
  // Check if sync is enabled
  console.log(`📋 Odoo Sync Enabled: ${isOdooSyncEnabled()}`);
  
  if (!isOdooSyncEnabled()) {
    console.log('❌ Odoo sync is disabled. Set ODOO_SYNC_ENABLED=true to enable.');
    return;
  }

  try {
    // Test 1: Initialize Odoo Service
    console.log('\n🔧 Testing Odoo Service Initialization...');
    const odooService = new OdooService();
    console.log('✅ Odoo Service initialized');

    // Test 2: Test Authentication
    console.log('\n🔐 Testing Odoo Authentication...');
    const authResult = await odooService.authenticate();
    if (authResult) {
      console.log('✅ Odoo authentication successful');
    } else {
      console.log('❌ Odoo authentication failed');
      return;
    }

    // Test 3: Test Customer Creation
    console.log('\n👤 Testing Customer Creation...');
    const testCustomer = {
      full_name: 'Test Customer Odoo',
      contact_number: '+971501234567',
      email_address: 'test.odoo@example.com',
      occasion_for_purchase: 'Wedding',
      address: 'Dubai, UAE',
      community: 'Downtown Dubai',
      budget_mentioned: '50000-100000 AED',
      notes: 'Test customer for Odoo integration',
      purchase_history: [
        {
          purchase_date: new Date().toISOString(),
          item_description: 'Diamond Ring',
          item_category: 'Rings',
          price: 75000,
          payment_method: 'Credit Card'
        }
      ]
    };

    const odooCustomer = new OdooCustomer();
    const createResult = await odooCustomer.createCustomer(testCustomer, 'test-firebase-id-123');
    
    if (createResult.success) {
      console.log('✅ Customer created in Odoo CRM');
      console.log(`   Customer ID: ${createResult.customerId}`);
      console.log(`   Lead ID: ${createResult.leadId}`);
      
      // Test 4: Test Customer Update
      console.log('\n✏️ Testing Customer Update...');
      const updateData = {
        ...testCustomer,
        full_name: 'Updated Test Customer Odoo',
        budget_mentioned: '100000-150000 AED'
      };
      
      const updateResult = await odooCustomer.updateCustomer(
        createResult.customerId,
        updateData,
        'test-firebase-id-123'
      );
      
      if (updateResult.success) {
        console.log('✅ Customer updated in Odoo CRM');
      } else {
        console.log('❌ Customer update failed:', updateResult.error);
      }
      
      // Test 5: Test Customer Search
      console.log('\n🔍 Testing Customer Search...');
      const searchResult = await odooCustomer.searchExistingCustomer(
        testCustomer.email_address,
        testCustomer.contact_number
      );
      
      if (searchResult) {
        console.log('✅ Customer found in Odoo CRM');
        console.log(`   Found customer: ${searchResult.name}`);
      } else {
        console.log('❌ Customer not found in search');
      }
      
      // Test 6: Test Customer Deletion
      console.log('\n🗑️ Testing Customer Deletion...');
      const deleteResult = await odooCustomer.deleteCustomer(
        createResult.customerId,
        'test-firebase-id-123'
      );
      
      if (deleteResult.success) {
        console.log('✅ Customer deleted from Odoo CRM');
        console.log(`   Deleted leads: ${deleteResult.deletedLeads}`);
      } else {
        console.log('❌ Customer deletion failed:', deleteResult.error);
      }
      
    } else {
      console.log('❌ Customer creation failed:', createResult.error);
    }

    console.log('\n🎉 Odoo integration tests completed!');

  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.error('Stack trace:', error.stack);
  }
};

// Test RPC Call
const testRpcCall = async () => {
  console.log('\n🔧 Testing Direct RPC Call...');
  
  try {
    const odooService = new OdooService();
    await odooService.authenticate();
    
    // Test a simple RPC call
    const result = await odooService.makeRpcCall(
      'res.partner',
      'search_count',
      [[['is_company', '=', false]]]
    );
    
    console.log(`✅ RPC call successful. Found ${result} customers in Odoo.`);
    
  } catch (error) {
    console.error('❌ RPC call failed:', error.message);
  }
};

// Run tests
const runTests = async () => {
  await testOdooIntegration();
  await testRpcCall();
};

// Check if this is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testOdooIntegration, testRpcCall };
