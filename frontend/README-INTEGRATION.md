# Jewellery Customer Management System - Integration Guide

This project consists of a React frontend and Express.js backend API for managing jewellery customer data.

## Project Structure

```
Jewellery-NCBxA1/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # API service layer
│   │   └── utils/           # Utility functions
│   └── package.json
└── frontend/api/            # Express.js backend API
    ├── src/
    │   ├── controllers/      # API controllers
    │   ├── models/          # Data models
    │   ├── routes/          # API routes
    │   └── middleware/      # Validation middleware
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd frontend/api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` (or another available port)

## API Endpoints

- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

## Data Flow

1. **Frontend Form**: User fills out the customer data form
2. **Data Transformation**: Form data is transformed to match backend schema
3. **API Call**: Data is sent to backend via REST API
4. **Validation**: Backend validates the data using Joi schema
5. **Storage**: Valid data is stored in JSON file
6. **Response**: Success/error response is sent back to frontend
7. **User Feedback**: Frontend displays appropriate success/error messages

## Key Features

- **Real-time Validation**: Both frontend and backend validation
- **Data Persistence**: Customer data stored in JSON file
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive UI**: Modern, responsive design with Tailwind CSS
- **Type Safety**: TypeScript support in frontend

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend is running and CORS is properly configured
2. **Port Conflicts**: Check if ports 3000 (backend) and 5173 (frontend) are available
3. **Validation Errors**: Check the form data matches the required schema

### Backend Logs

Check the backend console for detailed error logs and validation messages.

### Frontend Console

Check the browser console for network errors and API response details.

## Development

- Backend uses ES modules (`"type": "module"`)
- Frontend uses Vite for fast development
- Data is stored in `frontend/api/data/customers.json`
- All API responses include proper error handling
