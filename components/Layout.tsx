import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import {
  Car,
  Users,
  Wrench,
  BarChart3,
  LogOut,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Car className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Fleet Manager
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {session && (
                <>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{session.user.name || session.user.email}</span>
                    <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {session.user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            {session && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-4 mb-3">
                  <div className="text-base font-medium text-gray-800">
                    {session.user.name || session.user.email}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session.user.role}
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
