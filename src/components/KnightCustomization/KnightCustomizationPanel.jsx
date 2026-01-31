import React, { useState } from 'react';
import { useKnightCustomization, KNIGHT_OPTIONS } from './KnightCustomizationContext';
import styles from './KnightCustomization.module.css';

export default function KnightCustomizationPanel() {
    const {
        customization,
        updateCustomization,
        isPanelOpen,
        closePanel,
        options
    } = useKnightCustomization();

    const [activeTab, setActiveTab] = useState('weapons');

    if (!isPanelOpen) return null;

    const handleItemSelect = (category, itemId) => {
        const categoryMap = {
            weapons: 'weapon',
            helmets: 'helmet',
            armors: 'armor',
            colors: 'color',
        };
        updateCustomization(categoryMap[category], itemId);
    };

    const renderInventoryItems = () => {
        const items = options[activeTab] || [];

        if (activeTab === 'colors') {
            return items.map(item => (
                <div
                    key={item.id}
                    className={`${styles.inventoryItem} ${customization.color === item.id ? styles.selected : ''}`}
                    onClick={() => handleItemSelect('colors', item.id)}
                    title={item.name}
                >
                    <div
                        className={styles.colorSwatch}
                        style={{
                            background: `linear-gradient(135deg, ${item.primary} 0%, ${item.secondary} 100%)`
                        }}
                    />
                    <span className={styles.itemName}>{item.name}</span>
                </div>
            ));
        }

        return items.map(item => (
            <div
                key={item.id}
                className={`${styles.inventoryItem} ${customization[activeTab.slice(0, -1)] === item.id ? styles.selected : ''}`}
                onClick={() => handleItemSelect(activeTab, item.id)}
            >
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemName}>{item.name}</span>
            </div>
        ));
    };

    const getCurrentEquipment = (type) => {
        const categoryMap = {
            helmet: 'helmets',
            weapon: 'weapons',
            armor: 'armors',
        };
        const items = options[categoryMap[type]];
        const current = items?.find(i => i.id === customization[type]);
        return current?.icon || '❓';
    };

    return (
        <div className={styles.panelOverlay} onClick={closePanel}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>Equip Your Knight...</h2>
                    <button className={styles.closeButton} onClick={closePanel}>
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className={styles.panelContent}>
                    {/* Equipment slots (left side) */}
                    <div className={styles.equipmentSide}>
                        <div className={styles.equipmentSlots}>
                            {/* Row 1 */}
                            <div className={`${styles.equipSlot} ${styles.empty}`} />
                            <div
                                className={`${styles.equipSlot} ${styles.active}`}
                                onClick={() => setActiveTab('helmets')}
                                title="Helmet"
                            >
                                {getCurrentEquipment('helmet')}
                                <span className={styles.slotLabel}>Head</span>
                            </div>
                            <div className={`${styles.equipSlot} ${styles.empty}`} />

                            {/* Row 2 */}
                            <div
                                className={`${styles.equipSlot} ${styles.active}`}
                                onClick={() => setActiveTab('weapons')}
                                title="Weapon"
                            >
                                {getCurrentEquipment('weapon')}
                                <span className={styles.slotLabel}>Weapon</span>
                            </div>
                            <div
                                className={`${styles.equipSlot} ${styles.active}`}
                                onClick={() => setActiveTab('armors')}
                                title="Armor"
                            >
                                {getCurrentEquipment('armor')}
                                <span className={styles.slotLabel}>Body</span>
                            </div>
                            <div className={`${styles.equipSlot} ${styles.empty}`} />

                            {/* Row 3 */}
                            <div className={`${styles.equipSlot} ${styles.empty}`} />
                            <div
                                className={`${styles.equipSlot} ${styles.active}`}
                                onClick={() => setActiveTab('colors')}
                                title="Color"
                                style={{
                                    background: `linear-gradient(135deg, ${options.colors.find(c => c.id === customization.color)?.primary || '#888'} 0%, ${options.colors.find(c => c.id === customization.color)?.secondary || '#666'} 100%)`
                                }}
                            >
                                <span className={styles.slotLabel}>Color</span>
                            </div>
                            <div className={`${styles.equipSlot} ${styles.empty}`} />
                        </div>
                    </div>

                    {/* Inventory (right side) */}
                    <div className={styles.inventorySide}>
                        {/* Category tabs */}
                        <div className={styles.categoryTabs}>
                            <button
                                className={`${styles.categoryTab} ${activeTab === 'weapons' ? styles.active : ''}`}
                                onClick={() => setActiveTab('weapons')}
                            >
                                ⚔️ Weapons
                            </button>
                            <button
                                className={`${styles.categoryTab} ${activeTab === 'helmets' ? styles.active : ''}`}
                                onClick={() => setActiveTab('helmets')}
                            >
                                ⛑️ Helmets
                            </button>
                            <button
                                className={`${styles.categoryTab} ${activeTab === 'armors' ? styles.active : ''}`}
                                onClick={() => setActiveTab('armors')}
                            >
                                🛡️ Armor
                            </button>
                            <button
                                className={`${styles.categoryTab} ${activeTab === 'colors' ? styles.active : ''}`}
                                onClick={() => setActiveTab('colors')}
                            >
                                🎨 Color
                            </button>
                        </div>

                        {/* Item grid */}
                        <div className={styles.inventoryGrid}>
                            {renderInventoryItems()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
