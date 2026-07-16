// Admin - Upload Materials

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseAPI, noteAPI, exerciseAPI, examAPI } from '../utils/api';
import { Loading, ErrorMessage, SuccessMessage } from '../components/SharedComponents';
import Navbar from '../components/Navbar';
import ReturnButton from '../components/ReturnButton';
import { useLanguage } from '../context/LanguageContext';

const UploadMaterials = () => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const initialCourseId = searchParams.get('courseId') || '';

    const [activeTab, setActiveTab] = useState('notes'); // notes, exercises, exams
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course: initialCourseId,
        level: '1',
        file: null,
        // Exam specific
        exam_type: 'SN',
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    // When course changes, update level automatically if possible
    useEffect(() => {
        if (formData.course) {
            const selectedCourse = courses.find(c => c.id.toString() === formData.course.toString());
            if (selectedCourse) {
                setFormData(prev => ({ ...prev, level: selectedCourse.level.toString() }));
            }
        }
    }, [formData.course, courses]);

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

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('course', formData.course);
        data.append('level', formData.level);
        if (formData.file) {
            data.append('file', formData.file);
        }

        try {
            if (activeTab === 'notes') {
                await noteAPI.create(data);
            } else if (activeTab === 'exercises') {
                await exerciseAPI.create(data);
            } else if (activeTab === 'exams') {
                data.append('exam_type', formData.exam_type);
                data.append('year', formData.year);
                await examAPI.create(data);
            }
            setSuccess(t('uploadSuccess') || 'Ressource uploadée avec succès !');
            // Reset form but keep course/level
            setFormData(prev => ({
                ...prev,
                title: '',
                description: '',
                file: null
            }));
             // Reset file input manually
             document.getElementById('fileInput').value = '';
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.detail || 'Erreur lors de l\'upload');
        } finally {
            setLoading(false);
        }
    };

    if (loading && courses.length === 0) return <><Navbar /><Loading /></>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '800px' }}>
                <ReturnButton />
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('uploadResources')}</h1>

                {error && <ErrorMessage message={error} />}
                {success && <SuccessMessage message={success} />}

                <div className="tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                    <button
                        className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        📝 {t('notes') || 'Cours & Notes'}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'exercises' ? 'active' : ''}`}
                        onClick={() => setActiveTab('exercises')}
                    >
                        💪 {t('exercises') || 'T.P & Exercices'}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
                        onClick={() => setActiveTab('exams')}
                    >
                       🎓 {t('exams') || 'Examens (CC/SN)'}
                    </button>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit}>
                         <div className="form-group">
                            <label className="form-label">{t('course') || 'Cours associé'}</label>
                            <select
                                className="input-field"
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                required
                            >
                                <option value="">Sélectionner un cours</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.title} (Niveau {course.level})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {activeTab === 'exams' && (
                             <div className="grid grid-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Type d'examen</label>
                                    <select
                                        className="input-field"
                                        value={formData.exam_type}
                                        onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                                    >
                                        <option value="SN">Session Normale (SN)</option>
                                        <option value="CC">Contrôle Continu (CC)</option>
                                        <option value="SR">Rattrapage (SR)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Année / Session</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        placeholder="2023"
                                    />
                                </div>
                             </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">{t('title')}</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder={activeTab === 'exams' ? "Ex: Algèbre 2023" : "Titre du document"}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('description')}</label>
                            <textarea
                                className="input-field"
                                rows="3"
                                placeholder="Description optionnelle..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="form-group">
                             <label className="form-label">{t('file')}</label>
                             <input
                                type="file"
                                id="fileInput"
                                className="input-field"
                                onChange={handleFileChange}
                                required
                                style={{ paddingTop: '0.5rem' }}
                             />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            {loading ? 'Upload en cours...' : `Uploader ${activeTab === 'notes' ? 'le cours' : activeTab === 'exercises' ? 'l\'exercice' : 'l\'examen'}`}
                        </button>
                    </form>
                </div>
            </div>

            <style jsx="true">{`
                .tab-btn {
                    padding: 0.5rem 1.5rem;
                    background: none;
                    border: none;
                    border-bottom: 3px solid transparent;
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .tab-btn:hover {
                    color: var(--primary);
                    background: rgba(0,0,0,0.05);
                }
                .tab-btn.active {
                    color: var(--primary);
                    border-bottom-color: var(--primary);
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default UploadMaterials;
