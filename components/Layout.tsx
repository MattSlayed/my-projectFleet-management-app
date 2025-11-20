import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Car,
  Users,
  Wrench,
  BarChart3,
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [mobileMenuOpen]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Drivers', href: '/drivers', icon: Users },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Skip to main content (Accessibility) */}
      <a
        href="#main-content"
        className="skip-to-content"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav
        className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-sticky"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link
                href="/"
                className="flex-shrink-0 flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md"
              >
                <div className="p-1.5 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <Car className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <span className="ml-3 text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  NOVATEK Fleet
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg',
                        'transition-all duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                        active
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Info (Desktop) */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium text-neutral-900">Fleet Manager</span>
                <span className="ml-2 text-neutral-500">Admin</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  'inline-flex items-center justify-center p-2 rounded-lg',
                  'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-colors duration-150'
                )}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <div className="sm:hidden fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl z-50 animate-slide-in-right">
              <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
                <span className="text-lg font-semibold text-neutral-900">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg',
                        'transition-all duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                        active
                          ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600 -ml-[4px] pl-[calc(1rem-4px)]'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}
      </nav>

      {/* Main content */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
      >
        {children}
      </main>
    </div>
  );
}
