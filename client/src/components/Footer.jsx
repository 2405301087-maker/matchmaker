import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant py-space-md mt-auto">
      <div className="w-full max-w-[1560px] mx-auto px-margin-sm md:px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm text-xs text-on-surface-variant">
        <div className="flex items-center gap-space-sm">
          <span>© 2025 VIBE Global Network.</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Instant Peer-to-Peer Encrypted Match.</span>
        </div>
        <div className="flex items-center gap-space-md">
          <button className="hover:text-on-surface transition-colors" onClick={() => alert("Community Guidelines: Be respectful, no nudity, no harassment. Violators will be banned.")}>
            Community Guidelines
          </button>
          <button className="hover:text-on-surface transition-colors" onClick={() => alert("Safety & Trust: All video/audio is WebRTC P2P direct, never stored on servers.")}>
            Safety & Trust
          </button>
          <button className="hover:text-on-surface transition-colors" onClick={() => alert("Terms of Service: 18+ service. Anonymous spontaneous video chat.")}>
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
}
