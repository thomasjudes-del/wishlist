/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_APPWRITE_ENDPOINT?: string; readonly VITE_APPWRITE_PROJECT_ID?: string; readonly VITE_APPWRITE_DATABASE_ID?: string; readonly VITE_APPWRITE_PROFILES_TABLE_ID?: string; readonly VITE_APPWRITE_WISHES_TABLE_ID?: string; readonly VITE_APPWRITE_STEPS_TABLE_ID?: string; readonly VITE_APPWRITE_UPDATES_TABLE_ID?: string; readonly VITE_APPWRITE_HELP_TABLE_ID?: string; readonly VITE_APPWRITE_FOLLOWS_TABLE_ID?: string; }
interface ImportMeta { readonly env: ImportMetaEnv; }
