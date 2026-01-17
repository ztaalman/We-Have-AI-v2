import React from 'react';

// Check if mobile
const isMobileDevice = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth <= 480;
    }
    return false;
};

export default function HUD() {
    // Title changed to zLAB
    const title = "zLAB";
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 480);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const styles = {
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 100,
            fontFamily: '"MedievalSharp", "Cinzel", Georgia, serif',
        },
        credit: {
            position: 'absolute',
            // Move DOWN on mobile to avoid overlap with stones
            top: isMobile ? '48%' : '33%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#c9a227',
            fontSize: isMobile ? '0.8rem' : 'clamp(0.9rem, 2.5vw, 1.1rem)',
            fontFamily: '"MedievalSharp", Georgia, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            letterSpacing: '2px',
            whiteSpace: 'nowrap',
        },
        instruction: {
            position: 'absolute',
            bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
            left: 'max(1rem, env(safe-area-inset-left, 1rem))',
            color: '#c9a227',
            fontSize: isMobile ? '0.75rem' : 'clamp(0.8rem, 2vw, 0.9rem)',
            fontFamily: '"MedievalSharp", Georgia, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            textAlign: 'left',
            opacity: 0.9,
            lineHeight: 1.4,
        },
        mobileHint: {
            position: 'absolute',
            bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
            right: 'max(1rem, env(safe-area-inset-right, 1rem))',
            color: '#c9a227',
            fontSize: '0.65rem',
            fontFamily: '"MedievalSharp", Georgia, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            opacity: 0.6,
        }
    };

    return (
        <div style={styles.container}>
            {/* Title Top Center */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                color: '#d4af37',
                fontSize: isMobile ? '1.5rem' : '3rem',
                fontWeight: 'bold',
                textShadow: '0 0 10px #d4af37',
                letterSpacing: '5px',
                zIndex: 100
            }}>
                {title}
            </div>

            {/* By Zach Taalman - moved down on mobile */}
            <div style={styles.credit}>
                By Zach Taalman
            </div>

            {/* Instruction text */}
            <div style={styles.instruction}>
                {isMobile ? 'Tap a door' : 'Click a door to send'}<br />
                {isMobile ? 'to begin' : 'the knight on a quest'}
            </div>

            {/* Mobile hint for landscape */}
            {isMobile && (
                <div style={styles.mobileHint}>
                    Rotate for best view
                </div>
            )}
        </div>
    );
}
