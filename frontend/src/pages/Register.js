import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../components/Toast';
import Img3 from '../assets/img/Img3.png';

const GOOGLE_CLIENT_ID = '812813626877-nrjg75bqld9ejvmfq70m883h7br9flq9.apps.googleusercontent.com';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    level: 1,
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [toast, setToast] = useState(null);
  const { register, googleLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Initialize Google Identity Services
  const handleGoogleCredential = useCallback(async (response) => {
    setLoading(true);
    setError('');
    const result = await googleLogin(response.credential);
    if (result.success) {
      setToast({ message: t('googleLoginSuccess') || 'Google Login Successful!', type: 'success' });
      setTimeout(() => navigate('/'), 800);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [googleLogin, navigate, t]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-register-btn'),
          {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            shape: 'pill',
            text: 'continue_with',
          }
        );
      }
    };
    document.head.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) existing.remove();
    };
  }, [handleGoogleCredential]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError(t('passwordsDoNotMatch') || 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    const result = await register(formData);

    if (result.success) {
      setToast({
        message: t('checkEmailVerification') || 'Please check your email to verify your account.',
        type: 'info',
      });
      setTimeout(() => navigate('/login'), 4000);
    } else {
      const errorMsg = typeof result.error === 'object'
        ? Object.values(result.error).flat().join(', ')
        : result.error;
      setError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      {toast && <Toast message={toast.message} type={toast.type} duration={6000} onClose={() => setToast(null)} />}
      {/* Glassmorphism Card */}
      <div className="register-card">
        {/* Logo */}
        <div className="register-logo">
          <img src={Img3} alt="Next-Ed" />
        </div>

        {/* Left panel - Branding */}
        <div className="register-branding">
          <div className="branding-content">
            <h2>{t('welcome') || 'Bienvenue'}</h2>
            <p>{t('welcomeSubtitle') || 'Votre plateforme éducative'}</p>
            <div className="branding-decoration">
              <div className="deco-circle deco-circle-1"></div>
              <div className="deco-circle deco-circle-2"></div>
              <div className="deco-circle deco-circle-3"></div>
            </div>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className="register-form-panel">
          <h2>{t('register') || "S'inscrire"}</h2>
          <div className="title-bar"></div>

          {error && <div className="reg-error">{error}</div>}

          <form onSubmit={handleSubmit} id="registerForm">
            {/* Name Row */}
            <div className="form-row">
              <div className="reg-field">
                <input
                  type="text"
                  name="first_name"
                  placeholder={t('firstName') || 'Prénom'}
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="reg-field">
                <input
                  type="text"
                  name="last_name"
                  placeholder={t('lastName') || 'Nom'}
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Level Selection */}
            <div className="reg-field">
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="level-select"
                required
              >
                <option value={1}>📘 Level 1</option>
                <option value={2}>📗 Level 2</option>
                <option value={3}>📕 Level 3</option>
              </select>
            </div>

            {/* Email */}
            <div className="reg-field">
              <input
                type="email"
                name="email"
                placeholder={t('email') || 'Email'}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password with eye toggle */}
            <div className="reg-field password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t('password') || 'Mot de passe'}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password with eye toggle */}
            <div className="reg-field password-field">
              <input
                type={showPassword2 ? 'text' : 'password'}
                name="password2"
                placeholder={t('confirmPassword') || 'Confirmer le mot de passe'}
                value={formData.password2}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword2(!showPassword2)}
                tabIndex={-1}
              >
                {showPassword2 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            <button type="submit" className="register-submit" disabled={loading}>
              {loading ? '⏳ ...' : (t('register') || "S'inscrire")}
            </button>

            {/* Divider */}
            <div className="reg-divider">
              <span className="reg-divider-line"></span>
              <span className="reg-divider-text">{t('or') || 'ou'}</span>
              <span className="reg-divider-line"></span>
            </div>

            {/* Google Sign-Up */}
            <div className="google-register-wrapper">
              <div id="google-register-btn"></div>
            </div>

            <div className="register-login-link">
              <p>{t('haveAccount') || 'Déjà un compte ?'} <Link to="/login">{t('loginHere') || 'Se connecter'}</Link></p>
            </div>
          </form>
        </div>
      </div>

      <style jsx="true">{`
        .register-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #2A9D8F 0%, #264653 30%, #E76F51 70%, #F4A261 100%);
          font-family: 'Inter', 'Poppins', sans-serif;
          padding: 2rem;
        }

        .register-card {
          position: relative;
          display: flex;
          width: 880px;
          min-height: 600px;
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

        .register-logo {
          position: absolute;
          top: 1rem;
          left: 1.5rem;
          z-index: 10;
        }

        .register-logo img {
          width: 120px;
          height: auto;
          mix-blend-mode: screen;
          filter: brightness(1.2);
        }

        /* Left Branding Panel */
        .register-branding {
          width: 45%;
          background: rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .branding-content {
          text-align: center;
          padding: 2rem;
          z-index: 2;
        }

        .branding-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #F4A261;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          letter-spacing: 1px;
        }

        .branding-content p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .branding-decoration {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .deco-circle {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(244, 162, 97, 0.15);
        }

        .deco-circle-1 {
          width: 200px; height: 200px;
          top: -50px; left: -50px;
          animation: float 8s ease-in-out infinite;
        }
        .deco-circle-2 {
          width: 150px; height: 150px;
          bottom: -30px; right: -30px;
          animation: float 6s ease-in-out infinite reverse;
        }
        .deco-circle-3 {
          width: 80px; height: 80px;
          top: 50%; left: 60%;
          animation: float 10s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Right Form Panel */
        .register-form-panel {
          width: 55%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
        }

        .register-form-panel h2 {
          font-size: 1.75rem;
          color: white;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .title-bar {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #F4A261, #E76F51);
          border-radius: 999px;
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 0.75rem;
          width: 100%;
        }

        .form-row .reg-field {
          flex: 1;
        }

        .reg-field {
          width: 100%;
          margin-bottom: 1rem;
          position: relative;
        }

        .reg-field input,
        .level-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.3s ease;
          outline: none;
        }

        .reg-field input:focus,
        .level-select:focus {
          border-color: #F4A261;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(244, 162, 97, 0.15);
        }

        .reg-field input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .level-select {
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .level-select option {
          background: #1e293b;
          color: white;
          padding: 0.5rem;
        }

        /* Password field with eye toggle */
        .password-field {
          position: relative;
        }

        .password-field input {
          padding-right: 3rem;
        }

        .eye-toggle {
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
        }

        .eye-toggle:hover {
          color: #F4A261;
        }

        .register-submit {
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
          letter-spacing: 0.5px;
        }

        .register-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(244, 162, 97, 0.4);
        }

        .register-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Divider */
        .reg-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          margin: 1rem 0;
        }
        .reg-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.2);
        }
        .reg-divider-text {
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Google Button */
        .google-register-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .google-register-wrapper > div {
          width: 100% !important;
        }

        .register-login-link {
          margin-top: 0.75rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .register-login-link a {
          color: #F4A261;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .register-login-link a:hover {
          color: #E9C46A;
          text-decoration: underline;
        }

        .reg-error {
          width: 100%;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 0.5rem;
          color: #fca5a5;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        #registerForm {
          width: 100%;
          max-width: 380px;
        }

        @media (max-width: 768px) {
          .register-card {
            flex-direction: column;
            width: 95%;
            min-height: auto;
          }
          .register-branding {
            width: 100%;
            padding: 3rem 2rem 2rem;
          }
          .register-form-panel {
            width: 100%;
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
