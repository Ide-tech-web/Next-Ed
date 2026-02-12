// Admin Dashboard

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import { Loading } from '../components/SharedComponents';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    delegates: 0,
    admins: 0,
    pending_questions: 0,
    notes: 0,
    exercises: 0,
    exams: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <><Navbar /><Loading /></>;

  const statCards = [
    { icon: '📚', label: t('coursesCount'), value: stats.courses, color: 'var(--primary)' },
    { icon: '👤', label: t('studentsCount'), value: stats.students, color: 'var(--success)' },
    { icon: '📋', label: t('delegatesCount'), value: stats.delegates, color: 'var(--secondary)' },
    { icon: '🛡️', label: t('adminsCount'), value: stats.admins, color: 'var(--info)' },
    { icon: '💬', label: t('pendingQuestionsCount'), value: stats.pending_questions, color: 'var(--warning)' },
    { icon: '📝', label: t('notesCount'), value: stats.notes, color: 'var(--primary)' },
  ];

  const featureCards = [
    {
      icon: '📚',
      title: t('manageCourses'),
      description: t('createManageCourses'),
      link: '/admin/courses',
      borderColor: 'var(--primary)',
    },
    {
      icon: '📤',
      title: t('uploadResources'),
      description: t('uploadResourcesDesc'),
      link: '/admin/upload',
      borderColor: 'var(--secondary)',
    },
    {
      icon: '👨‍🎓',
      title: t('manageStudents'),
      description: t('manageStudentsDesc'),
      link: '/admin/students',
      borderColor: 'var(--success)',
    },
    {
      icon: '👥',
      title: t('staffManagement'),
      description: t('staffManagementDesc'),
      link: '/admin/staff',
      borderColor: '#F4A261',
    },
    {
      icon: '💬',
      title: t('answerQuestions'),
      description: `${stats.pending_questions} ${t('answerQuestionsDesc')}`,
      link: '/admin/questions',
      borderColor: 'var(--warning)',
    },
    {
      icon: '🏠',
      title: t('homeLink'),
      description: t('homeLinkDesc'),
      link: '/',
      borderColor: 'var(--info)',
    },
  ];

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
            {t('adminDashboard')} 🛡️
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            {t('welcomeAdmin')}, <strong>{user?.first_name}</strong>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
          {statCards.map((stat, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <h3 style={{ color: stat.color, fontSize: '2rem', marginBottom: '0.25rem' }}>{stat.value}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{t('quickActions')}</h2>
        <div className="grid grid-3">
          {featureCards.map((feature, idx) => (
            <Link key={idx} to={feature.link} style={{ textDecoration: 'none' }}>
              <div className="card" style={{
                height: '100%',
                borderLeft: `4px solid ${feature.borderColor}`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
