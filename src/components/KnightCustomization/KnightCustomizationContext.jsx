import React, { createContext, useContext, useState, useCallback } from 'react';

// Default customization state
const defaultCustomization = {
    color: 'silver',
    helmet: 'basic',
    armor: 'plate',
    weapon: 'sword',
};

// Available options
export const KNIGHT_OPTIONS = {
    colors: [
        { id: 'silver', name: 'Silver', primary: '#d0d0d0', secondary: '#8a8a8a', plume: '#cc3333' },
        { id: 'gold', name: 'Gold', primary: '#d4af37', secondary: '#b8860b', plume: '#ffffff' },
        { id: 'bronze', name: 'Bronze', primary: '#cd7f32', secondary: '#8b4513', plume: '#2f4f4f' },
        { id: 'black', name: 'Black', primary: '#2a2a2a', secondary: '#1a1a1a', plume: '#cc3333' },
        { id: 'crimson', name: 'Crimson', primary: '#8b0000', secondary: '#4a0000', plume: '#ffd700' },
        { id: 'blue', name: 'Royal Blue', primary: '#4169e1', secondary: '#1e3a8a', plume: '#ffffff' },
        { id: 'green', name: 'Forest', primary: '#228b22', secondary: '#0a4a0a', plume: '#ffffff' },
    ],
    helmets: [
        { id: 'basic', name: 'Knight Helm', icon: '⛑️' },
        { id: 'horned', name: 'Horned Helm', icon: '🐂' },
        { id: 'winged', name: 'Winged Helm', icon: '🦅' },
        { id: 'crown', name: 'Crown', icon: '👑' },
        { id: 'none', name: 'None', icon: '🚫' },
    ],
    armors: [
        { id: 'plate', name: 'Plate Armor', icon: '🛡️' },
        { id: 'spiked', name: 'Spiked Armor', icon: '⚔️' },
        { id: 'chainmail', name: 'Chainmail', icon: '🔗' },
        { id: 'leather', name: 'Leather', icon: '🥋' },
    ],
    weapons: [
        { id: 'sword', name: 'Sword', icon: '🗡️' },
        { id: 'axe', name: 'Battle Axe', icon: '🪓' },
        { id: 'spear', name: 'Spear', icon: '🔱' },
        { id: 'bow', name: 'Bow', icon: '🏹' },
        { id: 'none', name: 'None', icon: '✋' },
    ],
};

// Create context
const KnightCustomizationContext = createContext(null);

// Provider component
export function KnightCustomizationProvider({ children }) {
    const [customization, setCustomization] = useState(defaultCustomization);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const updateCustomization = useCallback((key, value) => {
        setCustomization(prev => ({ ...prev, [key]: value }));
    }, []);

    const togglePanel = useCallback(() => {
        setIsPanelOpen(prev => !prev);
    }, []);

    const closePanel = useCallback(() => {
        setIsPanelOpen(false);
    }, []);

    const openPanel = useCallback(() => {
        setIsPanelOpen(true);
    }, []);

    // Get current color palette
    const getColorPalette = useCallback(() => {
        return KNIGHT_OPTIONS.colors.find(c => c.id === customization.color) || KNIGHT_OPTIONS.colors[0];
    }, [customization.color]);

    const value = {
        customization,
        updateCustomization,
        isPanelOpen,
        togglePanel,
        closePanel,
        openPanel,
        getColorPalette,
        options: KNIGHT_OPTIONS,
    };

    return (
        <KnightCustomizationContext.Provider value={value}>
            {children}
        </KnightCustomizationContext.Provider>
    );
}

// Hook to use customization context
export function useKnightCustomization() {
    const context = useContext(KnightCustomizationContext);
    if (!context) {
        throw new Error('useKnightCustomization must be used within a KnightCustomizationProvider');
    }
    return context;
}

export default KnightCustomizationContext;
