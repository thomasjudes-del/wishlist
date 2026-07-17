# Wishlist V0 — Rebuild brief

This document overrides the current UI implementation whenever it conflicts with `docs/WISHLIST_V0.md`.

## Objective

Rebuild the current interface into a coherent, usable V0 while preserving the existing domain types, demo data, Appwrite configuration and service layer where possible.

Do not add features. Do not reinterpret the product. Do not build a dashboard. Do not expose every capability on every screen.

The product must answer one simple idea:

> People publish wishes. Other people can discover them and offer concrete help.

## Product hierarchy

The primary object is the Wish.

The secondary objects are:

- its ordered path;
- its activity;
- offers of help;
- its owner.

Everything else is secondary or hidden behind an action.

## Required screens

### 1. Explore / home

Purpose: immediately understand the product and discover wishes.

Required:

- compact header;
- short hero, maximum two lines;
- one primary CTA: `Add a wish`;
- visible wish cards above the fold on desktop;
- filters: New, Active, Achieved;
- cards with image, title, owner, status, one progress cue;
- no giant typography;
- no empty decorative space.

### 2. Public wish page

Purpose: understand one wish and decide whether to help.

Required visible content only:

- image with fallback;
- title;
- owner;
- short description;
- status;
- ordered path;
- recent activity;
- helper count;
- primary action: `I can help`;
- secondary actions: Follow, Share;
- Edit only for the owner.

The `I can help` action opens a drawer or modal with:

- I want to help;
- I have an idea;
- I know someone;
- I have done this;
- I want to join;
- I can offer something.

Do not show the help form permanently.

Do not show prompt templates on the public page.

Do not show a `Share preview` block.

### 3. My Wishlist

Purpose: manage the user's own wishes.

Required:

- compact profile summary;
- list of owned wishes;
- visibility and status clearly shown;
- Add a wish;
- Edit action.

### 4. Create / edit wish

Purpose: create and manage one wish.

Required:

- title;
- description;
- image URL for V0;
- visibility;
- status;
- accepts help;
- ordered steps with add, edit, complete, delete and reorder;
- clear save confirmation and error state.

### 5. Profile

Purpose: describe what the user can offer.

Required:

- display name;
- location;
- short bio;
- what I can offer;
- tags;
- contact URL.

### 6. External AI tools

Prompt templates belong in a small utility section inside the private editor only.

Each prompt action must:

- copy the complete prompt;
- show a visible confirmation such as `Prompt copied`;
- never appear to call an AI service;
- never be presented as a core product feature.

## Interaction requirements

Every visible control must have an observable result.

- Share: native share or copy link, with confirmation.
- Follow: toggles state and label.
- Prompt: copies and confirms.
- Offer help: opens the modal, submits, closes, then updates activity/helper count.
- Save: shows success or error.
- Sign in / sign up: works in demo mode.
- Navigation: all links lead to valid pages.
- Images: always have a fallback and never show a broken-image icon.

## Demo mode

Demo mode must work without Appwrite tables.

Required:

- visible but discreet demo badge;
- seeded public wishes visible without authentication;
- demo sign-in works with the existing seeded credentials;
- creating/editing wishes persists to localStorage;
- follow and help actions persist to localStorage;
- direct URLs to seeded wishes remain stable across refreshes.

## Visual system

### Overall

Contemporary, clean, warm, human and visual.

Not retro editorial. Not luxury magazine. Not a 1990s website. Not a SaaS dashboard.

### Typography

- interface: modern sans-serif;
- optional serif accent only for selected headings;
- desktop hero maximum 72px;
- wish page title maximum 64px;
- mobile title maximum 40px;
- body minimum 16px;
- line length maximum 70 characters;
- all long text must wrap safely;
- use `overflow-wrap: anywhere` where necessary.

### Layout

- content max-width around 1200px;
- no content touching viewport edges;
- responsive grid;
- public wish page: two-column desktop, one-column mobile;
- image ratio fixed, using `object-fit: cover`;
- no horizontal overflow at any viewport.

### Palette

- warm neutral background;
- near-black text;
- one terracotta/copper accent;
- white or very light surfaces for content separation;
- avoid excessive beige-on-beige.

### Components

- restrained borders;
- small consistent radius;
- limited shadows;
- button hierarchy must be obvious;
- no badge soup;
- no permanently visible admin forms on public pages.

## Acceptance tests

Before completion, verify at 1440px, 1024px, 768px and 390px widths.

The rebuild is accepted only if:

1. no text overlaps or escapes its container;
2. no broken image icon appears;
3. no horizontal scroll exists;
4. all visible buttons provide feedback;
5. Explore is usable without signing in;
6. demo authentication works;
7. a wish can be created, edited and reopened after refresh;
8. path steps can be reordered;
9. help can be offered from the public wish page;
10. prompt copying works from the private editor with visible confirmation;
11. lint and production build pass;
12. screenshots of the key screens are reviewed before merge.

## Implementation rule

Do the rebuild on a new branch and open a pull request. Do not merge automatically.

Keep the current service layer unless a bug requires a change. Replace the UI structure and styles as needed.
