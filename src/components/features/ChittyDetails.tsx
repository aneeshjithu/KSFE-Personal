import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useData } from '../../context/DataContext';
import type { PropertyDetails } from '../../types';
import PageHeader from '../common/PageHeader';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import BlurFade from '../magicui/blur-fade';
import ErrorBoundary from '../common/ErrorBoundary';
import DeleteConfirmationModal from '../ui/delete-confirmation-modal';
import { CalendarDays, IndianRupee, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const statusTone: Record<string, string> = {
  running: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'running+auctioned': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  completed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const ChittyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, updateChitty, deleteChitty } = useData();
  const chitty = data.chitties.find((c) => c.id === id);

  const [properties, setProperties] = useState<PropertyDetails[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    holderName: '',
    location: '',
    measurement: '',
    value: 0,
    givenAmount: 0,
    pendingAmount: 0,
  });

  // Delete confirmation modals
  const [deletePropertyModal, setDeletePropertyModal] = useState<{
    isOpen: boolean;
    propertyId: string;
    propertyName: string;
  }>({ isOpen: false, propertyId: '', propertyName: '' });

  const [deleteChittyModal, setDeleteChittyModal] = useState(false);

  useEffect(() => {
    if (chitty) {
      setProperties(chitty.properties || []);
    }
  }, [chitty]);

  if (!chitty) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center text-slate-500">
        Chitty not found.
      </div>
    );
  }

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProperties = editingPropertyId
      ? properties.map((p) => (p.id === editingPropertyId ? { ...p, ...formData } : p))
      : [
          ...properties,
          {
            id: uuidv4(),
            ...formData,
          },
        ];

    setProperties(updatedProperties);
    updateChitty({ ...chitty, properties: updatedProperties });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      holderName: '',
      location: '',
      measurement: '',
      value: 0,
      givenAmount: 0,
      pendingAmount: 0,
    });
    setEditingPropertyId(null);
    setShowAddForm(false);
  };

  const handleEditProperty = (property: PropertyDetails) => {
    setFormData({
      holderName: property.holderName,
      location: property.location,
      measurement: property.measurement,
      value: property.value,
      givenAmount: property.givenAmount,
      pendingAmount: property.pendingAmount,
    });
    setEditingPropertyId(property.id);
    setShowAddForm(true);
  };

  const handleDeleteProperty = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    setDeletePropertyModal({
      isOpen: true,
      propertyId,
      propertyName: property?.holderName || 'Unknown Property',
    });
  };

  const confirmDeleteProperty = () => {
    const updatedProperties = properties.filter((p) => p.id !== deletePropertyModal.propertyId);
    setProperties(updatedProperties);
    updateChitty({ ...chitty, properties: updatedProperties });
  };

  const handleDeleteChitty = () => {
    setDeleteChittyModal(true);
  };

  const confirmDeleteChitty = () => {
    deleteChitty(chitty.id);
    navigate('/chitties');
  };

  const summaryTiles = [
    { label: 'Installment', value: `₹${chitty.installmentAmount.toLocaleString()}` },
    { label: 'Duration', value: `${chitty.totalMonths} months` },
    { label: 'Members', value: `${chitty.members.length}` },
  ];

  return (
    <ErrorBoundary>
      <div>
      <PageHeader
        eyebrow="Chitty Detail"
        title={chitty.name}
        description={`${chitty.branch ?? 'Unassigned branch'} · ${new Date(chitty.startDate).toLocaleDateString()}`}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 bg-white/70"
              onClick={() => navigate(`/chitties/${chitty.id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" aria-hidden />
              Edit
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl border-red-200 bg-red-50/80 text-red-500 hover:bg-red-100"
              onClick={handleDeleteChitty}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden />
              Delete
            </Button>
          </>
        }
      />

      <div className="mb-10 flex flex-wrap items-center gap-4">
        <span
          className={cn(
            'rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em]',
            statusTone[chitty.status] ?? 'bg-slate-100 text-slate-600 border-slate-200'
          )}
        >
          {chitty.status.replace('+', ' + ')}
        </span>
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4" aria-hidden />
          {chitty.branch || 'Branch TBD'}
        </span>
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4" aria-hidden />
          {new Date(chitty.startDate).toLocaleDateString()}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryTiles.map((tile) => (
          <Card key={tile.label} className="rounded-3xl border-white/60 bg-white/80 shadow-inner">
            <CardHeader className="pb-1">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{tile.label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{tile.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Properties & collateral</h2>
          <p className="text-sm text-slate-500">Keep every document and valuation tidy.</p>
        </div>
        <Button
          className="rounded-2xl px-6 py-5 text-base font-semibold shadow-lg"
          variant={showAddForm ? 'outline' : 'default'}
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? (
            'Close builder'
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" aria-hidden />
              Add property
            </>
          )}
        </Button>
      </div>

      {showAddForm && (
        <BlurFade delay={0.05} inView>
          <Card className="mt-6 rounded-[32px] border border-indigo-100 bg-white shadow-[0_25px_60px_rgba(99,102,241,0.15)]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {editingPropertyId ? 'Update property' : 'New property'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSaveProperty}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="holderName">Holder name</Label>
                    <Input
                      id="holderName"
                      value={formData.holderName}
                      onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="measurement">Measurement / Notes</Label>
                  <Textarea
                    id="measurement"
                    value={formData.measurement}
                    onChange={(e) => setFormData({ ...formData, measurement: e.target.value })}
                    placeholder="Plot size, survey numbers, attachments, etc."
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="value">Property value (₹)</Label>
                    <Input
                      id="value"
                      type="number"
                      min={0}
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="givenAmount">Given amount (₹)</Label>
                    <Input
                      id="givenAmount"
                      type="number"
                      min={0}
                      value={formData.givenAmount}
                      onChange={(e) => setFormData({ ...formData, givenAmount: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pendingAmount">Pending amount (₹)</Label>
                    <Input
                      id="pendingAmount"
                      type="number"
                      min={0}
                      value={formData.pendingAmount}
                      onChange={(e) => setFormData({ ...formData, pendingAmount: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-slate-200 bg-white/70"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-2xl px-6 py-5 text-base font-semibold shadow-lg">
                    {editingPropertyId ? 'Update property' : 'Save property'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </BlurFade>
      )}

      <div className="mt-10 grid gap-6">
        {properties.length ? (
          properties.map((property) => (
            <BlurFade key={property.id} delay={0.05} inView>
              <Card className="relative rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.06)]">
                <div className="absolute right-6 top-6 flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-slate-200 bg-white/70 text-sm"
                    onClick={() => handleEditProperty(property)}
                  >
                    <Pencil className="mr-1.5 h-4 w-4" aria-hidden />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl border-red-200 bg-red-50/80 text-red-500"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" aria-hidden />
                    Remove
                  </Button>
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{property.holderName}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" aria-hidden />
                      {property.location}
                    </p>
                    <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{property.measurement}</p>
                  </div>
                  <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Value</p>
                      <p className="mt-2 flex items-center gap-1 text-lg font-semibold text-slate-900">
                        <IndianRupee className="h-4 w-4" aria-hidden />
                        {property.value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Given</p>
                      <p className="mt-2 flex items-center gap-1 text-lg font-semibold text-emerald-600">
                        <IndianRupee className="h-4 w-4" aria-hidden />
                        {property.givenAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Pending</p>
                      <p className="mt-2 flex items-center gap-1 text-lg font-semibold text-rose-500">
                        <IndianRupee className="h-4 w-4" aria-hidden />
                        {property.pendingAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </BlurFade>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-sm text-slate-500">
            No properties captured yet. Add one to keep collateral in sync.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modals */}
      <DeleteConfirmationModal
        isOpen={deletePropertyModal.isOpen}
        onClose={() => setDeletePropertyModal({ isOpen: false, propertyId: '', propertyName: '' })}
        onConfirm={confirmDeleteProperty}
        title="Delete Property Record"
        description="This will permanently remove this property record from the chitty. This action cannot be undone."
        itemName={deletePropertyModal.propertyName}
        confirmText="Delete Property"
        variant="danger"
      />

      <DeleteConfirmationModal
        isOpen={deleteChittyModal}
        onClose={() => setDeleteChittyModal(false)}
        onConfirm={confirmDeleteChitty}
        title="Delete Chitty Forever"
        description="This will permanently delete the entire chitty along with all its data, members, payments, and properties. This action cannot be undone."
        itemName={chitty.name}
        confirmText="Delete Chitty"
        variant="danger"
      />
    </div>
    </ErrorBoundary>
  );
};

export default ChittyDetails;
