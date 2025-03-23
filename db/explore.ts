import { db } from './index';
import * as schema from './schema';

async function exploreDatabase() {
  console.log('Exploring database contents...');
  
  try {
    // Query and display users
    console.log('\n===== USERS =====');
    const allUsers = await db.select().from(schema.users);
    console.log(allUsers);
    
    // Query and display products
    console.log('\n===== PRODUCTS =====');
    const allProducts = await db.select().from(schema.products);
    console.log(allProducts);
    
    // Query and display warehouses
    console.log('\n===== WAREHOUSES =====');
    const allWarehouses = await db.select().from(schema.warehouses);
    console.log(allWarehouses);
    
    // Query and display orders
    console.log('\n===== ORDERS =====');
    const allOrders = await db.select().from(schema.orders);
    console.log(allOrders);
    
    // Add more tables as needed
    
  } catch (error) {
    console.error('Error exploring database:', error);
  }
}

exploreDatabase(); 