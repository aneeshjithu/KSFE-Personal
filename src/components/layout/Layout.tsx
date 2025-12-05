import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Wallet, Clock, Bell, Users, Settings, Hammer } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorBoundary from '../common/ErrorBoundary';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chitties', label: 'All Chitties', icon: Wallet },
  { to: '/auctioned', label: 'Auctioned', icon: Hammer },
  { to: '/to-be-auctioned', label: 'Coming Auctions', icon: Clock },
  { to: '/reminders', label: 'Reminders', icon: Bell },
  { to: '/properties', label: 'Properties', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-foreground">
      {/* Ambient background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-300/20 to-pink-300/20 blur-3xl" />
        <div className="absolute right-20 top-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-300/15 to-purple-300/15 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-amber-200/10 to-orange-200/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:bg-white lg:hidden"
          aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className="text-xl font-medium">{isSidebarOpen ? '✕' : '☰'}</span>
        </button>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/50 bg-white/95 p-6 pb-8 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 lg:bg-white/90 lg:shadow-none',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="mb-8 flex items-center gap-3 rounded-2xl">
            <div className="flex h-12 w-full items-center justify-center rounded-xl bg-white p-2 shadow-[0_15px_35px_rgba(34,197,94,0.25)]">
              <img src="/ksfe-logo.png" alt="KSFE Logo" className="h-full w-full object-contain" />
            </div>
            {/* <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">KSFE Chitty</p>
               <p className="text-lg font-semibold tracking-tight">App</p> 
            </div> */}
          </div>

          {/* <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            <Sparkles className="h-4 w-4 text-emerald-400" aria-hidden />
            Navigation
          </div> */}

          <nav className="fancy-scrollbar flex-1 space-y-2 overflow-auto pb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className="block" onClick={() => setIsSidebarOpen(false)}>
                  {({ isActive }) => (
                    <div className="relative">
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-2xl bg-white shadow-[0_10px_30px_rgba(76,110,245,0.15)] ring-1 ring-indigo-100"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <div
                        className={cn(
                          'relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                          isActive
                            ? 'text-slate-900'
                            : 'text-slate-500 hover:text-slate-900'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/40 shadow-inner transition-all',
                            isActive && 'border-emerald-100 bg-gradient-to-br from-emerald-500/10 to-teal-500/20 text-emerald-600'
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                        </div>
                        <span>{item.label}</span>
                      </div>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/50 bg-white/30 p-4 text-sm backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/50">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Currently signed in</p>
            <p className="truncate text-base font-semibold text-slate-800 dark:text-white">{user?.email ?? 'guest@chitty.app'}</p>
            <Button
              variant="outline"
              className="mt-4 w-full justify-center rounded-xl border-slate-200 bg-white/60 text-slate-700 shadow-sm hover:bg-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden />
              Sign out
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden lg:ml-0">
          <div className="h-full overflow-auto px-4 py-6 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-xl lg:p-10">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
