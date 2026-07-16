// Change Password Modal — Glassmorphism Design

import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.new_password !== formData.confirm_password) {
      setError(t('passwordsDoNotMatch') || 'New passwords do not match.');
      return;
    }

    if (formData.new_password.length < 6) {
      setError(t('passwordTooShort') || 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword(formData);
      setSuccess(t('passwordChanged') || 'Password changed successfully!');
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.old_password) {
        setError(errData.old_password);
      } else if (errData?.confirm_password) {
        setError(errData.confirm_password);
      } else {
        setError(t('changePasswordError') || 'Failed to change password.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const EyeIcon = ({ show }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      )}
    </svg>
  );

  return (
    <div className="cpw-overlay" onClick={onClose}>
      <div className="cpw-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cpw-close" onClick={onClose}>✕</button>

        <h2 className="cpw-title">🔑 {t('changePassword') || 'Change Password'}</h2>
        <div className="cpw-bar"></div>

        {error && <div className="cpw-error">{error}</div>}
        {success && <div className="cpw-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="cpw-field">
            <label>{t('currentPassword') || 'Current Password'}</label>
            <div className="cpw-input-wrap">
              <input
                type={showOld ? 'text' : 'password'}
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button type="button" className="cpw-eye" onClick={() => setShowOld(!showOld)}>
                <EyeIcon show={showOld} />
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="cpw-field">
            <label>{t('newPassword') || 'New Password'}</label>
            <div className="cpw-input-wrap">
              <input
                type={showNew ? 'text' : 'password'}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button type="button" className="cpw-eye" onClick={() => setShowNew(!showNew)}>
                <EyeIcon show={showNew} />
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="cpw-field">
            <label>{t('confirmNewPassword') || 'Confirm New Password'}</label>
            <div className="cpw-input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button type="button" className="cpw-eye" onClick={() => setShowConfirm(!showConfirm)}>
                <EyeIcon show={showConfirm} />
              </button>
            </div>
          </div>

          <button type="submit" className="cpw-submit" disabled={loading}>
            {loading ? '⏳ ...' : (t('savePassword') || 'Save Password')}
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .cpw-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .cpw-modal {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .cpw-close {
          position: absolute;
          top: 1rem; right: 1.25rem;
          background: none; border: none;
          color: rgba(255,255,255,0.5);
          font-size: 1.25rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .cpw-close:hover { color: #F4A261; }

        .cpw-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .cpw-bar {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #F4A261, #E76F51);
          border-radius: 999px;
          margin: 0 auto 1.5rem;
        }

        .cpw-error {
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 0.5rem;
          color: #fca5a5;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .cpw-success {
          padding: 0.75rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 0.5rem;
          color: #6ee7b7;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .cpw-field {
          margin-bottom: 1.25rem;
        }

        .cpw-field label {
          display: block;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 0.4rem;
        }

        .cpw-input-wrap {
          position: relative;
        }

        .cpw-input-wrap input {
          width: 100%;
          padding: 0.75rem 2.75rem 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: all 0.3s ease;
        }

        .cpw-input-wrap input:focus {
          border-color: #F4A261;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.15);
        }

        .cpw-input-wrap input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .cpw-eye {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.5);
          padding: 0.25rem;
          display: flex;
          transition: color 0.2s;
        }
        .cpw-eye:hover { color: #F4A261; }

        .cpw-submit {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #F4A261, #E76F51);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }

        .cpw-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(244, 162, 97, 0.4);
        }

        .cpw-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordModal;
