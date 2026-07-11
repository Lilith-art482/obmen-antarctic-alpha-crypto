'use client';
import { useState } from 'react';
import { Navigation } from './Navigation';
import { ToastProvider } from './ToastProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { ProfileModal } from './ProfileModal';
import { SettingsModal } from './SettingsModal';
import { ThemeProvider } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWallet';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { loading } = useWallet();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#0a0a1a] text-white relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
          <aside className="lg:w-64 lg:min-h-screen lg:p-4">
            <Navigation onOpenProfile={() => setProfileOpen(true)} onOpenSettings={() => setSettingsOpen(true)} />
          </aside>

          <main className="flex-1 p-4 lg:p-8 pb-36 lg:pb-8 max-w-7xl mx-auto w-full flex flex-col">
            <ErrorBoundary>
              <div className="flex-1 flex flex-col items-center justify-center">
                {loading ? (
                  <div className="w-8 h-8 loader-accent rounded-full animate-spin" />
                ) : (
                  children
                )}
              </div>
            </ErrorBoundary>
          </main>
        </div>

        <ToastProvider />
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}
