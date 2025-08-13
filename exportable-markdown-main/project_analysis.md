# Project Analysis: Exportable Markdown Editor

## 1. Project Overview

This project is a sophisticated, web-based Markdown editor built with a modern tech stack. Its primary purpose is to provide a seamless experience for writing in Markdown, with a live preview that renders the output in real-time. The application's key features are its ability to export the document to both PDF and DOCX formats, share content via WhatsApp, and maintain a history of exported documents. The user interface is clean, responsive, and utilizes a tabbed view on mobile and a side-by-side panel layout on desktop.

## 2. Technology Stack

*   **Framework:** React 18
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS with `tailwindcss-animate` for animations.
*   **UI Components:** A comprehensive suite of `shadcn/ui` components, indicating a focus on accessible and composable UI.
*   **Routing:** `react-router-dom` for client-side routing.
*   **State Management:** A combination of local component state (`useState`) and custom hooks for managing specific concerns like markdown content, history, and backend settings. `localStorage` is used for persisting markdown content across sessions.
*   **Linting:** ESLint with TypeScript support.
*   **Package Manager:** npm (inferred from `package-lock.json`).

## 3. Project Structure

The codebase is well-organized, following conventions typical of a modern React/Vite application.

-   `public/`: Contains static assets.
-   `src/`: The main application source directory.
    -   `components/`: Contains all React components.
        -   `ui/`: Holds the base components from `shadcn/ui`.
        -   `Editor.tsx`: The core component for markdown text input, featuring drag-and-drop for `.md` files.
        -   `Preview.tsx`: Renders the live HTML preview of the markdown using `react-markdown`.
        -   `Toolbar.tsx`: The main application header with action buttons.
        -   `HistoryPanel.tsx`: A sidebar component to display and manage exported document history.
        -   `SettingsModal.tsx`: A dialog for application settings.
    -   `hooks/`: Houses all custom React hooks, encapsulating business logic and state management.
    -   `lib/`: Contains utility functions, specifically `cn` for merging CSS classes.
    -   `pages/`: Contains top-level page components (`Index.tsx`, `NotFound.tsx`).
    -   `utils/`: Contains helper functions, such as `formatters.ts`.
-   Configuration files like `vite.config.ts`, `tailwind.config.ts`, and `tsconfig.json` are located in the root.

## 4. Core Features & Functionality

*   **Markdown Editing:** A feature-rich editor with word/character counts and the ability to clear content.
*   **Live Preview:** Real-time rendering of markdown to HTML, including support for GitHub Flavored Markdown (GFM).
*   **PDF Export:** Converts the rendered HTML preview into a PDF document using `html-to-image` (a fork of html2canvas) and `jspdf`.
*   **DOCX Export:** Parses the markdown text and converts it into a `.docx` file using the `docx` library.
*   **WhatsApp Sharing:** Allows users to share the markdown content directly to WhatsApp.
*   **File Import:** Users can import `.md` or `.txt` files locally or by dragging and dropping them into the editor.
*   **Document History:** The application logs each export (PDF/DOCX) and allows users to re-download or re-share from the history panel.
*   **Responsive Design:** The UI gracefully adapts from a dual-panel desktop view to a tabbed mobile interface.
*   **Persistent State:** The markdown content is automatically saved to `localStorage` to prevent data loss on page refresh.

## 5. Key Hooks Analysis

The project's logic is cleanly separated into custom hooks:

*   `useMarkdownState.ts`: Manages the state of the markdown content, including autosaving to `localStorage` and calculating word/character counts.
*   `useHistory.ts`: Handles the state for the document export history.
*   `useExportPdf.ts`: Encapsulates all logic for the PDF export feature.
*   `useExportDocx.ts`: Contains the markdown parsing and DOCX generation logic.
*   `useWhatsappShare.ts`: Manages the logic for creating and opening WhatsApp share links.
*   `useIsMobile.ts`: A simple hook to detect if the user is on a mobile device, enabling the responsive UI switch.
*   `useBackend.ts`: Manages backend-related settings, suggesting potential for future cloud-based features.

## 6. Build & Development Scripts

The `package.json` file defines the following scripts:

-   `npm run dev`: Starts the Vite development server for local development.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run lint`: Runs ESLint to check the codebase for errors and style issues.
-   `npm run preview`: Serves the production build locally for testing.
