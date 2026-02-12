// Personal Dashboard - Stats & Profile Settings

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { courseAPI, progressAPI } from '../utils/api';
import { Loading } from '../components/SharedComponents';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';

const PersonalDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, progressRes] = await Promise.all([
          courseAPI.getAll(),
          progressAPI.getMyProgress(),
        ]);
        setCourses(coursesRes.data);
        setProgress(progressRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedLessons = progress.filter(p => p.completed && p.lesson).length;
  const completedQuizzes = progress.filter(p => p.completed && p.quiz).length;
  const totalItems = courses.reduce((acc, c) => acc + (c.lessons?.length || 0) + (c.quizzes?.length || 0), 0);
  const totalProgress = totalItems > 0
    ? Math.round(((completedLessons + completedQuizzes) / totalItems) * 100)
    : 0;

  if (loading) return <><Navbar /><Loading /></>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-background)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <ReturnButton to="/study-hub" />

        {/* Header */}
        <div style={{ marginBottom: '2rem' }} className="fade-in">
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {t('myDashboard')} 📊
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            {t('personalStats')}, <strong>{user?.first_name} {user?.last_name}</strong>
          </p>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '1.5rem',
            flexShrink: 0,
          }}>
            {user?.first_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
              {user?.first_name} {user?.last_name}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
            <span style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.2rem 0.75rem',
              background: 'rgba(42, 157, 143, 0.15)',
              color: 'var(--primary)',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: '600',
            }}>
              {t('level')} {user?.level || 1} • {user?.role || 'STUDENT'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚</div>
            <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.25rem' }}>
              {courses.length}
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('courses')}</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
            <h3 style={{ color: 'var(--success)', fontSize: '2rem', marginBottom: '0.25rem' }}>
              {completedLessons + completedQuizzes}
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('completedItems')}</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
            <h3 style={{ color: 'var(--secondary)', fontSize: '2rem', marginBottom: '0.25rem' }}>
              {totalProgress}%
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('overallProgress')}</p>
            <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
              <div className="progress-bar-fill" style={{ width: `${totalProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Detailed Progress */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          {t('completedItems')}
        </h2>

        {progress.filter(p => p.completed).length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('noProgressYet')}</p>
            <Link to="/study-hub" className="btn btn-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
              🏠 {t('studyHub')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {progress.filter(p => p.completed).map((item) => (
              <div key={item.id} className="card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: item.lesson ? 'rgba(42, 157, 143, 0.15)' : 'rgba(244, 162, 97, 0.15)',
                      color: item.lesson ? 'var(--primary)' : 'var(--secondary)',
                      marginRight: '0.5rem',
                    }}>
                      {item.lesson ? t('lesson') : t('quiz')}
                    </span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {item.lesson_title || item.quiz_title || `ID: ${item.lesson || item.quiz}`}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {item.score > 0 && (
                      <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                        {t('score')}: {item.score}%
                      </span>
                    )}
                    <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✅</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDashboard;
