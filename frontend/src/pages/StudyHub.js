
import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import ProgressBar from '../components/ProgressBar';
import AuthContext from '../context/AuthContext';

const StudyHub = () => {
    const { user, authTokens } = useContext(AuthContext);
    const [stats, setStats] = useState({
        completedLessons: 0,
        averageQuizScore: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mock data for now - replace with actual API call
                // const response = await fetch('http://127.0.0.1:8000/api/progress/', {
                //     headers: { 'Authorization': `Bearer ${authTokens.access}` }
                // });
                // const data = await response.json();
                
                // Simulating API delay
                setTimeout(() => {
                    setStats({
                        completedLessons: 12,
                        averageQuizScore: 85,
                        recentActivity: [
                            { id: 1, title: 'Intro to Python', type: 'Lesson', date: '2 hours ago' },
                            { id: 2, title: 'Data Structures Quiz', type: 'Quiz', score: 90, date: 'Yesterday' },
                            { id: 3, title: 'Advanced Algorithms', type: 'Lesson', date: '2 days ago' },
                        ]
                    });
                    setLoading(false);
                }, 1000);

            } catch (error) {
                console.error("Error fetching stats:", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user, authTokens]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-teal-primary">Loading Study Hub...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.first_name || 'Student'}! 🚀</h1>
                <p className="text-gray-600 mb-8">Ready to continue your learning journey?</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Progress Overview */}
                    <GlassCard className="col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold text-teal-primary mb-4">Your Progress</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">Level 1 Completion</span>
                                    <span className="text-sm font-medium text-teal-600">75%</span>
                                </div>
                                <ProgressBar progress={75} color="bg-teal-primary" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">Overall Quiz Score</span>
                                    <span className="text-sm font-medium text-orange-accent">{stats.averageQuizScore}%</span>
                                </div>
                                <ProgressBar progress={stats.averageQuizScore} color="bg-orange-accent" />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Quick Stats */}
                    <GlassCard>
                        <h2 className="text-xl font-semibold text-teal-primary mb-4">Quick Stats</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white bg-opacity-40 rounded-lg">
                                <span className="text-gray-700">Lessons Completed</span>
                                <span className="text-2xl font-bold text-teal-600">{stats.completedLessons}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white bg-opacity-40 rounded-lg">
                                <span className="text-gray-700">Study Streak</span>
                                <span className="text-2xl font-bold text-orange-accent">3 Days 🔥</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Recent Activity */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.recentActivity.map((activity) => (
                        <GlassCard key={activity.id} hoverEffect={true} className="cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${activity.type === 'Quiz' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>
                                    {activity.type}
                                </span>
                                <span className="text-xs text-gray-500">{activity.date}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{activity.title}</h3>
                            {activity.score && (
                                <p className="text-sm text-gray-600">Score: <span className="font-bold text-teal-600">{activity.score}%</span></p>
                            )}
                        </GlassCard>
                    ))}
                </div>

            </motion.div>
        </div>
    );
};

export default StudyHub;
