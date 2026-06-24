import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import RecipeTemplate from '../../components/RecipeTemplate';

// Mock all child components
vi.mock('../../components/ToolsUsed', () => ({
    default: ({ tools }) => <div data-testid="tools-used">{tools?.join(', ')}</div>
}));

vi.mock('../../components/RelatedContent', () => ({
    default: ({ related, seasonal }) => (
        <div data-testid="related-content">
            {related?.join(', ')} | {seasonal?.join(', ')}
        </div>
    )
}));

vi.mock('../../components/JumpToRecipe', () => ({
    default: () => <div data-testid="jump-to-recipe">Jump</div>
}));

vi.mock('../../components/SheltieTip', () => ({
    default: ({ character, children }) => (
        <div data-testid="sheltie-tip" data-character={character}>
            {children}
        </div>
    )
}));

vi.mock('../../components/RecipeCalculator', () => ({
    default: ({ initialIngredients, initialYield, onScaleChange }) => (
        <div data-testid="recipe-calculator">
            <button onClick={() => onScaleChange(2)}>Scale 2x</button>
            {initialIngredients?.length} ingredients | {initialYield}
        </div>
    )
}));

vi.mock('../../components/NutritionFacts', () => ({
    default: ({ nutrition, servingMultiplier, collapsible }) => (
        <div data-testid="nutrition-facts" data-multiplier={servingMultiplier}>
            {nutrition?.calories} cal | Collapsible: {collapsible ? 'true' : 'false'}
        </div>
    )
}));

vi.mock('../../components/DietaryBadges', () => ({
    default: ({ dietary, maxVisible }) => (
        <div data-testid="dietary-badges">
            {dietary?.slice(0, maxVisible).join(', ')}
        </div>
    )
}));

vi.mock('../../components/AllergenWarnings', () => ({
    default: ({ allergens }) => (
        <div data-testid="allergen-warnings">{allergens?.join(', ')}</div>
    )
}));

vi.mock('../../components/GiselleGuestbook', () => ({
    default: ({ recipeSlug }) => (
        <div data-testid="giselle-guestbook" data-slug={recipeSlug}>
            Guestbook
        </div>
    )
}));

vi.mock('../../components/ProcessStep', () => ({
    default: ({ stepNumber, content, image }) => (
        <div data-testid="process-step" data-step={stepNumber}>
            {content} {image && `[Image: ${image}]`}
        </div>
    )
}));

vi.mock('../../components/PinterestButton', () => ({
    default: ({ url, description, image }) => (
        <button data-testid="pinterest-button" data-url={url}>
            Pin: {description}
        </button>
    )
}));

vi.mock('../../components/illustrations/Decorations', () => ({
    WashiTape: ({ className, color }) => (
        <div data-testid="washi-tape" className={className} data-color={color}>
            Tape
        </div>
    ),
    PawPrint: ({ className, color, opacity, width, height }) => (
        <div
            data-testid="paw-print"
            className={className}
            data-color={color}
            data-opacity={opacity}
            data-width={width}
            data-height={height}
        >
            Paw
        </div>
    )
}));

// Mock analytics
vi.mock('../../lib/analytics', () => ({
    trackPrint: vi.fn(),
    trackCopy: vi.fn()
}));

// Mock CSS imports
vi.mock('../../components/RecipeTemplate.css', () => ({}));

const recipeTemplateCssPath = path.resolve(process.cwd(), 'src/components/RecipeTemplate.css');
const readRecipeTemplateCss = () => fs.readFileSync(recipeTemplateCssPath, 'utf8');

