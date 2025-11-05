# Odoo Sync Setup Guide

## Overview

This system syncs Firebase customers to Odoo CRM using a scheduled task approach:
- Firebase is the source of truth
- Odoo sync runs periodically (not on every API request)
- Tracks which customers are already synced (prevents duplicates)
- New customers → Create in Odoo
- Updated customers → Update in Odoo (not create new)

## Setup Steps

### 1. Enable Odoo Sync

Edit `frontend/api/.env`:
```env
ODOO_SYNC_ENABLED=true
```

### 2. Test Manual Sync

```bash
cd frontend/api
node sync-to-odoo.js
```

This will sync all Firebase customers to Odoo.

### 3. Set Up Windows Task Scheduler (Automated Sync)

#### Option A: Using Task Scheduler GUI

1. Open **Task Scheduler** (search in Windows)
2. Click **Create Basic Task**
3. Name: "Odoo Customer Sync"
4. Trigger: **Daily** (or your preferred schedule)
5. Time: Choose when to run (e.g., every hour, every 6 hours)
6. Action: **Start a program**
7. Program/script: `node`
8. Add arguments: `sync-to-odoo.js`
9. Start in: `C:\Users\aritt\OneDrive\Desktop\A1 Future\New Projects\Jewellery-NCBxA1\frontend\api`
10. Click **Finish**

#### Option B: Using PowerShell Command

```powershell
# Create a scheduled task that runs every hour
$action = New-ScheduledTaskAction -Execute "node" -Argument "sync-to-odoo.js" -WorkingDirectory "C:\Users\aritt\OneDrive\Desktop\A1 Future\New Projects\Jewellery-NCBxA1\frontend\api"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName "OdooCustomerSync" -Action $action -Trigger $trigger -Description "Sync Firebase customers to Odoo CRM"
```

### 4. Manual Sync via API (For Testing)

#### Sync Single Customer
```bash
curl -X POST http://localhost:3000/customers/{customer_id}/sync-odoo
```

#### Sync All Customers
```bash
curl -X POST http://localhost:3000/customers/sync-all-odoo
```

## How It Works

### First Sync (New Customer)
1. Script reads customer from Firebase
2. Checks if `odoo_id` field exists
3. If NO → Creates new customer in Odoo
4. Stores Odoo ID back in Firebase (`odoo_id` field)

### Subsequent Syncs (Updated Customer)
1. Script reads customer from Firebase
2. Checks if `odoo_id` field exists
3. If YES → Updates existing Odoo customer
4. No duplicate customers created!

## Monitoring

### Check Sync Logs
The sync script outputs detailed logs:
- ✅ Created: New customers added to Odoo
- 📝 Updated: Existing customers updated in Odoo
- ❌ Failed: Errors during sync

### Verify in Odoo
1. Go to https://a1-future-crm.odoo.com
2. Navigate to Contacts
3. Check that customers match Firebase data

## Troubleshooting

### Sync Not Running
- Check Task Scheduler is enabled
- Verify Node.js is in system PATH
- Check working directory is correct

### Duplicate Customers in Odoo
- This shouldn't happen if `odoo_id` is stored correctly
- Run manual sync to fix: `node sync-to-odoo.js`

### Sync Errors
- Check API server logs
- Verify Odoo credentials in `.env`
- Test Odoo connection: `node test-odoo.js`

## Recommended Schedule

- **Development**: Manual sync only (use API endpoints)
- **Production**: Every 1-6 hours (depending on customer volume)

## Disable Sync

Edit `frontend/api/.env`:
```env
ODOO_SYNC_ENABLED=false
```

This stops all Odoo syncing without breaking Firebase operations.
