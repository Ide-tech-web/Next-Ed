// Admin Student Management Page — View Info + Delete + i18n

import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Loading } from '../components/SharedComponents';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';
import { useLanguage } from '../context/LanguageContext';

const AdminStudentManagement = () => {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInfo = async (studentId) => {
    setDetailLoading(true);
    try {
      const response = await adminAPI.getUserDetail(studentId);
      setSelectedStudent(response.data);
    } catch (error) {
      console.error('Error fetching student detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (studentId, firstName, lastName) => {
    if (!window.confirm(`${t('deleteConfirm')} ${firstName} ${lastName}${t('deleteIrreversible')}`)) return;
    
    try {
      await adminAPI.deleteUser(studentId);
      fetchStudents();
    } catch (error) {
      alert(t('deleteError'));
    }
  };

  const filteredStudents = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const started = students.filter(s => (s.progress || 0) > 0).length;
  const avgProgress = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / students.length)
    : 0;

  if (loading) return <><Navbar /><Loading /></>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <ReturnButton />

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {t('studentManagement')} 👨‍🎓
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {t('studentManagementDesc')}
        </p>

        {/* Stats Row */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📚</div>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{totalStudents}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{t('totalStudents')}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🚀</div>
            <h3 style={{ color: 'var(--secondary)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{started}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{t('haveStarted')}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📊</div>
            <h3 style={{ color: 'var(--success)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{avgProgress}%</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{t('averageProgress')}</p>
          </div>
        </div>

        {/* Search */}
        <div className="search-container" style={{ marginBottom: '2rem', maxWidth: '100%' }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder={t('searchByNameOrEmail')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Student Table — Desktop */}
        <div className="student-table-desktop">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>{t('student')}</th>
                <th style={thStyle}>{t('level')}</th>
                <th style={thStyle}>{t('progress')}</th>
                <th style={thStyle}>{t('registrationDate')}</th>
                <th style={thStyle}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td style={tdStyle}>
                    <div>
                      <strong>{s.first_name} {s.last_name}</strong>
                      <br />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.email}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '0.2rem 0.75rem',
                      background: 'rgba(42, 157, 143, 0.15)',
                      color: 'var(--primary)',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}>
                      {t('level')} {s.level || 1}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-bar" style={{ width: '80px' }}>
                        <div className="progress-bar-fill" style={{ width: `${s.progress || 0}%` }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{s.progress || 0}%</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{new Date(s.date_joined).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-primary" style={actionBtnStyle} onClick={() => handleViewInfo(s.id)}>
                        {t('viewInfo')}
                      </button>
                      <button className="btn btn-danger" style={actionBtnStyle} onClick={() => handleDelete(s.id, s.first_name, s.last_name)}>
                        {t('deleteBtn')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student Cards — Mobile */}
        <div className="student-cards-mobile" style={{ display: 'none' }}>
          {filteredStudents.map((s) => (
            <div key={s.id} className="card" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                  <strong>{s.first_name} {s.last_name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>{s.email}</p>
                </div>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  background: 'rgba(42, 157, 143, 0.15)',
                  color: 'var(--primary)',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}>
                  {t('level')} {s.level || 1}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-bar-fill" style={{ width: `${s.progress || 0}%` }}></div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{s.progress || 0}%</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" style={{ ...actionBtnStyle, flex: 1 }} onClick={() => handleViewInfo(s.id)}>
                  {t('viewInfo')}
                </button>
                <button className="btn btn-danger" style={{ ...actionBtnStyle, flex: 1 }} onClick={() => handleDelete(s.id, s.first_name, s.last_name)}>
                  {t('deleteBtn')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>{t('noStudentsFound')}</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {(selectedStudent || detailLoading) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }} onClick={() => setSelectedStudent(null)}>
          <div
            className="card"
            style={{ maxWidth: '650px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>{t('loading')}</p>
              </div>
            ) : selectedStudent && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h2 style={{ margin: 0 }}>{t('studentDetails')}</h2>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedStudent(null)}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    ✕ {t('close')}
                  </button>
                </div>

                {/* Profile Section */}
                <div style={{
                  background: 'rgba(42, 157, 143, 0.08)',
                  border: '1px solid rgba(42, 157, 143, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}>
                    {selectedStudent.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={infoLabelStyle}>{t('firstName')}</td>
                          <td style={infoValueStyle}>{selectedStudent.first_name}</td>
                        </tr>
                        <tr>
                          <td style={infoLabelStyle}>{t('lastName')}</td>
                          <td style={infoValueStyle}>{selectedStudent.last_name}</td>
                        </tr>
                        <tr>
                          <td style={infoLabelStyle}>{t('email')}</td>
                          <td style={infoValueStyle}>{selectedStudent.email}</td>
                        </tr>
                        <tr>
                          <td style={infoLabelStyle}>{t('level')}</td>
                          <td style={infoValueStyle}>{t('level')} {selectedStudent.level || 1}</td>
                        </tr>
                        <tr>
                          <td style={infoLabelStyle}>{t('overallProgress')}</td>
                          <td style={infoValueStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div className="progress-bar" style={{ width: '100px' }}>
                                <div className="progress-bar-fill" style={{ width: `${selectedStudent.progress || 0}%` }}></div>
                              </div>
                              <strong>{selectedStudent.progress || 0}%</strong>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Course Progression */}
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  📚 {t('courseProgression')} ({selectedStudent.total_completed || 0} {t('completedItems')})
                </h3>

                {(!selectedStudent.completed_items || selectedStudent.completed_items.length === 0) ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-muted)',
                    background: 'var(--glass-bg)',
                    borderRadius: '0.75rem',
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                    <p>{t('noCompletedItems')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedStudent.completed_items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        background: 'var(--glass-bg)',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--glass-border)',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}>
                        <div>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '0.25rem',
                            background: item.type === 'lesson' ? 'rgba(42, 157, 143, 0.15)' : 'rgba(244, 162, 97, 0.15)',
                            color: item.type === 'lesson' ? 'var(--primary)' : 'var(--secondary)',
                            marginRight: '0.5rem',
                            textTransform: 'uppercase',
                          }}>
                            {item.type === 'lesson' ? t('lesson') : t('quiz')}
                          </span>
                          <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.title}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                            ({item.course})
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {item.score > 0 && (
                            <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>
                              {t('score')}: {item.score}%
                            </span>
                          )}
                          <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>✅</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style jsx="true">{`
        @media (max-width: 768px) {
          .student-table-desktop {
            display: none !important;
          }
          .student-cards-mobile {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

// Shared Styles
const thStyle = {
  textAlign: 'left',
  padding: '0.875rem 0.75rem',
  color: 'var(--text-muted)',
  fontWeight: '600',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '2px solid var(--glass-border)',
};

const tdStyle = {
  padding: '0.875rem 0.75rem',
  borderBottom: '1px solid var(--glass-border)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
};

const actionBtnStyle = {
  padding: '0.35rem 0.75rem',
  fontSize: '0.8rem',
  minHeight: '36px',
};

const infoLabelStyle = {
  padding: '0.35rem 0.75rem 0.35rem 0',
  color: 'var(--text-muted)',
  fontSize: '0.85rem',
  fontWeight: '500',
  whiteSpace: 'nowrap',
};

const infoValueStyle = {
  padding: '0.35rem 0',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  fontWeight: '600',
};

export default AdminStudentManagement;
