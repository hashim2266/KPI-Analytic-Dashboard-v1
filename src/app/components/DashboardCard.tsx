import React from 'react';

// 1. Define the TypeScript interface for your props
interface DashboardCardProps {
  title?: string;
  percentage?: string | number;
  subtext?: string;
}

// 2. Apply the interface to your functional component
export default function DashboardCard({ 
  title = "SEKSYEN 1", 
  percentage = 71, 
  subtext = "Pengurusan & Kewangan" 
}: DashboardCardProps) {
  
  return (
    // The main glass container with 24px blur and shadow depth
    <div className="relative p-6 rounded-[24px] bg-glass-surface backdrop-blur-[24px] border border-glass-border shadow-[0_12px_32px_0_rgba(0,0,0,0.6)] overflow-hidden">
      
      {/* Subtle top edge white-green highlight embedded inside */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      {/* The animated sweeping edge light */}
      <div className="absolute inset-0 p-[1px] rounded-[24px] glass-card-mask pointer-events-none z-0">
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[conic-gradient(from_0deg,transparent_70%,rgba(16,185,129,0.3)_85%,transparent_100%)] animate-edge-sweep" />
      </div>

      {/* The Actual Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-medium tracking-wide text-emerald-100/70 uppercase mb-4">{title}</h3>
        
        {/* Placeholder for your actual circular chart */}
        <div className="w-32 h-32 mx-auto rounded-full border-4 border-emerald-500/30 flex items-center justify-center mb-6">
           <div className="flex flex-col items-center">
             <span className="text-3xl font-light text-emerald-400">{percentage}%</span>
             <span className="text-[10px] text-emerald-200/50">Pencapaian</span>
           </div>
        </div>

        <p className="text-center text-sm text-emerald-100">{subtext}</p>
      </div>
    </div>
  );
}