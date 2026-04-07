# Guess The Year - Project & Memory Documentation

## 1. Project Overview
**Guess The Year** is an interactive, web-based multiplayer trivia game where players listen to music clips and attempt to guess the release year of the song. The application is built using modern web development technologies.

### 1.1 Tech Stack
- **Frontend Framework:** React 19
- **Build Tool:** Vite 8
- **Backend / Database:** Supabase (PostgreSQL, Realtime, Auth)
- **Styling:** Vanilla CSS (`App.css`, `index.css`)
- **Package Manager:** npm

### 1.2 Core Dependencies
- `@supabase/supabase-js`: Client for interacting with the Supabase backend.
- `pg`: PostgreSQL client.
- `react`, `react-dom`: UI library for building components.

## 2. Directory Structure & Architecture
The project follows a standard React/Vite structure, separated into logical modules:

- **`/src`**: Contains all frontend UI components and styles.
  - `App.jsx`, `Game.jsx`, `Lobby.jsx`: Main game views and logic.
  - `Auth.jsx`, `DecadeSelect.jsx`, `MusicTypeSelect.jsx`: Supplementary user interface and configuration components.
  - `lib/supabase.js`: Local Supabase client initialization.
- **`/lib`**: Server-side or shared logic modules.
  - `auth.ts`, `roles.ts`, `supabase.ts`: Handles authentication, role-based access, and database interactions.
- **`/supabase`**: Contains backend database schemas and logic.
  - `migrations/`: SQL migration files defining the initial schema and multiplayer logic (`001_initial_schema.sql`, `002_multiplayer.sql`).
- **`/docs`**: Contains existing project documentation.
- **`/public`**: Static assets like icons and favicons.

## 3. Project Memory & Recent Tasks
*This section serves as a living memory of significant operations, bug fixes, and architectural decisions made during development.*

### 3.1 YouTube Video Link Remediation (April 2026)
- **Issue:** Several YouTube video clips in the `HEBREW_SONGS` array inside `src/Game.jsx` were no longer available or embedded, resulting in an inability to play the song snippet during the game.
- **Action Taken:**
  - Audited 150 predefined Hebrew songs across multiple decades (70s, 80s, 90s, 00s, 10s, 20s).
  - Implemented an automated script querying the YouTube `oembed` API to validate the embedded playback status of every `youtubeId`.
  - Identified that **117 video links** were broken (returning 404 or 403 errors).
  - Utilized a temporary integration with `yt-search` to search for replacements using the song title and artist.
  - Automatically replaced all 117 broken IDs with fresh, working YouTube IDs directly within `src/Game.jsx`.
- **Outcome:** The Hebrew music category has been fully restored with 100% playable video clips. The temporary scripts and packages used for the migration were safely cleaned up to prevent clutter in the repository.

### 3.2 Linter Status
- A post-modification linter check (`npm run lint`) highlighted an existing issue in `src/Game.jsx` (line 677) where a helper function `resetQuestion` is called inside a broadcast listener before it is properly declared lower in the file (line 722). 
- *Note for future task:* `resetQuestion` should be hoisted or refactored to resolve this `no-use-before-define` error.
