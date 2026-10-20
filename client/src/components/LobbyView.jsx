import React, { useState, useEffect } from 'react';

const randomAdjectives = ['Swift', 'Cosmic', 'Solar', 'Velvet', 'Nova', 'Electric', 'Lunar', 'Echo', 'Neon', 'Aqua'];
const randomNouns = ['Wave', 'Nomad', 'Pilot', 'Rider', 'Spark', 'Beacon', 'Wanderer', 'Surfer', 'Phoenix', 'Comet'];

export default function LobbyView({ onStartMatching }) {
  const [nickname, setNickname] = useState('Guest_');
  const [identity, setIdentity] = useState('boy');
  const [preference, setPreference] = useState('everyone');
  const [avToggle, setAvToggle] = useState(true);

  // Randomize initial nickname
  useEffect(() => {
    randomizeNickname();
  }, []);

  const randomizeNickname = () => {
    const adj = randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)];
    const noun = randomNouns[Math.floor(Math.random() * randomNouns.length)];
    const num = Math.floor(100 + Math.random() * 899);
    setNickname(`${adj}${noun}${num}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartMatching({
      nickname: nickname.trim() || 'Guest_' + Math.floor(100 + Math.random() * 899),
      identity,
      preference,
      videoEnabled: avToggle
    });
  };

  return (
    <div className="relative w-full overflow-hidden py-space-xl flex flex-col items-center justify-center">
      {/* Soft Decorative Gradient Bloom */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-br from-primary-fixed-dim/25 via-secondary-fixed/20 to-transparent blur-3xl pointer-events-none rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-tertiary-fixed/15 blur-3xl pointer-events-none rounded-full"></div>

      <div className="relative w-full max-w-xl mx-auto px-margin-sm md:px-0">
        {/* Main Setup Card */}
        <div className="w-full bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-xl shadow-primary-container/5 relative overflow-hidden">
          {/* Subtle Top Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary-container via-primary-container to-primary"></div>

          {/* Logo with Radiant Ring */}
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-secondary-container/40 to-primary/40 blur-md scale-110"></div>
              <div className="relative w-20 h-20 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-md p-2">
                <img 
                  alt="VIBE Logo" 
                  className="w-14 h-14 object-contain" 
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WAxkvtLy4rR5WpohqZnlPRNp3w0GiXecJMNma2iOdVMy7H3uAUqKXZiin1ijbQQrqtEB5wXS0KjdvvSUi_D0HdmMqhG_PB6OphuQwH6Lsl6BsHsJZoeMGfu4wDs42vIo61AVU81WaH1SMEoB7EXsZ00mDGgmL3hNXMhmCYpTYreCoWc1cYo7L_om00SmD1W6yEHQa0Ai6M0hngrYz6KgZ_GLOlP5UatM2Arr85oA3NAo645dPPMNtQRglN" 
                />
              </div>
              <span className="absolute bottom-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-tertiary"></span>
              </span>
            </div>
          </div>

          {/* Headings */}
          <div className="text-center mt-space-md">
            <h1 className="text-3xl md:text-4xl text-on-surface font-extrabold tracking-tight">
              Meet someone new.
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant mt-space-xs font-normal">
              Find your match and start chatting live.
            </p>
          </div>

          {/* Setup Form */}
          <form className="mt-space-lg flex flex-col gap-space-lg text-left" onSubmit={handleSubmit}>
            {/* Nickname Field */}
            <div className="flex flex-col gap-space-xs">
              <label className="text-sm text-on-surface font-semibold flex items-center justify-between" htmlFor="nickname">
                <span>Your nickname / username</span>
                <span className="text-xs text-on-surface-variant font-normal">Anonymous to matches</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary">alternate_email</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low text-on-surface text-base font-medium pl-12 pr-12 py-3.5 rounded-2xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all" 
                  id="nickname" 
                  maxLength={24} 
                  placeholder="e.g. Alex, CyberWave, Guest902" 
                  type="text" 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                />
                <button 
                  className="absolute right-3.5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant text-on-surface-variant flex items-center justify-center transition-colors" 
                  id="shuffleBtn" 
                  onClick={randomizeNickname} 
                  title="Randomize Nickname" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">casino</span>
                </button>
              </div>
            </div>

            {/* Self Identity Selection */}
            <div className="flex flex-col gap-space-xs">
              <span className="text-sm text-on-surface font-semibold">I am</span>
              <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-1.5 rounded-2xl" id="identityGroup">
                <button 
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
                    identity === 'boy' 
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setIdentity('boy')} 
                  type="button"
                >
                  Boy
                </button>
                <button 
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
                    identity === 'girl' 
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setIdentity('girl')} 
                  type="button"
                >
                  Girl
                </button>
                <button 
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
                    identity === 'nonbinary' 
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setIdentity('nonbinary')} 
                  type="button"
                >
                  Non-binary
                </button>
              </div>
            </div>

            {/* Matching Preference Cards */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface font-semibold">Match me with</span>
                <span className="inline-flex items-center gap-1 text-xs text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full font-bold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Fastest
                </span>
              </div>
              <div className="grid grid-cols-3 gap-space-sm pt-1" id="preferenceGroup">
                {/* Everyone */}
                <button 
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all cursor-pointer ${
                    preference === 'everyone'
                      ? 'bg-surface-container-high text-primary shadow-sm ring-2 ring-primary-container'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                  onClick={() => setPreference('everyone')} 
                  type="button"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                    preference === 'everyone' ? 'bg-primary-container text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">group</span>
                  </div>
                  <span className="text-sm font-bold">Everyone</span>
                  <span className="text-xs text-on-surface-variant mt-0.5">Instant queue</span>
                </button>

                {/* Boys */}
                <button 
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all cursor-pointer ${
                    preference === 'boys'
                      ? 'bg-surface-container-high text-primary shadow-sm ring-2 ring-primary-container'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                  onClick={() => setPreference('boys')} 
                  type="button"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                    preference === 'boys' ? 'bg-primary-container text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">male</span>
                  </div>
                  <span className="text-sm font-semibold">Boys</span>
                  <span className="text-xs text-on-surface-variant mt-0.5">Direct peer</span>
                </button>

                {/* Girls */}
                <button 
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all cursor-pointer ${
                    preference === 'girls'
                      ? 'bg-surface-container-high text-primary shadow-sm ring-2 ring-primary-container'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                  onClick={() => setPreference('girls')} 
                  type="button"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                    preference === 'girls' ? 'bg-primary-container text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">female</span>
                  </div>
                  <span className="text-sm font-semibold">Girls</span>
                  <span className="text-xs text-on-surface-variant mt-0.5">Direct peer</span>
                </button>
              </div>

              {/* Guarantee Notice */}
              <p className="text-xs text-on-surface-variant text-center mt-1 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[14px]">lock_open</span>
                All matching preferences are 100% free forever. No tokens or paywalls.
              </p>
            </div>

            {/* Dynamic Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary-container shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                </div>
                <div>
                  <div className="text-sm text-on-surface font-semibold">Camera & Microphone</div>
                  <div className="text-xs text-on-surface-variant">Switch to text-only anytime during match</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  checked={avToggle} 
                  className="sr-only peer" 
                  onChange={(e) => setAvToggle(e.target.checked)} 
                  type="checkbox" 
                />
                <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>

            {/* Prominent CTA Button */}
            <div className="pt-2 flex flex-col items-center">
              <button 
                className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary py-4 px-8 rounded-2xl text-lg font-bold shadow-lg shadow-primary-container/25 hover:shadow-primary-container/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer" 
                id="ctaBtn" 
                type="submit"
              >
                <span>Find My Match</span>
                <span className="material-symbols-outlined text-on-primary group-hover:translate-x-1 transition-transform">bolt</span>
              </button>
              <span className="text-xs font-bold text-on-surface-variant tracking-wider mt-4 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                100% Free · No Login Required
              </span>
            </div>
          </form>
        </div>

        {/* Trust & Safety Highlights */}
        <div className="mt-space-lg w-full flex flex-wrap items-center justify-center gap-space-sm">
          <div className="flex items-center gap-2 px-space-md py-2.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface text-xs font-medium">
            <span className="text-secondary select-none text-[16px]">⚡</span>
            <span>Instant Connection</span>
          </div>
          <div className="flex items-center gap-2 px-space-md py-2.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface text-xs font-medium">
            <span className="text-tertiary select-none text-[16px]">🛡️</span>
            <span>Zero Registration / No Email</span>
          </div>
          <div className="flex items-center gap-2 px-space-md py-2.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface text-xs font-medium">
            <span className="text-primary-container select-none text-[16px]">📹</span>
            <span>Optional Cam & Mic</span>
          </div>
        </div>

        {/* Community Stat Snapshot */}
        <div className="mt-space-md text-center">
          <p className="text-xs text-on-surface-variant">
            Peer-to-peer encrypted · Instant skipping · Auto-moderated chat
          </p>
        </div>
      </div>
    </div>
  );
}
