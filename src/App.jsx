import React, { useState } from 'react';
import Scene from './components/Scene';
import HUD from './components/HUD';
import AboutMe from './components/AboutMe/AboutMe';
import Chatbot from './components/Chatbot/Chatbot';
import ContactCard from './components/ContactCard/ContactCard';
import FloatingMusicPlayer from './components/FloatingMusicPlayer/FloatingMusicPlayer';
import { MusicPlayerProvider } from './components/FloatingMusicPlayer/MusicPlayerContext';
import ConstructionScene from './components/ConstructionScene';

function App() {
  const [view, setView] = useState('hub');

  const handleNavigate = (targetView) => {
    // Removed alert, now we navigate to the view which will render ConstructionScene
    setView(targetView);
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
        {view === 'hub' && (
          <>
            <HUD />
            <Scene onNavigate={handleNavigate} />
          </>
        )}

        {view === 'about' && (
          <AboutMe onNavigate={handleNavigate} />
        )}

        {view === 'chatbot' && (
          <Chatbot onNavigate={handleNavigate} />
        )}

        {view === 'contact' && (
          <ContactCard onNavigate={handleNavigate} />
        )}

        {(view === 'tools' || view === 'games') && (
          <ConstructionScene
            onNavigate={handleNavigate}
            title={view === 'tools' ? "TOOLS SECTION" : "GAMES ARCADE"}
          />
        )}

        {/* Music Player - persists across all pages */}
        <FloatingMusicPlayer />
      </div>
    </MusicPlayerProvider>
  );
}

export default App;
