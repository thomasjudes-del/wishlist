# Wishlist Agent Notes

This repository is a React + TypeScript + Vite application for the Wishlist V0.

Before changing product code, read and follow:

- `docs/WISHLIST_V0.md`
- `docs/APPWRITE_SCHEMA.md`

Build the V0 described in those documents. Preserve the existing stack unless a change is technically necessary.

Priorities:

1. a working, responsive product rather than a static concept page;
2. Appwrite authentication and typed data services;
3. the core Wish, Path, Help, Explore, Profile, Follow, Activity, privacy, and sharing flows;
4. a distinctive editorial visual identity that avoids generic SaaS and self-development aesthetics;
5. seeded demo data and an explicit demo fallback when Appwrite public environment variables are missing;
6. successful lint and production build.

Never commit secrets or an Appwrite API key. Client code may use only public Appwrite endpoint, project ID, database ID, and table IDs from Vite environment variables.

When a task is completed, run the available lint/build checks, fix errors, and summarize what remains to configure manually in Appwrite.