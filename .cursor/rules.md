# Cursor rules — starter-nextjs-cursor-template

## Project context

This repository is a **Next.js App Router** starter (React 19, TypeScript, Tailwind v4). Product and engineering notes live under `docs/` (`prd.md`, `tasks.md`, `architecture.md`, `tech-spec.md`).

## Next.js & agent constraints

Follow **`AGENTS.md`** at the repo root. This Next.js version may differ from older training patterns: prefer the in-repo docs under `node_modules/next/dist/docs/` and official migration notes when changing routing, data fetching, or caching.

## Editing guidelines

- Match existing patterns in `app/` (layout, metadata, Tailwind usage).
- Keep changes minimal and scoped to the task; avoid unrelated refactors.
- Use Server Components unless a Client Component is required.

## Documentation

When behavior, stack, or structure changes meaningfully, update the relevant file in `docs/` so PRDs, tasks, architecture, and tech spec stay truthful.

## Product & Design Guidelines

- Prioritize clean, minimal, editorial UI
- Focus on strong typography and spacing
- Design for clarity over visual complexity
- Treat this as a premium personal brand experience, not a generic portfolio

## Content Strategy

- Separate content from UI when possible (use lib/content.ts)
- Messaging should feel senior, strategic, and confident
- Avoid buzzwords; favor clear, direct language

## UX Principles

- Maintain strong visual hierarchy
- Optimize for readability and scanning
- Ensure responsive behavior across screen sizes

## AI Collaboration

- Always read docs/ before implementing features
- Follow tasks.md step-by-step
- Ask for clarification if requirements are unclear

## Framework Awareness

- Follow AGENTS.md guidance for Next.js changes
- Prefer App Router patterns (app/)
- Avoid outdated Next.js patterns (pages/, legacy data fetching)

## Framework & UI Best Practices

- Follow modern Next.js App Router patterns
- Use Server Components by default unless interactivity is required
- Prefer composition over configuration
- Use Tailwind utility classes for styling consistency
- Optimize for performance (avoid unnecessary client components)
- Ensure SEO best practices (metadata, semantic HTML)
- Use Next.js Image optimization where relevant
- Keep UI accessible (contrast, semantics, focus states)