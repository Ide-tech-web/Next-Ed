// Student Questions Page — Thread View, Glassmorphism Bubbles, i18n

import React, { useState, useEffect } from 'react';
import { questionAPI, courseAPI } from '../utils/api';
import { Loading, ErrorMessage, SuccessMessage } from '../components/SharedComponents';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';
import { useLanguage } from '../context/LanguageContext';

const Questions = () => {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    course: '',
    question_text: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedThreads, setExpandedThreads] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [questionsRes, coursesRes] = await Promise.all([
        questionAPI.getMyQuestions(),
        courseAPI.getAll(),
      ]);
      setQuestions(questionsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const dataToSend = {
        ...formData,
        course: formData.course || null,
      };
      await questionAPI.create(dataToSend);
      setSuccess(t('questionSent'));
      setFormData({ course: '', question_text: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      setError(t('questionError'));
    }
  };

  const toggleThread = (questionId) => {
    setExpandedThreads(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  if (loading) return <><Navbar /><Loading /></>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '900px' }}>
        <ReturnButton />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('myQuestions')}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {t('questionsHelp')}
        </p>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        {/* Ask Question Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ marginBottom: '2rem' }}
        >
          {showForm ? t('cancelBtn') : t('askQuestionBtn')}
        </button>

        {/* Question Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{t('newQuestion')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('courseOptional')}</label>
                <select
                  className="input-field"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="">{t('selectCourse')}</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('yourQuestion')}</label>
                <textarea
                  className="input-field"
                  rows="6"
                  placeholder={t('questionPlaceholder')}
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {t('sendQuestion')}
              </button>
            </form>
          </div>
        )}

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
              {t('noQuestionsYet')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((question) => (
              <div key={question.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                    {new Date(question.created_at).toLocaleDateString()}
                    {question.course && ` • ${t('courseId')}: ${question.course}`}
                  </p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: question.status === 'ANSWERED' ? 'var(--success)' : 'var(--warning)',
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                  }}>
                    {question.status === 'ANSWERED' ? t('answeredStatus') : t('pendingStatus')}
                  </span>
                </div>

                {/* Question Bubble — Teal Glassmorphism */}
                <div style={{
                  background: 'rgba(42, 157, 143, 0.1)',
                  border: '1px solid rgba(42, 157, 143, 0.25)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '1rem 1rem 1rem 0.25rem',
                  padding: '1rem 1.25rem',
                  marginBottom: '0.75rem',
                }}>
                  <p style={{ margin: 0, color: 'var(--text-primary)' }}>{question.question_text}</p>
                </div>

                {/* Thread — inline expandable */}
                {question.responses && question.responses.length > 0 && (
                  <>
                    <button
                      onClick={() => toggleThread(question.id)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', marginBottom: '0.75rem' }}
                    >
                      💬 {expandedThreads[question.id] ? t('hideThread') : t('showThread')} ({question.responses.length})
                    </button>

                    {expandedThreads[question.id] && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {question.responses.map((resp) => (
                          <div key={resp.id} style={{
                            background: 'rgba(244, 162, 97, 0.1)',
                            border: '1px solid rgba(244, 162, 97, 0.25)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '1rem 1rem 0.25rem 1rem',
                            padding: '0.875rem 1.125rem',
                            marginLeft: '1.5rem',
                          }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                              ✍️ {resp.admin_name || resp.admin_email || 'Admin'}
                              {resp.admin_role ? ` (${resp.admin_role})` : ''}
                              {' • '}
                              {new Date(resp.created_at).toLocaleString()}
                            </p>
                            <p style={{ margin: 0, color: 'var(--text-primary)' }}>{resp.response_text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {question.status !== 'ANSWERED' && question.responses?.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
                    {t('noResponseYet')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
