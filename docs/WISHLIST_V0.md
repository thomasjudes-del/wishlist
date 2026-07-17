# Wishlist V0 — Product and visual build brief

## Product idea

Wishlist is a lightweight place where people publish what they would genuinely like to make happen, map a path toward it, and let other people jump in to help.

It is not a life-coaching product, a productivity dashboard, a crowdfunding platform, or a noisy social network.

Core line:

> Share a wish. Build the path. Let people jump in.

The primary object is a **Wish**. A public wish that accepts participation can be called an **Open Wish**.

## V0 goal

Validate that users will:

1. create several wishes;
2. make some private, some link-shared, and some public;
3. maintain an ordered path of steps toward each wish;
4. discover wishes from other people;
5. offer useful participation to a whole wish or to one specific step;
6. share public wish pages outside the product.

## Core user flow

1. Arrive on a striking but very simple landing page.
2. Create an account or sign in.
3. Create a first wish with a title and short description.
4. Choose visibility: Private, Shared by link, or Public.
5. Optionally add an image.
6. Build an ordered path with as many steps as needed.
7. Publish updates as the wish changes.
8. Share the public wish page.
9. Other users can follow, participate, offer help, add an idea, or say they know someone.
10. Detailed exchanges leave Wishlist through WhatsApp, email, or another external contact link. Do not build internal messaging in V0.

## Main objects

### Wish

Fields and behaviour:

- title;
- short description;
- optional image;
- owner;
- created and updated dates;
- visibility: private, link, public;
- status: dreaming, exploring, in_progress, on_hold, achieved, abandoned, transformed;
- optional location;
- optional target date;
- accepts participation yes/no;
- shareable slug;
- ordered path;
- updates/activity;
- followers;
- helpers and participation offers.

### Path step

- belongs to one wish;
- ordered freely, with no artificial three-level limit;
- title;
- optional description;
- status: planned, active, completed, skipped;
- optional date;
- optional type: action, test, milestone, question;
- can receive a specific help offer.

### Participation / help offer

A user may help the whole wish or one step.

Types:

- I want to help;
- I have an idea;
- I know someone;
- I’ve done this;
- I want to join;
- I can offer something.

Each offer has a short message and an optional external contact URL. Keep it lightweight and concrete.

### User profile

Keep onboarding minimal:

- display name;
- optional avatar;
- optional approximate location;
- optional short line;
- external contact links;
- **What I can offer**: free text plus tags for skills, time, equipment, places, transport, contacts, experience, or introductions;
- public wishes;
- wishes followed;
- help offered.

### Activity

Each wish has a human-readable activity stream, for example:

- Thomas added a step;
- Sarah offered to help;
- A milestone was completed;
- The wish became public;
- A new idea was proposed;
- The wish was transformed.

This creates movement and allows followers to understand what changed. It is an effect of the product, not a separate “momentum” feature.

## Required screens

1. **Landing / Explore**
   - immediately show real or seeded wishes;
   - main question: “What would you love to make happen?”;
   - primary actions: Add a wish and Explore;
   - no corporate explanation above the wishes.

2. **Authentication**
   - email/password first;
   - sign up, sign in, sign out;
   - no long onboarding.

3. **My Wishlist**
   - all of the user’s wishes;
   - clear visibility and status;
   - add a wish;
   - compact profile area showing what the user can offer.

4. **Create / edit a wish**
   - start with title and description;
   - visibility;
   - status;
   - image optional;
   - path editor with add, edit, complete, delete, and reorder.

5. **Public wish page**
   - the visual centre of the product;
   - title, image, owner, description, status, path, updates, helpers;
   - actions: Follow, I want to help / participate, Add an idea, Share;
   - external sharing via Web Share API where available and copy-link fallback.

6. **Explore**
   - simple wall of public wishes;
   - initial filters only: New, Active, Achieved, I may be able to help;
   - no complex recommendation algorithm.

7. **Profile**
   - public wishes;
   - what the person can offer;
   - wishes followed and help offered where public.

## AI use in V0

Do not call any paid AI API.

Wishlist is compatible with any external AI. For each wish provide optional prompt templates that the user can copy:

- Clarify this wish;
- Reality-check this wish;
- Turn this wish into an ordered path;
- Identify assumptions to test;
- Propose the smallest useful experiment;
- Improve the public presentation.

The user can paste a result back manually. AI is supportive, not the product’s centre.

## Visual direction

The product should feel like **a beautiful place for unfinished wishes**, not a SaaS dashboard.

### Character

- editorial, human, visual, contemporary;
- warm and desirable, but never sentimental or “self-development” coded;
- simple enough to understand in seconds;
- distinctive enough that a screenshot is recognisable without the logo.

### Avoid absolutely

- purple AI gradients;
- generic SaaS dashboard layouts;
- KPI widgets, charts, tables, and sidebars full of menus;
- Material Design defaults;
- heavy shadows and rounded-card overload;
- motivational-coach language;
- likes, vanity reactions, and generic encouragement;
- Kickstarter-style fundraising presentation;
- gamification, points, currencies, badges, or streaks.

### Palette

- warm off-white background, not clinical white;
- near-black typography;
- one restrained accent colour only, initially deep copper / terracotta;
- muted photographic colours.

### Typography

- large editorial display type for wish titles;
- highly legible sans-serif for interface text;
- generous spacing;
- very limited number of weights and sizes.

### Images

- photography is prominent;
- no generic AI illustrations or clip art;
- seed content may use carefully selected remote placeholder photographs, but code must make replacement easy.

### Cards

Wish cards should be large and emotionally legible:

- one image;
- one wish title;
- owner;
- one understated status/progress cue;
- latest meaningful update or number of people involved;
- no badge soup.

### Path

Do not style the path like a corporate to-do list. It should read as a sequence or route, with steps visibly ordered and completed steps calmly distinguished.

### Activity

Display activity as a sparse journal, not a technical log.

### Motion

- subtle and purposeful;
- quick enough to feel responsive;
- no decorative animation overload.

### Mobile

Mobile-first, single-column where possible, thumb-friendly controls, no horizontal overflow.

## Low-cost viral mechanics required in V0

- every public wish has a clean, memorable URL;
- native share button plus copy-link fallback;
- public page looks good when screenshotted;
- compact share-preview component showing title, image, owner, status, number of steps and helpers;
- follow a wish and see its latest activity inside the app;
- seeded demo content should cover very different wishes, not only entrepreneurial or charitable projects.

Seed examples:

- Cross the Atlantic with my children;
- Find the person I want to build a life with;
- Open a tiny jazz café;
- Take my mother to see Rome;
- Walk across Japan;
- Write and publish my first graphic novel.

## Explicitly out of scope

- payments and crowdfunding;
- internal chat;
- wish points or help points;
- complex matching;
- push notifications and email campaigns;
- identity verification;
- advanced moderation;
- native mobile apps;
- groups and communities;
- AI API integration;
- public comments or likes;
- booking and marketplace functions.

## Quality bar

A new user must be able to understand the concept, create a wish, add ordered steps, publish or share it, and offer help to another wish without instructions.

The application must build without errors, be responsive, and include clear empty, loading, success, and failure states.