import React, { createContext, useState } from 'react';

export const MusicPlayerContext = createContext({
  setKaraokePlayRequest: () => {},
});

export const MusicPlayerProvider = ({ children }) => {
  const [karaokePlayRequest, setKaraokePlayRequest] = useState(null);

  return (
    <MusicPlayerContext.Provider value={{ karaokePlayRequest, setKaraokePlayRequest }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}; 