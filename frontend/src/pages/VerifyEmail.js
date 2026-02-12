// Email Verification Page — handles token verification from email link
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

const VerifyEmail = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await api.get(`/verify-email/${uid}/${token}/`);
        setStatus('success');
        setMessage(response.data.message || t('emailVerified'));
        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.error || t('verificationFailed'));
      }
    };
    verify();
  }, [uid, token, navigate, t]);

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-icon">
          {status === 'verifying' && '⏳'}
          {status === 'success' && '✅'}
          {status === 'error' && '❌'}
        </div>
        <h1 className="verify-title">
          {status === 'verifying' && (t('verifying') || 'Verifying...')}
          {status === 'success' && (t('emailVerified') || 'Email Verified!')}
          {status === 'error' && (t('verificationFailed') || 'Verification Failed')}
        </h1>
        <p className="verify-message">{message || (t('verifying') || 'Please wait...')}</p>
        {status === 'success' && (
          <p className="verify-redirect">{t('redirectingToLogin') || 'Redirecting to login...'}</p>
        )}
        {status === 'error' && (
          <button className="verify-btn" onClick={() => navigate('/register')}>
            {t('tryAgain') || 'Try Again'}
          </button>
        )}
      </div>

      <style jsx="true">{`
        .verify-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #2A9D8F 0%, #264653 30%, #E76F51 70%, #F4A261 100%);
          font-family: 'Inter', 'Poppins', sans-serif;
          padding: 2rem;
        }
        .verify-card {
          text-align: center;
          padding: 3rem 2.5rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 1.5rem;
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.3);
          max-width: 450px;
          width: 100%;
        }
        .verify-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .verify-title {
          color: white;
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .verify-message {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .verify-redirect {
          color: #F4A261;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .verify-btn {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #F4A261, #E76F51);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .verify-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(244, 162, 97, 0.4);
        }
        @media (max-width: 480px) {
          .verify-card { padding: 2rem 1.5rem; }
          .verify-icon { font-size: 3rem; }
          .verify-title { font-size: 1.4rem; }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
