import { Account, Client, ID, Permission, Query, Role, TablesDB } from 'appwrite';

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'wishlist',
  profilesTableId: import.meta.env.VITE_APPWRITE_PROFILES_TABLE_ID || 'profiles',
  wishesTableId: import.meta.env.VITE_APPWRITE_WISHES_TABLE_ID || 'wishes',
  stepsTableId: import.meta.env.VITE_APPWRITE_STEPS_TABLE_ID || 'wish_steps',
  updatesTableId: import.meta.env.VITE_APPWRITE_UPDATES_TABLE_ID || 'wish_updates',
  helpTableId: import.meta.env.VITE_APPWRITE_HELP_TABLE_ID || 'help_offers',
  followsTableId: import.meta.env.VITE_APPWRITE_FOLLOWS_TABLE_ID || 'wish_follows',
};

export const appwriteMode = import.meta.env.VITE_APPWRITE_MODE === 'live' ? 'live' : 'demo';
export const isDemoMode = appwriteMode !== 'live';

const requiredLiveConfig = ['endpoint', 'projectId', 'databaseId', 'profilesTableId', 'wishesTableId', 'stepsTableId', 'updatesTableId', 'helpTableId', 'followsTableId'] as const;
export const appwriteConfigError =
  appwriteMode === 'live'
    ? requiredLiveConfig
        .filter((key) => !appwriteConfig[key])
        .map((key) => `Missing VITE_APPWRITE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`)
        .join('; ')
    : '';

export const appwriteClient = new Client()
  .setEndpoint(appwriteConfig.endpoint || 'http://localhost/v1')
  .setProject(appwriteConfig.projectId || 'demo-project');

export const account = new Account(appwriteClient);
export const tablesDB = new TablesDB(appwriteClient);

export { ID, Permission, Query, Role };
