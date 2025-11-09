import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const LoginPage = lazy(() => import('./pages/login'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const PostView = lazy(() => import('./pages/PostView'));
const NewPost = lazy(() => import('./pages/NewPost'));
const EditPost = lazy(() => import('./pages/EditPost'));
// Note: BlogPost is loaded via page-level wrappers (NewPost/EditPost)

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin-only route
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gray-50">
              <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route 
                    path="/new" 
                    element={
                      <AdminRoute>
                        <NewPost />
                      </AdminRoute>
                    } 
                  />
                  <Route 
                    path="/edit/:id" 
                    element={
                      <ProtectedRoute>
                        <EditPost />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/posts/:id" element={<PostView />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
