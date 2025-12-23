import { useState } from 'react'
import ToolsUsed from './ToolsUsed'
import RelatedContent from './RelatedContent'
import JumpToRecipe from './JumpToRecipe'
import SheltieTip from './SheltieTip'
import { WashiTape, PawPrint } from './illustrations/Decorations'
import { trackPrint, trackCopy } from '../lib/analytics'
import './RecipeTemplate.css'

function RecipeTemplate({ recipe }) {
    const [copied, setCopied] = useState(false)
    const [checkedIngredients, setCheckedIngredients] = useState({})

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
                            <ul className="recipe__list">
                                {recipe.ingredients.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className={checkedIngredients[idx] ? 'is-checked' : ''}
                                        onClick={() => toggleIngredient(idx)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4>Steps</h4>
                            <ol className="recipe__steps">
                                {recipe.steps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Science tip from Phaedra */}
                    <SheltieTip character="phaedra">
                        <p>The key to this recipe is temperature control. When chocolate cools too quickly, it can seize. Patience, friends!</p>
                    </SheltieTip>

                    <div className="recipe__extras">
                    </div>
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
