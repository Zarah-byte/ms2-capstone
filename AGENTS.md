# AGENTS.md

## Project Overview

This project is a private family archive for tracking lineage and preserving personal family stories. It should help people gather the people, places, photographs, memories, and relationships that make up a family history.

The core product idea is not a generic dashboard or records manager. It is a quiet place to build a living archive:

- Map family relationships and lineage across generations.
- Store people with names, life dates, places, notes, and photographs.
- Preserve family stories, remembered fragments, recipes, letters, migrations, and oral histories.
- Connect stories back to the people they belong to.
- Keep the experience personal, private, and emotionally warm.

## Current App Shape

The main React application lives in `family-tree/`.

Important routes and areas:

- `/` renders the public home page.
- `/login` handles guest login.
- `/onboarding` is for setting up a user's archive/profile.
- `/archive` is the protected archive area.
- `/archive/people` is the portrait room for family members.
- `/archive/stories` is the story shelves area for family memories.
- `/archive/tree` is the lineage/tree room.
- `/profile` is the protected user profile area.

Supabase is used for auth and archive data. The database schema is in `supabase/migrations/202604260001_create_family_archive_schema.sql`.

Core tables include:

- `profiles`
- `family_archives`
- `people`
- `stories`
- `story_people`

The schema is privacy-first: row-level security policies should keep each user scoped to their own family archive.

## Product Language

Use warm, intimate, archival language. The app should feel like a place where family memory is handled with care.

Preferred words and metaphors:

- archive
- family archive
- branches
- roots
- lineage
- people
- portraits
- rooms
- story shelves
- remembered fragments
- voices
- faces
- letters
- recipes
- places
- generations

Avoid generic SaaS or admin language when a more personal phrase fits.

Prefer:

- "Open the Archive"
- "Portrait Room"
- "Story Shelves"
- "Tree Room"
- "Watch the branches gather."
- "Letters, legends, and remembered fragments."

Avoid:

- "Dashboard"
- "Records Management"
- "Users"
- "Entities"
- "Items"
- "CRUD"
- "Admin Panel"

## Visual Direction

The intended aesthetic is minimal, spacious, and network-like, based on the provided visual reference.

Key visual cues:

- Mostly white or near-white space.
- Thin black connecting lines.
- Small soft gray nodes where lines meet.
- A family tree that feels like a living constellation or lineage map.
- Floating pill controls with subtle shadows.
- Circular floating menu button.
- Restrained typography.
- Calm, archival tone.
- Minimal ornament.

The current app includes some warmer archive-card styling. Future UI work should move toward the uploaded minimalist node-and-line aesthetic while keeping the emotional warmth of the family archive concept.

## Interface Guidance

Treat the family tree as the primary metaphor. Relationships, paths, and branches should guide the visual system.

Do:

- Keep layouts open and breathable.
- Use thin lines and nodes to imply connection.
- Let the tree or archive content be the main visual signal.
- Use floating controls sparingly.
- Keep shadows soft and subtle.
- Use cards only when they hold individual repeated items, forms, or focused content.
- Preserve a quiet, private feeling.

Avoid:

- Heavy dashboards.
- Dense admin tables as the primary experience.
- Decorative clutter.
- Loud gradients.
- Oversized marketing sections.
- Generic productivity-app patterns.
- UI copy that explains the interface too literally.

## Implementation Guidance

Privacy and ownership are central. When changing data access, auth, or Supabase logic, preserve the archive boundary so users only see and edit their own family data.

When adding features:

- Connect stories to people wherever possible.
- Keep people, stories, photos, and relationship data conceptually linked.
- Favor user-facing language that feels personal instead of technical.
- Keep empty states gentle and useful.
- Make the tree view feel central, not like an afterthought.
- Respect the existing route structure unless there is a clear reason to change it.

When changing styling:

- Prefer shared design tokens or reusable styling patterns over one-off inline values when the area is growing.
- Keep typography readable and restrained.
- Use the local fonts in `Assets/Fonts/` when appropriate.
- Avoid visual decisions that make the app feel like a business dashboard.

## Git Workflow

For active implementation sessions, push completed work every 30 minutes so progress is preserved remotely. Do not push unfinished, broken, or unreviewed changes unless the user explicitly asks for a work-in-progress push.

## Testing Notes

This file is project guidance only and does not require runtime tests.

For future code changes:

- Run relevant React checks from `family-tree/` when UI behavior changes.
- Verify protected archive routes still require auth.
- Verify Supabase changes keep row-level security intact.
- Check responsive layouts when touching major screens.
