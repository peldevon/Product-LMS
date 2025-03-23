'use server'

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

// Type definitions
type User = {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Farmer' | 'Processor' | 'Transporter';
  status: 'Active' | 'Inactive';
  lastActive: string;
  dateJoined: string;
}

type AuthResult = {
  success: boolean;
  user?: User;
  error?: string;
}

type RegistrationResult = {
  success: boolean;
  user?: User;
  error?: string;
}

// Login authentication
export async function authenticateUser({ email, password }: { email: string, password: string }): Promise<AuthResult> {
  try {
    // In a real app, you would hash the password and compare hashes
    // For demo purposes, we're doing direct comparison
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (result.length === 0) {
      return { success: false, error: "User not found" };
    }
    
    const user = result[0];
    
    if (user.password !== password) {
      return { success: false, error: "Invalid password" };
    }
    
    if (user.status === 'Inactive') {
      return { success: false, error: "Account is inactive" };
    }
    
    // Update last active timestamp
    await db
      .update(users)
      .set({ lastActive: new Date().toISOString() })
      .where(eq(users.id, user.id));
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    // Set a cookie for user session
    const cookieStore = cookies();
    cookieStore.set('userId', String(user.id), { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    return {
      success: true,
      user: userWithoutPassword as User
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

// User registration
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Farmer' | 'Processor' | 'Transporter';
}): Promise<RegistrationResult> {
  try {
    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
    
    if (existingUser.length > 0) {
      return { success: false, error: "Email already registered" };
    }
    
    // In a real app, you would hash the password before storing
    const result = await db.insert(users).values({
      name: userData.name,
      email: userData.email,
      password: userData.password, // Should be hashed in production
      role: userData.role,
      status: 'Active',
      lastActive: new Date().toISOString(),
      dateJoined: new Date().toISOString(),
    }).returning();
    
    if (result.length === 0) {
      return { success: false, error: "Registration failed" };
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = result[0];
    
    return {
      success: true,
      user: userWithoutPassword as User
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed" };
  }
}

// Get all users (for admin dashboard)
export async function getUsers() {
  try {
    const result = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      lastActive: users.lastActive,
      dateJoined: users.dateJoined,
    }).from(users);
    
    return result;
  } catch (error) {
    console.error("Failed to get users:", error);
    throw new Error("Failed to get users");
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) return null;
    
    const result = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      lastActive: users.lastActive,
      dateJoined: users.dateJoined,
    }).from(users).where(eq(users.id, parseInt(userId))).limit(1);
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

// Update user status
export async function updateUserStatus(userId: number, status: 'Active' | 'Inactive') {
  try {
    const result = await db
      .update(users)
      .set({ status })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0];
  } catch (error) {
    console.error("Failed to update user status:", error);
    throw new Error("Failed to update user status");
  }
}

// Logout user
export async function logoutUser() {
  const cookieStore = cookies();
  cookieStore.delete('userId');
  return { success: true };
} 