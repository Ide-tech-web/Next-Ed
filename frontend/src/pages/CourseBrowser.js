import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import PDFViewer from '../components/PDFViewer';

const CourseBrowser = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        // Mock fetch - replace with real API
        setTimeout(() => {
            const mockCourses = [
                { id: 1, title: "Introduction to Computer Science", code: "CSC101", level: 1, description: "Foundational concepts of computing.", thumbnail: "https://via.placeholder.com/300" },
                { id: 2, title: "Data Structures & Algorithms", code: "CSC201", level: 2, description: "Arrays, lists, trees, and graphs.", thumbnail: "https://via.placeholder.com/300" },
                { id: 3, title: "Database Management Systems", code: "CSC301", level: 3, description: "SQL, NoSQL, and normalization.", thumbnail: "https://via.placeholder.com/300" },
                { id: 4, title: "Web Development Basics", code: "CSC102", level: 1, description: "HTML, CSS, and JavaScript fundamentals.", thumbnail: "https://via.placeholder.com/300" },
            ];
            setCourses(mockCourses);
            setLoading(false);
        }, 800);
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              course.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = selectedLevel === 'All' || course.level === parseInt(selectedLevel);
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="container mx-auto px-4 py-8 relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Courses 📚</h1>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input 
                    type="text" 
                    placeholder="Search by title or code..." 
                    className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-primary"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option value="All">All Levels</option>
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                </select>
                <Button variant="primary">Search</Button>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="text-center text-gray-500">Loading courses...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <GlassCard key={course.id} hoverEffect={true} className="flex flex-col h-full">
                            {/* Thumbnail Placeholder */}
                            <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-1 rounded">
                                    {course.code}
                                </span>
                                <span className="text-xs font-semibold text-gray-500">
                                    Level {course.level}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">{course.description}</p>
                            
                            <div className="flex gap-2 mt-auto">
                                <Button variant="outline" className="flex-1">
                                    View Course
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    className="flex-1"
                                    onClick={() => setSelectedPdf('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf')}
                                >
                                    Syllabus
                                </Button>
                            </div>
                        </GlassCard>
                    ))}
                    
                    {filteredCourses.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-8">
                            No courses found matching your criteria.
                        </div>
                    )}
                </div>
            )}

            {/* PDF Viewer Modal */}
            {selectedPdf && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">Course Syllabus</h3>
                            <button 
                                onClick={() => setSelectedPdf(null)}
                                className="text-gray-500 hover:text-gray-700 font-bold text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6 bg-gray-100 flex justify-center">
                            <PDFViewer fileUrl={selectedPdf} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseBrowser;
