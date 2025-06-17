import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wakr - Smart Wake-up Calls',
    short_name: 'Wakr',
    description: 'Start your day right with personalized wake-up calls and habit tracking',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#7c3aed',
    orientation: 'portrait',
    scope: '/',
    categories: ['productivity', 'lifestyle', 'health'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-1.png',
        sizes: '1280x720',
        type: 'image/png',
      },
      {
        src: '/screenshot-2.png',
        sizes: '1280x720',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Set Wake-up Call',
        short_name: 'Wake Call',
        description: 'Configure your wake-up call',
        url: '/dashboard/calls',
        icons: [{ src: '/shortcuts/wake-call.png', sizes: '96x96' }],
      },
      {
        name: 'Track Habits',
        short_name: 'Habits',
        description: 'View and track your habits',
        url: '/dashboard/habits',
        icons: [{ src: '/shortcuts/habits.png', sizes: '96x96' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}