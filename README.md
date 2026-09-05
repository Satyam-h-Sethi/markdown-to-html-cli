# markdown-to-html-cli

A clean, fast, zero-dependency Markdown converter and interactive Web Studio with modern light/dark mode styling.

## What it does

Parses standard Markdown syntax (headings, bold/italic, inline code, code blocks, lists, blockquotes, links, and horizontal rules) and produces a self-contained `.html` file. Also includes an interactive live web studio.

## Features

- **Interactive Web Studio**: Live split-pane editor with instant HTML rendering and one-click export.
- **Zero dependencies**: Powered entirely by native Node.js and vanilla Web APIs.
- **Embedded modern CSS**: Automatically supports OS light and dark color schemes.
- **Standalone CLI**: Convert files directly from the command line.

## Setup

Requires Node.js (v14+). No external dependencies.

```bash
cd markdown-to-html-cli
```

## Run command

### Launch Web Studio UI
```bash
node index.js --web
# Open http://localhost:3000
```
*(Or simply open `index.html` directly in any browser)*

### CLI Usage
```bash
node index.js sample.md output.html --title "My Notes"
```

## Example usage

```bash
# Start web UI on custom port
node index.js --web 8080

# Convert README to an HTML page via CLI
node index.js README.md readme.html
```
