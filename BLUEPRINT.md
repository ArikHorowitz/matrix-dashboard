# Technical Blueprint: Data Persistence with Vercel KV

This document outlines the architectural plan for upgrading the Matrix Dashboard from a `localStorage`-based prototype to a robust application with persistent cloud storage using Vercel KV.

## 1. The Problem: The Limits of `localStorage`

The current implementation saves chapter drafts to the browser's `localStorage`. This is not a viable long-term solution because:
-   **It's Not Permanent:** `localStorage` can be cleared by the user or the browser at any time.
-   **It's Not Synced:** Data is tied to a single browser on a single device. It cannot be accessed from another device.
-   **It's Not Secure:** It's not designed for storing critical user data.

## 2. The Solution: Vercel KV

Vercel KV is a serverless Redis database that is fast, durable, and integrates seamlessly with the Vercel ecosystem. It is the ideal choice for this project.

### Why Not GitHub?
Using the GitHub API as a database is not recommended. It's slow, rate-limited, and not designed for the frequent, small writes of an application like this. It would add significant complexity and fragility. GitHub is for versioning code, not for storing application data.

## 3. Implementation Plan

The implementation will involve creating API routes (serverless functions) that handle communication between the React front-end and the Vercel KV store.

### Step 1: Vercel KV Setup

1.  In the Vercel Dashboard, create a new KV database and link it to this project.
2.  Vercel will automatically provide the necessary environment variables (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`). These will be added to the project's settings in Vercel.

### Step 2: Create API Routes

We will create a new directory: `api/`. Inside, we'll need two primary routes.

**A. `api/chapters/get.ts`**
-   **Purpose:** Fetches the saved draft content for a specific chapter.
-   **HTTP Method:** `GET`
-   **Query Parameter:** `chapterId` (e.g., `/api/chapters/get?chapterId=p1c6`)
-   **Logic:**
    1.  Reads the `chapterId` from the request.
    2.  Connects to the Vercel KV store.
    3.  Fetches the value from a key, e.g., `draft:p1c6`.
    4.  Returns the text content as JSON.

**B. `api/chapters/update.ts`**
-   **Purpose:** Saves or updates the draft content for a specific chapter.
-   **HTTP Method:** `POST`
-   **Request Body:** `{ "chapterId": "p1c6", "content": "The new draft text..." }`
-   **Logic:**
    1.  Parses the `chapterId` and `content` from the request body.
    2.  Connects to the Vercel KV store.
    3.  Uses the `set` command to save the content to the key `draft:p1c6`.
    4.  Returns a success response.

### Step 3: Modify the Front-End (`FocusView.tsx`)

The `FocusView` component will be updated to use these new API routes instead of `localStorage`.

1.  **On Mount (`useEffect`):**
    -   Instead of `localStorage.getItem`, it will `fetch('/api/chapters/get?chapterId=...').`
    -   The component's `draft` state will be populated with the response.

2.  **On Save (debounced `useEffect`):**
    -   Instead of `localStorage.setItem`, it will send a `POST` request to `/api/chapters/update` with the `chapterId` and the current `draft` content in the body.
    -   It should also handle loading and error states (e.g., show a "Saving..."/"Saved" indicator).

### Data Model in KV
-   **Key:** `draft:<chapterId>` (e.g., `draft:p1c1`)
-   **Value:** A simple string containing the full Markdown text of the draft.

This architecture provides a scalable, secure, and professional solution for data persistence, fully integrated with the existing tech stack.
