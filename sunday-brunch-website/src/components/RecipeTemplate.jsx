import { useState, useMemo } from 'react'
import ToolsUsed from './ToolsUsed'
import RelatedContent from './RelatedContent'
import JumpToRecipe from './JumpToRecipe'
import SheltieTip from './SheltieTip'
import RecipeCalculator from './RecipeCalculator'
import NutritionFacts from './NutritionFacts'
import DietaryBadges from './DietaryBadges'
import AllergenWarnings from './AllergenWarnings'
import { WashiTape, PawPrint } from './illustrations/Decorations'
import PinterestButton from './PinterestButton'
import GiselleGuestbook from './GiselleGuestbook'
import ProcessStep from './ProcessStep'
import IngredientAlchemist from './IngredientAlchemist'
import ThePantry from './ThePantry'
import { trackPrint, trackCopy } from '../lib/analytics'
import './RecipeTemplate.css'

function RecipeTemplate({ recipe, expandedImage }) {
    const [copied, setCopied] = useState(false)
    const [checkedIngredients, setCheckedIngredients] = useState({})
    const [servingMultiplier, setServingMultiplier] = useState(1)
    const [isPantryOpen, setIsPantryOpen] = useState(false)
    const [isIngredientsOpen, setIsIngredientsOpen] = useState(true)
    const [isTransmutationsOpen, setIsTransmutationsOpen] = useState(false)

    const recipeSchema = useMemo(() => {
        const schema = {
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

        // Add nutrition information if available
        if (recipe.nutrition) {
            schema.nutrition = {
                "@type": "NutritionInformation",
                "servingSize": recipe.nutrition.servingSize,
                "calories": `${recipe.nutrition.calories} calories`,
                "fatContent": `${recipe.nutrition.totalFat.amount}${recipe.nutrition.totalFat.unit}`,
                "saturatedFatContent": `${recipe.nutrition.saturatedFat.amount}${recipe.nutrition.saturatedFat.unit}`,
                "cholesterolContent": `${recipe.nutrition.cholesterol.amount}${recipe.nutrition.cholesterol.unit}`,
                "sodiumContent": `${recipe.nutrition.sodium.amount}${recipe.nutrition.sodium.unit}`,
                "carbohydrateContent": `${recipe.nutrition.totalCarbohydrates.amount}${recipe.nutrition.totalCarbohydrates.unit}`,
                "fiberContent": `${recipe.nutrition.dietaryFiber.amount}${recipe.nutrition.dietaryFiber.unit}`,
                "sugarContent": `${recipe.nutrition.totalSugars.amount}${recipe.nutrition.totalSugars.unit}`,
                "proteinContent": `${recipe.nutrition.protein.amount}${recipe.nutrition.protein.unit}`
            };
        }

        // Add dietary information if available
        if (recipe.dietary && recipe.dietary.length > 0) {
            schema.suitableForDiet = recipe.dietary.map(diet =>
                `https://schema.org/${diet.replace(/\s+/g, '').replace(/-/g, '')}Diet`
            );
        }

        return schema;
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
                    <div className="tape-top-center-wrapper">
                        <WashiTape className="tape-top-center" color="var(--pastel-lavender)" />
                        {/* Scattered pawprints on the tape for scrapbook charm */}
                        <PawPrint className="tape-paw paw-1" color="var(--midnight-lavender)" opacity="0.25" width="12" height="12" />
                        <PawPrint className="tape-paw paw-2" color="var(--midnight-lavender)" opacity="0.2" width="10" height="10" />
                        <PawPrint className="tape-paw paw-3" color="var(--midnight-lavender)" opacity="0.3" width="14" height="14" />
                        <PawPrint className="tape-paw paw-4" color="var(--midnight-lavender)" opacity="0.22" width="11" height="11" />
                        <PawPrint className="tape-paw paw-5" color="var(--midnight-lavender)" opacity="0.28" width="13" height="13" />
                    </div>
                    <PinterestButton
                        url={window.location.href}
                        description={`Check out this amazing ${recipe.title} from Sunday Brunch With Giselle!`}
                        image={recipe.image}
                    />

                    {/* Expanded Recipe Image */}
                    {expandedImage && (
                        <div className="recipe__hero-image">
                            <img src={expandedImage} alt={recipe.title} />
                        </div>
                    )}

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

                    {/* Dietary Badges */}
                    {recipe.dietary && recipe.dietary.length > 0 && (
                        <DietaryBadges dietary={recipe.dietary} maxVisible={5} />
                    )}

                    {/* Allergen Warnings */}
                    {recipe.allergens && recipe.allergens.length > 0 && (
                        <AllergenWarnings allergens={recipe.allergens} />
                    )}

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
                            <PawPrint width="20" height="20" color="var(--midnight-lavender)" />
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
                            {/* Collapsible: The Alchemist's Pantry */}
                            <div className="collapsible-section">
                                <button
                                    className="collapsible-header"
                                    onClick={() => setIsPantryOpen(!isPantryOpen)}
                                    aria-expanded={isPantryOpen}
                                >
                                    <h4>The Alchemist's Pantry</h4>
                                    <span className={`chevron ${isPantryOpen ? 'open' : ''}`}>▼</span>
                                </button>
                                <div className={`collapsible-content ${isPantryOpen ? 'open' : ''}`}>
                                    <ThePantry ingredients={recipe.ingredients} />
                                </div>
                            </div>

                            {/* Collapsible: Ingredients */}
                            <div className="collapsible-section">
                                <button
                                    className="collapsible-header"
                                    onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
                                    aria-expanded={isIngredientsOpen}
                                >
                                    <h4>Ingredients</h4>
                                    <span className={`chevron ${isIngredientsOpen ? 'open' : ''}`}>▼</span>
                                </button>
                                <div className={`collapsible-content ${isIngredientsOpen ? 'open' : ''}`}>
                                    <RecipeCalculator
                                        initialIngredients={recipe.ingredients}
                                        initialYield={recipe.yield}
                                        onScaleChange={setServingMultiplier}
                                    />
                                </div>
                            </div>

                            {/* Collapsible: Ingredients Transmutations */}
                            <div className="collapsible-section">
                                <button
                                    className="collapsible-header"
                                    onClick={() => setIsTransmutationsOpen(!isTransmutationsOpen)}
                                    aria-expanded={isTransmutationsOpen}
                                >
                                    <h4>Ingredients Transmutations</h4>
                                    <span className={`chevron ${isTransmutationsOpen ? 'open' : ''}`}>▼</span>
                                </button>
                                <div className={`collapsible-content ${isTransmutationsOpen ? 'open' : ''}`}>
                                    <IngredientAlchemist />
                                </div>
                            </div>

                            {/* Nutrition Facts (synced with recipe calculator) */}
                            {recipe.nutrition && (
                                <NutritionFacts
                                    nutrition={recipe.nutrition}
                                    servingMultiplier={servingMultiplier}
                                    collapsible={true}
                                />
                            )}
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

                    <GiselleGuestbook recipeSlug={recipe.slug} />
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
