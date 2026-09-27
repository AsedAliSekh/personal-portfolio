import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowLeft, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F7FA] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-rose-500/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg text-center space-y-6 p-8 rounded-3xl border border-rose-500/30 bg-[#0d1117]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.15)]">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-5xl font-black text-rose-400 tracking-wider">
            404
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">
            SYSTEM ADDRESS NOT FOUND
          </h1>
          <p className="text-sm font-mono text-gray-400">
            The requested digital coordinate does not exist on the current network plane.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="btn-cyber-primary px-6 py-3 rounded-xl inline-flex items-center gap-2 text-xs tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Return to Mainframe Root</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
