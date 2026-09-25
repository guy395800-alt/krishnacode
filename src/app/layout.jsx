'use client';

import './globals.css';
import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { usePathname } from 'next/navigation';

function MainLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide sidebar on landing page, login page, and active exam interface for clean distraction-free view
  const hideSidebar =
    pathname === '/' ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    (pathname?.includes('/exams/') && pathname?.includes('/workspace'));

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-950 text-slate-100 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Animated Background & Tech Particles */}
      <BackgroundEffects />

      <Navbar />
      <div className="flex flex-1">
        {!hideSidebar && user && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>NexgenCode — Student Coding Practice Platform</title>
        <meta name="description" content="Online programming practice and coding examination platform for students" />
      </head>
      <body>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
