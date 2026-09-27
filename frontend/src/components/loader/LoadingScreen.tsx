import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Terminal, Cpu, Zap, Wifi } from 'lucide-react';

interface LoadingScreenProps {
  onFinish?: () => void;
  initials?: string;
}

const BOOT_LOGS = [
  'INITIALIZING QUANTUM RUNTIME v4.2.0...',
  'CALIBRATING THREE.JS HOLOGRAPHIC PIPELINE...',
  'ESTABLISHING ENCRYPTED ATLAS DB REPLICA...',
  'COMPILING NEURAL GLSL SURFACE SHADERS...',
  'LOADING 3D AVATAR SPATIAL MESH...',
  'SYNCHRONIZING DEFENSIVE SECURITY TOOLCHAIN...',
  'ALL SYSTEMS NOMINAL. MAINFRAME ONLINE.'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish, initials = 'AS' }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem('portfolio_boot_loaded');
    // If loaded recently, boot faster (approx 1s), otherwise full dramatic 2.2s cinematic boot
    const totalDuration = hasLoadedBefore ? 500 : 1100;
    const intervalTime = 30;
    const totalSteps = totalDuration / intervalTime;
    const stepIncrement = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement + (Math.random() * 2 - 1);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoaded(true);
            sessionStorage.setItem('portfolio_boot_loaded', 'true');
            if (onFinish) onFinish();
          }, 350);
          return 100;
        }

        // Cycle through boot logs smoothly as progress advances
        const logIdx = Math.min(
          Math.floor((next / 100) * BOOT_LOGS.length),
          BOOT_LOGS.length - 1
        );
        setCurrentLogIndex(logIdx);

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050608] text-[#F5F7FA] overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(10px)',
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          {/* Cyber Ambient Atmosphere */}
          <div className="absolute inset-0 bg-grid-cyber opacity-25 pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none -bottom-20 -right-20" />
          <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

          {/* Central Holographic Radar Reticle & Monogram */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            {/* Outer Segmented Radar Ring (Clockwise) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30"
            />

            {/* Middle Tech Notched Ring (Counter-Clockwise) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
              className="absolute inset-3 rounded-full border-2 border-t-cyan-400/60 border-r-transparent border-b-purple-500/60 border-l-transparent"
            />

            {/* Glowing Corner Crosshairs */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            {/* Radar Sweep Effect */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
              className="absolute inset-4 rounded-full pointer-events-none overflow-hidden"
            >
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/30 to-transparent origin-bottom-right" />
            </motion.div>

            {/* Core Hexagon Monogram HUD */}
            <div className="relative w-24 h-24 rounded-2xl bg-[#090d14]/90 border border-cyan-400/50 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.25)]">
              <span className="font-mono text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 tracking-wider">
                {initials}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase">
                  SYS_SYNC
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Status & Big Number Readout */}
          <div className="flex flex-col items-center gap-3 w-80 max-w-[90vw]">
            <div className="flex items-center justify-between w-full font-mono text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-bold tracking-wider">MAINFRAME INITIALIZATION</span>
              </div>
              <span className="text-cyan-300 font-extrabold text-sm drop-shadow-[0_0_8px_#22d3ee]">
                {Math.round(progress).toString().padStart(3, '0')}%
              </span>
            </div>

            {/* High-Tech Glowing Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#0d1117] border border-gray-800 p-0.5 overflow-hidden shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_15px_#22d3ee]"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Live Streaming Technical Boot Logs */}
            <div className="w-full py-1.5 px-3 rounded-lg bg-[#090d14]/70 border border-gray-800/80 font-mono text-[11px] text-gray-400 flex items-center justify-between overflow-hidden">
              <span className="text-emerald-400 font-bold truncate">
                $&gt; {BOOT_LOGS[currentLogIndex]}
              </span>
              <span className="text-gray-500 text-[9px] shrink-0 ml-2">
                REV_4.6
              </span>
            </div>

            {/* Frequency Visualizer Equalizer Bars */}
            <div className="flex items-center justify-center gap-1 pt-1">
              {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [`${h * 0.2}px`, `${h * 0.3}px`, `${h * 0.15}px`] }}
                  transition={{ repeat: Infinity, duration: 0.6 + (i % 4) * 0.2, ease: 'easeInOut' }}
                  className="w-1 rounded-full bg-cyan-400/60"
                  style={{ height: `${h * 0.25}px` }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
