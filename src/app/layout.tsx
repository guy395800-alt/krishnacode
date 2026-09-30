'use client';

import './globals.css';
import React, { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isLandingPage = pathname === '/';

  // Hide sidebar on landing page, login page, and active exam interface for clean distraction-free view
  const hideSidebar =
    isLandingPage ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    (pathname?.includes('/exams/') && pathname?.includes('/workspace'));

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-950 text-slate-100 selection:bg-blue-500/30 overflow-x-hidden font-sans">
      {/* Dynamic Animated Background & Tech Particles */}
      <BackgroundEffects />

      <Navbar />
      <div className="flex flex-1">
        {!hideSidebar && user && <Sidebar />}
        <main className={`flex-1 w-full ${isLandingPage ? '' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>NexgenCode — Enterprise Coding Practice &amp; Examination Platform</title>
        <meta name="description" content="Institutional competitive programming sandbox, proctored examinations, and automated compiler evaluation platform" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/amazon-ember" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
