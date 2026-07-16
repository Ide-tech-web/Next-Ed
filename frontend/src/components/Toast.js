// Glassmorphism Toast Notification Component
import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, 400);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const colors = {
    success: { bg: 'rgba(42, 157, 143, 0.2)', border: 'rgba(42, 157, 143, 0.5)', icon: '✅' },
    error: { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', icon: '❌' },
    info: { bg: 'rgba(244, 162, 97, 0.2)', border: 'rgba(244, 162, 97, 0.5)', icon: '📧' },
    warning: { bg: 'rgba(233, 196, 106, 0.2)', border: 'rgba(233, 196, 106, 0.5)', icon: '⚠️' },
  };

  const c = colors[type] || colors.info;

  return (
    <>
      <div className={`glass-toast ${exiting ? 'toast-exit' : 'toast-enter'}`}>
        <span className="toast-icon">{c.icon}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={() => { setExiting(true); setTimeout(() => { setVisible(false); onClose && onClose(); }, 400); }}>✕</button>
      </div>
      <style jsx="true">{`
        .glass-toast {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: ${c.bg};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${c.border};
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 420px;
          min-width: 280px;
          font-family: inherit;
          color: white;
        }
        .toast-enter {
          animation: slideIn 0.4s ease-out forwards;
        }
        .toast-exit {
          animation: slideOut 0.4s ease-in forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(120%); opacity: 0; }
        }
        .toast-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        .toast-message {
          font-size: 0.95rem;
          line-height: 1.4;
          flex: 1;
        }
        .toast-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-size: 1rem;
          padding: 0.25rem;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .toast-close:hover {
          color: white;
        }
        @media (max-width: 480px) {
          .glass-toast {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
            min-width: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Toast;
