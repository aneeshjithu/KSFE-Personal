import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../common/PageHeader';
import BlurFade from '../magicui/blur-fade';

const Members: React.FC = () => {
  const { data } = useData();
  
  const allMembers = data.chitties.flatMap((chitty) =>
    chitty.members.map((member) => ({
      ...member,
      chittyName: chitty.name,
      chittyId: chitty.id,
    }))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Members orbit"
        description="A delightful, searchable roll of everyone invested in your chitties."
      />

      {allMembers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center text-slate-500">
          No members to show yet. Add members inside a chitty to see them here.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {allMembers.map((member, index) => (
            <BlurFade key={`${member.id}-${index}`} delay={0.05 + index * 0.02} inView>
              <div className="flex items-center justify-between rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/15 to-indigo-500/20 text-lg font-semibold text-slate-900">
                    {member.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                    <p className="text-lg font-semibold text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-500">
                      Joined {new Date(member.joinedDate).toLocaleDateString()}
                </p>
                    {member.phone && <p className="text-sm text-slate-500">{member.phone}</p>}
              </div>
            </div>
              <Link 
                to={`/chitties/${member.chittyId}`} 
                  className="rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
              >
                {member.chittyName}
              </Link>
            </div>
            </BlurFade>
        ))}
          </div>
        )}
    </div>
  );
};

export default Members;
