import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../components/Toast';
import Img3 from '../assets/img/Img3.png';
import Img1 from '../assets/img/Img1.jpg';

const GOOGLE_CLIENT_ID = '812813626877-nrjg75bqld9ejvmfq70m883h7br9flq9.apps.googleusercontent.com';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { login, googleLogin } = useAuth();
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
        // Load Google Identity Services script
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
                    document.getElementById('google-login-btn'),
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="login-body">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="login-container">
                <div className="logo-container">
                    <img src={Img3} className="Img3" alt="Logo" />
                </div>
                <div className="drop"></div>
                <div className="content">
                    <h2>{t('login')}</h2>
                    <hr />
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="box">
                            <input
                                type="text"
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="box password-box">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="eye-toggle-login"
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
                        <div className="fgpw">
                            <Link to="#">{t('forgotPassword')}</Link>
                        </div>
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? '...' : t('login')}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider-row">
                        <span className="divider-line"></span>
                        <span className="divider-text">{t('or') || 'ou'}</span>
                        <span className="divider-line"></span>
                    </div>

                    {/* Google Login Button */}
                    <div className="google-btn-wrapper">
                        <div id="google-login-btn"></div>
                    </div>

                    <div className="register-link">
                         <p>{t('noAccount')} <Link to="/register">{t('registerHere')}</Link></p>
                    </div>
                </div>
                <div className="text">
                    <h2>{t('welcome')}</h2>
                    <p>{t('welcomeSubtitle')}</p>
                </div>
            </div>

            <style jsx="true">{`
                .login-body {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-image: url(${Img1});
                    background-size: cover;
                    background-position: center;
                    font-family: 'Poppins', sans-serif;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .login-container {
                    position: relative;
                    width: 640px;
                    min-height: 560px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 2px solid #4A4A4A;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 15px 25px rgba(0,0,0,0.2);
                }

                .logo-container {
                    position: absolute;
                    top: 5px;
                    right: 60px;
                    z-index: 10;
                }

                .Img3 {
                    width: 150px;
                    height: auto;
                    mix-blend-mode: screen;
                }

                .content {
                    position: absolute;
                    width: 50%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    z-index: 10;
                    padding: 20px;
                }

                .content h2 {
                    font-size: 30px;
                    color: #0E2C61;
                    text-align: center;
                    font-weight: 600;
                }

                .content hr {
                    width: 80px;
                    height: 5px;
                    background: #FF6B00;
                    border-radius: 25px;
                    margin: 5px auto 15px;
                }

                .box {
                    width: 80%;
                    margin: 15px auto;
                }

                .box input {
                    width: 100%;
                    height: 48px;
                    background: transparent;
                    border: 0;
                    outline: none;
                    border-bottom: 2px solid #FF6B00;
                    color: #fff;
                    font-size: 18px;
                    transition: 0.3s;
                }
                
                .box input:focus {
                     border-bottom-color: #0E2C61;
                }

                .box input::placeholder {
                    color: #ddd; 
                }

                /* Password field with eye toggle */
                .password-box {
                    position: relative;
                }
                .password-box input {
                    padding-right: 2.5rem;
                }
                .eye-toggle-login {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: rgba(255, 255, 255, 0.5);
                    padding: 0.4rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s;
                    min-width: 44px;
                    min-height: 44px;
                }
                .eye-toggle-login:hover {
                    color: #F4A261;
                }

                .fgpw {
                    width: 80%;
                    margin: 8px auto;
                    text-align: right;
                }
                
                .fgpw a {
                    color: #fff;
                    text-decoration: none;
                    font-size: 14px;
                }

                .login-btn {
                    width: 80%;
                    height: 40px;
                    background: #7693a2;
                    color: #fff;
                    border: 0;
                    font-size: 18px;
                    letter-spacing: 2px;
                    border-radius: 40px;
                    margin: 15px auto;
                    cursor: pointer;
                    transition: 0.5s;
                    display: block;
                }

                .login-btn:hover {
                    background: #0e2c61;
                }

                /* Divider */
                .divider-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 80%;
                    margin: 10px auto;
                }
                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.3);
                }
                .divider-text {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* Google Button */
                .google-btn-wrapper {
                    width: 80%;
                    margin: 8px auto;
                    display: flex;
                    justify-content: center;
                }
                .google-btn-wrapper > div {
                    width: 100% !important;
                }

                .text {
                    position: absolute;
                    width: 50%;
                    height: 100%;
                    top: 0;
                    right: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 40px;
                    z-index: 1;
                    text-align: center;
                    background: rgba(0,0,0,0.2); 
                }

                .text h2 {
                    font-size: 28px;
                    color: #FF6B00;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }

                .text p {
                    color: #fff;
                    font-size: 18px;
                    line-height: 1.5;
                }
                
                .error-message {
                    color: #ff4444;
                    text-align: center;
                    margin-bottom: 10px;
                    font-weight: bold;
                    background: rgba(0,0,0,0.5);
                    padding: 5px;
                    border-radius: 4px;
                }

                .register-link {
                    text-align: center;
                    margin-top: 8px;
                    color: white;
                }

                .register-link a {
                    color: #FF6B00;
                    font-weight: bold;
                    text-decoration: none;
                }
                 .register-link a:hover {
                    text-decoration: underline;
                }
                
                @media (max-width: 768px) {
                    .login-container {
                        width: 90%;
                        min-height: auto;
                        flex-direction: column;
                    }
                    .content, .text {
                        width: 100%;
                        position: relative;
                        height: auto;
                    }
                     .text {
                        padding: 20px;
                     }
                }
            `}</style>
        </div>
    );
};

export default Login;
