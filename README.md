# The Matrix Dashboard: A Praxeological Writing Environment

A bespoke digital tool to transform the static architectural blueprint of the book 'Omnipotent Government in the Holy Land' into a dynamic, interactive writing and auditing environment. It mirrors the book's core 'matrix' logic—the intersection of a four-part narrative arc with nine thematic lenses—to provide control over thematic consistency, rhetorical tone, and philosophical rigor.

This is not just a text editor; it is a command center for a complex philosophical argument, designed for a tablet-first workflow.

## Core Features

*   **Master Matrix Overview:** A high-level dashboard showing the status, progress, and thematic density of all four parts of the book at a glance.
*   **Part Matrix Deep Dive:** A detailed grid view for each part, allowing for fine-grained interaction with individual chapters and their thematic lenses.
*   **Distraction-Free Focus View:** An immersive writing mode for drafting chapter content, complete with Markdown support, a live preview, and quick access to all related thematic notes.
*   **Command Palette (`Cmd/Ctrl+K`):** A power-user tool for instant navigation. Jump to any chapter, part, or apply any filter with a few keystrokes.
*   **"Golden Thread" Thematic Tracing:** A unique analytical view that highlights and visually connects all chapters related to a specific theme or motif, allowing the author to trace a single idea's evolution through the entire manuscript.
*   **Global Widgets:** Project-wide trackers for Lens Density, Motif Frequency, and a tactical Work Log keep strategic goals front and center.

## Technology Stack

*   **Framework:** React (with Hooks)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Deployment:** Vercel
*   **Code Repository:** GitHub

## Project Architecture & Data Persistence

This application is designed as a static front-end served by Vercel, with all user-generated content (like chapter drafts) intended to be stored in a cloud database.

**IMPORTANT:** The current implementation saves draft progress to the browser's `localStorage`. This is for demonstration purposes only and is **not a permanent or safe** way to store your work.

The official architectural path forward is detailed in the [**BLUEPRINT.md**](./BLUEPRINT.md) file. It outlines a plan to integrate **Vercel KV**, a fast, serverless database that lives within the Vercel ecosystem. This will provide robust, secure, and permanent cloud storage for all your writing.

## Foundational Documents

*   [**WHITE_PAPER.md**](./WHITE_PAPER.md): Articulates the core vision, design philosophy, and praxeological principles behind the project.
*   [**BLUEPRINT.md**](./BLUEPRINT.md): Provides the technical architecture and roadmap for implementing permanent data storage with Vercel KV.

## Getting Started

1.  Clone the repository from GitHub.
2.  Push the repository to your own GitHub account.
3.  Connect the GitHub repository to a new project in Vercel.
4.  Vercel will automatically build and deploy the application. Any subsequent pushes to the `main` branch will trigger a new deployment.
