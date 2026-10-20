import React, { useState, useEffect } from 'react';

const statuses = [
  "Searching for available and compatible users",
  "Negotiating secure WebRTC handshake",
  "Pinging regional media nodes",
  "Calibrating peer-to-peer encryption",
  "Matching with verified online peer"
];

export default function FindingMatchModal({ preference, onCancel }) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [latency, setLatency] = useState(21);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIdx(prev => (prev + 1) % statuses.length);
    }, 2800);

    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 18);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 12;
      });
    }, 400);

    return () => {
      clearInterval(statusInterval);
      clearInterval(latencyInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-space-md sm:p-space-lg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <div className="w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-70 animate-pulse"></div>
        <div className="w-[380px] h-[380px] rounded-full bg-secondary-container/10 blur-2xl opacity-60"></div>
      </div>

      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-xl p-8 sm:p-10 flex flex-col items-center text-center border border-outline-variant/30">
        {/* Pulsing Radar Stage */}
        <div className="relative w-44 h-44 flex items-center justify-center my-space-xs">
          <span className="absolute inline-flex w-40 h-40 rounded-full bg-secondary-container/20 animate-ping opacity-60" style={{ animationDuration: '2.8s' }}></span>
          <span className="absolute inline-flex w-32 h-32 rounded-full bg-primary/10 animate-ping opacity-75" style={{ animationDuration: '2.2s', animationDelay: '0.4s' }}></span>
          <span className="absolute inline-flex w-24 h-24 rounded-full bg-primary/15 animate-ping opacity-90" style={{ animationDuration: '1.8s', animationDelay: '0.8s' }}></span>
          
          <div className="relative z-10 w-20 h-20 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-4xl animate-pulse">radar</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl text-on-surface tracking-tight mt-space-sm mb-space-xs font-bold">
          Finding your match...
        </h1>

        <div className="flex items-center justify-center gap-1.5 text-sm text-on-surface-variant min-h-[1.75rem]">
          <span>{statuses[statusIdx]}</span>
          <span className="inline-flex space-x-1 ml-0.5">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </span>
        </div>

        {/* Searching Status Meta Box */}
        <div className="w-full mt-space-lg bg-surface-container-low rounded-2xl p-space-md flex flex-col gap-space-sm">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
              <span>Searching:</span>
              <span className="font-bold text-on-surface capitalize">{preference || 'Everyone'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
              <span className="font-mono font-bold text-on-surface">#VB-84920</span>
            </div>
          </div>

          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary-container rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant pt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span>Connecting to real-time signaling relay...</span>
            <span className="font-mono text-secondary font-bold">{latency}ms</span>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="w-full flex items-center justify-center mt-space-lg">
          <button 
            className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-semibold bg-surface-container-high text-on-surface hover:bg-error-container hover:text-on-error-container transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            onClick={onCancel}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>Cancel Search</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-space-lg pt-space-xs text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[18px] text-tertiary">verified_user</span>
          <span>Real-time WebRTC backend • Connecting only to real available peers. No bots or fake matches.</span>
        </div>
      </div>

      <div className="mt-space-md flex items-center gap-space-lg text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">encrypted</span>
          <span>End-to-End P2P</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">visibility_off</span>
          <span>100% Anonymous</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">speed</span>
          <span>Ultra-low Latency</span>
        </div>
      </div>
    </div>
  );
}
