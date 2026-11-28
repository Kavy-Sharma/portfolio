// Eagerly import all Markdown files from /content/notes/*.md
const rawNotesModules = import.meta.glob('/content/notes/*.md', {
  query: '?raw',
  eager: true,
  import: 'default'
});

export const CATEGORY_COLORS = {
  Access: '#D93829',
  Injection: '#B45309',
  Files: '#1E7E52',
  Auth: '#1D63B8',
  Logic: '#743CC7',
  Network: '#0E7E8D',
  Machines: '#A83271'
};

export const CATEGORY_ORDER = [
  'Access',
  'Injection',
  'Files',
  'Auth',
  'Logic',
  'Network',
  'Machines'
];

function parseFrontmatter(rawContent, fallbackSlug) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      metadata: {
        title: fallbackSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: fallbackSlug,
        symbol: fallbackSlug.slice(0, 2).toUpperCase(),
        category: 'Network',
        readTime: 2,
        tldr: rawContent.slice(0, 100).replace(/[#*`_]/g, '') + '...',
        red: 'I explored this attack vector.',
        blue: 'I enforced strict defense validation.',
        next: ''
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

  // Fallbacks
  if (!metadata.symbol) {
    metadata.symbol = (metadata.title || fallbackSlug).slice(0, 2).toUpperCase();
  }
  if (!metadata.category) {
    metadata.category = 'Access';
  }
  if (!metadata.readTime) {
    const words = markdownBody.trim().split(/\s+/).length;
    metadata.readTime = Math.max(1, Math.round(words / 150));
  }

  return {
    metadata,
    content: markdownBody
  };
}

// Parse and process all discovered notes
const parsedNotes = Object.entries(rawNotesModules).map(([filePath, rawContent]) => {
  const fileName = filePath.split('/').pop().replace(/\.md$/, '');
  const { metadata, content } = parseFrontmatter(rawContent, fileName);
  return {
    ...metadata,
    slug: metadata.slug || fileName,
    color: CATEGORY_COLORS[metadata.category] || '#1F9FB0',
    rawContent,
    content
  };
});

// Sort by standard category order, then title
parsedNotes.sort((a, b) => {
  const catA = CATEGORY_ORDER.indexOf(a.category);
  const catB = CATEGORY_ORDER.indexOf(b.category);
  const orderA = catA === -1 ? 99 : catA;
  const orderB = catB === -1 ? 99 : catB;
  if (orderA !== orderB) return orderA - orderB;
  return (a.title || '').localeCompare(b.title || '');
});

// Assign sequential element numbers 01..N
parsedNotes.forEach((note, idx) => {
  note.number = String(idx + 1).padStart(2, '0');
});

export function getAllNotes() {
  return parsedNotes;
}

export function getNoteBySlug(slug) {
  return parsedNotes.find((n) => n.slug === slug) || null;
}

export function getCategories() {
  return ['All', ...CATEGORY_ORDER];
}
