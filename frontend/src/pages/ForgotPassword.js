// Forgot Password Page — Glassmorphism Design
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../components/Toast';
import Img3 from '../assets/img/Img3.png';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      await authAPI.requestPasswordReset(email);
      setSent(true);
      setToast({
        message: t('resetEmailSent') || 'If an account with that email exists, a reset link has been sent.',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: t('resetEmailError') || 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="fp-card">
        {/* Logo */}
        <div className="fp-logo">
          <img src={Img3} alt="Next-Ed" />
        </div>

        {/* Left Branding */}
        <div className="fp-branding">
          <div className="fp-branding-content">
            <h2>{t('resetPassword') || 'Reset Password'}</h2>
            <p>{t('resetPasswordSubtitle') || 'Enter your email and we\'ll send you a link to reset your password.'}</p>
            <div className="fp-deco">
              <div className="fp-circle fp-circle-1"></div>
              <div className="fp-circle fp-circle-2"></div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="fp-form-panel">
          <h2>{t('forgotPasswordTitle') || 'Forgot Password?'}</h2>
          <div className="fp-title-bar"></div>

          {sent ? (
            <div className="fp-success-box">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
              <p>{t('checkEmailReset') || 'Check your email for a password reset link.'}</p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                {t('checkSpam') || 'Don\'t forget to check your spam folder.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="fp-form">
              <div className="fp-field">
                <input
                  type="email"
                  placeholder={t('email') || 'Email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="fp-submit" disabled={loading}>
                {loading ? (
                  <span className="fp-spinner-wrap">
                    <span className="fp-spinner"></span>
                    {t('sending') || 'Sending...'}
                  </span>
                ) : (
                  t('sendResetLink') || 'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="fp-back-link">
            <Link to="/login">← {t('backToLogin') || 'Return to Login'}</Link>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .fp-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #2A9D8F 0%, #264653 30%, #E76F51 70%, #F4A261 100%);
          font-family: 'Inter', 'Poppins', sans-serif;
          padding: 2rem;
        }

        .fp-card {
          position: relative;
          display: flex;
          width: 780px;
          min-height: 440px;
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

        .fp-logo {
          position: absolute;
          top: 1rem;
          left: 1.5rem;
          z-index: 10;
        }
        .fp-logo img {
          width: 100px;
          height: auto;
          mix-blend-mode: screen;
          filter: brightness(1.2);
        }

        /* Left Branding */
        .fp-branding {
          width: 45%;
          background: rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .fp-branding-content {
          text-align: center;
          padding: 2rem;
          z-index: 2;
        }
        .fp-branding-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #F4A261;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          letter-spacing: 1px;
        }
        .fp-branding-content p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1rem;
          line-height: 1.6;
        }
        .fp-deco {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        .fp-circle {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(244, 162, 97, 0.15);
        }
        .fp-circle-1 {
          width: 180px; height: 180px;
          top: -40px; left: -40px;
          animation: fpFloat 8s ease-in-out infinite;
        }
        .fp-circle-2 {
          width: 120px; height: 120px;
          bottom: -30px; right: -30px;
          animation: fpFloat 6s ease-in-out infinite reverse;
        }
        @keyframes fpFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        /* Right Form */
        .fp-form-panel {
          width: 55%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
        }
        .fp-form-panel h2 {
          font-size: 1.6rem;
          color: white;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .fp-title-bar {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #F4A261, #E76F51);
          border-radius: 999px;
          margin-bottom: 2rem;
        }

        .fp-form {
          width: 100%;
          max-width: 340px;
        }

        .fp-field {
          width: 100%;
          margin-bottom: 1.25rem;
        }
        .fp-field input {
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
        .fp-field input:focus {
          border-color: #F4A261;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.15);
        }
        .fp-field input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .fp-submit {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #2A9D8F, #264653);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }
        .fp-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(42, 157, 143, 0.4);
        }
        .fp-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Spinner */
        .fp-spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .fp-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: fpSpin 0.6s linear infinite;
        }
        @keyframes fpSpin {
          to { transform: rotate(360deg); }
        }

        /* Success state */
        .fp-success-box {
          text-align: center;
          padding: 1.5rem;
          background: rgba(42, 157, 143, 0.1);
          border: 1px solid rgba(42, 157, 143, 0.25);
          border-radius: 1rem;
          backdrop-filter: blur(8px);
          max-width: 340px;
          width: 100%;
        }
        .fp-success-box p {
          color: rgba(255,255,255,0.9);
          font-size: 1rem;
          line-height: 1.5;
          margin: 0;
        }

        .fp-back-link {
          margin-top: 1.5rem;
          text-align: center;
        }
        .fp-back-link a {
          color: #F4A261;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .fp-back-link a:hover {
          color: #E9C46A;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .fp-card {
            flex-direction: column;
            width: 95%;
            min-height: auto;
          }
          .fp-branding {
            width: 100%;
            padding: 3rem 2rem 2rem;
          }
          .fp-form-panel {
            width: 100%;
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
