import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Cpu, RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: string | null;
}

export class HeroErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorInfo: error.message || 'Unknown WebGL or 3D subsystem error',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[HeroErrorBoundary] Intercepted 3D scene crash:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-[460px] sm:h-[530px] lg:h-[600px] flex flex-col items-center justify-center p-6 border border-cyan-500/20 rounded-2xl bg-[#08090B]/80 backdrop-blur-md text-center font-mono select-none">
          {/* Cyber HUD Corner Reticles */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-cyan-400/40 pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-cyan-400/40 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-400/40 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-400/40 pointer-events-none" />

          <div className="relative w-16 h-16 flex items-center justify-center mb-4 rounded-full border border-cyan-500/30 bg-cyan-950/30">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>

          <h3 className="text-sm font-semibold text-cyan-300 tracking-wider mb-1">
            SPATIAL 3D ENGINE STANDBY
          </h3>
          <p className="text-xs text-gray-400 max-w-xs mb-4">
            GPU WebGL context was reset by mobile system memory manager. All other mainframe systems nominal.
          </p>

          <button
            type="button"
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RECONNECT 3D ENGINE</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
