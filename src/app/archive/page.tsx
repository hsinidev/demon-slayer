import type { Metadata } from 'next';
import { getChaptersByArc } from '@/lib/chapters';
import ArchiveClient from './ArchiveClient';

export const metadata: Metadata = {
  title: 'Manga Archive | Demon Slayer: Kimetsu no Yaiba Online',
  description: 'Explore the complete chronicles of Demon Slayer (Kimetsu no Yaiba). A visual journey through every arc and volume of the Taisho era saga.',
  alternates: { canonical: 'https://demonnslayer.com/archive' },
};

export default function ArchivePage() {
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

  return <ArchiveClient arcGroups={arcGroups} />;
}
