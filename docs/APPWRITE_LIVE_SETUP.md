# Appwrite live setup for Wishlist V0

Use this guide only for real multi-user live mode. Demo mode remains the default unless `VITE_APPWRITE_MODE=live` is set.

## 1. Project and platform

1. Open Appwrite Console.
2. Create or select a project.
3. Copy the public endpoint and project ID.
4. In **Overview → Platforms**, add a **Web** platform for each hostname:
   - `localhost` for local Vite development.
   - your Appwrite Sites production domain.
   - any custom production domain.

## 2. Frontend environment variables

Set these public variables in `.env.local` and in **Appwrite Sites → Settings → Environment variables**:

```env
VITE_APPWRITE_MODE=live
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=wishlist
VITE_APPWRITE_PROFILES_TABLE_ID=profiles
VITE_APPWRITE_WISHES_TABLE_ID=wishes
VITE_APPWRITE_STEPS_TABLE_ID=wish_steps
VITE_APPWRITE_UPDATES_TABLE_ID=wish_updates
VITE_APPWRITE_HELP_TABLE_ID=help_offers
VITE_APPWRITE_FOLLOWS_TABLE_ID=wish_follows
```

Do not set API keys as `VITE_` variables. API keys are server/admin credentials only.

## 3. Database and tables

Create database ID `wishlist`. Create these tables/collections with **Document security enabled** and table-level create permission `users`:

- `profiles`
- `wishes`
- `wish_steps`
- `wish_updates`
- `help_offers`
- `wish_follows`

## 4. Attributes

### `profiles`

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `user_id` | string 255 | yes | unique |
| `display_name` | string 255 | yes | |
| `avatar_url` | string 2048 | no | |
| `location` | string 255 | no | |
| `bio` | string 2000 | no | |
| `offers_text` | string 4000 | no | |
| `offer_tags` | string 64 array | no | |
| `contact_email` | string 255 | no | |
| `contact_whatsapp` | string 255 | no | |
| `contact_url` | string 2048 | no | |
| `created_at` | datetime | yes | |
| `updated_at` | datetime | yes | |

### `wishes`

`owner_id`, `owner_name`, `title`, `slug`, `description`, `image_url`, `visibility`, `status`, `location`, `target_date`, `accepts_help`, `created_at`, `updated_at`.

Enums stored as strings: `visibility` = `private`, `link`, `public`; `status` = `dreaming`, `exploring`, `in_progress`, `on_hold`, `achieved`, `abandoned`, `transformed`.

### `wish_steps`

`wish_id`, `owner_id`, `title`, `description`, `position` integer, `status`, `step_type`, `target_date`, `created_at`, `updated_at`.

`status` strings: `planned`, `active`, `completed`, `skipped`. `step_type` strings: `action`, `test`, `milestone`, `question`.

### `wish_updates`

`wish_id`, `actor_id`, `actor_name`, `event_type`, `message`, `created_at`.

Initial `event_type` strings: `wish_created`, `step_added`, `step_completed`, `status_changed`, `wish_shared`, `help_offered`, `idea_added`, `wish_transformed`.

### `help_offers`

`wish_id`, `step_id`, `wish_owner_id`, `helper_id`, `helper_name`, `offer_type`, `message`, `contact_url`, `status`, `created_at`, `updated_at`.

`offer_type` strings: `help`, `idea`, `know_someone`, `done_this`, `join`, `offer_something`. `status` strings: `offered`, `accepted`, `declined`, `completed`.

### `wish_follows`

`wish_id`, `user_id`, `created_at`.

## 5. Indexes

- `profiles`: unique `user_id`.
- `wishes`: key `owner_id`; unique `slug`; key `visibility, updated_at`; key `status, updated_at`.
- `wish_steps`: key `wish_id, position`; key `owner_id`.
- `wish_updates`: key `wish_id, created_at`.
- `help_offers`: key `wish_id, created_at`; key `step_id`; key `wish_owner_id`; key `helper_id`.
- `wish_follows`: unique `wish_id, user_id`; key `user_id`.

## 6. Row permissions used by the app

The frontend creates row-level permissions and never stores secrets.

- Profiles: anyone can read; owner can update/delete.
- Public wishes: anyone can read; owner can read/update/delete.
- Link-visible wishes: anyone with the URL can read; owner can read/update/delete. They are excluded from Explore by query.
- Private wishes: owner can read/update/delete.
- Wish steps and updates: permissions mirror the parent wish visibility; only the owner can modify steps.
- Help offers: helper and wish owner can read; helper can update/delete their own row; wish owner can update status.
- Follows: follower can read/update/delete their row; wish owner can read follower rows.

## 7. Optional idempotent setup script

Run from a trusted admin machine, not the browser bundle:

```bash
APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1 \
APPWRITE_PROJECT_ID=your-project-id \
APPWRITE_API_KEY=server-api-key-with-database-scope \
node scripts/setup-appwrite-live.mjs
```

The script creates the database, tables, attributes, and indexes using the IDs above. It treats already-existing resources as success. Never commit or expose `APPWRITE_API_KEY`.

## 8. Live verification checklist

1. Build and deploy with `VITE_APPWRITE_MODE=live` and all public variables set.
2. Sign up with email/password.
3. Save a profile.
4. Create a private wish and confirm only the owner can open it.
5. Create a link wish and confirm it opens by direct URL but does not show in Explore.
6. Create a public wish and confirm it appears in Explore.
7. Sign in as a second user, follow the public wish, and send a help offer.
8. Confirm the wish owner can see the offer and follower count while contact details are not publicly exposed by table permissions.
