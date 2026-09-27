import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft, Shield } from 'lucide-react';
import { IProfile, ISkill, IProject } from '../../types';

interface InteractiveTerminalProps {
  profile: IProfile | null;
  skills: ISkill[];
  projects: IProject[];
}

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({ profile, skills, projects }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'whoami',
      output: (
        <div className="text-cyan-300">
          <div>{profile?.name || 'Ased'} // {profile?.title || 'Full Stack Engineer & Cyber Researcher'}</div>
          <div className="text-gray-400 text-xs mt-1">Status: {profile?.statusText || 'Available'} | Location: {profile?.location || 'Remote'}</div>
        </div>
      ),
    },
  ]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only scroll internal terminal box when user actually executes commands, never on initial mount
    if (history.length > 1 && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-gray-300 text-xs">
            <div>Available Commands:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-1 text-cyan-300">
              <div>• whoami - Display digital operator profile</div>
              <div>• about - Operator summary & philosophy</div>
              <div>• skills - List top engineering proficiencies</div>
              <div>• projects - List featured production systems</div>
              <div>• contact - Direct uplink credentials</div>
              <div>• clear - Wipe terminal buffer</div>
              <div>• sudo - Request mainframe root escalation</div>
              <div>• date - Current system timestamp</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="text-cyan-300">
            <div>{profile?.name || 'Ased'} [Clearance: Level 5 Root]</div>
            <div className="text-xs text-gray-400 mt-0.5">{profile?.bio}</div>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="text-gray-300 text-xs leading-relaxed space-y-1">
            <p>{profile?.bio}</p>
            <p className="text-cyan-400">Philosophy: "{profile?.philosophy}"</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-xs">
            <div className="text-gray-400">Verified Technical Stack:</div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.slice(0, 12).map((s) => (
                <span key={s.name} className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  {s.name} ({s.proficiency}%)
                </span>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1 text-xs">
            <div className="text-gray-400">Featured Deployments:</div>
            {projects.slice(0, 5).map((p) => (
              <div key={p.slug} className="flex items-center justify-between text-cyan-300 border-b border-gray-800/60 py-1">
                <span>{p.title}</span>
                <span className="text-gray-500 text-[10px]">{p.category}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="text-xs space-y-1 text-gray-300">
            <div>Email Direct: <a href={`mailto:${profile?.email}`} className="text-cyan-400 underline">{profile?.email}</a></div>
            <div>Location: {profile?.location}</div>
            <div>Availability: {profile?.statusText}</div>
          </div>
        );
        break;

      case 'sudo':
        output = (
          <div className="text-rose-400 text-xs">
            Permission denied: You do not possess the biological neural implant for Level 0 Kernel escalation. Try typing <span className="text-cyan-300 font-mono">login</span>.
          </div>
        );
        break;

      case 'admin':
      case 'login':
      case 'root':
      case 'auth':
      case 'sudo su':
        output = (
          <div className="text-emerald-400 text-xs font-mono space-y-1 py-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>[SECURITY OVERRIDE DETECTED]</span>
            </div>
            <div>Elevating privileges to Administrative Uplink Console...</div>
            <div className="text-cyan-300 text-[11px] animate-pulse">Redirecting to secure login gateway...</div>
          </div>
        );
        setTimeout(() => {
          window.location.href = '/malikhaihum/cockpit';
        }, 900);
        break;

      case 'date':
        output = <div className="text-cyan-300 text-xs">{new Date().toUTCString()}</div>;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        output = (
          <div className="text-yellow-400 text-xs">
            Command not recognized: '{cmd}'. Type <span className="text-cyan-300 font-bold">'help'</span> for instruction manual.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: inputVal, output }]);
    setInputVal('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-cyan-500/30 bg-[#08090B]/95 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-sm">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1117] border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs text-gray-400 ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            ased@mainframe: ~ (bash 5.2)
          </span>
        </div>
        <div className="text-[10px] text-cyan-400/80 uppercase tracking-widest flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-400" /> ENCRYPTED
        </div>
      </div>

      {/* Terminal Output Body */}
      <div 
        ref={terminalBodyRef}
        className="p-5 min-h-[260px] max-h-[380px] overflow-y-auto space-y-3"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="text-gray-500 text-xs">
          Interactive Mainframe Terminal Shell v2.6. Type <span className="text-cyan-400 font-bold">help</span> to begin.
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="text-gray-500">$</span>
              <span>{item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}

        {/* Input Prompt */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
          <span className="text-cyan-400 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command..."
            className="flex-1 bg-transparent border-none outline-none text-white text-xs focus:ring-0"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" className="text-gray-500 hover:text-cyan-400">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
