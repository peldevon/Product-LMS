'use server'

import { db } from '@/db';
import { sales, qualityMetrics, shipments, orders, inventory, users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// Sales data for charts
export async function getSalesData(year: number) {
  return await db
    .select({
      month: sales.month,
      amount: sales.amount
    })
    .from(sales)
    .where(eq(sales.year, year))
    .orderBy(sql`CASE 
      WHEN ${sales.month} = 'Jan' THEN 1
      WHEN ${sales.month} = 'Feb' THEN 2
      WHEN ${sales.month} = 'Mar' THEN 3
      WHEN ${sales.month} = 'Apr' THEN 4
      WHEN ${sales.month} = 'May' THEN 5
      WHEN ${sales.month} = 'Jun' THEN 6
      WHEN ${sales.month} = 'Jul' THEN 7
      WHEN ${sales.month} = 'Aug' THEN 8
      WHEN ${sales.month} = 'Sep' THEN 9
      WHEN ${sales.month} = 'Oct' THEN 10
      WHEN ${sales.month} = 'Nov' THEN 11
      WHEN ${sales.month} = 'Dec' THEN 12
      END`);
}

// Quality metrics data
export async function getQualityData() {
  const currentDate = new Date().toISOString().split('T')[0];
  return await db
    .select({
      grade: qualityMetrics.grade,
      percentage: qualityMetrics.percentage
    })
    .from(qualityMetrics)
    .where(eq(qualityMetrics.date, currentDate));
}

// Inventory levels over time
export async function getInventoryData() {
  // Group inventory by date and sum quantities
  return await db
    .select({
      month: sql`strftime('%m', ${inventory.date})`,
      quantity: sql`SUM(${inventory.quantity})`
    })
    .from(inventory)
    .groupBy(sql`strftime('%m', ${inventory.date})`)
    .orderBy(sql`strftime('%m', ${inventory.date})`);
}

// Transportation data
export async function getTransportData() {
  // This would typically be more sophisticated, using real data aggregation
  // For simplicity, we're just counting shipments by status
  return await db
    .select({
      inTransit: sql`COUNT(CASE WHEN ${shipments.status} = 'In Transit' THEN 1 END)`,
      delivered: sql`COUNT(CASE WHEN ${shipments.status} = 'Delivered' THEN 1 END)`,
      scheduled: sql`COUNT(CASE WHEN ${shipments.status} = 'Scheduled' THEN 1 END)`
    })
    .from(shipments);
}

// Order summary data
export async function getOrderSummary() {
  return await db
    .select({
      pending: sql`COUNT(CASE WHEN ${orders.status} = 'Pending' THEN 1 END)`,
      processing: sql`COUNT(CASE WHEN ${orders.status} = 'Processing' THEN 1 END)`,
      shipped: sql`COUNT(CASE WHEN ${orders.status} = 'Shipped' THEN 1 END)`,
      delivered: sql`COUNT(CASE WHEN ${orders.status} = 'Delivered' THEN 1 END)`
    })
    .from(orders);
}

// Dashboard summary counts
export async function getDashboardSummary() {
  const [userCount, orderCount, shipmentCount, inventoryCount] = await Promise.all([
    db.select({ count: sql`COUNT(*)` }).from(users),
    db.select({ count: sql`COUNT(*)` }).from(orders),
    db.select({ count: sql`COUNT(*)` }).from(shipments),
    db.select({ sum: sql`SUM(${inventory.quantity})` }).from(inventory)
  ]);

  return {
    totalUsers: userCount[0]?.count || 0,
    totalOrders: orderCount[0]?.count || 0,
    totalShipments: shipmentCount[0]?.count || 0,
    totalInventory: inventoryCount[0]?.sum || 0
  };
} 