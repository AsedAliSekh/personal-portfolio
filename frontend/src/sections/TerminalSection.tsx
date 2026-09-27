import React from 'react';
import { InteractiveTerminal } from '../components/terminal/InteractiveTerminal';
import { IProfile, ISkill, IProject } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalSectionProps {
  profile: IProfile | null;
  skills: ISkill[];
  projects: IProject[];
}

export const TerminalSection: React.FC<TerminalSectionProps> = ({ profile, skills, projects }) => {
  return (
    <section id="terminal" className="relative py-24 bg-[#050505] border-t border-cyan-500/10 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-12 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
            <TerminalIcon className="w-4 h-4" />
            <span>12 // LIVE DEVELOPER TERMINAL INTERFACE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Direct Mainframe Console
          </h2>
          <p className="text-sm font-mono text-gray-400 max-w-xl mx-auto">
            Interact with the portfolio directly through an in-browser bash terminal. Type <span className="text-cyan-400">help</span> to begin.
          </p>
        </div>

        <InteractiveTerminal profile={profile} skills={skills} projects={projects} />
      </div>
    </section>
  );
};
