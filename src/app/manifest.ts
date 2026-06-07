import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Demon Slayer: Breath of Ink',
    short_name: 'Demon Slayer',
    description: 'Immersive Demon Slayer (Kimetsu no Yaiba) manga reading experience.',
    start_url: '/',
    display: 'standalone',
    background_color: '#131313',
    theme_color: '#d32f2f',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
