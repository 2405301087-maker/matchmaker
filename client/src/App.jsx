import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LobbyView from './components/LobbyView.jsx';
import FindingMatchModal from './components/FindingMatchModal.jsx';
import MatchRoomView from './components/MatchRoomView.jsx';

const BACKEND_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export default function App() {
  const [view, setView] = useState('lobby'); // 'lobby' | 'searching' | 'room'
  const [userProfile, setUserProfile] = useState(null);
  const [peer, setPeer] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [onlineCount, setOnlineCount] = useState(28419);
  const [isSkipping, setIsSkipping] = useState(false);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected to backend signaling server:', socket.id);
    });

    socket.on('online_count', (count) => {
      if (count) setOnlineCount(count);
    });

    socket.on('match_found', (data) => {
      console.log('[Match] Partner found:', data);
      setPeer(data.peer);
      setRoomId(data.roomId);
      setView('room');
      setIsSkipping(false);
    });

    socket.on('connect_error', (err) => {
      console.log('[Socket] Connection warning, using fallback relay:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Start Matching
  const handleStartMatching = (profile) => {
    setUserProfile(profile);
    setView('searching');
    setIsSkipping(false);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('join_queue', profile);
    } else {
      // Offline fallback: if backend is starting up, simulate connection
      setTimeout(() => {
        setPeer({
          nickname: 'Luna ✨',
          identity: 'girl',
          videoEnabled: true,
          location: 'Berlin, DE (340km)',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9EUC6UElgXloKexYqjVR5u1b0Lchu2z756xP4F9gX4obRJOyDw-lZUX6VcKIv8qblmO2KQoOePkVzyqVZ-PlZqcokeneNPJj7pJns8xLGbbboBb73rqb2U7d603RdcF5Ex6rNv1goMqs3NMBwqAFe6YrozhT-rj1wiFyHwx0jRUJaxtPWEydxo8Ullhq4BBn4xlfl-lj995ldybp213-vfA72NzgsTd21p77ukvLKp3XH9w2qqaMZ5w',
          videoPoster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBro5yI50gS0K96HA7HIAT85Q2c1BOl4lgzHMNJm4NbEvPalI0zsyseR1C1RVCb6cY4i8d7wfZFcImm0vWoUIey9AoMXSdFDNGJiVsiKbPk_t07y_hAydN0SiDwPiSE89fhAsEm2Pxzg3N3oc_Ba3JOOQEl6wEUVg51pyu4HAdj8f_Cp-Tk-m8As6l7Rdi79EbgjbeAmcxzGuxSsQlQlJ8-rYltRJl2M2aF3LoYyN-RX2rKUx-FcVw86w',
          tags: ['#Design', '#ElectronicMusic', '#Travel'],
          initialGreetings: [
            "Hey there! How is your day going? Just stumbled onto VIBE while taking a coffee break ☕",
            "Nice to meet you! Are you in Europe as well? The ping between us is super low!"
          ]
        });
        setRoomId('room_demo_' + Math.floor(1000 + Math.random() * 9000));
        setView('room');
      }, 2600);
    }
  };

  // Cancel search while waiting
  const handleCancelSearch = () => {
    setView('lobby');
    setIsSkipping(false);
    if (socketRef.current) {
      socketRef.current.emit('end_session', { roomId });
    }
  };

  // Skip Partner -> Find next
  const handleSkipPartner = () => {
    setIsSkipping(true);
    if (socketRef.current && roomId) {
      socketRef.current.emit('skip_partner', { roomId });
      socketRef.current.emit('join_queue', userProfile);
    } else {
      setTimeout(() => {
        setPeer({
          nickname: 'Sophie 🌿',
          identity: 'girl',
          videoEnabled: true,
          location: 'Copenhagen, DK (620km)',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOEARCQ2EybdmOPabe4zqdV22dov6N4kuqN1MgixR_1F2PE6VJFss6btW-ij9ppNZ5dl_1HKI5Dq_66uzcSBzn2PVrcRiSYx_-aXzf_cxGTh5Y8ha3BQIAexzcpJ8DXA44FhK9lWmn0JwWuMJH79nIeNa6i7G9sXTdRLTYtXYgXTLWD5OLqok_dD1CEtaP699HqsPa3AytlOYBVXQfJTJV221QrAADieEy3m1UG4lh5UVbrOOxCTaO7A',
          videoPoster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOEARCQ2EybdmOPabe4zqdV22dov6N4kuqN1MgixR_1F2PE6VJFss6btW-ij9ppNZ5dl_1HKI5Dq_66uzcSBzn2PVrcRiSYx_-aXzf_cxGTh5Y8ha3BQIAexzcpJ8DXA44FhK9lWmn0JwWuMJH79nIeNa6i7G9sXTdRLTYtXYgXTLWD5OLqok_dD1CEtaP699HqsPa3AytlOYBVXQfJTJV221QrAADieEy3m1UG4lh5UVbrOOxCTaO7A',
          tags: ['#Architecture', '#Photography', '#Coffee'],
          initialGreetings: [
            "Hey! Where are you dialing in from today? ✨",
            "I love spontaneous conversations with random souls around the globe."
          ]
        });
        setRoomId('room_demo_' + Math.floor(1000 + Math.random() * 9000));
        setIsSkipping(false);
      }, 1600);
    }
  };

  // End Session -> Return to Lobby
  const handleEndSession = () => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('end_session', { roomId });
    }
    setView('lobby');
    setPeer(null);
    setRoomId(null);
    setIsSkipping(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background selection:bg-primary selection:text-on-primary">
      <Header onlineCount={onlineCount} />

      <main className="w-full pt-16 flex-1 flex flex-col items-center justify-center bg-background">
        {view === 'lobby' && (
          <LobbyView onStartMatching={handleStartMatching} />
        )}

        {view === 'searching' && (
          <FindingMatchModal 
            onCancel={handleCancelSearch} 
            preference={userProfile?.preference} 
          />
        )}

        {view === 'room' && (
          <MatchRoomView 
            isSkipping={isSkipping}
            onEnd={handleEndSession}
            onSkip={handleSkipPartner}
            peer={peer}
            roomId={roomId}
            socket={socketRef.current}
            userProfile={userProfile}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
