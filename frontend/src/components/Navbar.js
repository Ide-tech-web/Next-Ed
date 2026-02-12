import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  // Home ALWAYS goes to the Study Hub for all roles
  const getHomePath = () => {
    return '/study-hub';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to={user ? getHomePath() : '/'} className="navbar-logo">
          Next-Ed
        </Link>
        
        <div className="navbar-right">
          {/* Controls visible always */}
          <div className="controls">
            <button onClick={toggleTheme} className="icon-btn touch-target" title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={toggleLanguage} className="lang-btn touch-target" title="Toggle Language">
              {language.toUpperCase()}
            </button>
          </div>

          {/* Animated Hamburger Button — SINGLE toggle (opens AND closes) */}
          {user && (
            <button 
              className={`hamburger touch-target ${isOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          )}
        </div>

        {/* Sidebar Drawer Overlay */}
        <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu}>
          <div className="menu-content" onClick={(e) => e.stopPropagation()}>
            {/* NO separate close button — hamburger→X is the single close mechanism */}
            
            {user && (
              <>
                {/* User Info */}
                <div className="menu-user-info">
                  <div className="menu-avatar">
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="menu-user-name">{user.first_name} {user.last_name}</p>
                    <span className="menu-user-role">
                      {user.role}{user.role === 'DELEGATE' ? ` • ${t('level')} ${user.level}` : ''}
                    </span>
                  </div>
                </div>
                <div className="menu-divider"></div>

                {/* Home — always first, for ALL roles */}
                <Link to={getHomePath()} className={`menu-link ${isActive(getHomePath())}`} onClick={closeMenu}>
                  🏠 {t('home')}
                </Link>

                {user.role === 'ADMIN' ? (
                  <>
                    <Link to="/admin" className={`menu-link ${isActive('/admin')}`} onClick={closeMenu}>
                      🛡️ {t('adminDashboard')}
                    </Link>
                    <Link to="/admin/courses" className={`menu-link ${isActive('/admin/courses')}`} onClick={closeMenu}>
                      📚 {t('manageCourses')}
                    </Link>
                    <Link to="/admin/upload" className={`menu-link ${isActive('/admin/upload')}`} onClick={closeMenu}>
                      📤 {t('uploadResources')}
                    </Link>
                    <Link to="/admin/students" className={`menu-link ${isActive('/admin/students')}`} onClick={closeMenu}>
                      👨‍🎓 {t('manageStudents')}
                    </Link>
                    <Link to="/admin/staff" className={`menu-link ${isActive('/admin/staff')}`} onClick={closeMenu}>
                      👥 {t('staffManagement')}
                    </Link>
                    <Link to="/admin/questions" className={`menu-link ${isActive('/admin/questions')}`} onClick={closeMenu}>
                      💬 {t('answerQuestions')}
                    </Link>
                  </>
                ) : user.role === 'DELEGATE' ? (
                  <>
                    <Link to="/delegate" className={`menu-link ${isActive('/delegate')}`} onClick={closeMenu}>
                      📋 {t('dashboard')}
                    </Link>
                    <Link to="/admin/courses" className={`menu-link ${isActive('/admin/courses')}`} onClick={closeMenu}>
                      📚 {t('delegateCourses')} ({t('level')} {user.level})
                    </Link>
                    <Link to="/admin/upload" className={`menu-link ${isActive('/admin/upload')}`} onClick={closeMenu}>
                      📤 {t('delegateUpload')} ({t('level')} {user.level})
                    </Link>
                    <Link to="/admin/questions" className={`menu-link ${isActive('/admin/questions')}`} onClick={closeMenu}>
                      💬 {t('delegateQuestions')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/my-dashboard" className={`menu-link ${isActive('/my-dashboard')}`} onClick={closeMenu}>
                      📊 {t('myDashboard')}
                    </Link>
                    <Link to="/levels" className={`menu-link ${isActive('/levels')}`} onClick={closeMenu}>
                      🎯 {t('selectLevel')}
                    </Link>
                    <Link to="/questions" className={`menu-link ${isActive('/questions')}`} onClick={closeMenu}>
                      💬 {t('questions')}
                    </Link>
                  </>
                )}

                <div className="menu-divider" style={{ marginTop: 'auto' }}></div>
                <button onClick={handleLogout} className="btn-logout-menu">
                  🚪 {t('logout')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .navbar {
          background: var(--glass-bg);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 0.75rem 0;
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--glass-border);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo {
          font-size: 1.6rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
          transition: var(--transition);
        }

        .navbar-logo:hover {
          transform: scale(1.05);
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .icon-btn {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          font-size: 1.15rem;
          cursor: pointer;
          transition: var(--transition);
          padding: 0.4rem;
          border-radius: 0.5rem;
          -webkit-tap-highlight-color: transparent;
        }
        .icon-btn:hover { 
          transform: scale(1.1) rotate(15deg);
          border-color: var(--primary);
        }

        .lang-btn {
          background: var(--glass-bg);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          padding: 0.35rem 0.7rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition);
          -webkit-tap-highlight-color: transparent;
        }
        .lang-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        /* Animated Hamburger — 3 lines morph to X */
        .hamburger {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 10px;
          z-index: 2001;
          position: relative;
          -webkit-tap-highlight-color: transparent;
        }

        .hamburger-line {
          width: 22px;
          height: 2.5px;
          background: var(--primary);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-origin: center;
        }

        /* Hamburger → X animation */
        .hamburger.active .hamburger-line:nth-child(1) {
          transform: translateY(7.5px) rotate(45deg);
          background: var(--secondary);
        }
        .hamburger.active .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger.active .hamburger-line:nth-child(3) {
          transform: translateY(-7.5px) rotate(-45deg);
          background: var(--secondary);
        }

        .hamburger:hover .hamburger-line {
          background: var(--secondary);
        }

        /* Menu Overlay — full screen backdrop */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1999;
        }

        .menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        /* Sidebar Drawer */
        .menu-content {
          position: fixed;
          top: 0;
          right: -300px;
          width: 280px;
          max-width: 85vw;
          height: 100vh;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid var(--glass-border);
          box-shadow: -10px 0 30px rgba(0,0,0,0.2);
          transition: right 0.4s cubic-bezier(0.77, 0, 0.175, 1);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          padding: 4.5rem 1.5rem 1.5rem;
          gap: 0.25rem;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .menu-overlay.open .menu-content {
          right: 0;
        }

        /* User Info in Menu */
        .menu-user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          margin-bottom: 0.25rem;
        }

        .menu-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .menu-user-name {
          margin: 0;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .menu-user-role {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .menu-divider {
          height: 1px;
          background: var(--glass-border);
          margin: 0.5rem 0;
        }

        .menu-link {
          font-size: 0.95rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
          padding: 0.75rem 0.875rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }

        .menu-link:hover {
          color: var(--primary);
          background: rgba(42, 157, 143, 0.1);
          transform: translateX(4px);
        }

        .menu-link:active {
          transform: translateX(2px) scale(0.98);
        }

        .menu-link.active-link {
          color: var(--primary);
          font-weight: 700;
          background: rgba(42, 157, 143, 0.15);
        }

        .btn-logout-menu {
          background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 44px;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }

        .btn-logout-menu:hover { 
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }

        .btn-logout-menu:active {
          transform: translateY(0) scale(0.97);
        }

        /* Mobile adjustments */
        @media (max-width: 480px) {
          .navbar {
            padding: 0.5rem 0;
          }
          .navbar-logo {
            font-size: 1.35rem;
          }
          .controls {
            gap: 0.25rem;
          }
          .icon-btn {
            font-size: 1rem;
            padding: 0.35rem;
          }
          .lang-btn {
            padding: 0.3rem 0.5rem;
            font-size: 0.75rem;
          }
          .menu-content {
            padding: 4rem 1.25rem 1.25rem;
          }
          .menu-link {
            font-size: 0.9rem;
            padding: 0.65rem 0.75rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
