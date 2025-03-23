'use server'

import { db } from '@/db';
import { shipments } from '@/db/schema';
import { and, eq, like, or } from 'drizzle-orm';

export async function getShipments(
  searchTerm = '',
  statusFilter = 'All',
  transporterFilter = 'All'
) {
  let query = db.select().from(shipments);
  
  if (searchTerm) {
    query = query.where(
      or(
        like(shipments.shipmentId, `%${searchTerm}%`),
        like(shipments.from, `%${searchTerm}%`),
        like(shipments.to, `%${searchTerm}%`)
      )
    );
  }
  
  if (statusFilter !== 'All') {
    query = query.where(eq(shipments.status, statusFilter as 'Scheduled' | 'In Transit' | 'Delivered'));
  }
  
  if (transporterFilter !== 'All') {
    query = query.where(eq(shipments.transporter, transporterFilter));
  }
  
  return await query;
}

export async function getShipmentById(id: number) {
  const result = await db.select().from(shipments).where(eq(shipments.id, id)).limit(1);
  return result[0];
}

export async function createShipment(shipmentData: Omit<typeof shipments.$inferInsert, 'id'>) {
  return await db.insert(shipments).values(shipmentData);
}

export async function updateShipment(id: number, shipmentData: Partial<typeof shipments.$inferInsert>) {
  return await db.update(shipments).set(shipmentData).where(eq(shipments.id, id));
}

export async function deleteShipment(id: number) {
  return await db.delete(shipments).where(eq(shipments.id, id));
}

export async function updateShipmentStatus(id: number, status: 'Scheduled' | 'In Transit' | 'Delivered') {
  return await db.update(shipments)
    .set({ status })
    .where(eq(shipments.id, id));
}
