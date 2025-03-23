'use server'

import { db } from '@/db';
import { users } from '@/db/schema';
import { and, eq, like, or } from 'drizzle-orm';

export async function getUsers(
  searchTerm = '',
  roleFilter = 'All',
  statusFilter = 'All'
) {
  let query = db.select().from(users);
  
  if (searchTerm) {
    query = query.where(
      or(
        like(users.name, `%${searchTerm}%`),
        like(users.email, `%${searchTerm}%`)
      )
    );
  }
  
  if (roleFilter !== 'All') {
    query = query.where(eq(users.role, roleFilter as 'Admin' | 'Farmer' | 'Processor' | 'Transporter'));
  }
  
  if (statusFilter !== 'All') {
    query = query.where(eq(users.status, statusFilter as 'Active' | 'Inactive'));
  }
  
  return await query;
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function createUser(userData: Omit<typeof users.$inferInsert, 'id'>) {
  return await db.insert(users).values(userData);
}

export async function updateUser(id: number, userData: Partial<typeof users.$inferInsert>) {
  return await db.update(users).set(userData).where(eq(users.id, id));
}

export async function updateUserStatus(id: number, status: 'Active' | 'Inactive') {
  return await db.update(users).set({ status }).where(eq(users.id, id));
}

export async function deleteUser(id: number) {
  return await db.delete(users).where(eq(users.id, id));
}
