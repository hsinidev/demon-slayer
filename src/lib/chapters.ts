import fs from 'fs';
import path from 'path';

const MANGA_DIR = path.join(process.cwd(), 'manga', 'Kimetsu_no_Yaiba');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

/** Arc boundaries by chapter number */
const ARC_MAP: { name: string; from: number; to: number }[] = [
  { name: 'Final Selection Arc',           from: 1,   to: 9   },
  { name: 'Asakusa Arc',                   from: 10,  to: 19  },
  { name: 'Tsuzumi Mansion Arc',           from: 20,  to: 27  },
  { name: 'Mount Natagumo Arc',            from: 28,  to: 44  },
  { name: 'Rehabilitation Training Arc',   from: 45,  to: 53  },
  { name: 'Mugen Train Arc',              from: 54,  to: 66  },
  { name: 'Entertainment District Arc',   from: 67,  to: 99  },
  { name: 'Swordsmith Village Arc',       from: 100, to: 127 },
  { name: 'Hashira Training Arc',         from: 128, to: 136 },
  { name: 'Infinity Castle Arc',          from: 137, to: 183 },
  { name: 'Sunrise Countdown Arc',        from: 184, to: 206 },
];

export interface ChapterMeta {
  /** Raw folder name e.g. "Chapter 66 - The Dawn Spreads" */
  folderName: string;
  /** URL-safe slug for the route param */
  slug: string;
  /** Numeric chapter number extracted from folder name */
  num: number;
  /** Human-readable title e.g. "Chapter 66: The Dawn Spreads" */
  title: string;
  /** Arc this chapter belongs to */
  arc: string;
  /** Sorted list of image file names (not full paths) */
  images: string[];
  /** Thumbnail = first image */
  thumb: string;
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function parseChapter(folderName: string): { num: number; title: string } {
  // "Chapter 66 - The Dawn Spreads"  or  "Chapter 1"
  const m = folderName.match(/Chapter\s+(\d+)(?:\s*[-–]\s*(.+))?/i);
  if (!m) return { num: 0, title: folderName };
  const num = parseInt(m[1], 10);
  const subtitle = m[2] ? m[2].trim() : '';
  const title = subtitle ? `Chapter ${num}: ${subtitle}` : `Chapter ${num}`;
  return { num, title };
}

function arcFor(num: number): string {
  for (const arc of ARC_MAP) {
    if (num >= arc.from && num <= arc.to) return arc.name;
  }
  return 'Supplemental';
}

let _cache: ChapterMeta[] | null = null;

export function getAllChapters(): ChapterMeta[] {
  if (_cache) return _cache;

  if (!fs.existsSync(MANGA_DIR)) {
    console.warn('[chapters] manga dir not found:', MANGA_DIR);
    return [];
  }

  const folders = fs
    .readdirSync(MANGA_DIR)
    .filter((f) => fs.statSync(path.join(MANGA_DIR, f)).isDirectory())
    .sort(naturalSort);

  _cache = folders
    .map((folderName): ChapterMeta | null => {
      const dir = path.join(MANGA_DIR, folderName);
      const images = fs
        .readdirSync(dir)
        .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
        .sort(naturalSort);

      if (images.length === 0) return null;

      const { num, title } = parseChapter(folderName);
      const slug = encodeURIComponent(folderName);

      return {
        folderName,
        slug,
        num,
        title,
        arc: arcFor(num),
        images,
        thumb: images[0],
      };
    })
    .filter(Boolean) as ChapterMeta[];

  return _cache;
}

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return getAllChapters().find((c) => c.slug === slug);
}

/** Returns { prev, current, next } for navigation */
export function getChapterNav(slug: string) {
  const all = getAllChapters();
  const idx = all.findIndex((c) => c.slug === slug);
  return {
    current: all[idx] ?? null,
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

/** Chapters grouped by arc for the archive page */
export function getChaptersByArc(): { arc: string; chapters: ChapterMeta[] }[] {
  const map = new Map<string, ChapterMeta[]>();
  for (const ch of getAllChapters()) {
    if (!map.has(ch.arc)) map.set(ch.arc, []);
    map.get(ch.arc)!.push(ch);
  }
  return Array.from(map.entries()).map(([arc, chapters]) => ({ arc, chapters }));
}
