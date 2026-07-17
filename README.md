# Wishlist

Wishlist is a React and TypeScript web application scaffolded with Vite. This repository currently contains only the project foundation; product requirements and visual direction will be supplied next.

## Tech stack

- [Vite](https://vite.dev/) for local development and production builds
- [React](https://react.dev/) with TypeScript
- [React Router](https://reactrouter.com/) for client-side routing
- [Appwrite](https://appwrite.io/) client SDK configured through environment variables

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- An Appwrite project endpoint and project ID for local integration work

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy the example environment file and fill in your local Appwrite values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
| --- | --- |
| `VITE_APPWRITE_ENDPOINT` | Appwrite API endpoint, such as `https://cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite project ID for this application |

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project structure

```text
.
├── public/             # Static assets served by Vite
├── src/
│   ├── lib/            # Shared integrations such as Appwrite
│   ├── routes/         # Route definitions and route pages
│   ├── App.tsx         # Root application layout
│   ├── main.tsx        # React entry point
│   └── styles.css      # Global styles
├── .env.example        # Safe environment variable template
└── vite.config.ts      # Vite configuration
```
