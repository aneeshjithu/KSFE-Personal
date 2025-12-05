import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, eyebrow, actions, className }) => {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-6 rounded-[28px] border border-white/60 bg-white/80 px-6 py-6 shadow-[0_25px_60px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between',
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;


