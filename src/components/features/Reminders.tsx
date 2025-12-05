import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import PageHeader from '../common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import BlurFade from '../magicui/blur-fade';
import DeleteConfirmationModal from '../ui/delete-confirmation-modal';
import { BellRing, Trash2 } from 'lucide-react';

const Reminders: React.FC = () => {
  const { data, addReminder, deleteReminder } = useData();
  const { chitties, reminders } = data;

  const activeChitties = chitties.filter((c) => c.status === 'running' || c.status === 'running+auctioned');

  const [formData, setFormData] = useState({
    chittyId: '',
    date: '',
    note: '',
  });

  // Delete confirmation modal
  const [deleteReminderModal, setDeleteReminderModal] = useState<{
    isOpen: boolean;
    reminderId: string;
    reminderNote?: string;
  }>({ isOpen: false, reminderId: '', reminderNote: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.chittyId && formData.date) {
      addReminder(formData);
      setFormData({ chittyId: '', date: '', note: '' });
    }
  };

  const handleDelete = (id: string) => {
    const reminder = reminders.find((r) => r.id === id);
    setDeleteReminderModal({
      isOpen: true,
      reminderId: id,
      reminderNote: reminder?.note,
    });
  };

  const confirmDeleteReminder = () => {
    deleteReminder(deleteReminderModal.reminderId);
  };

  const renderChittyInfo = (id: string) => {
    const chitty = chitties.find((c) => c.id === id);
    return {
      name: chitty?.name ?? 'Unknown chitty',
      branch: chitty?.branch ?? 'Branch TBD',
    };
  };

  return (
    <div>
      <PageHeader
        eyebrow="Focus"
        title="Playful reminders"
        description="Friendly nudges keep payouts on track. Everything syncs offline for zero-stress collections."
      />

      <BlurFade delay={0.05} inView>
        <Card className="mb-10 rounded-[32px] border-none bg-white/90 shadow-[0_30px_70px_rgba(15,23,42,0.06)]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="chittyId">Chitty</Label>
                  <select
                    id="chittyId"
                    value={formData.chittyId}
                    onChange={(e) => setFormData({ ...formData, chittyId: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    required
                  >
                    <option value="">Pick a chitty</option>
                    {activeChitties.map((chitty) => (
                      <option key={chitty.id} value={chitty.id}>
                        {chitty.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="date">Reminder date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="rounded-2xl border-slate-200 bg-white/70"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  placeholder="Auction rehearsal, payout, call member..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="rounded-2xl border-slate-200 bg-white/70"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="rounded-2xl px-6 py-5 text-base font-semibold shadow-lg">
                  Save reminder
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </BlurFade>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reminders.length ? (
          reminders
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((reminder, index) => {
              const chittyInfo = renderChittyInfo(reminder.chittyId);
              return (
                <BlurFade key={reminder.id} delay={0.05 + index * 0.03} inView>
                  <Card className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.06)]">
                    <div className="absolute inset-y-0 left-0 w-1 rounded-bl-[32px] rounded-tl-[32px] bg-gradient-to-b from-emerald-400 to-teal-500" />
                    <button
                      type="button"
                      onClick={() => handleDelete(reminder.id)}
                      className="absolute right-6 top-6 rounded-full border border-red-100 bg-red-50/80 p-2 text-red-600 shadow-sm hover:bg-red-100 hover:text-red-700 hover:border-red-200 transition-colors"
                      aria-label="Delete reminder"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{chittyInfo.branch}</p>
                        <h3 className="text-xl font-bold text-slate-900">{chittyInfo.name}</h3>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-emerald-600">
                        <BellRing className="h-5 w-5" aria-hidden />
                        <span className="text-sm font-semibold">
                          {new Date(reminder.date).toLocaleDateString()}
                        </span>
                      </div>
                      {reminder.note && (
                        <p className="text-sm italic text-slate-600">“{reminder.note}”</p>
                      )}
                    </div>
                  </Card>
                </BlurFade>
              );
            })
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-10 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">
            No reminders yet. Create one to keep everyone in sync.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteReminderModal.isOpen}
        onClose={() => setDeleteReminderModal({ isOpen: false, reminderId: '', reminderNote: '' })}
        onConfirm={confirmDeleteReminder}
        title="Remove Reminder"
        description="This will permanently delete this reminder. This action cannot be undone."
        itemName={deleteReminderModal.reminderNote || 'Reminder'}
        confirmText="Remove Reminder"
        variant="warning"
      />
    </div>
  );
};

export default Reminders;
