// Admin - Answer Questions — with Thread History & Glassmorphism Bubbles

import React, { useState, useEffect } from 'react';
import { questionAPI, responseAPI } from '../utils/api';
import { Loading, ErrorMessage, SuccessMessage } from '../components/SharedComponents';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';
import { useLanguage } from '../context/LanguageContext';

const AdminQuestions = () => {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState({});

  const fetchQuestions = React.useCallback(async () => {
    try {
      const params = filter ? { status: filter } : {};
      const response = await questionAPI.getAllQuestions(params);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const toggleThread = (questionId) => {
    setExpandedThreads(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await responseAPI.create({
        question: selectedQuestion.id,
        response_text: responseText,
      });
      setSuccess(t('responseSent'));
      setResponseText('');
      setSelectedQuestion(null);
      fetchQuestions();
    } catch (error) {
      setError(t('responseError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <><Navbar /><Loading /></>;

  const pendingCount = questions.filter(q => q.status === 'PENDING').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '1000px' }}>
        <ReturnButton />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('studentQuestions')}</h1>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('PENDING')}
            className={`btn ${filter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
          >
            ⏳ {t('pending')} ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('ANSWERED')}
            className={`btn ${filter === 'ANSWERED' ? 'btn-primary' : 'btn-secondary'}`}
          >
            ✓ {t('answered')}
          </button>
          <button
            onClick={() => setFilter('')}
            className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t('all')}
          </button>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
              {filter === 'PENDING' ? t('noPendingQuestions') : t('noQuestions')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((question) => (
              <div key={question.id} className="card">
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {t('from')}: {question.student_email || 'Student'} • {new Date(question.created_at).toLocaleDateString()}
                      </p>
                      {question.course && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          {t('courseId')}: {question.course}
                        </p>
                      )}
                    </div>
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
                    <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{question.question_text}</p>
                  </div>
                </div>

                {/* Thread History inline */}
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
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

                {/* Reply Button */}
                <button
                  onClick={() => setSelectedQuestion(question)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  💬 {t('reply')}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Response Modal */}
        {selectedQuestion && (
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
          }} onClick={() => setSelectedQuestion(null)}>
            <div
              className="card"
              style={{ maxWidth: '600px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: '1rem' }}>{t('replyToQuestion')}</h3>
              
              <div style={{
                background: 'rgba(42, 157, 143, 0.1)',
                border: '1px solid rgba(42, 157, 143, 0.25)',
                padding: '1rem',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
              }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {t('studentQuestion')}
                </p>
                <p style={{ margin: 0 }}>{selectedQuestion.question_text}</p>
              </div>

              <form onSubmit={handleSubmitResponse}>
                <div className="form-group">
                  <label className="form-label">{t('yourResponse')}</label>
                  <textarea
                    className="input-field"
                    rows="6"
                    placeholder={t('responsePlaceholder')}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ flex: 1, minWidth: '140px' }}
                  >
                    {submitting ? t('sending') : t('sendResponse')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedQuestion(null)}
                    className="btn btn-secondary"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;
