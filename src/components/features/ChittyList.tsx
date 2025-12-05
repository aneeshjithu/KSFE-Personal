import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../common/PageHeader';
import { Button } from '../ui/button';
import BlurFade from '../magicui/blur-fade';
import ErrorBoundary from '../common/ErrorBoundary';
import DeleteConfirmationModal from '../ui/delete-confirmation-modal';
import { Calendar, MapPin, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChittyListProps {
  statusFilter?: string[];
}

const statusStyles: Record<string, string> = {
  running: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'running+auctioned': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  completed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const ChittyList: React.FC<ChittyListProps> = ({ statusFilter }) => {
  const { data, deleteChitty } = useData();
  const filteredChitties = statusFilter ? data.chitties.filter((c) => statusFilter.includes(c.status)) : data.chitties;
  
  // Sort chitties by owner name (ownedBy)
  const chitties = [...filteredChitties].sort((a, b) => {
    const ownerA = a.ownedBy || 'zzz'; // Put chitties without owner at the end
    const ownerB = b.ownedBy || 'zzz';
    return ownerA.localeCompare(ownerB);
  });

  // Delete confirmation modal
  const [deleteChittyModal, setDeleteChittyModal] = React.useState<{
    isOpen: boolean;
    chittyId: string;
    chittyName: string;
  }>({ isOpen: false, chittyId: '', chittyName: '' });

  const handleDelete = (id: string, name: string) => {
    setDeleteChittyModal({
      isOpen: true,
      chittyId: id,
      chittyName: name,
    });
  };

  const confirmDeleteChitty = () => {
    deleteChitty(deleteChittyModal.chittyId);
  };

  return (
    <ErrorBoundary>
      <div>
      <PageHeader
        title="Create/View"
        eyebrow="Manage chitties"
        description="Track every chitty, their members and auction readiness with premium clarity."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-2xl border-slate-200 bg-white/70 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
              <Link to="/chitties">All chitties</Link>
            </Button>
            <Button asChild className="rounded-2xl px-6 py-5 text-base font-semibold shadow-lg">
              <Link to="/chitties/new">Create chitty</Link>
            </Button>
          </>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-black font-bold">Total</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{chitties.length}</p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-black font-bold">Active</p>
          <p className="mt-2 text-3xl font-bold text-emerald-500">
            {chitties.filter((c) => c.status === 'running').length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-black font-bold">Auctioned</p>
          <p className="mt-2 text-3xl font-bold text-indigo-500">
            {chitties.filter((c) => c.status === 'running+auctioned').length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-black font-bold">Completed</p>
          <p className="mt-2 text-3xl font-bold text-slate-700">
            {chitties.filter((c) => c.status === 'completed').length}
          </p>
        </div>
      </div>

      {chitties.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-12 text-center text-slate-500">
          No chitties yet. Tap “Create chitty” to build your first delightful pool.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {chitties.map((chitty, index) => (
            <BlurFade key={chitty.id} delay={0.05 + index * 0.03} inView>
              <div className="group relative flex h-full flex-col rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.06)]">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/chitties/${chitty.id}`} className="text-2xl font-semibold text-slate-900 hover:underline">
                      {chitty.name}
                    </Link>
                    {chitty.branch && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" aria-hidden />
                        {chitty.branch}
                      </p>
                    )}
                    <p className="mt-2 flex items-center gap-1 text-xs uppercase tracking-[0.4em] text-slate-400">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {new Date(chitty.startDate).toLocaleDateString()}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs uppercase tracking-[0.4em] text-blue-600 font-semibold">
                      {chitty.ownedBy || 'No owner'}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-2xl border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                      statusStyles[chitty.status] ?? 'bg-slate-100 text-slate-600 border-slate-200'
                    )}
                  >
                    {chitty.status.replace('+', ' + ')}
                  </span>
                </div>

                <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm">
                  {/* <div>
                    <dt className="text-xs uppercase tracking-[0.4em] text-slate-400">Installment</dt>
                    <dd className="mt-2 flex items-center gap-1 text-base font-semibold text-slate-900">
                      <IndianRupee className="h-4 w-4" aria-hidden />
                      {chitty.installmentAmount.toLocaleString()}
                    </dd>
                  </div> */}
                  <div>
                    <dt className="text-xs uppercase tracking-[0.4em] text-slate-400">Duration</dt>
                    <dd className="mt-2 text-base font-semibold text-slate-900">{chitty.totalMonths} months</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.4em] text-slate-400">Chitty No</dt>
                    <dd className="mt-2 text-base font-semibold text-slate-900">
                      {chitty.chittyNo || '-'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="rounded-2xl border-slate-200 bg-white/70 text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                    <Link to={`/chitties/${chitty.id}/edit`} className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" aria-hidden />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-red-200 bg-red-50/60 text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleDelete(chitty.id, chitty.name)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                    Delete
                  </Button>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteChittyModal.isOpen}
        onClose={() => setDeleteChittyModal({ isOpen: false, chittyId: '', chittyName: '' })}
        onConfirm={confirmDeleteChitty}
        title="Delete Chitty"
        description="This will permanently delete the chitty and all its associated data including members, payments, and properties. This action cannot be undone."
        itemName={deleteChittyModal.chittyName}
        confirmText="Delete Chitty"
        variant="danger"
      />
    </div>
    </ErrorBoundary>
  );
};

export default ChittyList;
