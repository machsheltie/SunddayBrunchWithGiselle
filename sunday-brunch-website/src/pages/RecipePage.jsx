import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RecipeTemplate from '../components/RecipeTemplate'
import CTAForm from '../components/CTAForm'
import ShareBar from '../components/ShareBar'
import { getRecipeBySlug } from '../lib/content'
import { applyMeta, applyRecipeSchema } from '../lib/seo'

function RecipePage() {
    const { slug } = useParams()
    const [recipe, setRecipe] = useState(null)
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        setStatus('loading')
        getRecipeBySlug(slug).then((data) => {
            if (data) {
                setRecipe(data)
                applyMeta({
                    title: `${data.title} | Sunday Brunch With Giselle`,
                    description: data.meta?.description,
                    ogImage: data.meta?.ogImage,
                    canonical: `/recipes/${data.slug}`
                })
                applyRecipeSchema(data)
                setStatus('ready')
            } else {
                setRecipe(null)
                setStatus('missing')
            }
        })
    }, [slug])

    return (
        <section className="section">
            <div className="section__header">
                <h1 className="section__title">Recipe</h1>
                <span className="pill">{status === 'ready' ? 'Fresh' : status === 'loading' ? 'Loading' : 'Not found'}</span>
            </div>
            <div className="card">
                {status === 'loading' && <p className="small-muted">Loading recipe...</p>}
                {status === 'missing' && <p className="small-muted">We could not find that recipe.</p>}
                {status === 'ready' && recipe && (
                    <>
                        <RecipeTemplate recipe={recipe} />
                        <ShareBar />
                        <CTAForm headline="Get recipes, Sunday letters, early drops" />
                    </>
                )}
            </div>
        </section>
    )
}

export default RecipePage
