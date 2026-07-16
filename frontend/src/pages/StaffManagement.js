// Staff Management Page - Admin Only
// Create and manage Delegate and Admin accounts

import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Loading } from '../components/SharedComponents';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'DELEGATE',
    level: 1,
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await adminAPI.getUsers();
      const staffUsers = response.data.filter(u => u.role === 'DELEGATE' || u.role === 'ADMIN');
      setStaff(staffUsers);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      await adminAPI.createStaff(formData);
      setFormSuccess(`${formData.role === 'DELEGATE' ? 'Délégué' : 'Admin'} créé avec succès !`);
      setFormData({ email: '', first_name: '', last_name: '', password: '', role: 'DELEGATE', level: 1 });
      fetchStaff();
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess('');
      }, 2000);
    } catch (error) {
      const errMsg = error.response?.data
        ? typeof error.response.data === 'object'
          ? Object.values(error.response.data).flat().join(', ')
          : error.response.data
        : 'Erreur lors de la création du compte.';
      setFormError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Supprimer le compte de ${userName} ? Cette action est irréversible.`)) return;
    try {
      await adminAPI.deleteUser(userId);
      setStaff(staff.filter(s => s.id !== userId));
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la suppression.');
    }
  };

  if (loading) return <><Navbar /><Loading /></>;

  const delegates = staff.filter(s => s.role === 'DELEGATE');
  const admins = staff.filter(s => s.role === 'ADMIN');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <ReturnButton to="/admin" />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Gestion du Personnel 👥
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              Créer et gérer les comptes Délégués et Administrateurs
            </p>
          </div>
          <button
            className="btn btn-accent"
            onClick={() => setShowForm(!showForm)}
            style={{ fontSize: '1rem' }}
          >
            {showForm ? '✕ Fermer' : '+ Nouveau Membre'}
          </button>
        </div>

        {/* Create Staff Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--secondary)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Créer un Compte Personnel
            </h3>
            
            {formError && (
              <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: '#fca5a5', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}
            {formSuccess && (
              <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.5rem', color: '#6ee7b7', marginBottom: '1rem' }}>
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Prénom</label>
                  <input className="input-field" type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Nom</label>
                  <input className="input-field" type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email</label>
                  <input className="input-field" type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Mot de passe</label>
                  <input className="input-field" type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Rôle</label>
                  <select className="input-field" name="role" value={formData.role} onChange={handleChange}>
                    <option value="DELEGATE">Délégué</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                {formData.role === 'DELEGATE' && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Niveau Assigné</label>
                    <select className="input-field" name="level" value={formData.level} onChange={handleChange}>
                      <option value={1}>Level 1</option>
                      <option value={2}>Level 2</option>
                      <option value={3}>Level 3</option>
                    </select>
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-accent" disabled={submitting}>
                {submitting ? '⏳ Création...' : '✓ Créer le Compte'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
            <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.25rem' }}>{staff.length}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Personnel</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
            <h3 style={{ color: 'var(--secondary)', fontSize: '2rem', marginBottom: '0.25rem' }}>{delegates.length}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Délégués</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
            <h3 style={{ color: 'var(--info)', fontSize: '2rem', marginBottom: '0.25rem' }}>{admins.length}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Administrateurs</p>
          </div>
        </div>

        {/* Delegates Table */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>📋 Délégués</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(42, 157, 143, 0.15)', borderBottom: '2px solid var(--glass-border)' }}>
                <th style={tealHeaderStyle}>Nom</th>
                <th style={tealHeaderStyle}>Email</th>
                <th style={tealHeaderStyle}>Niveau</th>
                <th style={tealHeaderStyle}>Date</th>
                <th style={tealHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {delegates.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Aucun délégué</td></tr>
              ) : (
                delegates.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={avatarStyle('var(--secondary)')}>{d.first_name?.[0]?.toUpperCase() || 'D'}</div>
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{d.first_name} {d.last_name}</span>
                      </div>
                    </td>
                    <td style={cellStyle}><span style={{ color: 'var(--text-secondary)' }}>{d.email}</span></td>
                    <td style={cellStyle}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600', background: 'rgba(42,157,143,0.15)', color: 'var(--primary)' }}>
                        Level {d.level}
                      </span>
                    </td>
                    <td style={cellStyle}><span style={{ color: 'var(--text-muted)' }}>{new Date(d.date_joined).toLocaleDateString('fr-FR')}</span></td>
                    <td style={cellStyle}>
                      <button onClick={() => handleDelete(d.id, `${d.first_name} ${d.last_name}`)} className="btn" style={orangeDeleteBtn}>
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Admins Table */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>🛡️ Administrateurs</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(42, 157, 143, 0.15)', borderBottom: '2px solid var(--glass-border)' }}>
                <th style={tealHeaderStyle}>Nom</th>
                <th style={tealHeaderStyle}>Email</th>
                <th style={tealHeaderStyle}>Date</th>
                <th style={tealHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Aucun administrateur</td></tr>
              ) : (
                admins.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={avatarStyle('var(--info)')}>{a.first_name?.[0]?.toUpperCase() || 'A'}</div>
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{a.first_name} {a.last_name}</span>
                      </div>
                    </td>
                    <td style={cellStyle}><span style={{ color: 'var(--text-secondary)' }}>{a.email}</span></td>
                    <td style={cellStyle}><span style={{ color: 'var(--text-muted)' }}>{new Date(a.date_joined).toLocaleDateString('fr-FR')}</span></td>
                    <td style={cellStyle}>
                      <button onClick={() => handleDelete(a.id, `${a.first_name} ${a.last_name}`)} className="btn" style={orangeDeleteBtn}>
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Teal header styling
const tealHeaderStyle = {
  padding: '1rem',
  textAlign: 'left',
  fontWeight: '600',
  color: '#2A9D8F',
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const cellStyle = {
  padding: '1rem',
  verticalAlign: 'middle',
};

const orangeDeleteBtn = {
  background: 'linear-gradient(135deg, #F4A261, #E76F51)',
  color: 'white',
  fontSize: '0.8rem',
  padding: '0.4rem 0.85rem',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
};

const avatarStyle = (bg) => ({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: '600',
  fontSize: '0.9rem',
  flexShrink: 0,
});

export default StaffManagement;
