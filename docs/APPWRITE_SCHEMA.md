# Wishlist V0 — Appwrite schema and integration brief

Use the current Appwrite Web SDK / React library and the current Appwrite terminology: databases, tables, and rows.

## Environment variables

Client-side variables only:

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

Never put an Appwrite API key in client code, `.env.example`, or GitHub.

## Authentication

Use Appwrite email/password authentication for V0.

Required flows:

- create account;
- create session;
- read current account;
- sign out;
- protected routes;
- graceful unauthenticated state.

Use the official React library if it integrates cleanly with the existing Vite scaffold; otherwise use the official Web SDK directly behind a small typed service layer.

## Database

Database ID: `wishlist`

### Table: profiles

One row per authenticated user. Prefer row ID equal to the Appwrite user ID.

Columns:

- `user_id` string, required, unique;
- `display_name` string, required;
- `avatar_url` string, optional;
- `location` string, optional;
- `bio` string, optional;
- `offers_text` string, optional;
- `offer_tags` string array, optional;
- `contact_email` string, optional;
- `contact_whatsapp` string, optional;
- `contact_url` string, optional;
- `created_at` datetime, required;
- `updated_at` datetime, required.

Permissions:

- public read for profiles used on public wish pages;
- authenticated user can create and update only their own profile row.

### Table: wishes

Columns:

- `owner_id` string, required, indexed;
- `owner_name` string, required;
- `title` string, required;
- `slug` string, required, unique and indexed;
- `description` string, required;
- `image_url` string, optional;
- `visibility` enum/string: `private`, `link`, `public`, required;
- `status` enum/string: `dreaming`, `exploring`, `in_progress`, `on_hold`, `achieved`, `abandoned`, `transformed`, required;
- `location` string, optional;
- `target_date` datetime, optional;
- `accepts_help` boolean, required, default true;
- `created_at` datetime, required;
- `updated_at` datetime, required.

Indexes:

- owner_id;
- slug unique;
- visibility + updated_at;
- status + updated_at.

Permissions:

- owner has read/update/delete;
- public wishes grant public read;
- link visibility is not strong secrecy in a pure client application. For V0, implement it as an unlisted slug and document that it is accessible to anyone with the URL;
- private wishes grant read only to the owner.

### Table: wish_steps

Columns:

- `wish_id` string, required, indexed;
- `owner_id` string, required, indexed;
- `title` string, required;
- `description` string, optional;
- `position` integer, required;
- `status` enum/string: `planned`, `active`, `completed`, `skipped`, required;
- `step_type` enum/string: `action`, `test`, `milestone`, `question`, optional;
- `target_date` datetime, optional;
- `created_at` datetime, required;
- `updated_at` datetime, required.

Indexes:

- wish_id + position;
- owner_id.

Permissions:

- inherit practical visibility from the parent wish when rows are created;
- only the wish owner may create/update/delete steps.

### Table: wish_updates

Columns:

- `wish_id` string, required, indexed;
- `actor_id` string, required;
- `actor_name` string, required;
- `event_type` string, required;
- `message` string, required;
- `created_at` datetime, required.

Initial event types:

- `wish_created`;
- `step_added`;
- `step_completed`;
- `status_changed`;
- `wish_shared`;
- `help_offered`;
- `idea_added`;
- `wish_transformed`.

Permissions should mirror the parent wish’s visibility. Only the wish owner may create editorial updates; the application may create automatic activity rows after valid user actions.

### Table: help_offers

Columns:

- `wish_id` string, required, indexed;
- `step_id` string, optional, indexed;
- `wish_owner_id` string, required, indexed;
- `helper_id` string, required, indexed;
- `helper_name` string, required;
- `offer_type` enum/string: `help`, `idea`, `know_someone`, `done_this`, `join`, `offer_something`, required;
- `message` string, required;
- `contact_url` string, optional;
- `status` enum/string: `offered`, `accepted`, `declined`, `completed`, required;
- `created_at` datetime, required;
- `updated_at` datetime, required.

Permissions:

- helper and wish owner can read;
- helper can create and update their own offer;
- wish owner can update offer status;
- do not expose private contact details publicly.

### Table: wish_follows

Columns:

- `wish_id` string, required, indexed;
- `user_id` string, required, indexed;
- `created_at` datetime, required.

Unique logical key: wish_id + user_id.

Permissions:

- authenticated user can create/delete their own follow row;
- wish owner may read follower rows;
- public UI may show an aggregate count but not expose follower identities by default.

## Storage

V0 may initially accept remote image URLs to avoid blocking development on upload configuration.

When Appwrite Storage is added, create one bucket `wish-images` with:

- common web image MIME types only;
- a reasonable file-size limit;
- authenticated create;
- owner update/delete;
- public read only for images attached to public wishes.

## Frontend architecture

Create a typed repository/service layer so pages do not call Appwrite directly.

Suggested modules:

- `src/lib/appwrite.ts` — client/provider setup;
- `src/services/auth.ts`;
- `src/services/profiles.ts`;
- `src/services/wishes.ts`;
- `src/services/steps.ts`;
- `src/services/helpOffers.ts`;
- `src/services/follows.ts`;
- `src/types/domain.ts`.

Use a demo-data fallback only when required environment variables are missing. Make the demo mode explicit in the UI and keep the real Appwrite path fully implemented.

## Setup documentation

Update the README with exact Appwrite Console instructions:

1. add a Web platform for localhost and the future production domain;
2. create database and tables using the IDs above;
3. create columns and indexes;
4. configure table and row permissions;
5. copy `.env.example` to `.env.local` and add the public project values;
6. run and verify sign-up, sign-in, creating a wish, adding steps, public explore, following, and offering help.
