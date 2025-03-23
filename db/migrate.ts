import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

console.log('Setting up database...');

// Direct approach to create tables
function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Connect directly to the SQLite database
    const db = new Database('sqlite.db');
    
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'Active',
        "last_active" TEXT,
        "date_joined" TEXT NOT NULL
      )
    `);
    console.log('Users table created');
    
    // Create products table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "category" TEXT,
        "price" REAL NOT NULL,
        "stock" INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('Products table created');
    
    // Create orders table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "order_id" TEXT NOT NULL UNIQUE,
        "customer" TEXT NOT NULL,
        "total_amount" REAL NOT NULL,
        "order_date" TEXT NOT NULL,
        "delivery_date" TEXT,
        "status" TEXT NOT NULL
      )
    `);
    console.log('Orders table created');
    
    // Create order_items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "order_id" INTEGER NOT NULL,
        "product_id" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL,
        "unit_price" REAL NOT NULL,
        FOREIGN KEY ("order_id") REFERENCES "orders"("id"),
        FOREIGN KEY ("product_id") REFERENCES "products"("id")
      )
    `);
    console.log('Order items table created');
    
    // Create warehouses table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "warehouses" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "capacity" INTEGER NOT NULL,
        "used" INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('Warehouses table created');
    
    // Create inventory table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "inventory" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "product_id" INTEGER NOT NULL,
        "warehouse_id" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        FOREIGN KEY ("product_id") REFERENCES "products"("id"),
        FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id")
      )
    `);
    console.log('Inventory table created');
    
    // Create shipments table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "shipments" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "shipment_id" TEXT NOT NULL UNIQUE,
        "from" TEXT NOT NULL,
        "to" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "transporter" TEXT NOT NULL,
        "dispatch_date" TEXT NOT NULL,
        "delivery_date" TEXT,
        "status" TEXT NOT NULL
      )
    `);
    console.log('Shipments table created');
    
    // Create sales table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "sales" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "month" TEXT NOT NULL,
        "year" INTEGER NOT NULL,
        "amount" REAL NOT NULL,
        "product_id" INTEGER,
        FOREIGN KEY ("product_id") REFERENCES "products"("id")
      )
    `);
    console.log('Sales table created');
    
    // Create quality_metrics table
    db.exec(`
      CREATE TABLE IF NOT EXISTS "quality_metrics" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "product_id" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        "score" REAL,
        "grade" TEXT NOT NULL,
        "percentage" REAL NOT NULL,
        "defect_rate" REAL,
        "inspector" TEXT,
        FOREIGN KEY ("product_id") REFERENCES "products"("id")
      )
    `);
    console.log('Quality metrics table created');
    
    // Close the database connection
    db.close();
    
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
}

// Ensure drizzle directories exist for migration tracking
const drizzleDir = path.join(process.cwd(), 'drizzle');
const metaDir = path.join(drizzleDir, 'meta');

if (!fs.existsSync(drizzleDir)) {
  fs.mkdirSync(drizzleDir, { recursive: true });
}

if (!fs.existsSync(metaDir)) {
  fs.mkdirSync(metaDir, { recursive: true });
}

// Create journal file if it doesn't exist
const journalPath = path.join(metaDir, '_journal.json');
if (!fs.existsSync(journalPath)) {
  fs.writeFileSync(
    journalPath,
    JSON.stringify({
      version: "5",
      dialect: "sqlite",
      entries: []
    }, null, 2)
  );
}

// Main function to run the migration
async function main() {
  try {
    // Create tables directly without using the migration file
    const success = createTables();
    
    if (!success) {
      console.error('Failed to create database tables');
      process.exit(1);
    }
    
    // Update the journal to mark migration as complete
    if (fs.existsSync(journalPath)) {
      const journal = JSON.parse(fs.readFileSync(journalPath, 'utf8'));
      // Ensure the migration is marked as applied
      if (!journal.entries.some((entry: any) => entry.tag === '0000_initial_schema')) {
        journal.entries.push({
          idx: 0,
          version: "5",
          when: Date.now().toString(),
          tag: "0000_initial_schema",
          breakpoints: true
        });
        fs.writeFileSync(journalPath, JSON.stringify(journal, null, 2));
      }
    }
    
    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

main();
