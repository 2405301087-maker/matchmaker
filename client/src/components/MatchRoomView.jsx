import React, { useState, useEffect, useRef } from 'react';

export default function MatchRoomView({
  peer,
  roomId,
  userProfile,
  onSkip,
  onEnd,
  socket,
  isSkipping
}) {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [chimeEnabled, setChimeEnabled] = useState(true);

  // AV Controls state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(userProfile?.videoEnabled ?? true);
  const [isRemoteVideoVisible, setIsRemoteVideoVisible] = useState(true);
  const [isMirrored, setIsMirrored] = useState(false);
  const [latency, setLatency] = useState(18);

  // Modals state
  const [showEndModal, setShowEndModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate behavior');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Video refs
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const chatScrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize WebRTC User Media (Real local webcam/microphone)
  useEffect(() => {
    let active = true;

    async function setupLocalMedia() {
      if (isCamOn || isMicOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: isCamOn,
            audio: isMicOn
          });
          if (!active) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.log('[Media] Camera/Mic access denied or unavailable; fallback to simulated avatar preview.');
        }
      } else {
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
          localStreamRef.current = null;
        }
      }
    }

    setupLocalMedia();

    return () => {
      active = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCamOn, isMicOn]);

  // Initial welcome greeting from peer if simulated
  useEffect(() => {
    setMessages([]);
    if (peer?.initialGreetings && peer.initialGreetings.length > 0) {
      peer.initialGreetings.forEach((greeting, i) => {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: 'init_' + i,
              sender: 'peer',
              text: greeting,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }, (i + 1) * 1200);
      });
    }
  }, [peer]);

  // Socket listener for receiving messages & partner actions
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg_' + Date.now() + Math.random(),
          sender: 'peer',
          text: data.text,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    const handlePartnerTyping = (data) => {
      setIsPartnerTyping(data.isTyping);
    };

    const handlePartnerLeft = (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: 'sys_' + Date.now(),
          sender: 'system',
          text: `Partner ${data.reason === 'skipped' ? 'skipped to next match.' : 'left the chat session.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      // Auto skip to next partner after brief notification
      setTimeout(() => {
        onSkip();
      }, 1500);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('partner_typing', handlePartnerTyping);
    socket.on('partner_left', handlePartnerLeft);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('partner_typing', handlePartnerTyping);
      socket.off('partner_left', handlePartnerLeft);
    };
  }, [socket, onSkip]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isPartnerTyping]);

  // Fluctuating latency simulation
  useEffect(() => {
    const latInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 16);
    }, 3500);
    return () => clearInterval(latInterval);
  }, []);

  // Keyboard shortcut: ESC to Skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const newMsg = {
      id: 'self_' + Date.now(),
      sender: 'self',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    if (socket && roomId) {
      socket.emit('send_message', {
        roomId,
        text,
        timestamp: newMsg.timestamp
      });
      socket.emit('typing', { roomId, isTyping: false });
    }
  };

  // Handle Typing indicator emit
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (socket && roomId) {
      socket.emit('typing', { roomId, isTyping: true });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { roomId, isTyping: false });
      }, 1500);
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    setIsCamOn(prev => !prev);
  };

  // Toggle Mic
  const toggleMic = () => {
    setIsMicOn(prev => !prev);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
    }
  };

  // Submit safety report
  const submitReport = async () => {
    try {
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterNickname: userProfile?.nickname || 'Anonymous',
          reportedNickname: peer?.nickname || 'Partner',
          roomId: roomId || 'room_default',
          reason: reportReason
        })
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSubmitted(false);
      }, 1500);
    } catch (e) {
      setShowReportModal(false);
    }
  };

  return (
    <div className="w-full max-w-[1560px] mx-auto p-gutter-sm lg:p-gutter">
      {/* Top Matched Room Header */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md mb-gutter flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
        <div className="flex items-center gap-space-md min-w-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center flex-shrink-0 ring-2 ring-primary-container/20">
            <img 
              alt={peer?.nickname || 'Partner'} 
              className="w-full h-full object-cover" 
              src={peer?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9EUC6UElgXloKexYqjVR5u1b0Lchu2z756xP4F9gX4obRJOyDw-lZUX6VcKIv8qblmO2KQoOePkVzyqVZ-PlZqcokeneNPJj7pJns8xLGbbboBb73rqb2U7d603RdcF5Ex6rNv1goMqs3NMBwqAFe6YrozhT-rj1wiFyHwx0jRUJaxtPWEydxo8Ullhq4BBn4xlfl-lj995ldybp213-vfA72NzgsTd21p77ukvLKp3XH9w2qqaMZ5w'} 
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary-fixed-dim rounded-full ring-2 ring-surface-container-lowest"></span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="text-xl font-bold text-on-surface truncate">
                Connected with {peer?.nickname || 'Luna ✨'}
              </span>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                Live Peer
              </span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-space-xs mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>Anonymous P2P session • {peer?.location || 'Berlin, DE (340km)'}</span>
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
          <button 
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-space-md py-space-sm rounded-full bg-secondary-fixed text-on-secondary-fixed-variant hover:bg-secondary-container hover:text-on-secondary-container transition-all text-sm font-semibold shadow-sm active:scale-95 cursor-pointer"
            onClick={onSkip}
            title="Skip to next match (or press ESC)"
          >
            <span className="material-symbols-outlined text-[20px]">fast_forward</span>
            <span>Skip Partner</span>
            <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-surface-container-lowest/80 text-on-surface rounded font-mono">ESC</kbd>
          </button>
          <button 
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-space-md py-space-sm rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-all text-sm font-semibold shadow-sm active:scale-95 cursor-pointer"
            onClick={() => setShowEndModal(true)}
          >
            <span className="material-symbols-outlined text-[20px]">call_end</span>
            <span>End Chat</span>
          </button>
        </div>
      </div>

      {/* Top Session Metadata Pill Bar */}
      <div className="flex items-center justify-between pb-space-md">
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            <span className="text-xs font-semibold text-on-surface uppercase tracking-wide">P2P Encrypted Session</span>
            <span className="text-outline-variant text-xs">|</span>
            <span className="text-xs text-on-surface-variant font-mono">{roomId || 'ID: #VB-9281-EU'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-secondary text-xs font-medium">
            <span className="material-symbols-outlined text-[16px]">speed</span>
            <span>Latency: {latency}ms</span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <button 
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest hover:bg-error-container text-on-surface-variant hover:text-on-error-container text-xs font-medium transition-colors cursor-pointer"
            onClick={() => setShowReportModal(true)}
          >
            <span className="material-symbols-outlined text-[16px]">flag</span>
            <span className="hidden md:inline">Report Peer</span>
          </button>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
            <span className="hidden sm:inline">18+ Moderated</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Arena */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* LEFT: Video Viewport & Controls (7 or 8 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Master Video Stage Container */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-inverse-surface rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between p-space-md select-none group border border-white/5">
            {/* Remote Partner Video */}
            <div className="absolute inset-0 w-full h-full">
              {isRemoteVideoVisible ? (
                <img 
                  alt="Partner Video" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" 
                  src={peer?.videoPoster || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBro5yI50gS0K96HA7HIAT85Q2c1BOl4lgzHMNJm4NbEvPalI0zsyseR1C1RVCb6cY4i8d7wfZFcImm0vWoUIey9AoMXSdFDNGJiVsiKbPk_t07y_hAydN0SiDwPiSE89fhAsEm2Pxzg3N3oc_Ba3JOOQEl6wEUVg51pyu4HAdj8f_Cp-Tk-m8As6l7Rdi79EbgjbeAmcxzGuxSsQlQlJ8-rYltRJl2M2aF3LoYyN-RX2rKUx-FcVw86w'} 
                />
              ) : (
                /* Fallback text-only state when video is hidden/off */
                <div className="w-full h-full bg-inverse-surface flex flex-col items-center justify-center text-center p-space-lg">
                  <div className="w-24 h-24 rounded-full bg-surface-container-highest/20 flex items-center justify-center mb-space-md text-inverse-on-surface">
                    <span className="material-symbols-outlined text-[48px]">videocam_off</span>
                  </div>
                  <h3 className="text-xl text-inverse-on-surface font-semibold">Camera is off</h3>
                  <p className="text-sm text-outline-variant mt-1">{peer?.nickname || 'Partner'} is connected in spontaneous text mode</p>
                </div>
              )}
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-transparent to-inverse-surface/40 pointer-events-none"></div>
            </div>

            {/* Top Overlay HUD: Partner Info & Soundwave visualizer */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="inline-flex items-center gap-space-sm bg-inverse-surface/75 backdrop-blur-md px-space-md py-space-xs rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
                <span className="text-xs font-bold text-inverse-on-surface">{peer?.nickname || 'Luna'}</span>
                
                {/* Audio Wave Visualizer Simulation */}
                <div className="flex items-end gap-0.5 h-3.5 ml-1" title="Partner audio active">
                  <span className="w-1 bg-tertiary-fixed-dim rounded-full wave-bar-1"></span>
                  <span className="w-1 bg-tertiary-fixed-dim rounded-full wave-bar-2"></span>
                  <span className="w-1 bg-tertiary-fixed-dim rounded-full wave-bar-3"></span>
                </div>
              </div>

              {/* Quality & Latency Badge */}
              <div className="inline-flex items-center gap-1.5 bg-inverse-surface/75 backdrop-blur-md px-space-sm py-space-xs rounded-full text-xs text-inverse-on-surface">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px]">network_ping</span>
                <span>{latency}ms</span>
                <span className="text-outline-variant">•</span>
                <span>HD 60fps</span>
              </div>
            </div>

            {/* Picture-in-Picture (PiP) Local Self-View */}
            <div 
              className="relative z-10 self-end w-36 sm:w-48 aspect-[4/3] bg-inverse-surface/90 rounded-xl overflow-hidden shadow-2xl border border-white/20 group/pip transition-all"
              title="Your Self Video Preview"
            >
              <div className="relative w-full h-full bg-surface-container flex flex-col items-center justify-center text-center">
                {isCamOn ? (
                  <>
                    <video 
                      autoPlay 
                      className={`w-full h-full object-cover ${isMirrored ? '' : '-scale-x-100'}`} 
                      muted 
                      playsInline 
                      ref={localVideoRef} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent pointer-events-none"></div>
                    <span className="absolute bottom-1 left-2 text-[10px] text-inverse-on-surface font-bold bg-inverse-surface/60 px-1.5 py-0.5 rounded backdrop-blur-sm z-20">
                      You (Live)
                    </span>
                    <button 
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-inverse-surface/70 text-inverse-on-surface hover:bg-inverse-surface transition-colors cursor-pointer"
                      onClick={() => setIsMirrored(prev => !prev)} 
                      title="Flip view"
                    >
                      <span className="material-symbols-outlined text-[14px]">flip_camera_ios</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-on-surface-variant p-2">
                    <span className="material-symbols-outlined text-[28px] text-outline">no_photography</span>
                    <span className="text-xs font-semibold mt-1">Camera Off</span>
                    <span className="text-[10px] text-outline line-clamp-1">Click cam below</span>
                  </div>
                )}
              </div>
            </div>

            {/* Docked Floating Glassmorphism Call Controls */}
            <div className="relative z-10 w-full flex items-center justify-center gap-space-md pt-space-xs">
              <div className="inline-flex items-center gap-space-sm bg-inverse-surface/85 backdrop-blur-lg px-space-md py-space-xs rounded-full shadow-lg">
                {/* Microphone Toggle */}
                <button 
                  className={`flex items-center justify-center w-11 h-11 rounded-full transition-all active:scale-90 cursor-pointer ${
                    isMicOn 
                      ? 'bg-surface-container-lowest/15 text-inverse-on-surface hover:bg-surface-container-lowest/30' 
                      : 'bg-error text-on-error'
                  }`}
                  onClick={toggleMic}
                  title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  <span className="material-symbols-outlined text-[22px]">{isMicOn ? 'mic' : 'mic_off'}</span>
                </button>

                {/* Camera Toggle */}
                <button 
                  className={`flex items-center justify-center w-11 h-11 rounded-full transition-all active:scale-90 cursor-pointer ${
                    isCamOn 
                      ? 'bg-tertiary-container text-on-tertiary-container' 
                      : 'bg-surface-container-lowest/15 text-inverse-on-surface hover:bg-surface-container-lowest/30'
                  }`}
                  onClick={toggleCamera}
                  title={isCamOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  <span className="material-symbols-outlined text-[22px]">{isCamOn ? 'videocam' : 'videocam_off'}</span>
                </button>

                {/* Remote Stream Privacy Toggle */}
                <button 
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-surface-container-lowest/15 text-inverse-on-surface hover:bg-surface-container-lowest/30 transition-all active:scale-90 cursor-pointer"
                  onClick={() => setIsRemoteVideoVisible(prev => !prev)}
                  title={isRemoteVideoVisible ? "Hide Partner Video (Audio/Text only)" : "Show Partner Video"}
                >
                  <span className="material-symbols-outlined text-[22px]">{isRemoteVideoVisible ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Underdeck: Common Interests & Bitrate telemetry */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/30">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-on-surface-variant">Common Interests:</span>
              {(peer?.tags || ['#Design', '#ElectronicMusic', '#Photography']).map((tag, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <svg className="w-16 h-5 text-tertiary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 64 20">
                  <path d="M0 12 L10 14 L20 6 L30 11 L40 4 L50 9 L60 2 L64 5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="font-mono">2.8 Mb/s</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span>0% Loss</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Clean 1-on-1 Text Chat Feed (5 cols) */}
        <section className="lg:col-span-5 flex flex-col h-[640px] bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden border border-outline-variant/30">
          {/* Chat Channel Header Bar */}
          <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="text-sm font-bold text-on-surface">Conversation Log</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                onClick={() => setChimeEnabled(prev => !prev)}
                title={chimeEnabled ? "Mute notification sounds" : "Enable notification sounds"}
              >
                <span className="material-symbols-outlined text-[18px]">{chimeEnabled ? 'volume_up' : 'volume_off'}</span>
              </button>
              <span className="text-xs text-outline font-mono">ID: {roomId ? roomId.substring(0, 10) : '#vb-8842'}</span>
            </div>
          </div>

          {/* Ephemeral Safety Notice */}
          <div className="px-space-md py-2 bg-surface-container-high/60 flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">lock</span>
            <span>Chats are ephemeral & never saved to disk. Stay respectful!</span>
          </div>

          {/* Chat Stream Message List */}
          <div className="flex-1 overflow-y-auto p-space-md flex flex-col gap-space-md" ref={chatScrollRef}>
            {/* System Welcome Banner */}
            <div className="w-full bg-surface-container rounded-lg p-space-sm text-center">
              <p className="text-xs text-on-surface font-medium">
                You're now chatting with <span className="font-bold text-primary">{peer?.nickname || 'Luna'}</span>! Say hello 👋
              </p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Camera & mic are completely optional. Be kind & respect boundaries.
              </p>
            </div>

            {/* Message Bubbles */}
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="w-full text-center my-1">
                    <span className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isSelf = msg.sender === 'self';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${isSelf ? 'items-end self-end' : 'items-start self-start'}`}
                >
                  <div 
                    className={`p-space-md shadow-sm ${
                      isSelf 
                        ? 'bg-primary text-on-primary rounded-2xl rounded-br-sm shadow-md' 
                        : 'bg-surface-container-low text-on-surface rounded-2xl rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-[10px] text-outline ${isSelf ? 'mr-1' : 'ml-1'}`}>
                    <span>{isSelf ? 'You' : (peer?.nickname || 'Luna')} • {msg.timestamp}</span>
                    {isSelf && (
                      <span className="material-symbols-outlined text-[13px] text-tertiary">done_all</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isPartnerTyping && (
              <div className="flex items-center gap-space-xs text-on-surface-variant py-space-xs">
                <div className="flex items-center gap-1 bg-surface-container-low px-space-sm py-1.5 rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></span>
                  <span className="text-xs ml-1 text-on-surface-variant">{peer?.nickname || 'Luna'} is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Composer Dock */}
          <div className="p-space-md bg-surface-container-lowest border-t border-outline-variant/30">
            <form 
              className="flex items-center gap-space-xs bg-surface-container-low rounded-full px-space-md py-1.5 focus-within:ring-2 focus-within:ring-primary/40 transition-all"
              onSubmit={handleSendMessage}
            >
              <input 
                autoComplete="off" 
                className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none text-sm px-1 py-1" 
                onChange={handleInputChange} 
                placeholder="Type a message... (Press Enter to send)" 
                type="text" 
                value={inputText} 
              />
              <button 
                className="text-outline hover:text-on-surface-variant transition-colors p-1" 
                onClick={() => setInputText(prev => prev + ' ✨')} 
                title="Add sparkle" 
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">mood</span>
              </button>
              <button 
                className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-on-primary hover:bg-primary-container transition-all flex items-center justify-center shadow-md active:scale-90 cursor-pointer" 
                title="Send message" 
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
            <div className="flex items-center justify-between mt-space-xs px-space-sm text-outline text-[11px]">
              <span>End-to-End direct data channel</span>
              <span>Esc = Skip • Enter = Send</span>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Quick Action Navigation Hub */}
      <div className="w-full mt-gutter bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
        <div className="flex items-center gap-space-md">
          <div className="w-3 h-3 rounded-full bg-tertiary animate-ping"></div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-on-surface">Quick Navigation Hub</span>
            <span className="text-xs text-on-surface-variant">Skip immediately to encounter another random soul or disconnect safely.</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md w-full sm:w-auto">
          <button 
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-space-xl py-space-sm rounded-full bg-primary text-on-primary hover:bg-primary-container transition-all text-base font-bold shadow-md hover:shadow-xl active:scale-95 cursor-pointer"
            onClick={onSkip}
          >
            <span className="material-symbols-outlined text-[24px]">skip_next</span>
            <span>Skip (ESC)</span>
          </button>
          <button 
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-space-lg py-space-sm rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-all text-sm font-bold shadow-sm active:scale-95 cursor-pointer"
            onClick={() => setShowEndModal(true)}
          >
            <span className="material-symbols-outlined text-[20px]">call_end</span>
            <span>End Chat</span>
          </button>
        </div>
      </div>

      {/* Skipping / Searching Reconnection Modal */}
      {isSkipping && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/80 backdrop-blur-md flex items-center justify-center p-gutter animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-xl shadow-2xl flex flex-col items-center text-center">
            <div className="relative w-20 h-20 mb-space-md flex items-center justify-center">
              <span className="w-full h-full rounded-full border-4 border-primary/20 border-t-primary animate-spin absolute inset-0"></span>
              <span className="material-symbols-outlined text-primary text-[36px]">travel_explore</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Skipping to Next Match...</h2>
            <p className="text-sm text-on-surface-variant mt-space-xs">
              Scanning 28,419 active online members for instant pairing.
            </p>
            <div className="w-full bg-surface-container rounded-full h-2 mt-space-lg overflow-hidden">
              <div className="bg-primary h-full w-2/3 animate-pulse"></div>
            </div>
            <button 
              className="mt-space-lg px-space-lg py-space-xs rounded-full bg-surface-container-highest text-on-surface text-xs font-semibold hover:bg-surface-dim transition-all cursor-pointer"
              onClick={onEnd}
            >
              Cancel Search
            </button>
          </div>
        </div>
      )}

      {/* End Chat Confirmation Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/80 backdrop-blur-md flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mb-space-md shadow-inner">
              <span className="material-symbols-outlined text-[32px]">call_end</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">End Chat Session?</h2>
            <p className="text-sm text-on-surface-variant mt-space-xs">
              Your connection will be safely disconnected. All temporary session traces and media streams will be cleared immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full mt-space-lg">
              <button 
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-error text-on-error font-semibold text-sm hover:bg-error/90 transition-all cursor-pointer"
                onClick={() => {
                  setShowEndModal(false);
                  onEnd();
                }}
              >
                Disconnect
              </button>
              <button 
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-surface-container-high text-on-surface font-semibold text-sm hover:bg-surface-dim transition-all cursor-pointer"
                onClick={() => setShowEndModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Peer Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/80 backdrop-blur-md flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-xl shadow-2xl flex flex-col text-left">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error">flag</span>
                <h3 className="text-lg font-bold text-on-surface">Report Peer</h3>
              </div>
              <button className="text-outline hover:text-on-surface" onClick={() => setShowReportModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-6 text-center">
                <span className="material-symbols-outlined text-4xl text-tertiary mb-2">check_circle</span>
                <p className="text-sm font-semibold text-on-surface">Report submitted. Thank you for keeping VIBE safe.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-on-surface-variant mt-3">
                  Please select a reason for reporting {peer?.nickname || 'this user'}:
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {['Inappropriate behavior', 'Nudity or sexual content', 'Spam or advertising', 'Harassment'].map((reason) => (
                    <label key={reason} className="flex items-center gap-2 text-xs text-on-surface cursor-pointer p-2 rounded-lg hover:bg-surface-container">
                      <input 
                        checked={reportReason === reason} 
                        name="reportReason" 
                        onChange={() => setReportReason(reason)} 
                        type="radio" 
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-surface-container text-on-surface"
                    onClick={() => setShowReportModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-error text-on-error"
                    onClick={submitReport}
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
