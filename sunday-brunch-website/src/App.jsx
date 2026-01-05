import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import RecipePage from './pages/RecipePage'
import RecipeIndexPage from './pages/RecipeIndexPage'
import EpisodePage from './pages/EpisodePage'
import MediaKitPage from './pages/MediaKitPage'
import TeamPage from './pages/TeamPage'
import NewsletterPage from './pages/NewsletterPage'
import AlchemistsLab from './pages/AlchemistsLab'
import NotFound from './pages/NotFound'
import { trackPageView } from './lib/analytics'
import { AchievementProvider } from './components/AchievementToaster'

function App() {
    const location = useLocation()

    useEffect(() => {
        trackPageView(location.pathname)
        window.scrollTo(0, 0)
    }, [location.pathname])

    return (
        <AchievementProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipes" element={<RecipeIndexPage />} />
                    <Route path="/recipes/:slug" element={<RecipePage />} />
                    <Route path="/episodes/:slug" element={<EpisodePage />} />
                    <Route path="/media-kit" element={<MediaKitPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/newsletter" element={<NewsletterPage />} />
                    <Route path="/lab" element={<AlchemistsLab />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </AchievementProvider>
    )
}

export default App
