# Embedded for Kids — Product Requirements

## Original Problem Statement
Build a React and TailwindCSS educational web app called “Embedded for Kids” for teaching ESP32 and ESP-IDF students. Phase 1 focuses on a clean responsive layout and navigation: white content area, gray-100 sidebar, orange accents, collapsible curriculum sidebar with Beginner/Intermediate/Advanced mock categories, readable 65ch content shell, breadcrumb header, and profile icon. No backend or specific lesson pages yet. The user selected local mock data with simple accordion interaction.

## Architecture Decisions
- Frontend-only React experience for Phase 1; no API calls or backend logic added.
- Curriculum is represented as local structured data in `src/curriculumData.js`.
- Single responsive shell with desktop collapsible sidebar and mobile drawer.
- Outfit is used for headings/UI, with JetBrains Mono for small technical labels.
- Every interactive or critical user-facing element has a unique `data-testid`.

## User Personas
- Curious beginner students learning their first ESP32 concepts.
- Intermediate learners exploring ESP-IDF scheduling and RTOS concepts.
- Educators needing a calm, scannable learning shell for future lessons.

## Core Requirements (Static)
- Responsive collapsible curriculum sidebar.
- Accordion categories: official Level 0 through Level 8 curriculum.
- Breadcrumb and profile control in the header.
- Comfortable reading width of approximately 65ch.
- Orange accent, white main background, gray supporting surfaces.
- Local mock curriculum and lesson selection interaction.
- Dynamic lesson content with level, title, description, and curriculum context.
- Internal scrolling for long curriculum sections on desktop and mobile.
- Toggle between official academic curriculum and ESP32 Playground.
- Playground modules with Try, See, Change, Break, Discover, Challenge, and Build steps.

## Implemented

### 2026-02-21
- Replaced starter screen with the Embedded for Kids learning shell.
- Added curriculum accordion, local lesson selection, progress indicator, breadcrumbs, responsive mobile navigation, and lesson preview.
- Added responsive styling, warm orange visual language, typography, hover states, and page entrance animation.
- Verified desktop and mobile flows, accordion behavior, sidebar collapse, no horizontal overflow, and unique test IDs.
- Replaced the starter mock categories with all official Level 0–8 curriculum topics and generated short lesson introductions.
- Added active lesson state: selecting any sub-material updates breadcrumb and main content, and removes the welcome hero.
- Added internal sidebar scrolling with a viewport-bounded desktop sidebar for long levels such as FreeRTOS.

### 2026-02-21 — Playground Expansion
- Added a visible Lucide Compass icon for Level 0 Discovery.
- Made the desktop sidebar sticky at viewport height with its own internal scroll area.
- Added the Kurikulum Akademis / ESP32 Playground mode switch.
- Added 12 hands-on Playground modules with local simulation states for Try, See, Change, Break, Discover, Challenge, and Build.
- Added local error/broken-state visualization and challenge strip for experiments; no hardware or external API integration is included.

## Prioritized Backlog

### P0 — Next Tasks
- Add real lesson routes and persistent completion state.
- Replace generated introductions with authored lesson content for the first learning path.
- Turn Playground simulations into optional real device integrations when hardware connectivity is defined.

### P1 — Product Depth
- Add student progress persistence and completed lesson states.
- Add a searchable curriculum command menu.
- Add code snippets with copy and syntax highlighting.

### P2 — Delight & Reach
- Add interactive ESP32 pinout visualizer.
- Add small quizzes and shareable learning milestones.
