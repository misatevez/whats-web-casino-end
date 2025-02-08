import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FirebaseProvider } from '@/components/providers/firebase-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WhatsApp Web',
  description: 'WhatsApp Web - Send and receive messages without keeping your phone online.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WhatsApp',
  },
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=6ae5f450-b780-41ea-acc2-23905455e703',
    shortcut: 'https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=6ae5f450-b780-41ea-acc2-23905455e703',
    apple: 'https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=6ae5f450-b780-41ea-acc2-23905455e703',
    other: {
      rel: 'apple-touch-icon',
      url: 'https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=6ae5f450-b780-41ea-acc2-23905455e703',
    },
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overscroll-y-none">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#202c33" />
        <link rel="apple-touch-startup-image" href="https://firebasestorage.googleapis.com/v0/b/cargatusfichas.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=6ae5f450-b780-41ea-acc2-23905455e703" />
      </head>
      <body className={`${inter.className} safe-top`}>
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  );
}