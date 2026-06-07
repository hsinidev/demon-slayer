// Server Component: reads filesystem, passes data to client
import type { Metadata } from 'next';
import { getChaptersByArc } from '@/lib/chapters';
import ChaptersClient from './ChaptersClient';

export const metadata: Metadata = {
  title: 'All Chapters | Demon Slayer: Kimetsu no Yaiba Manga Online',
  description:
    'Browse all 205+ chapters of Demon Slayer (Kimetsu no Yaiba) organized by arc. Read free in HD.',
  alternates: { canonical: 'https://demonnslayer.com/chapters' },
};

export default function ChaptersPage() {
  const arcGroups = getChaptersByArc().map((g) => ({
    arc: g.arc,
    chapters: g.chapters.map((c) => ({
      slug:       c.slug,
      num:        c.num,
      title:      c.title,
      arc:        c.arc,
      thumb:      c.thumb,
      folderName: c.folderName,
    })),
  }));

  return <ChaptersClient arcGroups={arcGroups} />;
}
