import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import BlurFade from '../magicui/blur-fade';

const ChittyForm: React.FC = () => {
  const { addChitty, updateChitty, data } = useData();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    name: '',
    chittyNo: '',
    branch: '',
    ownedBy: '',
    totalMonths: 20,
    installmentAmount: 5000,
    startDate: new Date().toISOString().split('T')[0],
    status: 'running' as 'running' | 'completed' | 'running+auctioned',
    auctionAmount: 0,
    finalAmount: 0,
  });

  useEffect(() => {
    if (id) {
      const chitty = data.chitties.find((c) => c.id === id);
      if (chitty) {
        setFormData({
          name: chitty.name,
          chittyNo: chitty.chittyNo || '',
          branch: chitty.branch || '',
          ownedBy: chitty.ownedBy || '',
          totalMonths: chitty.totalMonths,
          installmentAmount: chitty.installmentAmount,
          startDate: chitty.startDate.split('T')[0],
          status: chitty.status,
          auctionAmount: chitty.auctionAmount || 0,
          finalAmount: chitty.finalAmount || 0,
        });
      }
    }
  }, [id, data.chitties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      const chitty = data.chitties.find((c) => c.id === id);
      if (chitty) {
        updateChitty({
          ...chitty,
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
        });
      }
    } else {
      addChitty({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
      });
    }
    navigate('/chitties');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Create"
        title={id ? 'Update chitty' : 'Create chitty'}
        description="Craft a delightful plan with clear payouts, members, and offline-ready guardrails."
      />

      <BlurFade delay={0.05} inView>
        <Card className="rounded-[32px] border-none bg-white/90 shadow-[0_30px_70px_rgba(15,23,42,0.06)]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {id ? 'Edit details' : 'Plan the essentials'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name">Chitty name</Label>
                  <Input
                    id="name"
                    placeholder="Enter chitty name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="rounded-2xl border-slate-200 bg-white/70"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="chittyNo">Chitty No</Label>
                  <Input
                    id="chittyNo"
                    placeholder="Enter chitty no"
                    value={formData.chittyNo}
                    onChange={(e) => setFormData({ ...formData, chittyNo: e.target.value })}
                    className="rounded-2xl border-slate-200 bg-white/70"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    placeholder="Enter branch name"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    required
                    className="rounded-2xl border-slate-200 bg-white/70"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="ownedBy">Owned By</Label>
                  <Input
                    id="ownedBy"
                    placeholder="Enter owner name"
                    value={formData.ownedBy}
                    onChange={(e) => setFormData({ ...formData, ownedBy: e.target.value })}
                    className="rounded-2xl border-slate-200 bg-white/70"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <Label htmlFor="months">Total months</Label>
                  <Input
                    id="months"
                    type="number"
                    min={1}
                    value={formData.totalMonths}
                    onChange={(e) => setFormData({ ...formData, totalMonths: Number(e.target.value) })}
                    required
                    className="rounded-2xl border-slate-200 bg-white/70"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="amount">Installment amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min={0}
                    value={formData.installmentAmount}
                    onChange={(e) => setFormData({ ...formData, installmentAmount: Number(e.target.value) })}
                    required
                    className="rounded-2xl border-slate-200 bg-white/70"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="rounded-2xl border-slate-200 bg-white/70"
                  />
                </div>
              </div>

              {id && (
                <div className="space-y-3">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'running' | 'completed' | 'running+auctioned' })}
                    className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <option value="running">Running</option>
                    <option value="running+auctioned">Running + Auctioned</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}

              {formData.status === 'running+auctioned' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="auctionAmount">Auction amount (₹)</Label>
                    <Input
                      id="auctionAmount"
                      type="number"
                      min={0}
                      value={formData.auctionAmount}
                      onChange={(e) => setFormData({ ...formData, auctionAmount: Number(e.target.value) })}
                      className="rounded-2xl border-slate-200 bg-white/70"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="finalAmount">Final amount (₹)</Label>
                    <Input
                      id="finalAmount"
                      type="number"
                      min={0}
                      value={formData.finalAmount}
                      onChange={(e) => setFormData({ ...formData, finalAmount: Number(e.target.value) })}
                      className="rounded-2xl border-slate-200 bg-white/70"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-2xl border-slate-200 bg-white/70 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                  onClick={() => navigate('/chitties')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 rounded-2xl py-6 text-base font-semibold shadow-lg">
                  {id ? 'Update chitty' : 'Create chitty'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
};

export default ChittyForm;
