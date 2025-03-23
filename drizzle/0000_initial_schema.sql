-- Initial schema migration

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Active',
  "last_active" TEXT,
  "date_joined" TEXT NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "price" REAL NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0
);

-- Orders table
CREATE TABLE IF NOT EXISTS "orders" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" TEXT NOT NULL UNIQUE,
  "customer" TEXT NOT NULL,
  "total_amount" REAL NOT NULL,
  "order_date" TEXT NOT NULL,
  "delivery_date" TEXT,
  "status" TEXT NOT NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit_price" REAL NOT NULL,
  FOREIGN KEY ("order_id") REFERENCES "orders"("id"),
  FOREIGN KEY ("product_id") REFERENCES "products"("id")
);

-- Warehouses table
CREATE TABLE IF NOT EXISTS "warehouses" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "capacity" INTEGER NOT NULL,
  "used" INTEGER NOT NULL DEFAULT 0
);

-- Inventory table
CREATE TABLE IF NOT EXISTS "inventory" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "product_id" INTEGER NOT NULL,
  "warehouse_id" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "date_added" TEXT NOT NULL,
  FOREIGN KEY ("product_id") REFERENCES "products"("id"),
  FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id")
);

-- Shipments table
CREATE TABLE IF NOT EXISTS "shipments" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "shipment_id" TEXT NOT NULL UNIQUE,
  "origin" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "departure_date" TEXT,
  "arrival_date" TEXT,
  "status" TEXT NOT NULL,
  "transporter_id" INTEGER,
  FOREIGN KEY ("transporter_id") REFERENCES "users"("id")
);

-- Sales table
CREATE TABLE IF NOT EXISTS "sales" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" INTEGER NOT NULL,
  "sale_date" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "payment_method" TEXT,
  FOREIGN KEY ("order_id") REFERENCES "orders"("id")
);

-- Quality metrics table
CREATE TABLE IF NOT EXISTS "quality_metrics" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "product_id" INTEGER NOT NULL,
  "quality_score" REAL NOT NULL,
  "test_date" TEXT NOT NULL,
  "notes" TEXT,
  FOREIGN KEY ("product_id") REFERENCES "products"("id")
); 