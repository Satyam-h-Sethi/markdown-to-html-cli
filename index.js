#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseMarkdown(md) {
  let html = md;

  // Escape HTML entities inside inline code & code blocks
  const codeBlocks = [];
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const token = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code class="language-${lang || 'text'}">${escaped}</code></pre>`);
    return token;
  });

  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const token = `__INLINE_CODE_${inlineCodes.length}__`;
    inlineCodes.push(`<code>${escaped}</code>`);
    return token;
  });

  // Headers (h6 down to h1)
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr />');

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

  // Bold & Italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links & Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Lists (Unordered & Ordered)
  html = html.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<oli>$1</oli>');
  html = html.replace(/(<oli>.*<\/oli>\n?)+/g, (match) => {
    return '<ol>' + match.replace(/<\/?oli>/g, (m) => m === '<oli>' ? '<li>' : '</li>') + '</ol>';
  });

  // Paragraphs
  const lines = html.split('\n\n');
  const processed = lines.map(block => {
    block = block.trim();
    if (!block) return '';
    if (
      block.startsWith('<h') ||
      block.startsWith('<ul') ||
      block.startsWith('<ol') ||
      block.startsWith('<blockquote') ||
      block.startsWith('<hr') ||
      block.startsWith('__CODE_BLOCK_')
    ) {
      return block;
    }
    return `<p>${block.replace(/\n/g, '<br />')}</p>`;
  });
  html = processed.join('\n\n');

  // Restore code blocks & inline codes
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, block);
  });
  inlineCodes.forEach((code, idx) => {
    html = html.replace(`__INLINE_CODE_${idx}__`, code);
  });

  return html;
}

function generateHTMLDocument(bodyHtml, title = 'Document') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --bg: #fdfdfd;
      --text: #24292e;
      --link: #0969da;
      --code-bg: #f6f8fa;
      --border: #d0d7de;
      --quote: #57606a;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0d1117;
        --text: #c9d1d9;
        --link: #58a6ff;
        --code-bg: #161b22;
        --border: #30363d;
        --quote: #8b949e;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: var(--text);
      background: var(--bg);
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.3em;
    }
    p, ul, ol, blockquote {
      margin-top: 0;
      margin-bottom: 16px;
    }
    a {
      color: var(--link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: var(--code-bg);
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace;
    }
    pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: var(--code-bg);
      border-radius: 6px;
      border: 1px solid var(--border);
    }
    pre code {
      padding: 0;
      background-color: transparent;
    }
    blockquote {
      padding: 0 1em;
      color: var(--quote);
      border-left: 0.25em solid var(--border);
    }
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: var(--border);
      border: 0;
    }
    img {
      max-width: 100%;
      box-sizing: content-box;
    }
  </style>
</head>
<body>
  <main>
${bodyHtml}
  </main>
</body>
</html>`;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    console.log(`
Usage: md2html <input.md> [output.html] [--title "Page Title"]

Options:
  --title, -t    Set page HTML title
  --help, -h     Show this help message
    `);
    process.exit(0);
  }

  const inputFile = args[0];
  let outputFile = 'output.html';
  let title = path.basename(inputFile, path.extname(inputFile));

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--title' || args[i] === '-t') {
      title = args[i + 1] || title;
      i++;
    } else if (!args[i].startsWith('-')) {
      outputFile = args[i];
    }
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' not found.`);
    process.exit(1);
  }

  const markdownContent = fs.readFileSync(inputFile, 'utf-8');
  const bodyHtml = parseMarkdown(markdownContent);
  const fullHtml = generateHTMLDocument(bodyHtml, title);

  fs.writeFileSync(outputFile, fullHtml, 'utf-8');
  console.log(`Successfully converted '${inputFile}' -> '${outputFile}'`);
}

if (require.main === module) {
  main();
}

module.exports = { parseMarkdown, generateHTMLDocument };
