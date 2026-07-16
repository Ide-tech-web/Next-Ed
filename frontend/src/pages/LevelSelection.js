// Level Selection Page - Choose Your Academic Level

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';

const LevelSelection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const levels = [
    {
      id: 1,
      title: 'Level 1',
      subtitle: t('firstYear'),
      description: t('firstYearDesc'),
      icon: '🎓',
      color: '#2A9D8F',
    },
    {
      id: 2,
      title: 'Level 2',
      subtitle: t('secondYear'),
      description: t('secondYearDesc'),
      icon: '📚',
      color: '#E9C46A',
    },
    {
      id: 3,
      title: 'Level 3',
      subtitle: t('thirdYear'),
      description: t('thirdYearDesc'),
      icon: '🚀',
      color: '#F4A261',
    },
  ];

  const handleLevelSelect = (levelId) => {
    navigate(`/study-hub?level=${levelId}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-background)' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <ReturnButton />
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="fade-in">
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {t('selectLevel')}
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {t('selectLevelDesc')}
          </p>
        </div>

        {/* Level Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {levels.map((level, index) => (
            <div
              key={level.id}
              className="level-tile fade-in"
              onClick={() => handleLevelSelect(level.id)}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                cursor: 'pointer',
              }}
            >
              {/* Icon */}
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}>
                {level.icon}
              </div>
              
              {/* Level Title */}
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: `linear-gradient(135deg, ${level.color} 0%, var(--secondary) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.5rem',
              }}>
                {level.title}
              </h2>
              
              {/* Subtitle */}
              <p style={{ 
                color: 'var(--text-primary)', 
                fontWeight: '600',
                fontSize: '1.1rem',
                marginBottom: '0.75rem',
              }}>
                {level.subtitle}
              </p>
              
              {/* Description */}
              <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.95rem',
                lineHeight: '1.5',
              }}>
                {level.description}
              </p>

              {/* Hover Arrow */}
              <div style={{
                marginTop: '1.5rem',
                color: 'var(--primary)',
                fontSize: '1.5rem',
                transition: 'var(--transition)',
              }}>
                →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;
