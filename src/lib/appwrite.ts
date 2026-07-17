import { Account, Client, Databases, ID, Query } from 'appwrite';

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'wishlist',
  profilesTableId: import.meta.env.VITE_APPWRITE_PROFILES_TABLE_ID || 'profiles',
  wishesTableId: import.meta.env.VITE_APPWRITE_WISHES_TABLE_ID || 'wishes',
  steps