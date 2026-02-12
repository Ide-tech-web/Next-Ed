// Student Dashboard - Main Page with Real-time Search

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { courseAPI, progressAPI } from '../utils/api';
import { Loading, CourseCard } from '../components/SharedComponents';
import Navbar from '../components/Navbar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialLevel = searchParams.get('level') || '';
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState([]);

  const fetchCourses = React.useCallback(async () => {
    try {
      const params = selectedLevel ? { level: selectedLevel } : {};
      const response = await courseAPI.getAll(params);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedLevel]);

  const fetchProgress = React.useCallback(async () => {
    try {
      const response = await progressAPI.getMyProgress();
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchProgress();
  }, [fetchCourses, fetchProgress]);

  // Real-time search filter with debounce effect
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;
    
    const term = searchTerm.toLowerCase();
    return courses.filter(course => 
      course.title.toLowerCase().includes(term) ||
      course.description?.toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  // Calculate progress stats
  const completedLessons = progress.filter(p => p.completed && p.lesson).length;
  const totalProgress = courses.length > 0 
    ? Math.round((completedLessons / Math.max(courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0), 1)) * 100)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-background)' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Welcome Section */}
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
            {t('welcome')}, {user?.first_name}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            {t('welcomeSubtitle')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚</div>
            <h3 style={{ 
              color: 'var(--primary)', 
              marginBottom: '0.25rem',
              fontSize: '2rem',
              fontWeight: '700'
            }}>
              {courses.length}
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('courses')}</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
            <h3 style={{ 
              color: 'var(--secondary)', 
              marginBottom: '0.25rem',
              fontSize: '2rem',
              fontWeight: '700'
            }}>
              {totalProgress}%
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('progress')}</p>
            <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
              <div className="progress-bar-fill" style={{ width: `${totalProgress}%` }}></div>
            </div>
          </div>

          <Link to="/questions" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ textAlign: 'center', height: '100%' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
              <h3 style={{ color: 'var(--info)', marginBottom: '0.25rem' }}>{t('questions')}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('askQuestion')}</p>
            </div>
          </Link>
        </div>

        {/* Search & Filter Section */}
        <div style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '1rem', 
          alignItems: 'center' 
        }}>
          {/* Real-time Search */}
          <div className="search-container" style={{ flex: '1', minWidth: '250px' }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={t('searchCourses')}
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Level Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedLevel('')}
              className={`btn ${!selectedLevel ? 'btn-primary' : 'btn-secondary'}`}
            >
              {t('allLevels')}
            </button>
            {[1, 2, 3].map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(String(level))}
                className={`btn ${selectedLevel === String(level) ? 'btn-accent' : 'btn-secondary'}`}
              >
                {t('level')} {level}
              </button>
            ))}
          </div>
        </div>

        {/* Courses List */}
        <h2 style={{ 
          fontSize: '1.875rem', 
          marginBottom: '1.5rem', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {t('courses')} 
          {searchTerm && (
            <span style={{ 
              fontSize: '1rem', 
              color: 'var(--text-muted)',
              fontWeight: '400'
            }}>
              ({filteredCourses.length} {t('results')})
            </span>
          )}
        </h2>

        {loading ? (
          <Loading />
        ) : filteredCourses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                {searchTerm 
                ? t('noCourses')
                : t('noCourses')
              }
            </p>
            {searchTerm && (
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '1rem' }}
                onClick={() => setSearchTerm('')}
              >
                {t('clearSearch')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-2">
            {filteredCourses.map((course, index) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                style={{ textDecoration: 'none' }}
                className="fade-in"
              >
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
