import { db } from './index';
import { 
  users, 
  products, 
  orders, 
  orderItems, 
  warehouses, 
  shipments, 
  inventory,
  sales,
  qualityMetrics
} from './schema';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// Function to safely delete from a table if it exists
async function safeDelete(table: any, tableName: string) {
  try {
    await db.delete(table);
    console.log(`Cleared table: ${tableName}`);
  } catch (error) {
    console.log(`Table ${tableName} may not exist yet, skipping delete`);
  }
}

// Function to run SQL file with multiple statements
function executeSqlFile(filePath: string) {
  console.log(`Executing SQL file: ${filePath}`);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Split on semicolons but keep comments intact
  const statements = sql.split(';')
    .map(statement => statement.trim())
    .filter(statement => 
      statement.length > 0 && 
      !statement.startsWith('--') // Skip standalone comments
    );

  // Get a direct database connection
  const sqlite = new Database('sqlite.db');

  // Execute each statement
  for (const statement of statements) {
    if (statement) {
      try {
        sqlite.exec(statement);
        console.log(`Successfully executed statement`);
      } catch (error) {
        // If table already exists, continue
        if (error.message.includes('already exists')) {
          console.log(`Table already exists, continuing...`);
        } else {
          console.error(`Error executing statement: ${error.message}`);
        }
      }
    }
  }

  // Close the connection
  sqlite.close();
}

