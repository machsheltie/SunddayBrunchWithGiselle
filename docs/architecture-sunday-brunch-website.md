# Architecture: sunday-brunch-website

## 1. Executive Summary

This document outlines the architecture for the `sunday-brunch-website` part of the Sunday Brunch With Giselle project. It is a modern web application built with React and Vite.

## 2. Technology Stack

- **Framework**: React (^18.3.1)
- **Build Tool**: Vite (^6.0.1)
- **Language**: TypeScript
- **HTTP Client**: Axios (^1.13.2)

## 3. Architecture Pattern

The application follows a **Component-based architecture**, which is typical for React projects. The UI is broken down into reusable components.

### Design System Architecture

The application implements a **CSS Variable-based Design System** to ensure brand consistency:

- **CSS Variables:** All brand colors, typography, spacing, and other design tokens are defined as CSS custom properties in `index.css`
- **Component Styling:** Components reference these variables for consistent theming
- **Brand Colors:** Sage Green, Buttercream Yellow, Terracotta, Soft Lavender, Warm Pink (see `design-system.md`)
- **Typography:** Serif-based font stack (Cormorant Garamond, Pacifico, Crimson Text) loaded from Google Fonts
- **Character System:** Each Sheltie character has signature colors for their segments

**Critical:** This is a cozy, whimsical baking podcast brand, NOT a corporate blog. All styling must align with the brand identity defined in `design-system.md`.


## 4. Data Architecture

No database or data models were detected in the quick scan.

## 5. API Design

No internal API endpoints were detected. The application uses `axios` to communicate with an external API, but the details of this API are not available in the codebase.

## 6. Component Overview

- **EpisodePlayer.jsx**: A component for playing audio episodes.
- **RecipeCard.jsx**: A component for displaying recipe information.
- **SheltieCallout.jsx**: A component for character commentary.

## 7. Source Tree

(Refer to `source-tree-analysis.md` for the full source tree.)

## 8. Development Workflow

- **Installation**: `npm install`
- **Development Server**: `npm run dev`
- **Production Build**: `npm run build`

## 9. Deployment Architecture

No deployment configuration (e.g., Docker, CI/CD) was detected.

## 10. Testing Strategy

No testing framework or test files were detected.
