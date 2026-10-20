import React from 'react';

export default function Header({ onlineCount = 28419 }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant">
      <div className="h-16 w-full px-margin-sm md:px-margin flex items-center justify-between gap-space-md max-w-[1560px] mx-auto">
        <div className="flex items-center gap-space-md min-w-0">
          <div className="flex items-center gap-space-sm flex-shrink-0 cursor-pointer" onClick={() => window.location.reload()}>
            <img 
              alt="VIBE Logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1WAxkvtLy4rR5WpohqZnlPRNp3w0GiXecJMNma2iOdVMy7H3uAUqKXZiin1ijbQQrqtEB5wXS0KjdvvSUi_D0HdmMqhG_PB6OphuQwH6Lsl6BsHsJZoeMGfu4wDs42vIo61AVU81WaH1SMEoB7EXsZ00mDGgmL3hNXMhmCYpTYreCoWc1cYo7L_om00SmD1W6yEHQa0Ai6M0hngrYz6KgZ_GLOlP5UatM2Arr85oA3NAo645dPPMNtQRglN" 
            />
            <span className="text-xl md:text-2xl tracking-tight font-extrabold text-on-surface select-none hidden sm:inline-block">
              VIBE
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-tertiary-fixed/30 border border-tertiary-fixed-dim/40 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span className="text-xs text-tertiary uppercase tracking-wider font-bold">
              LIVE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 pl-space-sm text-xs font-semibold text-on-surface-variant flex-shrink-0 border-l border-outline-variant">
            <span className="text-secondary select-none font-bold">⚡</span>
            <span>{onlineCount.toLocaleString()} Online Now</span>
          </div>
        </div>

        <div className="flex items-center gap-space-md flex-shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-space-md py-space-xs rounded-full bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface-variant shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[16px]">lock</span>
            <span>Anonymous & Encrypted • 100% Free</span>
          </div>

          <div 
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-primary/20 text-on-primary"
            title="Anonymous Profile"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
