// Admin - Manage Courses

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../utils/api';
import { Loading, ErrorMessage, SuccessMessage } from '../components/SharedComponents';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';
import { useLanguage } from '../context/LanguageContext';

const ManageCourses = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: '1',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', level: '1' });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level.toString(),
    });
    setEditingId(course.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await courseAPI.update(editingId, formData);
        setSuccess(t('courseUpdated') || 'Cours mis à jour avec succès !');
      } else {
        await courseAPI.create(formData);
        setSuccess(t('courseCreated') || 'Cours créé avec succès !');
      }
      resetForm();
      fetchCourses();
    } catch (error) {
      setError(error.response?.data?.detail || (editingId ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete') || 'Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    try {
      await courseAPI.delete(id);
      setSuccess(t('courseDeleted') || 'Cours supprimer avec succès');
      fetchCourses();
    } catch (error) {
      setError('Erreur lors de la suppression du cours');
    }
  };

  const handleManageResources = (id) => {
      navigate(`/admin/upload?courseId=${id}`);
  };

  if (loading) return <><Navbar /><Loading /></>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '1000px' }}>
        <ReturnButton />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('manageCourses')}</h1>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <button
          onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
          }}
          className="btn btn-primary"
          style={{ marginBottom: '2rem' }}
        >
          {showForm ? `${t('cancel')}` : `➕ ${t('createCourse') || 'Créer un nouveau cours'}`}
        </button>

        {/* Create/Edit Course Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>
                {editingId ? (t('editCourse') || 'Modifier le cours') : (t('newCourse') || 'Nouveau cours')}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('title')}</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Introduction à Python"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('description')}</label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder="Description détaillée du cours..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('level')}</label>
                <select
                  className="input-field"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="1">Niveau 1</option>
                  <option value="2">Niveau 2</option>
                  <option value="3">Niveau 3</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                    {editingId ? (t('save') || 'Enregistrer') : (t('create') || 'Créer')}
                </button>
                <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={resetForm}
                >
                    {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses List */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('allCourses') || 'Tous les cours'}</h2>
        {courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Aucun cours créé pour le moment</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0 }}>{course.title}</h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: 'var(--primary)',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}>
                        {t('level')} {course.level}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                      {course.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => handleManageResources(course.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                        📤 {t('manageResources') || 'Gérer les ressources'}
                    </button>
                    <button
                        onClick={() => handleEdit(course)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                        ✏️ {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="btn btn-danger"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      🗑️ {t('delete')}
                    </button>
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

export default ManageCourses;
