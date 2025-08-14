import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// API base URL
const API_URL = 'http://localhost:3000';

// Test customer data
const testCustomer = {
  full_name: 'Test Customer',
  gender: 'Female',
  contact_number: '+9876543210', // Updated from phone
  email_address: 'test@example.com', // Updated from email
  location: 'Delhi', // Updated from city
  occasion_for_purchase: 'Engagement', // Updated from occasion
  address: '123 Test Street',
  community: 'Test Community',
  sub_community: 'Test Sub Community',
  date_of_birth: '1990-01-01',
  anniversary_date: '2020-06-15',
  marital_status: 'married',
  budget_mentioned: '₹50k–₹1L', // Updated from budget
  gift_recipient_relationship: 'Spouse',
  items_shown_or_discussed: 'Diamond rings, Gold necklaces',
  expressed_interest_or_intent: 'Will purchase next month',
  in_store_query: 'Asked about diamond certification',
  frequency_of_visit: 'First time',
  lead_source: 'Instagram',
  notes: 'This is a test customer',
  // Adding purchase history
  purchase_history: [
    {
      purchase_id: uuidv4(), // You would need to import uuidv4 or generate a random ID
      purchase_date: new Date().toISOString(),
      item_description: 'Diamond Ring',
      item_category: 'Rings',
      item_type: 'Engagement',
      price: 75000,
      weight: '5g',
      metal_type: 'Gold',
      metal_purity: '18K',
      gemstone_details: {
        type: 'Diamond',
        carat: 1.5,
        color: 'D',
        clarity: 'VVS1',
        cut: 'Excellent'
      },
      discount_applied: {
        type: 'Festival',
        amount: 5000,
        percentage: 6.67
      },
      payment_method: 'Credit Card',
      sales_person: 'John Doe'
    }
  ]
};

// Store the created customer ID
let customerId;

// Helper function to log test results
const logResult = (testName, success, details = '') => {
  console.log(`${success ? '✅' : '❌'} ${testName}${details ? ': ' + details : ''}`);
};

// Run tests sequentially
const runTests = async () => {
  console.log('🧪 Starting API tests...');
  
  try {
    // Test 1: Create a new customer
    console.log('\n📝 Testing POST /customers');
    const createResponse = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCustomer)
    });
    
    if (createResponse.status === 201) {
      const customer = await createResponse.json();
      customerId = customer.id || customer.customer_id; // Support both old and new ID field
      logResult('Create customer', true, `ID: ${customerId}`);
    } else {
      const error = await createResponse.json();
      logResult('Create customer', false, JSON.stringify(error));
      return; // Stop tests if creation fails
    }
    
    // Test 2: Get all customers
    console.log('\n📋 Testing GET /customers');
    const getAllResponse = await fetch(`${API_URL}/customers`);
    
    if (getAllResponse.status === 200) {
      const customers = await getAllResponse.json();
      logResult('Get all customers', true, `Found ${customers.length} customer(s)`);
    } else {
      logResult('Get all customers', false, `Status: ${getAllResponse.status}`);
    }
    
    // Test 3: Get customer by ID
    console.log('\n🔍 Testing GET /customers/:id');
    const getByIdResponse = await fetch(`${API_URL}/customers/${customerId}`);
    
    if (getByIdResponse.status === 200) {
      const customer = await getByIdResponse.json();
      logResult('Get customer by ID', true, `Name: ${customer.full_name}`);
      
      // Verify purchase history is present
      if (customer.purchase_history && customer.purchase_history.length > 0) {
        logResult('Purchase history', true, `Found ${customer.purchase_history.length} purchase(s)`);
      } else {
        logResult('Purchase history', false, 'No purchase history found');
      }
    } else {
      logResult('Get customer by ID', false, `Status: ${getByIdResponse.status}`);
    }
    
    // Test 4: Update customer
    console.log('\n✏️ Testing PUT /customers/:id');
    const updateResponse = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testCustomer,
        full_name: 'Updated Test Customer',
        notes: 'This customer has been updated',
        // Add another purchase to the history
        purchase_history: [
          ...testCustomer.purchase_history,
          {
            purchase_date: new Date().toISOString(),
            item_description: 'Gold Bracelet',
            item_category: 'Bracelets',
            item_type: 'Gift',
            price: 45000,
            weight: '10g',
            metal_type: 'Gold',
            metal_purity: '22K',
            payment_method: 'Cash',
            sales_person: 'Jane Smith'
          }
        ]
      })
    });
    
    if (updateResponse.status === 200) {
      const updatedCustomer = await updateResponse.json();
      logResult('Update customer', true, `New name: ${updatedCustomer.full_name}`);
      
      // Verify purchase history was updated
      if (updatedCustomer.purchase_history && updatedCustomer.purchase_history.length === 2) {
        logResult('Updated purchase history', true, `Now has ${updatedCustomer.purchase_history.length} purchases`);
      } else {
        logResult('Updated purchase history', false, `Expected 2 purchases, got ${updatedCustomer.purchase_history?.length || 0}`);
      }
    } else {
      logResult('Update customer', false, `Status: ${updateResponse.status}`);
    }
    
    // Test 5: Delete customer
    console.log('\n🗑️ Testing DELETE /customers/:id');
    const deleteResponse = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.status === 204) {
      logResult('Delete customer', true);
    } else {
      logResult('Delete customer', false, `Status: ${deleteResponse.status}`);
    }
    
    // Test 6: Verify customer is deleted
    console.log('\n✅ Verifying customer deletion');
    const verifyDeleteResponse = await fetch(`${API_URL}/customers/${customerId}`);
    
    if (verifyDeleteResponse.status === 404) {
      logResult('Verify deletion', true, 'Customer not found (expected)');
    } else {
      logResult('Verify deletion', false, `Status: ${verifyDeleteResponse.status}`);
    }
    
    // Test 7: Test validation (missing required field)
    console.log('\n🛡️ Testing validation');
    const invalidCustomer = {
      gender: 'Male',
      email_address: 'invalid@example.com',
      location: 'Mumbai'
      // Missing required fields: full_name, contact_number, occasion_for_purchase
    };
    
    const validationResponse = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidCustomer)
    });
    
    if (validationResponse.status === 400) {
      const error = await validationResponse.json();
      logResult('Validation check', true, `Validation errors detected as expected`);
    } else {
      logResult('Validation check', false, `Expected 400, got ${validationResponse.status}`);
    }
    
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

// Check if server is running before starting tests
const checkServer = async () => {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      console.log('✅ Server is running');
      runTests();
    } else {
      console.error(`❌ Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Server is not running. Please start the server with "npm run dev" before running tests.');
  }
};

// Start the tests
checkServer();