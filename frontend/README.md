# Jewellery Customer Management System

## Overview

This repository contains a complete customer management system for a jewellery store, including both a React frontend application and a Node.js/Express backend API. The system is designed to capture comprehensive customer data for business intelligence and personalized marketing.

## Features

- **Modern React Frontend**: Built with TypeScript, Vite, and shadcn/ui components
- **RESTful API**: Node.js/Express backend with comprehensive customer data management
- **Comprehensive Customer Data**: Captures detailed customer information including purchase history, personal details, and business intelligence
- **Responsive Design**: Mobile-friendly interface with elegant animations
- **Form Validation**: Client-side validation using Zod schema validation

## Project Structure

```
├── api/                   # Backend API directory
│   ├── data/              # Data storage directory
│   │   └── customers.json # JSON file for storing customer data
│   ├── public/            # Static files
│   │   └── index.html     # Swagger UI for API documentation
│   ├── src/
│   │   ├── controllers/   # Controller functions
│   │   ├── middleware/    # Middleware functions
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── index.js       # Main application file
│   ├── package.json       # Node.js dependencies
│   ├── README.md          # API documentation
│   ├── swagger.json       # Swagger API specification
│   └── test.js            # Test script
├── src/                   # Frontend React application
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── CustomerDataForm.tsx # Main customer form
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/A1-Future-AI-Team/Jewellery-NCBxA1.git
cd Jewellery-NCBxA1
```

2. Install Frontend Dependencies

```bash
npm install
```

3. Install Backend Dependencies

```bash
cd api
npm install
cd ..
```

### Running the Application

#### Frontend (Development)

```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`.

#### Backend API

```bash
cd api
npm run dev
```

The API will be available at `http://localhost:3000`.

### API Documentation

Once the backend server is running, you can access the Swagger UI documentation at:

```
http://localhost:3000/
```

### Testing the API

You can run the automated test script with:

```bash
cd api
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

The system captures comprehensive customer information including:

### Basic Information
- `customer_id` - Unique identifier for each client
- `full_name` - Customer's full name
- `contact_number` - Phone number
- `email_address` - Email address
- `address` - Full address
- `community` - Community (e.g., Marwari, Bengali)
- `sub_community` - Sub-community (e.g., Agarwal, Maheshwari)
- `location` - City/Pincode

### Personal Information
- `date_of_birth` - Date of birth for birthday campaigns
- `anniversary_date` - Anniversary date for recurring purchases
- `gender` - For targeted collections
- `marital_status` - Single, Engaged, Married

### Purchase History (Granular)
- `transaction_id` - Unique ID for each sale
- `sku_product_id` - Specific item purchased
- `product_category` - Ring, Necklace, Earrings, Bangle, Watch
- `product_subcategory` - Engagement Ring, Cocktail Ring, Studs, Hoops
- `metal_type` - Gold, Platinum, Silver, Rose Gold
- `metal_purity` - 18K, 22K, 24K, 950 Platinum
- `gemstone_type` - Diamond, Ruby, Emerald, Sapphire, Pearl, None
- `gemstone_details` - Carat, Cut, Colour, Clarity (The 4Cs)
- `design_style` - Modern, Vintage, Traditional, Minimalist, Art Deco
- `purchase_date_time` - Timestamp of the sale
- `purchase_value` - Final price paid
- `discount_applied` - Boolean (Yes/No)
- `discount_value` - Discount percentage or amount

### Business Intelligence
- `occasion_for_purchase` - Wedding, Anniversary, Birthday Gift, Self-Purchase, Investment, Festive Gift
- `gift_recipient_relationship` - Spouse, Parent, Child, Sibling, Friend
- `items_shown_or_discussed` - Notes about items shown
- `expressed_interest_or_intent` - Customer's wishlist items
- `in_store_query` - What customer asked for when they walked in
- `budget_mentioned` - Budget range mentioned
- `frequency_of_visit` - How often they visit the store

## Validation

The frontend validates all required fields using Zod schema validation, and the API validates the following required fields:
- `customer_id`
- `full_name`
- `contact_number`
- `occasion_for_purchase`

If any of these fields are missing or empty, the system will return appropriate validation errors.

## Frontend Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Mobile-first approach with elegant animations
- **Form Validation**: Real-time validation using Zod schema
- **Date/Time Pickers**: Native datetime inputs for purchase and personal dates
- **Conditional Fields**: Dynamic form fields that show/hide based on user input
- **Toast Notifications**: User-friendly feedback for form submissions

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- shadcn/ui for component library
- React Hook Form for form management
- Zod for schema validation
- Lucide React for icons

### Backend
- Node.js with Express
- JSON file storage
- Swagger for API documentation
- Comprehensive validation middleware

## GitHub Actions

This repository includes a GitHub Actions workflow that automatically builds and tests the application when changes are pushed to feature branches or when pull requests are created against the `main` branch.

## Branches

- `main` - Production-ready code
- `frontend-latest` - Latest frontend updates with comprehensive customer data fields
