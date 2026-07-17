# Wishlist V0

Wishlist is a React + TypeScript + Vite application for publishing wishes, building ordered paths, and letting other people offer concrete participation.

## Run locally

```bash
npm install
npm run dev
```

If Appwrite public environment variables are missing, the app enters an explicit demo mode with seeded wishes and local browser storage. This lets reviewers explore authentication-like demo access, My Wishlist, wish editing, public wish pages, following, offers, activity, sharing, and prompt templates immediately.

## Appwrite setup

1. In Appwrite Console, create or select a project and add Web platforms for `localhost` and your production domain.
2. Create database `wishlist`.
3. Create these tables: `profiles`, `wishes`, `wish_steps`, `wish_updates`, `help_offers`, and `wish_follows`.
4. Add the columns and indexes listed in `docs/APPWRITE_SCHEMA.md`.
5. Configure permissions so public profiles and public/link wishes can be read publicly, owners can manage their rows, authenticated users can create their own follows and help offers, and private wishes are readable only by their owner.
6. Copy the variables below into `.env.local` with your public values only. Do not add an API key.

```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=wishlist
VITE_APPWRITE_PROFILES_TABLE_ID=profiles
VITE_APPWRITE_WISHES_TABLE_ID=wishes
VITE_APPWRITE_STEPS_TABLE_ID=wish_steps
VITE_APPWRITE_UPDATES_TABLE_ID=wish_updates
VITE_APPWRITE_HELP_TABLE_ID=help_offers
VITE_APPWRITE_FOLLOWS_TABLE_ID=wish_follows
```

7. Verify sign-up, sign-in, creating a wish, adding and reordering steps, Explore, following, offering help, and public sharing.
