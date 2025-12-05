import React from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import BlurFade from '../magicui/blur-fade';
import ErrorBoundary from '../common/ErrorBoundary';
import PWAInstallButton from '../common/PWAInstallButton';
import { Sparkles, Users, Wallet, TrendingUp, BellRing, ArrowUpRight, CalendarClock, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const Dashboard: React.FC = () => {
  const { data } = useData();
  const navigate = useNavigate();

  const totalChitties = data.chitties.length;
  const activeChitties = data.chitties.filter((c) => c.status === 'running' || c.status === 'running+auctioned').length;
  const auctionedChitties = data.chitties.filter((c) => c.status === 'running+auctioned').length;
  const comingAuctions = data.chitties.filter((c) => c.status === 'running').length;
  const chittiesWithProperties = data.chitties.filter((c) => c.properties && c.properties.length > 0).length;

  const stats = [
    { title: 'Total Chitties', value: totalChitties, trend: '+4 new', accent: 'from-emerald-500/20 to-teal-400/20', icon: Wallet },
    { title: 'Auctioned', value: auctionedChitties, trend: 'Running + Auctioned', accent: 'from-cyan-400/20 to-teal-500/20', icon: TrendingUp },
    { title: 'Coming Auctions', value: comingAuctions, trend: 'Ready to auction', accent: 'from-emerald-400/20 to-cyan-400/20', icon: Users },
    { title: 'With Properties', value: chittiesWithProperties, trend: 'Chitties', accent: 'from-teal-400/20 to-emerald-400/20', icon: Sparkles },
  ];

  const upcomingReminders = [...data.reminders]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const activeChittyList = data.chitties.filter((c) => c.status === 'running');

  const activityFeed = data.chitties
    .flatMap((c) =>
      c.payments.map((p) => ({
        ...p,
        chittyName: c.name,
        memberName: c.members.find((m) => m.id === p.memberId)?.name ?? 'Member',
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <ErrorBoundary>
      <div className="space-y-8">
      <BlurFade delay={0.05} inView>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-1">
          <div className="relative overflow-hidden rounded-[22px] bg-white p-8 sm:p-12">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full blur-3xl -z-0" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100/50 to-transparent rounded-full blur-3xl -z-0" />
            
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live Dashboard
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Welcome to <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">KSFE Chitty</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
                  Manage your chitty funds, track collections, monitor auctions, and stay on top of reminders—all in one powerful platform.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button
                    className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5"
                    onClick={() => navigate('/chitties/new')}
                  >
                    Create New Chitty
                    <ArrowUpRight className="ml-2 h-5 w-5" aria-hidden />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl border-2 border-slate-200 bg-white px-8 py-6 text-lg font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all hover:-translate-y-0.5"
                    onClick={() => navigate('/reminders')}
                  >
                    View Reminders
                  </Button>
                  <div className="flex items-center">
                    <PWAInstallButton />
                  </div>
                </div>
              </div>
              
              <div className="flex w-full max-w-sm flex-col gap-4 lg:w-auto">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Chitties</p>
                      <p className="mt-2 text-4xl font-extrabold text-slate-900">{activeChitties || '0'}</p>
                      <p className="text-sm text-slate-600 mt-1">Currently running</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
                    <p className="text-sm font-semibold text-emerald-600 mt-2">● Online</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sync</p>
                    <p className="text-sm font-semibold text-slate-700 mt-2 truncate">
                      {new Date(data.lastUpdated ?? new Date().toISOString()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <BlurFade key={stat.title} delay={0.1 + index * 0.05} inView>
            <Card className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/95 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className={cn('absolute inset-0 opacity-20', `bg-gradient-to-br ${stat.accent}`)} />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-700">{stat.title}</CardTitle>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">{stat.trend}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-3 shadow-inner">
                  <stat.icon className="h-5 w-5 text-emerald-600" aria-hidden />
                </div>
              </CardHeader>
              <CardContent className="relative pt-2">
                <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <BlurFade delay={0.2} inView className="lg:col-span-2">
          <Card className="rounded-[28px] border-none bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
            <CardHeader className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Active chitties</CardTitle>
                <p className="text-sm text-slate-500">Tap a card to jump into details.</p>
              </div>
              <Button variant="ghost" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700" onClick={() => navigate('/chitties')}>
                View all
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeChittyList.length ? (
                activeChittyList.map((chitty) => (
                  <button
                    key={chitty.id}
                    onClick={() => navigate(`/chitties/${chitty.id}`)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white/70 px-5 py-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40"
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{chitty.name}</p>
                      <p className="text-sm text-slate-500">
                        Owned By <span className="font-semibold text-blue-600">{chitty.ownedBy || 'Owner not specified'}</span>
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-emerald-500">{chitty.status}</p>
                      <p className="text-xs text-slate-400">Started {new Date(chitty.startDate).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                  No active chitties yet. Create one to get the party started.
                </div>
              )}
            </CardContent>
          </Card>
        </BlurFade>

        <div className="space-y-8">
          <BlurFade delay={0.25} inView>
            <Card className="rounded-[28px] border-none bg-gradient-to-b from-white/95 to-white/70 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <BellRing className="h-6 w-6 text-emerald-500" aria-hidden />
                  Upcoming reminders
                </CardTitle>
                <p className="text-sm text-slate-500">Stay ahead with friendly nudges.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingReminders.length ? (
                  upcomingReminders.map((reminder) => {
                    const chitty = data.chitties.find((c) => c.id === reminder.chittyId);
                    return (
                      <div key={reminder.id} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{chitty?.name ?? 'Unknown Chitty'}</p>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                              {chitty?.branch ?? '—'}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                            {new Date(reminder.date).toLocaleDateString()}
                          </div>
                        </div>
                        {reminder.note && <p className="mt-2 text-sm text-slate-500">“{reminder.note}”</p>}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    No reminders yet—set one to keep cashflows magical.
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <Card className="rounded-[28px] border-none bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                  <CalendarClock className="h-6 w-6 text-emerald-500" aria-hidden />
                  Recent activity
                </CardTitle>
                <p className="text-sm text-slate-500">Latest member payments and updates.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityFeed.length ? (
                  activityFeed.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4">
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        ₹
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {activity.memberName} paid ₹{activity.amount}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.chittyName} • {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    No activity yet. Record a payment to see the feed bloom.
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
