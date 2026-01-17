import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Scene from './components/Scene';
import HUD from './components/HUD';
import AboutMe from './components/AboutMe/AboutMe';
import Chatbot from './components/Chatbot/Chatbot';
import ContactCard from './components/ContactCard/ContactCard';
import FloatingMusicPlayer from './components/FloatingMusicPlayer/FloatingMusicPlayer';
import { MusicPlayerProvider } from './components/FloatingMusicPlayer/MusicPlayerContext';
import ConstructionScene from './components/ConstructionScene';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (targetView) => {
    if (targetView === 'hub') {
      navigate('/');
    } else {
      navigate(`/${targetView}`);
    }
  };

  return (
    <MusicPlayerProvider>
      <div style={{
        width: '100vw',
        height: '100dvh',
        minHeight: '100vh',
        background: '#0a0a0a',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
      }}>
        <Routes>
          <Route path="/" element={
            <>
              <HUD />
              <Scene onNavigate={handleNavigate} />
            </>
          } />
          <Route path="/about" element={<AboutMe onNavigate={handleNavigate} />} />
          <Route path="/chatbot" element={<Chatbot onNavigate={handleNavigate} />} />
          <Route path="/contact" element={<ContactCard onNavigate={handleNavigate} />} />
          <Route path="/tools" element={<ConstructionScene onNavigate={handleNavigate} title="TOOLS SECTION" />} />
          <Route path="/games" element={<ConstructionScene onNavigate={handleNavigate} title="GAMES ARCADE" />} />
          {/* Catch all redirect to Hub */}
          <Route path="*" element={
            <>
              <HUD />
              <Scene onNavigate={handleNavigate} />
            </>
          } />
        </Routes>

        {/* Music Player - persists across all pages */}
        <FloatingMusicPlayer />
      </div>
    </MusicPlayerProvider>
  );
}

export default App;
