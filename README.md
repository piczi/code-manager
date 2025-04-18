# Code Snippet Manager Chrome Extension

A Chrome extension for managing code snippets with a modern UI built using Vite, React, and shadcn/ui.

## Features

- Create, edit, and delete code snippets
- Organize snippets by categories
- Add tags to snippets for better organization
- Copy snippets to clipboard with one click
- Modern and responsive UI
- Dark mode support

## Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Building for Production

1. Build the extension:
   ```bash
   npm run build
   ```
2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## Usage

1. Click the extension icon in Chrome
2. Use the "New Snippet" tab to create a new code snippet:
   - Enter a title
   - Paste or type your code
   - Select a language
   - Choose a category
   - Add tags (comma-separated)
3. View your snippets in the "My Snippets" tab
4. Use the copy button to copy snippets to clipboard
5. Delete unwanted snippets using the delete button

## Technologies Used

- Vite
- React
- TypeScript
- shadcn/ui
- Tailwind CSS
- Chrome Extension API 