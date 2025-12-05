import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Download, Smartphone, Share2, Info } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import BlurFade from '../magicui/blur-fade';

const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, installApp, showIOSInstructions } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  // Don't show if already installed or not installable
  if (isInstalled || (!isInstallable && !showIOSInstructions)) {
    return null;
  }

  const handleInstall = async () => {
    if (showIOSInstructions) {
      setShowInstructions(true);
    } else {
      await installApp();
    }
  };

  if (showInstructions) {
    return (
      <BlurFade delay={0.1} inView>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-sm w-full bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Smartphone className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Install Chitty on iOS</h3>
              <p className="text-sm text-slate-600 mb-4">
                Follow these steps to add Chitty to your home screen:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold text-xs mt-0.5">
                  1
                </div>
                <p className="text-slate-700">Tap the <Share2 className="inline h-4 w-4 mx-1" /> Share button in Safari</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold text-xs mt-0.5">
                  2
                </div>
                <p className="text-slate-700">Scroll down and tap "Add to Home Screen"</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold text-xs mt-0.5">
                  3
                </div>
                <p className="text-slate-700">Tap "Add" to install Chitty</p>
              </div>
            </div>

            <Button
              onClick={() => setShowInstructions(false)}
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700"
            >
              Got it!
            </Button>
          </div>
        </div>
      </BlurFade>
    );
  }

  return (
    <BlurFade delay={0.05} inView>
      <Button
        onClick={handleInstall}
        className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
      >
        <Download className="mr-2 h-5 w-5" />
        Install Chitty
        {showIOSInstructions && <Info className="ml-2 h-4 w-4" />}
      </Button>
    </BlurFade>
  );
};

export default PWAInstallButton;
