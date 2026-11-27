import siteData from '../../content/site.json';

// Eagerly import all Markdown files from /content/notes/*.md
const rawNotesModules = import.meta.glob('/content/notes/*.md', {
  query: '?raw',
  eager: true,
  import: 'default'
});

function parseFrontmatter(rawContent, fallbackSlug) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      metadata: {
        title: fallbackSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: fallbackSlug,
        date: '2026-02-01',
        category: 'Field Notes',
        tags: ['Security'],
        owasp: [],
        red: 'I explored this attack path in my lab.',
        blue: 'I deployed defense controls and verification rules.',
        summary: rawContent.slice(0, 160).replace(/[#*`_]/g, '') + '...',
        wordCount: Math.round(rawContent.split(/\s+/).length),
        readingTimeMinutes: Math.max(1, Math.round(rawContent.split(/\s+/).length / 200))
      },
      content: rawContent
    };
  }

  const yamlBlock = match[1];
  const markdownBody = match[2];

  const metadata = {
    slug: fallbackSlug
  };

  // Parse YAML lines
  const lines = yamlBlock.split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    // Strip quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        metadata[key] = JSON.parse(val);
      } catch {
        metadata[key] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/['"]/g, ''));
      }
    } else if (val === 'true') {
      metadata[key] = true;
    } else if (val === 'false') {
      metadata[key] = false;
    } else if (!isNaN(Number(val)) && val !== '') {
      metadata[key] = Number(val);
    } else {
      metadata[key] = val;
    }
  }

  if (!metadata.wordCount) {
    const words = markdownBody.trim().split(/\s+/).length;
    metadata.wordCount = words;
    metadata.readingTimeMinutes = Math.max(1, Math.round(words / 200));
  }

  return {
    metadata,
    content: markdownBody
  };
}

// Parse all discovered notes
const parsedNotes = Object.entries(rawNotesModules).map(([filePath, rawContent]) => {
  const fileName = filePath.split('/').pop().replace(/\.md$/, '');
  const { metadata, content } = parseFrontmatter(rawContent, fileName);
  return {
    ...metadata,
    slug: metadata.slug || fileName,
    rawContent,
    content
  };
});

// Sort by date descending
parsedNotes.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

export function getAllNotes() {
  return parsedNotes;
}

export function getNoteBySlug(slug) {
  return parsedNotes.find((n) => n.slug === slug) || null;
}

export function getSiteData() {
  return siteData;
}
