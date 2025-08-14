# Jewellery Customer API

## Overview

This repository contains a RESTful API for managing customer data for a jewellery store. The API is built with Node.js and Express, and uses a local JSON file for data storage.

## Project Structure

```
api/
├── data/                  # Data storage directory
│   └── customers.json     # JSON file for storing customer data
├── public/                # Static files
│   └── index.html         # Swagger UI for API documentation
├── src/
│   ├── controllers/       # Controller functions
│   │   └── customerController.js
│   ├── middleware/        # Middleware functions
│   │   └── validation.js  # Validation middleware
│   ├── models/            # Data models
│   │   └── customer.js    # Customer model
│   ├── routes/            # API routes
│   │   └── customers.js   # Customer routes
│   └── index.js           # Main application file
├── .gitignore             # Git ignore file
├── package.json           # Node.js dependencies
├── README-MAIN.md         # API documentation (this file)
├── README.md              # API documentation
├── swagger.json           # Swagger API specification
└── test.js                # Test script
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the API directory

```bash
cd api
```

3. Install dependencies

```bash
npm install
```

### Running the API

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

### API Documentation

Once the server is running, you can access the Swagger UI documentation at:

```
http://localhost:3000/
```

### Testing the API

You can run the automated test script with:

```bash
npm test
```

This will run a series of tests against the API to verify that all endpoints are working correctly.

## API Endpoints

- `GET /customers` - Fetch all customers
- `GET /customers/:id` - Fetch a specific customer by ID
- `POST /customers` - Create a new customer
- `PUT /customers/:id` - Update a customer
- `DELETE /customers/:id` - Delete a customer

## Customer Data Schema

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
      "purchase_date": "string",
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

## Validation

The API validates the following required fields (either legacy or new names):
- `full_name`
- `phone` or `contact_number`
- `occasion` or `occasion_for_purchase`

If any of these fields are missing or empty, the API will return a 400 Bad Request response with details about the validation errors.

## Notes

- The API supports both legacy and new field names for backward compatibility.
- Purchase history and additional customer details are supported.
- Data is stored in a local JSON file (`data/customers.json`).
- Automated tests cover all CRUD