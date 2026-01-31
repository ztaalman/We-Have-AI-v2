import React, { Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Html, Environment } from '@react-three/drei';
import MechanicalArm from '../MechanicalArm';
import profilePic from '../../assets/contact-profile.jpg';
import './ContactCard.css';
import Contact from '../Contact';

export default function ContactCard({ onNavigate }) {
    const [showContactForm, setShowContactForm] = React.useState(false);

    const contactInfo = {
        name: "Zachary R Taalman",
        title: "Sales Manager | Machine Learning Engineer",
        email: "zach@wehave.ai",
        phone: "847-414-1682",
        location: "Chicago, Illinois",
        linkedin: "linkedin.com/in/zachary-taalman/",
        linkedinUrl: "https://linkedin.com/in/zachary-taalman/"
    };

    const handleDownloadVCard = () => {
        // Construct vCard 3.0 string
        const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.name}
N:Taalman;Zachary;R;;
TITLE:${contactInfo.title}
TEL;TYPE=CELL:${contactInfo.phone}
EMAIL;TYPE=INTERNET:${contactInfo.email}
ADR;TYPE=HOME:;;${contactInfo.location};;;
URL:${contactInfo.linkedinUrl}
END:VCARD`;

        const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Zachary_Taalman.vcf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEmailMe = () => {
        setShowContactForm(true);
    };

    return (
        <div className="contact-card-container">
            {/* 3D Mascot Layer */}
            <div className="mascot-layer">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                    <ambientLight intensity={0.8} />
                    <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#00ffff" />
                    <Environment preset="city" />

                    <Suspense fallback={null}>
                        <group position={[5.5, -3.5, 0]} rotation={[0, -0.6, 0]}>
                            {/* Replaced Hand with Industrial Arm (Floor Mount) */}
                            <MechanicalArm position={[0, 0, 0]} rotation={[0, 0, 0]} />

                            <Html position={[0.8, 6.0, 0]} distanceFactor={10} style={{ pointerEvents: 'none' }}>
                                <div className="speech-bubble" style={{ transform: 'translate3d(0,0,0)', width: 'max-content' }}>
                                    Hi! I'm Margot..<br />Margot Rob-E
                                </div>
                            </Html>
                        </group>
                    </Suspense>
                </Canvas>
            </div>

            <button className="return-button" onClick={() => onNavigate('hub')}>
                &lt; RETURN TO HUB
            </button>

            <motion.div
                className="contact-card"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="card-corner tl"></div>
                <div className="card-corner tr"></div>
                <div className="card-corner bl"></div>
                <div className="card-corner br"></div>

                <div className="profile-avatar">
                    <img src={profilePic} alt="Profile" />
                </div>

                <h1 className="contact-name">Zachary Taalman</h1>
                <p className="contact-title">{contactInfo.title}</p>

                <div className="contact-details">
                    <div className="detail-row">
                        <span className="detail-icon">📧</span>
                        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                    </div>
                    <div className="detail-row">
                        <span className="detail-icon">📱</span>
                        <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                    </div>
                    <div className="detail-row">
                        <span className="detail-icon">📍</span>
                        <span>{contactInfo.location}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-icon">🔗</span>
                        <a href={contactInfo.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            LinkedIn Profile
                        </a>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn-cyber" onClick={handleDownloadVCard}>
                        Export Contact
                    </button>
                    <button className="btn-cyber" onClick={handleEmailMe}>
                        Send message
                    </button>
                </div>
            </motion.div>

            {/* Contact Form Modal */}
            {showContactForm && (
                <div className="modal-overlay">
                    <div className="modal-content-wrapper">
                        <button
                            className="modal-close-btn"
                            onClick={() => setShowContactForm(false)}
                        >
                            ×
                        </button>
                        <Contact />
                    </div>
                </div>
            )}
        </div>
    );
}
