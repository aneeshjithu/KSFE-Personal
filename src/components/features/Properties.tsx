import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import PageHeader from '../common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import BlurFade from '../magicui/blur-fade';
import ErrorBoundary from '../common/ErrorBoundary';
import { Building2, MapPin, Ruler, IndianRupee, Pencil, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '../ui/delete-confirmation-modal';
import type { PropertyDetails } from '../../types';

const Properties: React.FC = () => {
  const { data, updateChitty } = useData();

  // Aggregate all properties from all chitties
  const allProperties: Array<PropertyDetails & { chittyName: string; chittyId: string }> = [];

  data.chitties.forEach((chitty) => {
    if (chitty.properties && chitty.properties.length > 0) {
      chitty.properties.forEach((property) => {
        allProperties.push({
          ...property,
          chittyName: chitty.name,
          chittyId: chitty.id,
        });
      });
    }
  });

  // State for property management
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyDetails & { chittyId: string } | null>(null);
  const [formData, setFormData] = useState({
    chittyId: '',
    holderName: '',
    location: '',
    measurement: '',
    value: 0,
    givenAmount: 0,
    pendingAmount: 0,
  });

  // Delete confirmation modal
  const [deletePropertyModal, setDeletePropertyModal] = useState<{
    isOpen: boolean;
    propertyId: string;
    chittyId: string;
    propertyName: string;
  }>({ isOpen: false, propertyId: '', chittyId: '', propertyName: '' });

  const totalProperties = allProperties.length;
  const totalValue = allProperties.reduce((sum, p) => sum + p.value, 0);
  const totalGivenAmount = allProperties.reduce((sum, p) => sum + p.givenAmount, 0);
  const totalPendingAmount = allProperties.reduce((sum, p) => sum + p.pendingAmount, 0);

  // Get available chitties for dropdown
  const availableChitties = data.chitties.filter(chitty =>
    chitty.status === 'running' || chitty.status === 'running+auctioned'
  );

  const resetForm = () => {
    setFormData({
      chittyId: '',
      holderName: '',
      location: '',
      measurement: '',
      value: 0,
      givenAmount: 0,
      pendingAmount: 0,
    });
    setEditingProperty(null);
    setShowAddForm(false);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();

    const chitty = data.chitties.find(c => c.id === formData.chittyId);
    if (!chitty) return;

    const newProperty: PropertyDetails = {
      id: editingProperty?.id || `prop_${Date.now()}`,
      holderName: formData.holderName,
      location: formData.location,
      measurement: formData.measurement,
      value: formData.value,
      givenAmount: formData.givenAmount,
      pendingAmount: formData.pendingAmount,
    };

    let updatedProperties: PropertyDetails[];
    if (editingProperty) {
      // Update existing property
      updatedProperties = (chitty.properties || []).map(prop =>
        prop.id === editingProperty.id ? newProperty : prop
      );
    } else {
      // Add new property
      updatedProperties = [...(chitty.properties || []), newProperty];
    }

    updateChitty({ ...chitty, properties: updatedProperties });
    resetForm();
  };

  const handleEditProperty = (property: PropertyDetails & { chittyId: string }) => {
    setEditingProperty(property);
    setFormData({
      chittyId: property.chittyId,
      holderName: property.holderName,
      location: property.location,
      measurement: property.measurement,
      value: property.value,
      givenAmount: property.givenAmount,
      pendingAmount: property.pendingAmount,
    });
    setShowAddForm(true);
  };

  const handleDeleteProperty = (propertyId: string, chittyId: string, propertyName: string) => {
    setDeletePropertyModal({
      isOpen: true,
      propertyId,
      chittyId,
      propertyName,
    });
  };

  const confirmDeleteProperty = () => {
    const chitty = data.chitties.find(c => c.id === deletePropertyModal.chittyId);
    if (!chitty) return;

    const updatedProperties = (chitty.properties || []).filter(
      prop => prop.id !== deletePropertyModal.propertyId
    );

    updateChitty({ ...chitty, properties: updatedProperties });
  };

  return (
    <ErrorBoundary>
      <div>
      <PageHeader
        eyebrow="Assets"
        title="Property Portfolio"
        description="Track all properties across chitties with comprehensive details and outstanding amounts."
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 bg-white/70 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors duration-200"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : '+ Add Property'}
            </Button>
          </>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-black font-bold">Total Properties</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalProperties}</p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-black font-bold">Total Value</p>
          <p className="mt-2 text-3xl font-bold text-emerald-500">
            ₹{totalValue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-black font-bold">Given Amount</p>
          <p className="mt-2 text-3xl font-bold text-cyan-500">
            ₹{totalGivenAmount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-black font-bold">Pending</p>
          <p className="mt-2 text-3xl font-bold text-orange-500">
            ₹{totalPendingAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {showAddForm && (
        <BlurFade delay={0.05} inView>
          <Card className="mb-8 rounded-[32px] border border-indigo-100 bg-white shadow-[0_25px_60px_rgba(99,102,241,0.15)]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {editingProperty ? 'Update property' : 'Add new property'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSaveProperty}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="chittySelect">Select Chitty</Label>
                    <select
                      id="chittySelect"
                      value={formData.chittyId}
                      onChange={(e) => setFormData({ ...formData, chittyId: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      required
                    >
                      <option value="">Choose a chitty...</option>
                      {availableChitties.map((chitty) => (
                        <option key={chitty.id} value={chitty.id}>
                          {chitty.name} ({chitty.branch})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="holderName">Holder Name</Label>
                    <Input
                      id="holderName"
                      value={formData.holderName}
                      onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                      placeholder="Property holder name"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Property location"
                      required
                    />
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
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="value">Total Value (₹)</Label>
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
                    <Label htmlFor="givenAmount">Given Amount (₹)</Label>
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
                    <Label htmlFor="pendingAmount">Pending Amount (₹)</Label>
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
                    className="rounded-2xl border-slate-200 bg-white/70 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-colors duration-200"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-2xl px-6 py-3 text-base font-semibold shadow-lg">
                    {editingProperty ? 'Update Property' : 'Save Property'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </BlurFade>
      )}

      {allProperties.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-12 text-center text-slate-500">
          No properties found. Add properties to chitties from the chitty details page.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {allProperties.map((property, index) => (
            <BlurFade key={property.id} delay={0.05 + index * 0.03} inView>
              <Card className="group relative flex h-full flex-col rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.06)]">
                <div className="absolute inset-y-0 left-0 w-1 rounded-bl-[28px] rounded-tl-[28px] bg-gradient-to-b from-emerald-400 to-teal-500" />

                {/* Action buttons */}
                <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 bg-white/80 text-xs"
                    onClick={() => handleEditProperty(property)}
                  >
                    <Pencil className="h-3 w-3 mr-1" aria-hidden />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-red-200 bg-red-50/80 text-red-600 hover:bg-red-100"
                    onClick={() => handleDeleteProperty(property.id, property.chittyId, property.holderName)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" aria-hidden />
                    Delete
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-emerald-600 font-semibold">
                        <Building2 className="h-3.5 w-3.5" aria-hidden />
                        {property.chittyName}
                      </div>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">{property.holderName}</h3>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" aria-hidden />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Ruler className="h-4 w-4 text-slate-400" aria-hidden />
                      <span>{property.measurement}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-500">Total Value</span>
                    <span className="flex items-center gap-1 text-base font-bold text-slate-900">
                      <IndianRupee className="h-4 w-4" aria-hidden />
                      {property.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-500">Given</span>
                    <span className="flex items-center gap-1 text-base font-semibold text-emerald-600">
                      <IndianRupee className="h-4 w-4" aria-hidden />
                      {property.givenAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Pending</span>
                    <span className="flex items-center gap-1 text-lg font-bold text-orange-600">
                      <IndianRupee className="h-4 w-4" aria-hidden />
                      {property.pendingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </BlurFade>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deletePropertyModal.isOpen}
        onClose={() => setDeletePropertyModal({ isOpen: false, propertyId: '', chittyId: '', propertyName: '' })}
        onConfirm={confirmDeleteProperty}
        title="Delete Property"
        description="This will permanently remove this property record. This action cannot be undone."
        itemName={deletePropertyModal.propertyName}
        confirmText="Delete Property"
        variant="danger"
      />
    </div>
    </ErrorBoundary>
  );
};

export default Properties;
