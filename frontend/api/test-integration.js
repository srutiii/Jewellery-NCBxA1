// Simple test script to verify Firebase and Odoo integration
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

const testCustomer = {
  full_name: 'Test Customer Integration',
  contact_number: '+971501234567',
  email_address: 'test.integration@example.com',
  occasion_for_purchase: 'Wedding',
  address: 'Dubai, UAE',
  community: 'Downtown Dubai',
  budget_mentioned: '50000-100000 AED',
  notes: 'Testing Firebase and Odoo integration'
};

async function testIntegration() {
  console.log('🧪 Testing Firebase and Odoo Integration...\n');
  
  try {
    // Test 1: Create a customer
    console.log('📝 Creating customer...');
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCustomer)
    });
    
    if (response.ok) {
      const customer = await response.json();
      console.log('✅ Customer created successfully!');
      console.log('Customer ID:', customer.id);
      console.log('Customer Name:', customer.full_name);
      
      // Test 2: Get all customers
      console.log('\n📋 Fetching all customers...');
      const getAllResponse = await fetch(`${API_URL}/customers`);
      const customers = await getAllResponse.json();
      console.log('✅ Found', customers.length, 'customers');
      
      // Test 3: Get specific customer
      console.log('\n🔍 Fetching specific customer...');
      const getResponse = await fetch(`${API_URL}/customers/${customer.id}`);
      if (getResponse.ok) {
        const specificCustomer = await getResponse.json();
        console.log('✅ Customer retrieved:', specificCustomer.full_name);
      }
      
      console.log('\n🎉 Integration test completed successfully!');
      console.log('Check your Firebase console and Odoo CRM for the created customer.');
      
    } else {
      const error = await response.text();
      console.log('❌ Error creating customer:', error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run the test
testIntegration();
