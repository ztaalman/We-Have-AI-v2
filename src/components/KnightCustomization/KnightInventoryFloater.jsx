import React from 'react';
import { useKnightCustomization } from './KnightCustomizationContext';
import styles from './KnightCustomization.module.css';

export default function KnightInventoryFloater() {
    const { openPanel, isPanelOpen } = useKnightCustomization();

    // Don't show if panel is already open
    if (isPanelOpen) return null;

    return (
        <div className={styles.floater} onClick={openPanel}>
            <div className={styles.floaterButton}>
                🛡️
            </div>
            <span className={styles.floaterText}>Customize Me</span>
        </div>
    );
}
