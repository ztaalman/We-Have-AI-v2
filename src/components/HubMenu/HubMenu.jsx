import React from 'react';
import './HubMenu.css';

const HubMenu = ({ onNavigate }) => {
    return (
        <div className="hub-menu-container">
            {/* Background Connecting Lines */}
            <svg className="connection-lines" xmlns="http://www.w3.org/2000/svg">
                <path className="connection-paths" d="M 25% 36% L 55% 24%" stroke="#00ffff" /> {/* About -> Tools */}
                <path className="connection-paths" d="M 60% 29% L 70% 50%" stroke="#ffcc00" /> {/* Tools -> Games */}
                <path className="connection-paths" d="M 70% 55% L 60% 70%" stroke="#ff00ff" /> {/* Games -> Chatbot */}
                <path className="connection-paths" d="M 55% 76% L 30% 65%" stroke="#00ff00" /> {/* Chatbot -> Contact */}
                <path className="connection-paths" d="M 35% 60% L 30% 41%" stroke="#ff3333" /> {/* Contact -> About */}
            </svg>

            <button className="hub-btn btn-about" onClick={() => onNavigate('about')}>
                <span className="hub-icon">👤</span>
                <span>ABOUT ME</span>
            </button>

            <button className="hub-btn btn-tools" onClick={() => onNavigate('tools')}>
                <span className="hub-icon">🛠️</span>
                <span>TOOLS</span>
            </button>

            <button className="hub-btn btn-games" onClick={() => onNavigate('chatbot')}> {/* Mapping Games to Chatbot for now as user mentioned games there, or 'games' if I create view */}
                <span className="hub-icon">🎮</span>
                <span>GAMES</span>
            </button>

            <button className="hub-btn btn-contact" onClick={() => onNavigate('contact')}>
                <span className="hub-icon">📞</span>
                <span>CONTACT</span>
            </button>

            <button className="hub-btn btn-chatbot" onClick={() => onNavigate('chatbot')}>
                <span className="hub-icon">🤖</span>
                <span>AI CHATBOT</span>
            </button>

        </div>
    );
};

export default HubMenu;
