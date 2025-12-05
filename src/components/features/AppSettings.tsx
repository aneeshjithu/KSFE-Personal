import React, { useRef } from 'react';
import { useData } from '../../context/DataContext';
import PageHeader from '../common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import BlurFade from '../magicui/blur-fade';

const AppSettings: React.FC = () => {
  const { exportData, importData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importData(file);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Import failed. Please ensure the file is valid.');
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Control"
        title="Playful settings"
        description="Backup data, restore memories, and see what version of Chitty is dancing on your device."
      />
      
      <div className="space-y-8">
        <BlurFade delay={0.05} inView>
          <Card className="rounded-[32px] border-none bg-white/90 shadow-[0_30px_70px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Data management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-slate-500">
                Chitty stores everything offline first. Export a snapshot anytime or re-import a saved timeline to continue where you left off.
        </p>
              <div className="flex flex-wrap gap-4">
                <Button className="rounded-2xl px-6 py-5 text-base font-semibold shadow-lg" onClick={exportData}>
                  Export data
                </Button>
                <input ref={fileInputRef} type="file" accept=".json,.txt" className="hidden" onChange={handleImport} />
                <Button
                  variant="outline"
                  className="rounded-2xl border-slate-200 bg-white/70 px-6 py-5 text-base font-semibold"
            onClick={() => fileInputRef.current?.click()} 
          >
                  Import data
                </Button>
        </div>
            </CardContent>
          </Card>
        </BlurFade>

        <BlurFade delay={0.1} inView>
          <Card className="rounded-[32px] border border-white/70 bg-white/80 shadow-inner">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Chitty PWA v1.0.0</p>
              <p className="text-sm text-slate-500">Crafted with love, Tailwind CSS, and framer-motion.</p>
            </CardContent>
          </Card>
        </BlurFade>
      </div>
    </div>
  );
};

export default AppSettings;
