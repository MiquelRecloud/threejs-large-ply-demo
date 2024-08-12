// src/LoadingIndicator.js

import React from 'react';

const LoadingIndicator = () => {
    // Inline styles for the loading indicator
    const containerStyle = {
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000, // Ensure it's above other content
    };

    const circleStyle = {
        width: '20px',
        height: '20px',
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        borderTop: '4px solid #3498db', // Blue color
        animation: 'spin 1s linear infinite',
    };

    // Inline styles for keyframes (including the spinning animation)
    const animationStyle = {
        '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
        },
    };

    // Apply keyframes by dynamically injecting styles into the head
    React.useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    return (
        <div style={containerStyle}>
            <div style={circleStyle}></div>
        </div>
    );
};

export default LoadingIndicator;
