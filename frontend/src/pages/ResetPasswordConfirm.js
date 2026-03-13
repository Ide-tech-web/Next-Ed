// Reset Password Confirm Page — Glassmorphism Design
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../components/Toast';
import Img3 from '../assets/img/Img3.png';

const ResetPasswordConfirm = () => {
  const { t } = useLanguage();
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (newPassword !== confirmPassword) {
      setToast({
        message: t('passwordsDoNotMatch') || 'Passwords do not match.',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.confirmPasswordReset({
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
      setToast({
        message: response.data?.message || t('passwordResetSuccess') || 'Password reset successfully!',
        type: 'success',
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const errMsg = error.response?.data?.error;
      const message = Array.isArray(errMsg)
        ? errMsg.join(' ')
        : errMsg || t('resetError') || 'Reset failed. The link may be invalid or expired.';
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div className="rpc-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="rpc-card">
        {/* Logo */}
        <div className="rpc-logo">
          <img src={Img3} alt="Next-Ed" />
        </div>

        {/* Left Branding */}
        <div className="rpc-branding">
          <div className="rpc-branding-content">
            <h2>{t('newPasswordTitle') || 'New Password'}</h2>
            <p>{t('newPasswordSubtitle') || 'Choose a strong password to secure your account.'}</p>
            <div className="rpc-deco">
              <div className="rpc-circle rpc-circle-1"></div>
              <div className="rpc-circle rpc-circle-2"></div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="rpc-form-panel">
          <h2>{t('resetYourPassword') || 'Reset Your Password'}</h2>
          <div className="rpc-title-bar"></div>

          {success ? (
            <div className="rpc-success-box">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <p>{t('passwordResetSuccess') || 'Password reset successfully!'}</p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                {t('redirectingToLogin') || 'Redirecting to login...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rpc-form">
              {/* New Password */}
              <div className="rpc-field rpc-password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('newPassword') || 'New Password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="rpc-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="rpc-field rpc-password-field">
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  placeholder={t('confirmNewPassword') || 'Confirm New Password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="rpc-eye-toggle"
                  onClick={() => setShowPassword2(!showPassword2)}
                  tabIndex={-1}
                >
                  {showPassword2 ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>

              <button type="submit" className="rpc-submit" disabled={loading}>
                {loading ? (
                  <span className="rpc-spinner-wrap">
                    <span className="rpc-spinner"></span>
                    {t('resetting') || 'Resetting...'}
                  </span>
                ) : (
                  t('resetPasswordBtn') || 'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="rpc-back-link">
            <Link to="/login">← {t('backToLogin') || 'Return to Login'}</Link>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .rpc-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #2A9D8F 0%, #264653 30%, #E76F51 70%, #F4A261 100%);
          font-family: 'Inter', 'Poppins', sans-serif;
          padding: 2rem;
        }

        .rpc-card {
          position: relative;
          display: flex;
          width: 780px;
          min-height: 480px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow:
            0 25px 45px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .rpc-logo {
          position: absolute;
          top: 1rem;
          left: 1.5rem;
          z-index: 10;
        }
        .rpc-logo img {
          width: 100px;
          height: auto;
          mix-blend-mode: screen;
          filter: brightness(1.2);
        }

        /* Left Branding */
        .rpc-branding {
          width: 45%;
          background: rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .rpc-branding-content {
          text-align: center;
          padding: 2rem;
          z-index: 2;
        }
        .rpc-branding-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #F4A261;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          letter-spacing: 1px;
        }
        .rpc-branding-content p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1rem;
          line-height: 1.6;
        }
        .rpc-deco {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        .rpc-circle {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(244, 162, 97, 0.15);
        }
        .rpc-circle-1 {
          width: 180px; height: 180px;
          top: -40px; left: -40px;
          animation: rpcFloat 8s ease-in-out infinite;
        }
        .rpc-circle-2 {
          width: 120px; height: 120px;
          bottom: -30px; right: -30px;
          animation: rpcFloat 6s ease-in-out infinite reverse;
        }
        @keyframes rpcFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        /* Right Form */
        .rpc-form-panel {
          width: 55%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
        }
        .rpc-form-panel h2 {
          font-size: 1.6rem;
          color: white;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .rpc-title-bar {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #F4A261, #E76F51);
          border-radius: 999px;
          margin-bottom: 2rem;
        }

        .rpc-form {
          width: 100%;
          max-width: 340px;
        }

        .rpc-field {
          width: 100%;
          margin-bottom: 1.25rem;
          position: relative;
        }
        .rpc-field input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.3s ease;
          outline: none;
        }
        .rpc-field input:focus {
          border-color: #F4A261;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.15);
        }
        .rpc-field input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .rpc-password-field input {
          padding-right: 3rem;
        }

        .rpc-eye-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.5);
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          min-width: 44px;
          min-height: 44px;
        }
        .rpc-eye-toggle:hover {
          color: #F4A261;
        }

        .rpc-submit {
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
          letter-spacing: 0.5px;
        }
        .rpc-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(244, 162, 97, 0.4);
        }
        .rpc-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Spinner */
        .rpc-spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .rpc-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: rpcSpin 0.6s linear infinite;
        }
        @keyframes rpcSpin {
          to { transform: rotate(360deg); }
        }

        /* Success state */
        .rpc-success-box {
          text-align: center;
          padding: 1.5rem;
          background: rgba(42, 157, 143, 0.1);
          border: 1px solid rgba(42, 157, 143, 0.25);
          border-radius: 1rem;
          backdrop-filter: blur(8px);
          max-width: 340px;
          width: 100%;
        }
        .rpc-success-box p {
          color: rgba(255,255,255,0.9);
          font-size: 1rem;
          line-height: 1.5;
          margin: 0;
        }

        .rpc-back-link {
          margin-top: 1.5rem;
          text-align: center;
        }
        .rpc-back-link a {
          color: #F4A261;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .rpc-back-link a:hover {
          color: #E9C46A;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .rpc-card {
            flex-direction: column;
            width: 95%;
            min-height: auto;
          }
          .rpc-branding {
            width: 100%;
            padding: 3rem 2rem 2rem;
          }
          .rpc-form-panel {
            width: 100%;
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordConfirm;
