import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Classification from './pages/Classification';
import NewProject from './pages/NewProject';

import { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f6f6]">
                <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/auth" />;
    }

    return <>{children}</>;
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/new-project"
                        element={
                            <ProtectedRoute>
                                <NewProject />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/classification"
                        element={
                            <ProtectedRoute>
                                <Classification />
                            </ProtectedRoute>
                        }
                    />
                    {/* Catch all route - redirect to root */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
