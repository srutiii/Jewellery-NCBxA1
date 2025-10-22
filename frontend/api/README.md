# Jewellery Customer API

A RESTful API for managing customer data for a jewellery store. This API provides endpoints for creating, reading, updating, and deleting customer information with extended profile and purchase history tracking. The API integrates with both Firebase Firestore and Odoo CRM for comprehensive customer management.

## Features

- CRUD operations for customer data
- Comprehensive customer profiles with purchase history tracking
- Retail-specific information fields
- Data validation for required fields (supports both legacy and new field names)
- **Firebase Firestore** for primary data storage
- **Odoo CRM integration** for customer relationship management
- Automatic synchronization between Firebase and Odoo
- CORS enabled for cross-origin requests
- Automated test script for API verification

## API Endpoints

- `GET /customers` - Fetch all customers
- `GET /customers/:id` - Fetch a specific customer by ID
- `POST /customers` - Create a new customer
- `PUT /customers/:id` - Update a customer
- `DELETE /customers/:id` - Delete a customer

## Extended Customer Data Schema

The API supports both legacy and new field names for customer data. Below is the full schema:

```json
{
  "id": "string (auto-generated)",
  "full_name": "string (required)",
  "gender": "string (optional)",
  "contact_number": "string (required, new)",
  "phone": "string (required, legacy)",
  "email_address": "string (optional, new)",
  "email": "string (optional, legacy)",
  "location": "string (optional, new)",
  "city": "string (optional, legacy)",
  "occasion_for_purchase": "string (required, new)",
  "occasion": "string (required, legacy)",
  "address": "string (optional)",
  "community": "string (optional)",
  "sub_community": "string (optional)",
  "date_of_birth": "string (optional, new)",
  "dob": "string (optional, legacy)",
  "anniversary_date": "string (optional)",
  "marital_status": "string (optional)",
  "budget_mentioned": "string (optional, new)",
  "budget": "string (optional, legacy)",
  "gift_recipient_relationship": "string (optional)",
  "items_shown_or_discussed": "string (optional)",
  "expressed_interest_or_intent": "string (optional)",
  "in_store_query": "string (optional)",
  "frequency_of_visit": "string (optional)",
  "lead_source": "string (optional)",
  "notes": "string (optional)",
  "purchase_history": [
    {
      "purchase_id": "string (auto-generated)",
      "purchase_date": "string (ISO date)",
      "item_description": "string",
      "item_category": "string",
      "item_type": "string",
      "price": "number",
      "weight": "string",
      "metal_type": "string",
      "metal_purity": "string",
      "gemstone_details": {
        "type": "string",
        "carat": "number",
        "color": "string",
        "clarity": "string",
        "cut": "string"
      },
      "discount_applied": {
        "type": "string",
        "amount": "number",
        "percentage": "number"
      },
      "payment_method": "string",
      "sales_person": "string"
    }
  ],
  "diamond_shape": "string (optional, legacy)",
  "first_visit": "string (optional, legacy)",
  "created_at": "string (auto-generated)",
  "updated_at": "string (auto-generated)"
}
```

## Installation

1. Clone the repository
2. Navigate to the API directory

```bash
cd api
```

3. Install dependencies

```bash
npm install
```

4. Configure environment variables

Create a `.env` file in the API root directory:

```env
# Firebase Configuration (optional - can use direct config)
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_cert_url

# Odoo CRM Integration
ODOO_SYNC_ENABLED=true
ODOO_BASE_URL=https://a1-future-crm.odoo.com
ODOO_DATABASE=a1-future-crm
ODOO_USERNAME=saugata@a1future.com
ODOO_PASSWORD=Saugata1000$
ODOO_API_KEY=0cdd3e223ebd96dbbf4e020d0779c5543f716ed6
```

## Running the API

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon, which automatically restarts the server when changes are detected.

### Production Mode

```bash
npm start
```

The API will be available at `http://localhost:3000`.

## Testing the API

### Basic API Testing

You can test the API using tools like Postman, Insomnia, or curl.

### Odoo Integration Testing

Test the Odoo CRM integration:

```bash
# Test Odoo connection and operations
node test-odoo.js

# Test full API with Odoo sync
npm test
```

### Example Requests

#### Create a new customer

```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Smith",
    "contact_number": "+971501234567",
    "email_address": "jane.smith@example.com",
    "address": "Palm Jumeirah, Dubai",
    "community": "Palm Jumeirah",
    "date_of_birth": "1985-06-15",
    "anniversary_date": "2010-09-22",
    "gender": "female",
    "marital_status": "married",
    "occasion_for_purchase": "Anniversary",
    "budget_mentioned": "15000-20000 AED",
    "purchase_history": [
      {
        "purchase_date": "2023-01-15",
        "item_description": "Diamond Tennis Bracelet",
        "item_category": "Bracelet",
        "price": 12500,
        "metal_type": "White Gold",
        "metal_purity": "18K",
        "gemstone_details": {
          "type": "Diamond",
          "carat": 3.5,
          "color": "F",
          "clarity": "VS1"
        },
        "payment_method": "Credit Card",
        "sales_person": "Ahmed"
      }
    ]
  }'
```

#### Get all customers

```bash
curl -X GET http://localhost:3000/customers
```

#### Get a specific customer

```bash
curl -X GET http://localhost:3000/customers/{customer_id}
```

#### Update a customer

```bash
curl -X PUT http://localhost:3000/customers/{customer_id} \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Smith-Johnson",
    "contact_number": "+971501234567",
    "occasion_for_purchase": "Anniversary",
    "purchase_history": [
      {
        "purchase_date": "2023-01-15",
        "item_description": "Diamond Tennis Bracelet",
        "item_category": "Bracelet",
        "price": 12500,
        "payment_method": "Credit Card"
      },
      {
        "purchase_date": "2023-06-22",
        "item_description": "Sapphire Pendant",
        "item_category": "Necklace",
        "price": 8750,
        "payment_method": "Cash"
      }
    ]
  }'
```

#### Delete a customer

```bash
curl -X DELETE http://localhost:3000/customers/{customer_id}
```

## Data Storage & Integration

### Primary Storage: Firebase Firestore
Customer data is primarily stored in Firebase Firestore for real-time access and scalability.

### Secondary Sync: Odoo CRM
After successful Firebase operations, customer data is automatically synchronized to Odoo CRM for:
- Customer relationship management
- Lead and opportunity tracking
- Sales pipeline management
- Business intelligence and reporting

### Integration Flow
1. **API Request** → Validation → **Firebase Operation** → **Odoo Sync** → Response
2. **Non-blocking**: Odoo sync failures don't affect API responses
3. **Automatic**: All CRUD operations trigger Odoo synchronization
4. **Bidirectional**: Supports create, update, and delete operations

For detailed Odoo integration information, see [ODOO-INTEGRATION.md](./ODOO-INTEGRATION.md).

## Validation

The API validates the following required fields (either legacy or new names):
- `full_name`
- `phone` or `contact_number`
- `occasion` or `occasion_for_purchase`

Additional validation is applied to:
- Purchase history items (when provided)
- Date formats
- Email format
- Gender and marital status values

If any validation fails, the API will return a 400 Bad Request response with details about the validation errors.

## Notes

- The API supports both legacy and new field names for backward compatibility.
- Purchase history and additional customer details are supported.
- Automated tests cover all CRUD