// Course Detail Page - View Materials

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI } from '../utils/api';
import { Loading, MaterialCard } from '../components/SharedComponents';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');

  const fetchCourseData = React.useCallback(async () => {
    try {
      const [courseRes, materialsRes] = await Promise.all([
        courseAPI.getById(id),
        courseAPI.getMaterials(id),
      ]);
      setCourse(courseRes.data);
      setMaterials(materialsRes.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  if (loading) return <><Navbar /><Loading /></>;

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Cours non trouvé</p>
        </div>
      </>
    );
  }

  const tabs = [
    { key: 'notes', label: 'Notes', icon: '📝', count: materials?.notes?.length || 0 },
    { key: 'exercises', label: 'Exercices', icon: '✏️', count: materials?.exercises?.length || 0 },
    { key: 'exams', label: 'Examens', icon: '📋', count: materials?.exams?.length || 0 },
    { key: 'lessons', label: 'Leçons', icon: '🎓', count: materials?.lessons?.length || 0 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Course Header */}
        <ReturnButton />

        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{course.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                {course.description}
              </p>
            </div>
            <span style={{
              padding: '0.5rem 1rem',
              background: 'var(--primary)',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
            }}>
              Niveau {course.level}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab.icon} {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Materials Display */}
        {activeTab === 'notes' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Notes de cours</h2>
            {materials?.notes?.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>Aucune note disponible</p>
              </div>
            ) : (
              <div className="grid grid-2">
                {materials?.notes?.map((note) => (
                  <MaterialCard
                    key={note.id}
                    material={note}
                    type="Note"
                    isAdmin={isAdmin()}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exercises' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Exercices (TDs)</h2>
            {materials?.exercises?.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>Aucun exercice disponible</p>
              </div>
            ) : (
              <div className="grid grid-2">
                {materials?.exercises?.map((exercise) => (
                  <MaterialCard
                    key={exercise.id}
                    material={exercise}
                    type="Exercice"
                    isAdmin={isAdmin()}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exams' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Examens</h2>
            {materials?.exams?.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>Aucun examen disponible</p>
              </div>
            ) : (
              <div className="grid grid-2">
                {materials?.exams?.map((exam) => (
                  <MaterialCard
                    key={exam.id}
                    material={exam}
                    type={`Examen ${exam.year || ''}`}
                    isAdmin={isAdmin()}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'lessons' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Leçons</h2>
            {materials?.lessons?.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>Aucune leçon disponible</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {materials?.lessons?.map((lesson) => (
                  <div key={lesson.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{lesson.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                          {lesson.content?.substring(0, 200)}...
                        </p>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}>
                        Ordre: {lesson.order}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