describe('RecipeTemplate', () => {
    const mockRecipe = {
        title: 'Chocolate Cake',
        slug: 'chocolate-cake',
        image: '/test-image.jpg',
        date: '2024-01-01',
        category: 'Desserts',
        yield: '8 servings',
        times: {
            prep: '20 min',
            cook: '30 min',
            total: '50 min',
            prepISO: 'PT20M',
            cookISO: 'PT30M',
            totalISO: 'PT50M'
        },
        story: ['This is a delicious chocolate cake story.'],
        ingredients: [
            { amount: '2', unit: 'cups', name: 'flour' },
            { amount: '1', unit: 'cup', name: 'sugar' }
        ],
        steps: ['Mix ingredients', 'Bake at 350°F'],
        dietary: ['Vegetarian'],
        allergens: ['Gluten', 'Dairy'],
        nutrition: {
            servingSize: '1 slice',
            calories: 250,
            totalFat: { amount: 10, unit: 'g' },
            saturatedFat: { amount: 5, unit: 'g' },
            cholesterol: { amount: 30, unit: 'mg' },
            sodium: { amount: 200, unit: 'mg' },
            totalCarbohydrates: { amount: 35, unit: 'g' },
            dietaryFiber: { amount: 2, unit: 'g' },
            totalSugars: { amount: 20, unit: 'g' },
            protein: { amount: 4, unit: 'g' }
        },
        tools: ['Mixer', 'Oven'],
        related: ['Vanilla Cake'],
        seasonal: ['Spring']
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock clipboard API
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined)
            }
        });
        // Mock window.print
        window.print = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ==========================================
    // 1. RENDERING TESTS (5 tests)
    // ==========================================

    describe('Rendering', () => {
        it('should render with complete recipe data', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);

            // Assert
            expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
            expect(screen.getByTestId('jump-to-recipe')).toBeInTheDocument();
            expect(screen.getByTestId('giselle-guestbook')).toBeInTheDocument();
        });

        it('should render recipe title and meta information', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);

            // Assert
            expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
            expect(screen.getByText(/Prep 20 min/)).toBeInTheDocument();
            expect(screen.getByText(/Cook 30 min/)).toBeInTheDocument();
            expect(screen.getByText(/Total 50 min/)).toBeInTheDocument();
            expect(screen.getByText(/Yield 8 servings/)).toBeInTheDocument();
        });

        it('should render dietary badges when provided', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);

            // Assert
            const dietaryBadges = screen.getByTestId('dietary-badges');
            expect(dietaryBadges).toBeInTheDocument();
            expect(dietaryBadges).toHaveTextContent('Vegetarian');
        });

        it('should render allergen warnings when provided', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);

            // Assert
            const allergenWarnings = screen.getByTestId('allergen-warnings');
            expect(allergenWarnings).toBeInTheDocument();
            expect(allergenWarnings).toHaveTextContent('Gluten');
            expect(allergenWarnings).toHaveTextContent('Dairy');
        });

        it('should NOT render dietary badges or allergens when embedded (the host card shows them)', () => {
            // When embedded inside the featured card, the dietary/allergen pills
            // live in the card header, so the template must not duplicate them.
            render(<RecipeTemplate recipe={mockRecipe} embedded />);

            expect(screen.queryByTestId('dietary-badges')).not.toBeInTheDocument();
            expect(screen.queryByTestId('allergen-warnings')).not.toBeInTheDocument();
        });

        it('should render expanded image when expandedImage prop provided', () => {
            // Arrange & Act
            render(
                <RecipeTemplate recipe={mockRecipe} expandedImage="/hero-image.jpg" />
            );

            // Assert
            const heroImage = screen.getByAltText('Chocolate Cake');
            expect(heroImage).toBeInTheDocument();
            expect(heroImage).toHaveAttribute('src', '/hero-image.jpg');
        });

        it('should render canonical story object with headline, prose, and blockquote', () => {
            // Arrange
            const recipeWithCanonicalStory = {
                ...mockRecipe,
                story: {
                    headline: 'The pie that started everything',
                    body: 'The first French Silk Pie I ever made was a bribe.\n\n> **Giselle:** *"A bribe."* Darling. You had me at home.\n\nI was twenty-something and trying to bake my way in.'
                }
            };

            // Act
            const { container } = render(<RecipeTemplate recipe={recipeWithCanonicalStory} />);
            const schemaScript = container.querySelector('script[type="application/ld+json"]');
            const schema = JSON.parse(schemaScript.textContent);

            // Assert
            expect(screen.getByRole('heading', { name: 'The pie that started everything' })).toBeInTheDocument();
            expect(screen.getByText('The first French Silk Pie I ever made was a bribe.')).toBeInTheDocument();
            expect(screen.getByText(/Giselle:/)).toBeInTheDocument();
            expect(screen.getByText(/Darling\. You had me at home\./)).toBeInTheDocument();
            expect(container.querySelector('.story blockquote')).toHaveTextContent('A bribe.');
            expect(schema.description).toBe('The first French Silk Pie I ever made was a bribe.');
        });
    });

    // ==========================================
    // 2. SCHEMA GENERATION TESTS (3 tests)
    // ==========================================

    describe('Schema Generation', () => {
        it('should generate correct JSON-LD schema structure', () => {
            // Arrange & Act
            const { container } = render(<RecipeTemplate recipe={mockRecipe} />);
            const schemaScript = container.querySelector('script[type="application/ld+json"]');

            // Assert
            expect(schemaScript).toBeInTheDocument();
            const schema = JSON.parse(schemaScript.textContent);
            expect(schema['@context']).toBe('https://schema.org/');
            expect(schema['@type']).toBe('Recipe');
            expect(schema.name).toBe('Chocolate Cake');
            expect(schema.recipeYield).toBe('8 servings');
            expect(schema.prepTime).toBe('PT20M');
            expect(schema.cookTime).toBe('PT30M');
            expect(schema.totalTime).toBe('PT50M');
        });

        it('should include nutrition information in schema when available', () => {
            // Arrange & Act
            const { container } = render(<RecipeTemplate recipe={mockRecipe} />);
            const schemaScript = container.querySelector('script[type="application/ld+json"]');

            // Assert
            const schema = JSON.parse(schemaScript.textContent);
            expect(schema.nutrition).toBeDefined();
            expect(schema.nutrition['@type']).toBe('NutritionInformation');
            expect(schema.nutrition.calories).toBe('250 calories');
            expect(schema.nutrition.fatContent).toBe('10g');
            expect(schema.nutrition.proteinContent).toBe('4g');
        });

        it('should include dietary information in schema when available', () => {
            // Arrange & Act
            const { container } = render(<RecipeTemplate recipe={mockRecipe} />);
            const schemaScript = container.querySelector('script[type="application/ld+json"]');

            // Assert
            const schema = JSON.parse(schemaScript.textContent);
            expect(schema.suitableForDiet).toBeDefined();
            expect(schema.suitableForDiet).toHaveLength(1);
            expect(schema.suitableForDiet[0]).toContain('Vegetarian');
        });
    });

    // ==========================================
    // 3. INTERACTIVE FEATURES (4 tests)
    // ==========================================

    describe('Interactive Features', () => {
        it('should render recipe calculator for ingredient scaling', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);

            // Assert
            expect(screen.getByTestId('recipe-calculator')).toBeInTheDocument();
        });

        it('should copy ingredients to clipboard successfully', async () => {
            // Arrange
            const { trackCopy } = await import('../../lib/analytics');
            render(<RecipeTemplate recipe={mockRecipe} />);
            const copyButton = screen.getByText('Copy ingredients');

            // Act
            fireEvent.click(copyButton);

            // Assert
            await waitFor(() => {
                expect(navigator.clipboard.writeText).toHaveBeenCalledWith('2 cups flour\n1 cup sugar');
                expect(screen.getByText('Copied ingredients')).toBeInTheDocument();
                expect(trackCopy).toHaveBeenCalledWith({
                    type: 'ingredients',
                    recipe: 'chocolate-cake'
                });
            });
        });

        it('should copy ingredients handles clipboard failure gracefully', async () => {
            // Arrange
            const { trackCopy } = await import('../../lib/analytics');
            navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Clipboard error'));
            render(<RecipeTemplate recipe={mockRecipe} />);
            const copyButton = screen.getByText('Copy ingredients');

            // Act
            fireEvent.click(copyButton);

            // Assert
            await waitFor(() => {
                expect(trackCopy).toHaveBeenCalledWith({
                    type: 'ingredients',
                    recipe: 'chocolate-cake',
                    error: true
                });
            });
        });

        it('should print recipe calls window.print and tracks analytics', async () => {
            // Arrange
            const { trackPrint } = await import('../../lib/analytics');
            render(<RecipeTemplate recipe={mockRecipe} />);
            const printButtons = screen.getAllByText(/Print/i);

            // Act - Click the first print button (header area)
            fireEvent.click(printButtons[0]);

            // Assert
            expect(window.print).toHaveBeenCalled();
            expect(trackPrint).toHaveBeenCalledWith({
                type: 'recipe',
                slug: 'chocolate-cake'
            });
        });
    });

    // ==========================================
    // 4. FIXED PANEL LAYOUT (3 tests)
    // ==========================================

    describe('Fixed Panel Layout', () => {
        it('should render ingredients as a fixed panel', () => {
            // Arrange & Act
            const { container } = render(<RecipeTemplate recipe={mockRecipe} />);
            const ingredientsHeader = screen.getByRole('heading', { name: 'Ingredients' });

            // Assert
            expect(container.querySelector('.ingredients-panel')).toContainElement(ingredientsHeader);
            expect(ingredientsHeader.closest('button')).toBeNull();
            expect(screen.getByTestId('recipe-calculator')).toBeInTheDocument();
        });

        it('should render tools and nutrition in the left column', () => {
            // Arrange & Act
            const { container } = render(<RecipeTemplate recipe={mockRecipe} />);
            const leftColumn = container.querySelector('.recipe__col-left');

            // Assert
            expect(leftColumn).toContainElement(screen.getByTestId('tools-used'));
            expect(leftColumn).toContainElement(screen.getByTestId('nutrition-facts'));
        });

        it('should render instructions and steps in the right column', () => {
            // Arrange & Act
            const { container } = render(<RecipeTemplate recipe={mockRecipe} />);
            const rightColumn = container.querySelector('.recipe__col-right');

            // Assert
            expect(rightColumn).toContainElement(
                screen.getByRole('heading', { name: 'Instructions' })
            );
            screen.getAllByTestId('process-step').forEach((step) => {
                expect(rightColumn).toContainElement(step);
            });
        });
    });

    describe('Mobile Layout Guardrails', () => {
        it('should use active mobile selectors for the live recipe grid', () => {
            // Arrange & Act
            const css = readRecipeTemplateCss();
            const mobileBlocks = css.match(/@media\s*\(max-width:\s*(?:720|768)px\)\s*\{[\s\S]*?\n\}/g) || [];
            const combinedMobileCss = mobileBlocks.join('\n');

            // Assert
            expect(combinedMobileCss).toContain('.recipe__main-grid');
            expect(combinedMobileCss).not.toContain('.recipe__two-col');
        });

        it('should keep copy and print actions large enough for touch on mobile', () => {
            // Arrange & Act
            const css = readRecipeTemplateCss();

            // Assert
            expect(css).toMatch(/\.recipe__action\s*\{[\s\S]*min-height:\s*44px/);
            expect(css).toMatch(/\.recipe__actions\s*\{[\s\S]*flex-wrap:\s*wrap/);
        });

        it('should preserve embedded mode without standalone mobile spacing', () => {
            // Arrange & Act
            const { container } = render(<RecipeTemplate recipe={mockRecipe} embedded />);

            // Assert
            expect(container.querySelector('.recipe-container--embedded')).toBeInTheDocument();
            expect(container.querySelector('.recipe--embedded')).toBeInTheDocument();
            expect(container.querySelector('.scrapbook-paper')).not.toBeInTheDocument();
            expect(container.querySelector('.tape-top-center-wrapper')).not.toBeInTheDocument();
        });
    });

    // ==========================================
    // 5. CHILD COMPONENT INTEGRATION (3 tests)
    // ==========================================

    describe('Child Component Integration', () => {
        it('should pass correct props to RecipeCalculator', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);
            const calculator = screen.getByTestId('recipe-calculator');

            // Assert
            expect(calculator).toBeInTheDocument();
            expect(calculator).toHaveTextContent('2 ingredients');
            expect(calculator).toHaveTextContent('8 servings');
        });

        it('should pass numeric yield quantity to RecipeCalculator when provided', () => {
            // Arrange
            const recipeWithStructuredYield = {
                ...mockRecipe,
                yield: '8 slices',
                yieldQuantity: 8
            };

            // Act
            render(<RecipeTemplate recipe={recipeWithStructuredYield} />);

            // Assert
            expect(screen.getByTestId('recipe-calculator')).toHaveTextContent('2 ingredients | 8');
        });

        it('should pass correct props to NutritionFacts', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);
            const nutritionFacts = screen.getByTestId('nutrition-facts');

            // Assert
            expect(nutritionFacts).toBeInTheDocument();
            expect(nutritionFacts).toHaveTextContent('250 cal');
            expect(nutritionFacts).toHaveTextContent('Collapsible: false');
            expect(nutritionFacts).toHaveAttribute('data-multiplier', '1');
        });

        it('should render ProcessStep components for each recipe step', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);
            const steps = screen.getAllByTestId('process-step');

            // Assert
            expect(steps).toHaveLength(2);
            expect(steps[0]).toHaveAttribute('data-step', '1');
            expect(steps[0]).toHaveTextContent('Mix ingredients');
            expect(steps[1]).toHaveAttribute('data-step', '2');
            expect(steps[1]).toHaveTextContent('Bake at 350°F');
        });
    });

    // ==========================================
    // 6. EDGE CASES (2 tests)
    // ==========================================

    describe('Edge Cases', () => {
        it('should handle recipe without nutrition data', () => {
            // Arrange
            const recipeWithoutNutrition = { ...mockRecipe, nutrition: null };

            // Act
            render(<RecipeTemplate recipe={recipeWithoutNutrition} />);

            // Assert - Should not render nutrition facts
            expect(screen.queryByTestId('nutrition-facts')).not.toBeInTheDocument();
            // Schema should still be valid
            const { container } = render(<RecipeTemplate recipe={recipeWithoutNutrition} />);
            const schemaScript = container.querySelector('script[type="application/ld+json"]');
            const schema = JSON.parse(schemaScript.textContent);
            expect(schema.nutrition).toBeUndefined();
        });

        it('should handle recipe without dietary restrictions', () => {
            // Arrange
            const recipeWithoutDietary = { ...mockRecipe, dietary: null, allergens: null };

            // Act
            render(<RecipeTemplate recipe={recipeWithoutDietary} />);

            // Assert - Should not render dietary badges or allergen warnings
            expect(screen.queryByTestId('dietary-badges')).not.toBeInTheDocument();
            expect(screen.queryByTestId('allergen-warnings')).not.toBeInTheDocument();
        });
    });

    // ==========================================
    // BONUS: SERVING MULTIPLIER INTEGRATION
    // ==========================================

    describe('Serving Multiplier Integration', () => {
        it('should update NutritionFacts multiplier when RecipeCalculator scale changes', async () => {
            // Arrange
            render(<RecipeTemplate recipe={mockRecipe} />);
            const calculator = screen.getByTestId('recipe-calculator');
            const scaleButton = screen.getByText('Scale 2x');

            // Assert - Initial multiplier is 1
            expect(screen.getByTestId('nutrition-facts')).toHaveAttribute('data-multiplier', '1');

            // Act - Scale to 2x
            fireEvent.click(scaleButton);

            // Assert - Multiplier updated to 2
            await waitFor(() => {
                expect(screen.getByTestId('nutrition-facts')).toHaveAttribute('data-multiplier', '2');
            });
        });
    });

    // ==========================================
    // SHELTIE SEGMENTS
    // ==========================================

    describe('Sheltie Segments', () => {
        it('should render the default example tips when recipe has no shelties data', () => {
            // Arrange & Act
            render(<RecipeTemplate recipe={mockRecipe} />);
            const tips = screen.getAllByTestId('sheltie-tip');
            const characters = tips.map((t) => t.getAttribute('data-character'));

            // Assert - the two legacy example tips (Giselle top, Phaedra below grid)
            expect(characters).toEqual(['giselle', 'phaedra']);
            expect(screen.getByText(/I have standards/)).toBeInTheDocument();
        });

        it('should render all four named segments when recipe.shelties is provided', () => {
            // Arrange
            const recipeWithShelties = {
                ...mockRecipe,
                shelties: {
                    havok: 'HAVOK_RECON_TEXT',
                    tiana: 'TIANA_TASTING_TEXT',
                    phaedra: ['PHAEDRA_PORCH_TEXT'],
                    giselleVerdict: 'GISELLE_VERDICT_TEXT'
                }
            };

            // Act
            render(<RecipeTemplate recipe={recipeWithShelties} />);
            const tips = screen.getAllByTestId('sheltie-tip');
            const characters = tips.map((t) => t.getAttribute('data-character'));

            // Assert - Havok up top, then Tiana, Phaedra, and Giselle's verdict
            expect(characters).toEqual(['havok', 'tiana', 'phaedra', 'giselle']);
            expect(screen.getByText('HAVOK_RECON_TEXT')).toBeInTheDocument();
            expect(screen.getByText('TIANA_TASTING_TEXT')).toBeInTheDocument();
            expect(screen.getByText('PHAEDRA_PORCH_TEXT')).toBeInTheDocument();
            expect(screen.getByText('GISELLE_VERDICT_TEXT')).toBeInTheDocument();
            // The legacy example copy should be gone once real segments exist
            expect(screen.queryByText(/I have standards/)).not.toBeInTheDocument();
        });

        it('should render canonical characterSegments without recipe.shelties', () => {
            // Arrange
            const recipeWithCharacterSegments = {
                ...mockRecipe,
                characterSegments: [
                    {
                        characterId: 'CHAR-004-havok',
                        segment: "Havok's Kitchen Recon",
                        title: 'Gear check',
                        body: 'CANON_HAVOK_TEXT',
                        canonVersion: 'CANON-2026-06-11.1'
                    },
                    {
                        characterId: 'CHAR-003-tiana',
                        segment: "Tiana's Tasting Notes",
                        title: 'The first bite',
                        body: 'CANON_TIANA_TEXT',
                        canonVersion: 'CANON-2026-06-11.1'
                    },
                    {
                        characterId: 'CHAR-002-phaedra',
                        segment: "Phaedra's Porch Light",
                        title: 'Why it works',
                        body: ['CANON_PHAEDRA_TEXT'],
                        canonVersion: 'CANON-2026-06-11.1'
                    },
                    {
                        characterId: 'CHAR-001-giselle',
                        segment: "Giselle's Grand Verdict",
                        title: 'The final word',
                        body: 'CANON_GISELLE_TEXT',
                        canonVersion: 'CANON-2026-06-11.1'
                    }
                ]
            };

            // Act
            render(<RecipeTemplate recipe={recipeWithCharacterSegments} />);
            const tips = screen.getAllByTestId('sheltie-tip');
            const characters = tips.map((t) => t.getAttribute('data-character'));

            // Assert - canonical segments render in the page's fixed anchor order
            expect(characters).toEqual(['havok', 'tiana', 'phaedra', 'giselle']);
            expect(screen.getByText('CANON_HAVOK_TEXT')).toBeInTheDocument();
            expect(screen.getByText('CANON_TIANA_TEXT')).toBeInTheDocument();
            expect(screen.getByText('CANON_PHAEDRA_TEXT')).toBeInTheDocument();
            expect(screen.getByText('CANON_GISELLE_TEXT')).toBeInTheDocument();
            expect(screen.queryByText(/I have standards/)).not.toBeInTheDocument();
        });
    });
});
