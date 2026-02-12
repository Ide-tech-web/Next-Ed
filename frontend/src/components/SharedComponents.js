// Reusable Components with Enhanced Styling

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--app-background)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component
export const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--app-background)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return isAdmin() ? children : <Navigate to="/dashboard" />;
};

// Delegate Route Component (allows Admin + Delegate)
export const DelegateRoute = ({ children }) => {
  const { isStaff, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--app-background)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return isStaff() ? children : <Navigate to="/dashboard" />;
};

// Loading Spinner Component
export const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
    <div className="spinner"></div>
  </div>
);

// Error Message Component
export const ErrorMessage = ({ message }) => (
  <div style={{
    padding: '1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--danger)',
    borderRadius: '0.75rem',
    color: 'var(--danger)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  }}>
    <span style={{ fontSize: '1.25rem' }}>⚠️</span>
    {message}
  </div>
);

// Success Message Component
export const SuccessMessage = ({ message }) => (
  <div style={{
    padding: '1rem',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid var(--success)',
    borderRadius: '0.75rem',
    color: 'var(--success)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  }}>
    <span style={{ fontSize: '1.25rem' }}>✅</span>
    {message}
  </div>
);

// Course Card Component with Enhanced Styling
export const CourseCard = ({ course, onClick }) => (
  <div className="card" onClick={onClick} style={{ cursor: 'pointer', height: '100%' }}>
    {/* Thumbnail */}
    {course.thumbnail && (
      <div style={{
        height: '120px',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        marginBottom: '1rem',
        background: 'var(--bg-tertiary)',
      }}>
        <img 
          src={course.thumbnail} 
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    )}
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
      <h3 style={{ 
        color: 'var(--text-primary)', 
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: '600',
      }}>
        {course.title}
      </h3>
      <span style={{
        padding: '0.25rem 0.75rem',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: 'white',
        whiteSpace: 'nowrap',
      }}>
        Level {course.level}
      </span>
    </div>
    <p style={{ 
      color: 'var(--text-secondary)', 
      margin: 0,
      fontSize: '0.95rem',
      lineHeight: '1.5',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }}>
      {course.description}
    </p>
    
    {/* Course meta */}
    <div style={{ 
      marginTop: '1rem', 
      display: 'flex', 
      gap: '1rem',
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
    }}>
      {course.lessons && (
        <span>📖 {course.lessons.length} leçons</span>
      )}
      {course.quizzes && course.quizzes.length > 0 && (
        <span>📝 {course.quizzes.length} quiz</span>
      )}
    </div>
  </div>
);

// Material Card Component
export const MaterialCard = ({ material, type, onDownload, onDelete, isAdmin }) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
      <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
        {material.title}
      </h4>
      <span style={{
        padding: '0.25rem 0.75rem',
        background: 'var(--bg-tertiary)',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        fontWeight: '600',
        color: 'var(--text-secondary)',
      }}>
        {type}
      </span>
    </div>
    {material.description && (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0', lineHeight: '1.5' }}>
        {material.description}
      </p>
    )}
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      {(material.file || material.file_url) && (
        <a
          href={material.file_url || material.file}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          📥 Télécharger
        </a>
      )}
      {isAdmin && onDelete && (
        <button
          onClick={onDelete}
          className="btn btn-danger"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          🗑️ Supprimer
        </button>
      )}
    </div>
  </div>
);

// File Upload Component
export const FileUpload = ({ label, onChange, accept = ".pdf,.doc,.docx" }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      type="file"
      onChange={onChange}
      accept={accept}
      className="input-field"
      style={{ padding: '0.5rem' }}
    />
  </div>
);

// Mark as Completed Button
export const MarkCompleteButton = ({ completed, onComplete, loading }) => (
  <button
    onClick={onComplete}
    disabled={loading || completed}
    className={`btn ${completed ? 'btn-success' : 'btn-accent'}`}
    style={{ 
      opacity: loading ? 0.7 : 1,
      cursor: loading ? 'wait' : completed ? 'default' : 'pointer',
    }}
  >
    {loading ? (
      <>⏳ Chargement...</>
    ) : completed ? (
      <>✅ Terminé</>
    ) : (
      <>✓ Marquer comme terminé</>
    )}
  </button>
);
