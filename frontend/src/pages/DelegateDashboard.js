// Delegate Dashboard - Level-scoped view for Delegates

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { courseAPI } from '../utils/api';
import api from '../utils/api';
import { Loading } from '../components/SharedComponents';
import Navbar from '../components/Navbar';

const DelegateDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ courses: 0, notes: 0, exercises: 0, exams: 0 });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [coursesRes, statsRes] = await Promise.all([
        courseAPI.getAll({ level: user.level }),
        api.get('/stats/'),
      ]);
      setCourses(coursesRes.data?.results || coursesRes.data || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching delegate data:', error);
    } finally {
      setLoading(false);
    }
  }, [user.level]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <><Navbar /><Loading /></>;

  const levelCourses = Array.isArray(courses) ? courses : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {t('dashboard')} 📋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            {t('welcomeAdmin')}, <strong>{user.first_name}</strong> — {t('level')} <strong>{user.level}</strong>
          </p>
        </div>

        {/* Level Badge */}
        <div className="card" style={{
          marginBottom: '2rem',
          borderLeft: '4px solid var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'white',
          }}>
            L{user.level}
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem', fontSize: '1.25rem' }}>
              {t('delegatesCount')} {t('level')} {user.level}
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {t('createManageCourses')}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚</div>
            <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.25rem' }}>
              {levelCourses.length}
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('coursesCount')} {t('level')} {user.level}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
            <h3 style={{ color: 'var(--success)', fontSize: '2rem', marginBottom: '0.25rem' }}>
              {stats.students || 0}
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('studentsCount')}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
            <h3 style={{ color: 'var(--warning)', fontSize: '2rem', marginBottom: '0.25rem' }}>
              {stats.pending_questions || 0}
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('pendingQuestionsCount')}</p>
          </div>
        </div>

        {/* Actions */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{t('quickActions')}</h2>
        <div className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
          <Link to="/admin/courses" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ height: '100%', borderLeft: '4px solid var(--primary)', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('manageCourses')}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('level')} {user.level}</p>
            </div>
          </Link>
          <Link to="/admin/upload" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ height: '100%', borderLeft: '4px solid var(--secondary)', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('uploadResources')}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('uploadResourcesDesc')}</p>
            </div>
          </Link>
          <Link to="/admin/questions" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ height: '100%', borderLeft: '4px solid var(--warning)', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('answerQuestions')}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{stats.pending_questions || 0} {t('answerQuestionsDesc')}</p>
            </div>
          </Link>
        </div>

        {/* Course List */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          {t('coursesCount')} {t('level')} {user.level} ({levelCourses.length})
        </h2>
        {levelCourses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              {t('noCourses')}
            </p>
            <Link to="/admin/courses" className="btn btn-accent" style={{ marginTop: '1rem', display: 'inline-flex', textDecoration: 'none' }}>
              + {t('createCourse')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {levelCourses.map(course => (
              <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.15rem' }}>{course.title}</h3>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      color: 'white',
                      fontWeight: '600',
                    }}>
                      L{course.level}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>
                  <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {course.lessons?.length || 0} {t('lessons')} • {course.quizzes?.length || 0} {t('quiz')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DelegateDashboard;
