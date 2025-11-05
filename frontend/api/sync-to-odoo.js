import odooSyncService from "./src/services/odooSyncService.js";

/**
 * Scheduled Odoo Sync Script
 * Run this periodically using Windows Task Scheduler
 *
 * To set up in Windows Task Scheduler:
 * 1. Open Task Scheduler
 * 2. Create Basic Task
 * 3. Trigger: Daily (or your preferred schedule)
 * 4. Action: Start a program
 * 5. Program: node
 * 6. Arguments: sync-to-odoo.js
 * 7. Start in: C:\path\to\frontend\api
 */

console.log("🚀 Starting Odoo sync job...");
console.log("Time:", new Date().toISOString());

try {
  const results = await odooSyncService.syncAllCustomers();

  console.log("\n📊 Sync Results:");
  console.log(`   Total customers: ${results.total}`);
  console.log(`   ✅ Created: ${results.created}`);
  console.log(`   📝 Updated: ${results.updated}`);
  console.log(`   ❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log("\n❌ Errors:");
    results.errors.forEach((err) => {
      console.log(`   - ${err.id}: ${err.error}`);
    });
  }

  console.log("\n✅ Sync job completed successfully");
  process.exit(0);
} catch (error) {
  console.error("\n❌ Sync job failed:", error);
  process.exit(1);
}