async function seed() {
  console.log('Seeding database...');
  
  try {
    // First ensure all tables exist by running the schema script
    console.log('Ensuring tables exist...');
    const migrationFile = path.join(process.cwd(), 'drizzle', '0000_initial_schema.sql');
    if (fs.existsSync(migrationFile)) {
      executeSqlFile(migrationFile);
    } else {
      console.error('Migration file not found. Tables may not be created properly.');
    }
    
    // Clear existing data (optional - only for development/testing)
    // Use safe delete to avoid errors if tables don't exist
    await safeDelete(orderItems, 'order_items');
    await safeDelete(inventory, 'inventory');
    await safeDelete(sales, 'sales');
    await safeDelete(qualityMetrics, 'quality_metrics');
    await safeDelete(shipments, 'shipments');
    await safeDelete(orders, 'orders');
    await safeDelete(products, 'products');
    await safeDelete(warehouses, 'warehouses');
    await safeDelete(users, 'users');
    
    // Seed users (from app/dashboard/admin/users/page.tsx)
    console.log('Seeding users...');
    await db.insert(users).values([
      {
        name: 'Admin User',
        email: 'admin@cassava.com',
        password: 'admin123', // In real app, use password hashing
        role: 'Admin',
        status: 'Active',
        lastActive: new Date().toISOString(),
        dateJoined: '2023-01-15',
      },
      {
        name: 'Farmer User',
        email: 'farmer@cassava.com',
        password: 'farmer123',
        role: 'Farmer',
        status: 'Active',
        lastActive: new Date().toISOString(),
        dateJoined: '2023-02-20',
      },
      {
        name: 'Processor User',
        email: 'processor@cassava.com',
        password: 'processor123',
        role: 'Processor',
        status: 'Active',
        lastActive: new Date().toISOString(),
        dateJoined: '2023-03-10',
      },
      {
        name: 'Transporter User',
        email: 'transporter@cassava.com',
        password: 'transporter123',
        role: 'Transporter',
        status: 'Active',
        lastActive: new Date().toISOString(),
        dateJoined: '2023-04-05',
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.williams@cassava.com',
        password: 'password123',
        role: 'Farmer',
        status: 'Inactive',
        lastActive: '2023-10-25 14:30',
        dateJoined: '2023-05-12',
      },
      {
        name: 'David Miller',
        email: 'david.miller@cassava.com',
        password: 'password123',
        role: 'Processor',
        status: 'Active',
        lastActive: '2023-11-04 10:15',
        dateJoined: '2023-06-22',
      }
    ]);
    
    // Seed products
    console.log('Seeding products...');
    await db.insert(products).values([
      {
        name: 'Cassava Flour',
        description: 'High quality cassava flour',
        category: 'Flour',
        price: 5.0,
        stock: 1200,
      },
      {
        name: 'Cassava Starch',
        description: 'Refined cassava starch',
        category: 'Starch',
        price: 6.5,
        stock: 800,
      },
      {
        name: 'Cassava Chips',
        description: 'Dried cassava chips',
        category: 'Chips',
        price: 3.5,
        stock: 1500,
      },
      {
        name: 'Fresh Cassava',
        description: 'Fresh cassava roots',
        category: 'Raw',
        price: 2.0,
        stock: 3000,
      }
    ]);
    
    // Seed warehouses (from lib/chart-data.ts warehouseData)
    console.log('Seeding warehouses...');
    await db.insert(warehouses).values([
      {
        name: 'Warehouse A',
        location: 'Location A',
        capacity: 10000,
        used: 6500,
      },
      {
        name: 'Warehouse B',
        location: 'Location B',
        capacity: 8000,
        used: 7200,
      },
      {
        name: 'Warehouse C',
        location: 'Location C',
        capacity: 12000,
        used: 5800,
      },
      {
        name: 'Warehouse D',
        location: 'Location D',
        capacity: 15000,
        used: 9000,
      }
    ]);
    
    // Seed orders (from app/dashboard/admin/orders/page.tsx)
    console.log('Seeding orders...');
    const ordersData = [
      {
        orderId: 'ORD-1001',
        customer: 'Customer A',
        totalAmount: 5000,
        orderDate: '2023-11-10',
        deliveryDate: '2023-11-17',
        status: 'Processing',
      },
      {
        orderId: 'ORD-1002',
        customer: 'Customer B',
        totalAmount: 3500,
        orderDate: '2023-11-08',
        deliveryDate: '2023-11-15',
        status: 'Shipped',
      },
      {
        orderId: 'ORD-1003',
        customer: 'Customer C',
        totalAmount: 7000,
        orderDate: '2023-11-05',
        deliveryDate: '2023-11-12',
        status: 'Delivered',
      },
      {
        orderId: 'ORD-1004',
        customer: 'Customer D',
        totalAmount: 2500,
        orderDate: '2023-11-09',
        deliveryDate: '2023-11-16',
        status: 'Processing',
      },
      {
        orderId: 'ORD-1005',
        customer: 'Customer E',
        totalAmount: 4000,
        orderDate: '2023-11-03',
        deliveryDate: '2023-11-10',
        status: 'Pending',
      },
    ];
    const orderInsertResult = await db.insert(orders).values(ordersData).returning({ id: orders.id, orderId: orders.orderId });
    
    // Map order IDs to their database IDs for order items
    const orderIdMap = orderInsertResult.reduce((map, order) => {
      map[order.orderId] = order.id;
      return map;
    }, {} as Record<string, number>);
    
    // Get product IDs
    const productsResult = await db.select({ id: products.id, name: products.name }).from(products);
    const productIdMap = productsResult.reduce((map, product) => {
      map[product.name] = product.id;
      return map;
    }, {} as Record<string, number>);
    
    // Seed order items
    console.log('Seeding order items...');
    await db.insert(orderItems).values([
      {
        orderId: orderIdMap['ORD-1001'],
        productId: productIdMap['Cassava Flour'],
        quantity: 1000,
        unitPrice: 5.0,
      },
      {
        orderId: orderIdMap['ORD-1002'],
        productId: productIdMap['Cassava Starch'],
        quantity: 500,
        unitPrice: 7.0,
      },
      {
        orderId: orderIdMap['ORD-1003'],
        productId: productIdMap['Cassava Chips'],
        quantity: 2000,
        unitPrice: 3.5,
      },
      {
        orderId: orderIdMap['ORD-1004'],
        productId: productIdMap['Fresh Cassava'],
        quantity: 1250,
        unitPrice: 2.0,
      },
      {
        orderId: orderIdMap['ORD-1005'],
        productId: productIdMap['Cassava Flour'],
        quantity: 800,
        unitPrice: 5.0,
      },
    ]);
    
    // Seed shipments (from app/dashboard/admin/transportation/page.tsx)
    console.log('Seeding shipments...');
    await db.insert(shipments).values([
      {
        shipmentId: 'SHP-1001',
        from: 'Farm A',
        to: 'Processor B',
        quantity: 1500,
        transporter: 'Transporter X',
        dispatchDate: '2023-11-05',
        deliveryDate: '2023-11-07',
        status: 'In Transit',
      },
      {
        shipmentId: 'SHP-1002',
        from: 'Farm C',
        to: 'Processor A',
        quantity: 2000,
        transporter: 'Transporter Y',
        dispatchDate: '2023-11-06',
        deliveryDate: '2023-11-08',
        status: 'Scheduled',
      },
      {
        shipmentId: 'SHP-1003',
        from: 'Farm B',
        to: 'Processor C',
        quantity: 1200,
        transporter: 'Transporter Z',
        dispatchDate: '2023-11-04',
        deliveryDate: '2023-11-06',
        status: 'Delivered',
      },
      {
        shipmentId: 'SHP-1004',
        from: 'Farm D',
        to: 'Processor B',
        quantity: 800,
        transporter: 'Transporter X',
        dispatchDate: '2023-11-03',
        deliveryDate: '2023-11-05',
        status: 'Delivered',
      },
      {
        shipmentId: 'SHP-1005',
        from: 'Farm A',
        to: 'Processor C',
        quantity: 1000,
        transporter: 'Transporter Y',
        dispatchDate: '2023-11-07',
        deliveryDate: '2023-11-09',
        status: 'Scheduled',
      },
    ]);
    
    // Seed inventory data
    console.log('Seeding inventory...');
    const warehousesResult = await db.select({ id: warehouses.id, name: warehouses.name }).from(warehouses);
    const warehouseIdMap = warehousesResult.reduce((map, warehouse) => {
      map[warehouse.name] = warehouse.id;
      return map;
    }, {} as Record<string, number>);
    
    await db.insert(inventory).values([
      {
        productId: productIdMap['Cassava Flour'],
        warehouseId: warehouseIdMap['Warehouse A'],
        quantity: 2500,
        date: new Date().toISOString().split('T')[0],
      },
      {
        productId: productIdMap['Cassava Starch'],
        warehouseId: warehouseIdMap['Warehouse B'],
        quantity: 1800,
        date: new Date().toISOString().split('T')[0],
      },
      {
        productId: productIdMap['Cassava Chips'],
        warehouseId: warehouseIdMap['Warehouse C'],
        quantity: 3200,
        date: new Date().toISOString().split('T')[0],
      },
      {
        productId: productIdMap['Fresh Cassava'],
        warehouseId: warehouseIdMap['Warehouse D'],
        quantity: 5000,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    
    // Seed sales data (from lib/chart-data.ts salesData)
    console.log('Seeding sales data...');
    const currentYear = new Date().getFullYear();
    await db.insert(sales).values([
      { month: 'Jan', year: currentYear, amount: 12000, productId: null },
      { month: 'Feb', year: currentYear, amount: 19000, productId: null },
      { month: 'Mar', year: currentYear, amount: 24000, productId: null },
      { month: 'Apr', year: currentYear, amount: 18000, productId: null },
      { month: 'May', year: currentYear, amount: 28000, productId: null },
      { month: 'Jun', year: currentYear, amount: 32000, productId: null },
      { month: 'Jul', year: currentYear, amount: 27000, productId: null },
      { month: 'Aug', year: currentYear, amount: 35000, productId: null },
      { month: 'Sep', year: currentYear, amount: 30000, productId: null },
      { month: 'Oct', year: currentYear, amount: 25000, productId: null },
      { month: 'Nov', year: currentYear, amount: 22000, productId: null },
      { month: 'Dec', year: currentYear, amount: 28000, productId: null },
    ]);
    
    // Seed quality metrics data (from lib/chart-data.ts qualityData)
    console.log('Seeding quality metrics data...');
    const today = new Date().toISOString().split('T')[0];
    await db.insert(qualityMetrics).values([
      { 
        productId: productIdMap['Cassava Flour'],
        grade: 'Grade A', 
        percentage: 65, 
        date: today 
      },
      { 
        productId: productIdMap['Cassava Flour'],
        grade: 'Grade B', 
        percentage: 25, 
        date: today 
      },
      { 
        productId: productIdMap['Cassava Flour'],
        grade: 'Grade C', 
        percentage: 10, 
        date: today 
      },
    ]);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
