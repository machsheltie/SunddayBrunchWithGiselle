import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home' // Load immediately (critical)
import WhimsicalLoader from './components/WhimsicalLoader'
import { trackPageView } from './lib/analytics'
import { initWebVitals } from './lib/webVitals'
import { AchievementProvider } from './components/AchievementToaster'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Code splitting: Lazy load pages that aren't immediately needed
// This reduces initial bundle size while keeping ALL magic intact
const RecipePage = lazy(() => import('./pages/RecipePage'))
const RecipeIndexPage = lazy(() => import('./pages/RecipeIndexPage'))
const EpisodePage = lazy(() => import('./pages/EpisodePage'))
const MediaKitPage = lazy(() => import('./pages/MediaKitPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const AboutPage = lazy(() => import('./pages/About'))
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'))
const AlchemistsLab = lazy(() => import('./pages/AlchemistsLab'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const PerformanceDashboard = lazy(() => import('./components/PerformanceDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
    const location = useLocation()

    // Initialize Web Vitals monitoring once on mount
    useEffect(() => {
        initWebVitals()
    }, [])

    // Track page views and scroll to top on navigation
    useEffect(() => {
        trackPageView(location.pathname)
        window.scrollTo(0, 0)
    }, [location.pathname])

    return (
        <AuthProvider>
            <AchievementProvider>
                <Layout>
                    <Suspense fallback={<WhimsicalLoader />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/recipes" element={<RecipeIndexPage />} />
                            <Route path="/recipes/:slug" element={<RecipePage />} />
                            <Route path="/episodes/:slug" element={<EpisodePage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/media-kit" element={<MediaKitPage />} />
                            <Route path="/team" element={<TeamPage />} />
                            <Route path="/newsletter" element={<NewsletterPage />} />
                            <Route path="/lab" element={<AlchemistsLab />} />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/performance"
                                element={
                                    <ProtectedRoute>
                                        <PerformanceDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </Layout>
            </AchievementProvider>
        </AuthProvider>
    )
}

export default App
