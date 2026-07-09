'use client';
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(15, 15, 30, 0.95)',
          color: '#e2e8f0',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(79, 70, 229, 0.3)',
          borderRadius: '12px',
        },
      }}
    />
  );
}