'use server'

import { db } from '@/db';
import { products, inventory, warehouses } from '@/db/schema';
import { and, eq, like, or } from 'drizzle-orm';

// Products actions
export async function getProducts(searchTerm = '', categoryFilter = 'All') {
  let query = db.select().from(products);
  
  if (searchTerm) {
    query = query.where(
      or(
        like(products.name, `%${searchTerm}%`),
        like(products.description, `%${searchTerm}%`),
        like(products.category, `%${searchTerm}%`)
      )
    );
  }
  
  if (categoryFilter !== 'All') {
    query = query.where(eq(products.category, categoryFilter));
  }
  
  return await query;
}

export async function getProductById(id: number) {
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(productData: Omit<typeof products.$inferInsert, 'id'>) {
  return await db.insert(products).values(productData);
}

export async function updateProduct(id: number, productData: Partial<typeof products.$inferInsert>) {
  return await db.update(products).set(productData).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  return await db.delete(products).where(eq(products.id, id));
}

// Inventory actions
export async function getInventory(productId?: number, warehouseId?: number) {
  let query = db.select({
    inventory,
    product: products,
    warehouse: warehouses
  })
  .from(inventory)
  .innerJoin(products, eq(inventory.productId, products.id))
  .innerJoin(warehouses, eq(inventory.warehouseId, warehouses.id));
  
  if (productId) {
    query = query.where(eq(inventory.productId, productId));
  }
  
  if (warehouseId) {
    query = query.where(eq(inventory.warehouseId, warehouseId));
  }
  
  return await query;
}

export async function createInventoryEntry(inventoryData: Omit<typeof inventory.$inferInsert, 'id'>) {
  return await db.insert(inventory).values(inventoryData);
}

export async function updateInventoryQuantity(id: number, quantity: number) {
  return await db.update(inventory).set({ quantity }).where(eq(inventory.id, id));
}

export async function deleteInventoryEntry(id: number) {
  return await db.delete(inventory).where(eq(inventory.id, id));
}

export async function updateInventory({ id, quantity, price }: { id: number, quantity: number, price: number }) {
  try {
    // Get the inventory entry to update
    const inventoryEntry = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, id))
      .limit(1);
    
    if (!inventoryEntry || inventoryEntry.length === 0) {
      throw new Error('Inventory entry not found');
    }
    
    // Update product price if provided
    if (price) {
      await db
        .update(products)
        .set({ price })
        .where(eq(products.id, inventoryEntry[0].productId));
    }
    
    // Update inventory quantity
    const result = await db
      .update(inventory)
      .set({ quantity })
      .where(eq(inventory.id, id));
    
    return result;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw new Error('Failed to update inventory');
  }
}

// Warehouse actions
export async function getWarehouses() {
  return await db.select().from(warehouses);
}

export async function getWarehouseById(id: number) {
  const result = await db.select().from(warehouses).where(eq(warehouses.id, id)).limit(1);
  return result[0];
}

export async function createWarehouse(warehouseData: Omit<typeof warehouses.$inferInsert, 'id'>) {
  return await db.insert(warehouses).values(warehouseData);
}

export async function updateWarehouse(id: number, warehouseData: Partial<typeof warehouses.$inferInsert>) {
  return await db.update(warehouses).set(warehouseData).where(eq(warehouses.id, id));
}

export async function deleteWarehouse(id: number) {
  return await db.delete(warehouses).where(eq(warehouses.id, id));
}
