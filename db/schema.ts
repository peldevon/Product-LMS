import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['Admin', 'Farmer', 'Processor', 'Transporter'] }).notNull(),
  status: text('status', { enum: ['Active', 'Inactive'] }).notNull().default('Active'),
  lastActive: text('last_active'), // Store as ISO date string
  dateJoined: text('date_joined').notNull(), // Store as ISO date string
});

// Products table
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
});

// Orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id').notNull().unique(),
  customer: text('customer').notNull(),
  totalAmount: real('total_amount').notNull(),
  orderDate: text('order_date').notNull(), // Store as ISO date string
  deliveryDate: text('delivery_date'), // Store as ISO date string
  status: text('status', { enum: ['Pending', 'Processing', 'Shipped', 'Delivered'] }).notNull(),
});

// Order items table
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
});

// Warehouses table
export const warehouses = sqliteTable('warehouses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  capacity: integer('capacity').notNull(),
  used: integer('used').notNull().default(0),
});

// Inventory table
export const inventory = sqliteTable('inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id),
  warehouseId: integer('warehouse_id').notNull().references(() => warehouses.id),
  quantity: integer('quantity').notNull(),
  date: text('date').notNull(), // Store as ISO date string
});

// Shipments table
export const shipments = sqliteTable('shipments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  shipmentId: text('shipment_id').notNull().unique(),
  from: text('from').notNull(),
  to: text('to').notNull(),
  quantity: integer('quantity').notNull(),
  transporter: text('transporter').notNull(),
  dispatchDate: text('dispatch_date').notNull(), // Store as ISO date string
  deliveryDate: text('delivery_date'), // Store as ISO date string
  status: text('status', { enum: ['Scheduled', 'In Transit', 'Delivered'] }).notNull(),
});

// Sales data table (for historical data/reports)
export const sales = sqliteTable('sales', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  month: text('month').notNull(),
  year: integer('year').notNull(),
  amount: real('amount').notNull(),
  productId: integer('product_id').references(() => products.id),
});

// Quality metrics table
export const qualityMetrics = sqliteTable('quality_metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').references(() => products.id),
  grade: text('grade', { enum: ['Grade A', 'Grade B', 'Grade C'] }).notNull(),
  percentage: real('percentage').notNull(),
  date: text('date').notNull(), // Store as ISO date string
});
