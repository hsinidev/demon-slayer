// ─── Server Component: fetches real data, renders reader shell ────────────────
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllChapters, getChapterBySlug, getChapterNav } from '@/lib/chapters';
import ReaderClient from './ReaderClient';

const DOMAIN = 'https://demonnslayer.com';

/* ── Static params for next build ──────────────────────────────────────────── */
export async function generateStaticParams() {
  return getAllChapters().map((ch) => ({ chapterId: ch.slug }));
}

/* ── Per-page metadata ──────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}): Promise<Metadata> {
  const { chapterId } = await params;
  const ch = getChapterBySlug(chapterId);
  if (!ch) return { title: 'Chapter Not Found' };

  const url = `${DOMAIN}/read/${chapterId}`;
  const imgUrl = `${DOMAIN}/manga/Kimetsu_no_Yaiba/${encodeURIComponent(ch.folderName)}/${encodeURIComponent(ch.thumb)}`;

  return {
    title: `Read Demon Slayer ${ch.title} Online | Kimetsu no Yaiba Manga`,
    description: `Read Demon Slayer (Kimetsu no Yaiba) ${ch.title} online for free in HD quality.`,
    keywords: `Demon Slayer, Kimetsu no Yaiba, ${ch.title}, manga online, read free`,
    alternates: { canonical: url },
    openGraph: {
      title: `Read Demon Slayer ${ch.title} Online`,
      description: `Free HD manga reader – ${ch.title}. No registration.`,
      url,
      siteName: 'Demon Slayer Manga Online',
      images: [{ url: imgUrl, width: 800, alt: `${ch.title} cover` }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Read Demon Slayer ${ch.title}`,
      images: [imgUrl],
    },
  };
}

/* ── Page Server Component ──────────────────────────────────────────────────── */
export default async function ReaderPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = getChapterBySlug(chapterId);
  if (!chapter) notFound();

  const { prev, next } = getChapterNav(chapterId);

  // Build image paths served via Next.js static file serving from /public
  // Images live at: manga/Kimetsu_no_Yaiba/<folderName>/<image>
  // We'll serve them through the /manga/ public alias configured in next.config
  const imagePaths = chapter.images.map(
    (img) =>
      `/manga/Kimetsu_no_Yaiba/${encodeURIComponent(chapter.folderName)}/${encodeURIComponent(img)}`
  );

  return (
    <ReaderClient
      chapterTitle={chapter.title}
      chapterNum={chapter.num}
      imagePaths={imagePaths}
      prevSlug={prev?.slug ?? null}
      nextSlug={next?.slug ?? null}
    />
  );
}
