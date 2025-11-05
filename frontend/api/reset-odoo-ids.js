import { db } from './src/config/firebase-admin.js';

/**
 * Reset all odoo_id fields in Firebase
 * Use this after cleaning up Odoo CRM
 */

console.log('🔄 Resetting all odoo_id fields in Firebase...');

try {
  const snapshot = await db.collection('customers').get();
  
  console.log(`Found ${snapshot.size} customers`);
  
  let count = 0;
  for (const doc of snapshot.docs) {
    await db.collection('customers').doc(doc.id).update({
      odoo_id: null,
      odoo_synced_at: null
    });
    count++;
    console.log(`✅ Reset ${doc.id}`);
  }
  
  console.log(`\n✅ Reset complete! ${count} customers ready for fresh sync.`);
  console.log('Now run: node sync-to-odoo.js');
  
} catch (error) {
  console.error('❌ Error:', error);
}
