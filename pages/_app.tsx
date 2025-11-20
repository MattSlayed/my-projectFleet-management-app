import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastContainer } from '@/components/ui/Toast';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  // Page transition animations
  useEffect(() => {
    const handleStart = () => document.body.classList.add('page-transition');
    const handleComplete = () => document.body.classList.remove('page-transition');

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <ToastContainer />
        <div className="animate-fade-in">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ErrorBoundary>
  );
}
