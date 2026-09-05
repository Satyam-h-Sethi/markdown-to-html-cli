# markdown-to-html-cli

A clean, fast, zero-dependency command-line tool to convert Markdown files into standalone, responsive HTML documents with modern light/dark mode CSS embedded.

## What it does

Parses standard Markdown syntax (headings, bold/italic, inline code, code blocks, lists, blockquotes, links, and horizontal rules) and produces a self-contained `.html` file ready to share or view in any browser.

## Features

- **Zero dependencies**: Powered entirely by native Node.js.
- **Embedded modern CSS**: Automatically supports OS light and dark color schemes.
- **Standalone output**: Generates a complete HTML document with clean typography.
- **Customizable**: Allows setting custom document `<title>`.

## Setup

Requires Node.js (v14+). No external package installation needed.

```bash
cd markdown-to-html-cli
```

## Run command

```bash
node index.js sample.md output.html --title "My Notes"
```

Or run the default npm script:
```bash
npm start
```

## Example usage

```bash
# Convert a README to an HTML page
node index.js README.md readme.html

# Convert with a custom title
node index.js notes.md notes.html --title "Project Architecture"
```
