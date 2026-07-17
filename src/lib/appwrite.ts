import { Account, Client, Databases, ID, Query } from 'appwrite';
export const appwriteConfig = { endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT, projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID, databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'wishlist', profilesTableId: import.meta.env.VITE_APPWRITE_PROFILES_TABLE_ID || 'profiles', wishesTableId: import.meta.env.VITE_APPWRITE_WISHES_TABLE_ID || 'wishes', stepsTableId: import.meta.env.VITE_APPWRITE_STEPS_TABLE_ID || 'wish_steps', updatesTableId: import.meta.env.VITE_APPWRITE_UPDATES_TABLE_ID || 'wish_updates', helpTableId: import.meta.env.VITE_APPWRITE_HELP_TABLE_ID || 'help_offers', followsTableId: import.meta.env.VITE_APPWRITE_FOLLOWS_TABLE_ID || 'wish_follows' };
export const isDemoMode = !appwriteConfig.endpoint || !appwriteConfig.projectId;
export const appwriteClient = new Client().setEndpoint(appwriteConfig.endpoint || 'http://localhost/v1').setProject(appwriteConfig.projectId || 'demo-project');
export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export { ID, Query };
