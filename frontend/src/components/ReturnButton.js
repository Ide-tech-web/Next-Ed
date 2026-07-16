// Reusable Return Button Component
// 44x44px minimum touch target, mobile-responsive

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ReturnButton = ({ to, label, hidden }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (hidden) return null;

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="return-btn" onClick={handleClick}>
      <span className="return-btn-arrow">←</span>
      <span className="return-btn-text">{label || t('returnBack')}</span>

      <style jsx="true">{`
        .return-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: 0.75rem;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          margin-bottom: 1.5rem;
          min-height: 44px;
          min-width: 44px;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }

        .return-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateX(-4px);
        }

        .return-btn:active {
          transform: translateX(-2px) scale(0.97);
        }

        .return-btn-arrow {
          font-size: 1.2rem;
          transition: transform 0.2s ease;
        }

        .return-btn:hover .return-btn-arrow {
          transform: translateX(-3px);
        }

        @media (max-width: 480px) {
          .return-btn {
            padding: 0.4rem 0.85rem;
            font-size: 0.85rem;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </button>
  );
};

export default ReturnButton;
