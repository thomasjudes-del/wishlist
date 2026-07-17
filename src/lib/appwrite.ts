import { Account, Client, Databases } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.warn(
    'Missing Appwrite environment variables. Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in your local .env file.',
  );
}

export const appwriteClient = new Client()
  .setEndpoint(endpoint ?? 'http://localhost/v1')
  .setProject(projectId ?? 'local-project');

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
