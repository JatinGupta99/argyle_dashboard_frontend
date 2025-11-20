import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
export const metadata = {
  title: 'Argyle Dashboard',
  description: 'Admin dashboard app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
