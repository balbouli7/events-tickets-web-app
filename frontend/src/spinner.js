import React from "react";
import spinner from "./spinner.gif";

const LoadingSpinner = () => {
    const styles = {
      spinner: {
        width: '50px',
        height: '50px',
        border: '5px solid rgba(0,0,0,0.1)',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      },
      // Define keyframes as an object
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    };
  
    return (
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
        <div style={styles.spinner}></div>
        {/* Inject keyframes */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  };

export default LoadingSpinner;