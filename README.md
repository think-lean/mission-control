# Mission Control

Cristina & Jesus - Personal Command Center

## Features

- **Task Board**: Track tasks with status (todo, in_progress, done, blocked), assign to Cristina or Jesus, and set priorities
- **Memory Screen**: Searchable database of everything remembered about conversations, preferences, goals, and insights

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- Convex (real-time database)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Convex:
   ```bash
   npx convex dev
   ```
   This will prompt you to log in to Convex and create a project.

3. Copy the Convex URL from the output and add it to `.env.local`:
   ```
   NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Deploying

### Deploy Convex Backend
```bash
npx convex deploy
```

### Deploy Frontend (Vercel)
```bash
npm i -g vercel
vercel
```

Or push to GitHub and connect to Vercel for automatic deploys.

## Usage

- **Adding Tasks**: Click "New Task" to create tasks. Assign to Cristina or Jesus, set priority, and track status
- **Adding Memories**: Click "Add Memory" to save important information. Categorize as Personal, Work, Preference, Goal, or Insight
- **Search**: Use the search bar to find memories by content
