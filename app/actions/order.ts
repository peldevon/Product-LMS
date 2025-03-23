'use server'

import { db } from '@/db';
import { orders, orderItems, products } from '@/db/schema';
import { and, eq, like, or } from 'drizzle-orm';

export async function getOrders(
  searchTerm = '',
  statusFilter = 'All'
) {
  let query = db.select().from(orders);
  
  if (searchTerm) {
    query = query.where(
      or(
        like(orders.orderId, `%${searchTerm}%`),
        like(orders.customer, `%${searchTerm}%`)
      )
    );
  }
  
  if (statusFilter !== 'All') {
    query = query.where(eq(orders.status, statusFilter as 'Pending' | 'Processing' | 'Shipped' | 'Delivered'));
  }
  
  return await query;
}

export async function getOrderById(id: number) {
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0];
}

export async function getOrderItems(orderId: number) {
  return await db.select({
    item: orderItems,
    product: products,
  })
  .from(orderItems)
  .innerJoin(products, eq(orderItems.productId, products.id))
  .where(eq(orderItems.orderId, orderId));
}

export async function createOrder(orderData: Omit<typeof orders.$inferInsert, 'id'>) {
  return await db.insert(orders).values(orderData);
}

export async function updateOrder(id: number, orderData: Partial<typeof orders.$inferInsert>) {
  return await db.update(orders).set(orderData).where(eq(orders.id, id));
}

export async function deleteOrder(id: number) {
  // First delete related order items
  await db.delete(orderItems).where(eq(orderItems.orderId, id));
  // Then delete the order
  return await db.delete(orders).where(eq(orders.id, id));
}

export async function createOrderItem(orderItemData: Omit<typeof orderItems.$inferInsert, 'id'>) {
  return await db.insert(orderItems).values(orderItemData);
}

export async function deleteOrderItem(id: number) {
  return await db.delete(orderItems).where(eq(orderItems.id, id));
}
