import type { Metadata, Viewport } from "next";
import { Epilogue, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#D32F2F",
};

export const metadata: Metadata = {
  title: "Demon Slayerr Manga Online",
  description: "Read Demon Slayer: Kimetsu no Yaiba manga online. High-quality scans and immersive 3D reading experience.",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "https://demonnslayer.com/",
  },
  openGraph: {
    title: "Demon Slayerr Manga Online - Read Kimetsu no Yaiba",
    description: "Read Demon Slayer: Kimetsu no Yaiba manga online. High-quality scans and immersive 3D reading experience.",
    url: "https://demonnslayer.com/",
    siteName: "Demon Slayerr Manga Online",
    images: [
      {
        url: "https://demonnslayer.com/og-artwork-tanjiro-nezuko.jpg",
        width: 1200,
        height: 630,
        alt: "Demon Slayer: Kimetsu no Yaiba Key Artwork featuring Tanjiro and Nezuko",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Demon Slayerr Manga Online",
    description: "Read Demon Slayer: Kimetsu no Yaiba manga online. High-quality scans.",
    images: ["https://demonnslayer.com/og-artwork-tanjiro-nezuko.jpg"],
  }
};

const GA_TRACKING_ID = "G-KEY3JJPXCM";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ComicSeries",
    "name": "Demon Slayer: Kimetsu no Yaiba",
    "alternateName": "Kimetsu no Yaiba",
    "url": "https://demonnslayer.com/",
    "author": {
      "@type": "Person",
      "name": "Koyoharu Gotouge"
    },
    "genre": ["Action", "Dark Fantasy", "Martial Arts"],
    "about": "A young man named Tanjiro Kamado becomes a demon slayer after his family is slaughtered and his younger sister Nezuko is turned into a demon."
  },
  {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "Demon Slayer: Kimetsu no Yaiba Manga Online",
    "author": {
      "@type": "Person",
      "name": "Koyoharu Gotouge"
    },
    "url": "https://demonnslayer.com/",
    "inLanguage": "en",
    "bookFormat": "https://schema.org/GraphicNovel",
    "isAccessibleForFree": true
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Next.js 14 optimized Script loading for Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${epilogue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
