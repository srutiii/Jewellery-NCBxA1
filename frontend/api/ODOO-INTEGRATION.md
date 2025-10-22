# Odoo CRM Integration

This document describes the Odoo CRM integration for the Jewellery Customer API. The integration automatically synchronizes customer data between Firebase and Odoo CRM for all CRUD operations.

## Overview

The integration works as follows:
1. **Primary Storage**: Customer data is stored in Firebase Firestore
2. **Secondary Sync**: After successful Firebase operations, data is automatically synchronized to Odoo CRM
3. **Non-blocking**: Odoo sync failures don't affect the main API operations
4. **Bidirectional**: Supports create, update, and delete operations

## Architecture

```
API Request → Validation → Firebase Operation → Odoo Sync Middleware → Response
```

### Components

- **OdooService**: Handles direct communication with Odoo API
- **OdooCustomer**: Business logic for customer operations in Odoo
- **OdooSyncMiddleware**: Intercepts API responses and triggers sync
- **Configuration**: Environment-based configuration management

## Configuration

### Environment Variables

Create a `.env` file in the API root directory:

```env
# Odoo CRM Integration
ODOO_SYNC_ENABLED=true
ODOO_BASE_URL=https://a1-future-crm.odoo.com
ODOO_DATABASE=a1-future-crm
ODOO_USERNAME=saugata@a1future.com
ODOO_PASSWORD=Saugata1000$
ODOO_API_KEY=0cdd3e223ebd96dbbf4e020d0779c5543f716ed6

# Optional settings
ODOO_RETRY_ATTEMPTS=3
ODOO_RETRY_DELAY=1000
ODOO_REQUEST_TIMEOUT=30000
ODOO_LOG_LEVEL=info
```

### Field Mapping

The integration maps customer fields to Odoo fields as follows:

| Customer Field | Odoo Field | Notes |
|----------------|------------|-------|
| `full_name` | `name` | Customer name |
| `contact_number` | `phone` | Phone number |
| `email_address` | `email` | Email address |
| `address` | `street` | Street address |
| `community` | `city` | City/Community |
| `occasion_for_purchase` | `comment` | Stored in notes |
| `budget_mentioned` | `comment` | Stored in notes |
| `purchase_history` | `comment` | Stored in notes |
| Other fields | `comment` | All other fields stored in notes |

## Odoo Models Used

### 1. res.partner (Customer/Contact)
- Stores basic customer information
- Maps to customer contact details
- Used for customer management

### 2. crm.lead (Lead/Opportunity)
- Creates leads for each customer
- Stores business context and purchase intent
- Maps occasion and budget information
- Links to customer via partner_id

## API Operations

### Create Customer
1. Validates customer data
2. Saves to Firebase
3. Creates customer in Odoo `res.partner`
4. Creates lead in Odoo `crm.lead`
5. Returns Firebase customer data

### Update Customer
1. Validates updated data
2. Updates Firebase customer
3. Updates Odoo customer (if exists)
4. Updates or creates Odoo lead
5. Returns updated Firebase data

### Delete Customer
1. Deletes from Firebase
2. Deletes from Odoo `res.partner`
3. Deletes associated leads from `crm.lead`
4. Returns success response

## Testing

### Test Odoo Integration

Run the Odoo integration test:

```bash
node test-odoo.js
```

This will test:
- Authentication with Odoo
- Customer creation
- Customer update
- Customer search
- Customer deletion
- Direct RPC calls

### Test API with Odoo Sync

1. Start the API server:
```bash
npm run dev
```

2. Create a customer:
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Customer",
    "contact_number": "+971501234567",
    "email_address": "test@example.com",
    "occasion_for_purchase": "Wedding",
    "budget_mentioned": "50000-100000 AED"
  }'
```

3. Check Odoo CRM for the created customer and lead

## Error Handling

- **Non-blocking**: Odoo sync failures don't affect API responses
- **Logging**: All sync operations are logged with success/failure status
- **Retry Logic**: Failed operations can be retried (configurable)
- **Graceful Degradation**: API continues to work even if Odoo is unavailable

## Monitoring

### Logs to Monitor

```bash
# Successful sync
✅ Odoo sync successful for CREATE operation

# Failed sync
❌ Odoo sync failed for UPDATE operation: Authentication failed

# Non-blocking errors
Odoo sync error (non-blocking): Connection timeout
```

### Odoo CRM Verification

1. **Customers**: Check `res.partner` model for customer records
2. **Leads**: Check `crm.lead` model for opportunity records
3. **Custom Fields**: Verify Firebase ID is stored in custom fields

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify credentials in `.env` file
   - Check Odoo server accessibility
   - Ensure API key is valid

2. **Sync Not Working**
   - Check `ODOO_SYNC_ENABLED=true`
   - Verify middleware is loaded in routes
   - Check console logs for errors

3. **Field Mapping Issues**
   - Verify field mappings in `odoo-config.js`
   - Check Odoo model field names
   - Ensure custom fields exist in Odoo

4. **Performance Issues**
   - Adjust timeout settings
   - Implement retry logic
   - Consider async processing for large datasets

### Debug Mode

Enable debug logging:

```env
ODOO_LOG_LEVEL=debug
```

This will provide detailed information about:
- RPC calls
- Authentication process
- Field mappings
- Error details

## Customization

### Adding Custom Fields

1. Create custom fields in Odoo
2. Update field mappings in `odoo-config.js`
3. Modify `formatCustomerForOdoo` function
4. Test with new field mappings

### Custom Lead Creation

Modify the `createLead` method in `OdooService` to:
- Set different lead stages
- Assign to specific users/teams
- Add custom tags or categories
- Set different priorities

### Custom Error Handling

Implement custom error handling in:
- `OdooService.makeRpcCall`
- `OdooSyncMiddleware.handleSync`
- `OdooCustomer.syncToOdoo`

## Security Considerations

- Store credentials in environment variables
- Use HTTPS for Odoo communication
- Implement proper authentication
- Log sensitive operations appropriately
- Consider rate limiting for API calls

## Performance Optimization

- Implement connection pooling
- Use batch operations for multiple records
- Cache authentication tokens
- Implement retry with exponential backoff
- Consider async processing for large datasets
