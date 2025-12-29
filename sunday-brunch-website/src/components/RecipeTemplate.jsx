import { useState, useMemo } from 'react'
import ToolsUsed from './ToolsUsed'
import RelatedContent from './RelatedContent'
import JumpToRecipe from './JumpToRecipe'
import SheltieTip from './SheltieTip'
import RecipeCalculator from './RecipeCalculator'
import { WashiTape, PawPrint } from './illustrations/Decorations'
import PinterestButton from './PinterestButton'
import RecipeReviews from './RecipeReviews'
import ProcessStep from './ProcessStep'
import IngredientAlchemist from './IngredientAlchemist'
import { trackPrint, trackCopy } from '../lib/analytics'
import './RecipeTemplate.css'

function RecipeTemplate({ recipe }) {
    const [copied, setCopied] = useState(false)
    const [checkedIngredients, setCheckedIngredients] = useState({})

    const recipeSchema = useMemo(() => {
        return {
            "@context": "https://schema.org/",
            "@type": "Recipe",
            "name": recipe.title,
            "image": [recipe.image],
            "author": {
                "@type": "Person",
                "name": "Sunday Brunch with Giselle"
            },
            "datePublished": recipe.date || "2024-12-29",
            "description": recipe.story ? recipe.story[0] : "",
            "prepTime": recipe.times?.prepISO || "PT20M",
            "cookTime": recipe.times?.cookISO || "PT30M",
            "totalTime": recipe.times?.totalISO || "PT50M",
            "recipeYield": recipe.yield,
            "recipeCategory": "Dessert",
            "recipeCuisine": "Whimsical",
            "recipeIngredient": recipe.ingredients.map(ing =>
                `${ing.amount} ${ing.unit} ${ing.name}`
            ),
            "recipeInstructions": recipe.steps.map(step => ({
                "@type": "HowToStep",
                "text": step
            }))
        };
    }, [recipe]);

    const toggleIngredient = (idx) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }))
    }

    const handleCopy = () => {
        const text = recipe.ingredients.join('\n')
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            trackCopy({ type: 'ingredients', recipe: recipe.slug })
        }).catch(() => {
            trackCopy({ type: 'ingredients', recipe: recipe.slug, error: true })
        })
        setTimeout(() => setCopied(false), 1500)
    }

    const handlePrint = () => {
        trackPrint({ type: 'recipe', slug: recipe.slug })
        window.print()
    }

    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(recipeSchema)}
            </script>
            <JumpToRecipe />
            <div className="recipe-container">
                {/* Magical Watercolor Floaters */}
                <div className="watercolor-float w-bubble-1"></div>
                <div className="watercolor-float w-bubble-2"></div>
                <div className="watercolor-float w-bubble-3"></div>

                {/* Decorative Paw Prints Background */}
                <PawPrint className="bg-decor bg-paw-1" color="var(--pastel-sky)" />
                <PawPrint className="bg-decor bg-paw-2" color="var(--soft-sakura)" />

                <div className="recipe scrapbook-paper" id="jump-to-recipe">
                    <WashiTape className="tape-top-center" color="var(--pastel-lavender)" />
                    <PinterestButton
                        url={window.location.href}
                        description={`Check out this amazing ${recipe.title} from Sunday Brunch With Giselle!`}
                        image={recipe.image}
                    />

                    <div className="recipe__header">
                        <div>
                            <h3 className="recipe__title">{recipe.title}</h3>
                            {recipe.times && (
                                <p className="recipe__meta">
                                    Prep {recipe.times.prep} | Cook {recipe.times.cook} | Total {recipe.times.total} | Yield {recipe.yield}
                                </p>
                            )}
                        </div>
                        <button className="pill" onClick={handlePrint}>Print</button>
                    </div>

                    {recipe.story && (
                        <div className="story">
                            {recipe.story.map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))}
                        </div>
                    )}

                    {/* Baker's Prep / Mise en Place */}
                    <div className="bakers-prep">
                        <div className="bakers-prep__header">
                            <PawPrint width="20" height="20" color="var(--terracotta-spark)" />
                            <h4>Baker's Prep</h4>
                        </div>
                        <ul className="bakers-prep__list">
                            <li>Ensure all ingredients marked "room temperature" are properly softened.</li>
                            <li>Preheat your oven 20 minutes before baking.</li>
                            <li>Measure ingredients accurately (we recommend using the Metric/Weight toggle!).</li>
                        </ul>
                    </div>

                    {/* Example Sheltie Tip - can be customized per recipe */}
                    <SheltieTip character="giselle">
                        <p>Darling, if you're going to make this, do it properly. No shortcuts. We're not animals... well, <em>I</em> am, but I have standards.</p>
                    </SheltieTip>

                    <div className="recipe__actions">
                        <button className="recipe__action" onClick={handleCopy}>
                            {copied ? 'Copied ingredients' : 'Copy ingredients'}
                        </button>
                        <button className="recipe__action" onClick={handlePrint}>Print recipe</button>
                    </div>

                    <div className="recipe__two-col">
                        <div>
                            <h4>Ingredients</h4>
                            <RecipeCalculator
                                initialIngredients={recipe.ingredients}
                                initialYield={recipe.yield}
                            />
                            <IngredientAlchemist />
                        </div>
                        <div>
                            <h4>Steps</h4>
                            <div className="recipe__steps-container">
                                {recipe.steps.map((step, idx) => (
                                    <ProcessStep
                                        key={idx}
                                        stepNumber={idx + 1}
                                        content={typeof step === 'string' ? step : step.content}
                                        image={step.image}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Science tip from Phaedra */}
                    <SheltieTip character="phaedra">
                        <p>The key to this recipe is temperature control. When chocolate cools too quickly, it can seize. Patience, friends!</p>
                    </SheltieTip>

                    <div className="recipe__extras">
                    </div>

                    <RecipeReviews recipeSlug={recipe.slug} />
                </div>

                <div className="recipe__extras">
                    <ToolsUsed tools={recipe.tools} />
                    <RelatedContent related={recipe.related} seasonal={recipe.seasonal} />
                </div>

                <WashiTape className="tape-bottom-center" color="var(--pastel-sky)" />
            </div>
        </>
    )
}

export default RecipeTemplate
