'use client';

// Type for user data
type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  dateJoined: string;
};

// Store user data in local storage
export function storeUserData(userData: UserData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(userData));
  }
}

// Retrieve user data from local storage
export function getUserData(): UserData | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
  }
  return null;
}

// Clear user data from local storage
export function clearUserData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
} 