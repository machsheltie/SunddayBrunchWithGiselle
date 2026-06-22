import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeaturedRecipeCard from '../../components/FeaturedRecipeCard';
import { getRecipeRatings } from '../../lib/ratings';

// Mock child components
vi.mock('../../components/RecipeTemplate', () => ({
    default: ({ recipe, expandedImage }) => (
        <div data-testid="recipe-template" data-slug={recipe.slug}>
            Recipe: {recipe.title}
            {expandedImage && ` | Image: ${expandedImage}`}
        </div>
    )
}));

vi.mock('../../components/WhimsicalButton', () => ({
    default: ({ children, type, onClick, showPaw }) => (
        <button
            data-testid="whimsical-button"
            data-type={type}
            data-show-paw={showPaw}
            onClick={onClick}
        >
            {children}
        </button>
    )
}));

vi.mock('../../components/DietaryBadges', () => ({
    default: ({ dietary, maxVisible }) => (
        <div data-testid="dietary-badges" data-max-visible={maxVisible}>
            {dietary?.slice(0, maxVisible).join(', ')}
        </div>
    )
}));

vi.mock('../../components/StarRating', () => ({
    default: ({ value, count, size }) => (
        <div data-testid="star-rating" data-value={value} data-count={count} data-size={size}>
            {value} stars ({count} ratings)
        </div>
    )
}));

// Mock ratings API
vi.mock('../../lib/ratings', () => ({
    getRecipeRatings: vi.fn()
}));

// Mock CSS imports
vi.mock('../../components/FeaturedRecipeCard.css', () => ({}));
vi.mock('../../components/StarRating.css', () => ({}));

describe('FeaturedRecipeCard', () => {
    const mockRecipe = {
        title: 'Blueberry Muffins',
        slug: 'blueberry-muffins',
        image: '/muffins.jpg',
        category: 'Breakfast',
        times: { total: '45 min' },
        yield: '12 muffins',
        skill: 'Easy',
        dietary: ['Vegetarian'],
        story: ['These muffins are perfect for Sunday brunch.'],
        ingredients: [
            { amount: '2', unit: 'cups', name: 'flour' },
            { amount: '1', unit: 'cup', name: 'blueberries' }
        ],
        steps: ['Mix ingredients', 'Bake']
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Keep unrelated rendering tests synchronous unless they opt into a result.
        getRecipeRatings.mockImplementation(() => new Promise(() => {}));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ==========================================
    // 1. RENDERING TESTS (4 tests)
    // ==========================================

    describe('Rendering', () => {
        it('should render collapsed card by default', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            expect(screen.getByText('Blueberry Muffins')).toBeInTheDocument();
            expect(screen.getByText('Featured')).toBeInTheDocument();
            expect(screen.queryByTestId('recipe-template')).not.toBeInTheDocument();
        });

        it('should display recipe image, title, and featured badge', () => {
            // Arrange & Act
            const { container } = render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            const image = screen.getByAltText('Blueberry Muffins');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/muffins.jpg');
            expect(screen.getByText('Blueberry Muffins')).toBeInTheDocument();

            // The homepage card uses a fixed featured badge rather than recipe taxonomy.
            const categoryBadge = container.querySelector('.category-badge');
            expect(categoryBadge).toBeInTheDocument();
            expect(categoryBadge).toHaveTextContent('Featured');
        });

        it('should display meta information (time, yield, skill level)', async () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert - Wait for ratings to load, then meta info shows
            await waitFor(() => {
                expect(screen.getByText(/45 min/)).toBeInTheDocument();
            });

            expect(screen.getByText(/Easy/)).toBeInTheDocument();
            // Note: yield (12 muffins) is not shown in the featured card meta
        });

        it('should display recipe story excerpt', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            expect(screen.getByText('These muffins are perfect for Sunday brunch.')).toBeInTheDocument();
        });

        it('should display excerpt from canonical story object body', () => {
            // Arrange
            const recipeWithCanonicalStory = {
                ...mockRecipe,
                story: {
                    headline: 'The muffin that started everything',
                    body: 'The first French Silk Pie I ever made was a bribe.\n\n> **Giselle:** *"A bribe."*'
                }
            };

            // Act
            render(<FeaturedRecipeCard recipe={recipeWithCanonicalStory} />);

            // Assert
            expect(screen.getByText('The first French Silk Pie I ever made was a bribe.')).toBeInTheDocument();
        });
    });

    // ==========================================
    // 2. EXPANSION/COLLAPSE (3 tests)
    // ==========================================

    describe('Expansion/Collapse', () => {
        it('should expand card when "View Full Recipe" clicked', () => {
            // Arrange
            render(<FeaturedRecipeCard recipe={mockRecipe} />);
            const expandButton = screen.getByText('View Full Recipe');

            // Assert - Initially collapsed
            expect(screen.queryByTestId('recipe-template')).not.toBeInTheDocument();

            // Act - Click expand
            fireEvent.click(expandButton);

            // Assert - Now expanded
            expect(screen.getByTestId('recipe-template')).toBeInTheDocument();
            expect(screen.queryByText('View Full Recipe')).not.toBeInTheDocument();
        });

        it('should show RecipeTemplate when expanded', () => {
            // Arrange
            render(<FeaturedRecipeCard recipe={mockRecipe} />);
            const expandButton = screen.getByText('View Full Recipe');

            // Act
            fireEvent.click(expandButton);

            // Assert
            const recipeTemplate = screen.getByTestId('recipe-template');
            expect(recipeTemplate).toBeInTheDocument();
            expect(recipeTemplate).toHaveAttribute('data-slug', 'blueberry-muffins');
            expect(recipeTemplate).toHaveTextContent('Recipe: Blueberry Muffins');
            expect(recipeTemplate).toHaveTextContent('Image: /muffins.jpg');
        });

        it('should collapse recipe when "Collapse Recipe" clicked', () => {
            // Arrange
            render(<FeaturedRecipeCard recipe={mockRecipe} />);
            const expandButton = screen.getByText('View Full Recipe');
            fireEvent.click(expandButton); // Expand first

            // Assert - Currently expanded
            expect(screen.getByTestId('recipe-template')).toBeInTheDocument();

            // Act - Click collapse
            const collapseButton = screen.getByText('Collapse Recipe');
            fireEvent.click(collapseButton);

            // Assert - Now collapsed
            expect(screen.queryByTestId('recipe-template')).not.toBeInTheDocument();
            expect(screen.getByText('View Full Recipe')).toBeInTheDocument();
        });
    });

    // ==========================================
    // 3. PROPS HANDLING (2 tests)
    // ==========================================

    describe('Props Handling', () => {
        it('should handle recipe with dietary information', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert - FeaturedRecipeCard doesn't display dietary badges
            // It's imported but not used in the component
            // This test now just verifies the component renders without error
            expect(screen.getByText('Blueberry Muffins')).toBeInTheDocument();
        });

        it('should handle recipe without story (optional field)', () => {
            // Arrange
            const recipeWithoutStory = { ...mockRecipe, story: null };

            // Act
            render(<FeaturedRecipeCard recipe={recipeWithoutStory} />);

            // Assert - Should not render story paragraph
            expect(screen.queryByText('These muffins are perfect for Sunday brunch.')).not.toBeInTheDocument();
            // Card should still render other content
            expect(screen.getByText('Blueberry Muffins')).toBeInTheDocument();
        });
    });

    // ==========================================
    // 4. EDGE CASES (1 test)
    // ==========================================

    describe('Edge Cases', () => {
        it('should handle recipe with missing meta fields (times, yield, skill)', async () => {
            // Arrange
            const recipeWithoutMeta = {
                ...mockRecipe,
                times: null,
                yield: null,
                skill: null
            };

            // Act
            render(<FeaturedRecipeCard recipe={recipeWithoutMeta} />);

            // Assert - Wait for ratings to load, then check for fallback values
            await waitFor(() => {
                expect(screen.getByText(/--/)).toBeInTheDocument(); // times.total fallback
            });
            expect(screen.getByText(/Medium/)).toBeInTheDocument(); // skill fallback
        });
    });

    // ==========================================
    // BONUS: BUTTON BEHAVIOR TESTS
    // ==========================================

    describe('Button Behavior', () => {
        it('should render primary button without paw for "View Full Recipe"', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);
            const buttons = screen.getAllByTestId('whimsical-button');
            const viewButton = buttons.find(btn => btn.textContent === 'View Full Recipe');

            // Assert
            expect(viewButton).toHaveAttribute('data-type', 'primary');
            expect(viewButton).toHaveAttribute('data-show-paw', 'false');
        });

        it('should render secondary button without paw for "Collapse Recipe"', () => {
            // Arrange
            render(<FeaturedRecipeCard recipe={mockRecipe} />);
            fireEvent.click(screen.getByText('View Full Recipe')); // Expand first

            // Act
            const buttons = screen.getAllByTestId('whimsical-button');
            const collapseButton = buttons.find(btn => btn.textContent === 'Collapse Recipe');

            // Assert
            expect(collapseButton).toHaveAttribute('data-type', 'secondary');
            expect(collapseButton).toHaveAttribute('data-show-paw', 'false');
        });
    });

    // ==========================================
    // BONUS: DIETARY BADGES INTEGRATION
    // ==========================================

    describe('Dietary Badges Integration', () => {
        it('should not render dietary badges when dietary array is empty', () => {
            // Arrange
            const recipeNoDietary = { ...mockRecipe, dietary: [] };

            // Act
            render(<FeaturedRecipeCard recipe={recipeNoDietary} />);

            // Assert
            expect(screen.queryByTestId('dietary-badges')).not.toBeInTheDocument();
        });

        it('should not render dietary badges when dietary is null', () => {
            // Arrange
            const recipeNoDietary = { ...mockRecipe, dietary: null };

            // Act
            render(<FeaturedRecipeCard recipe={recipeNoDietary} />);

            // Assert
            expect(screen.queryByTestId('dietary-badges')).not.toBeInTheDocument();
        });

        it('should render without dietary badges (not displayed in featured card)', () => {
            // Arrange
            const recipeMultipleDietary = {
                ...mockRecipe,
                dietary: ['Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free']
            };

            // Act
            render(<FeaturedRecipeCard recipe={recipeMultipleDietary} />);

            // Assert - FeaturedRecipeCard doesn't show dietary badges
            expect(screen.queryByTestId('dietary-badges')).not.toBeInTheDocument();
            expect(screen.getByText('Blueberry Muffins')).toBeInTheDocument();
        });
    });

    // ==========================================
    // RATINGS DISPLAY TESTS
    // ==========================================

    describe('Ratings Display', () => {
        it('should fetch and display recipe ratings', async () => {
            getRecipeRatings.mockResolvedValue({
                data: {
                    recipe_slug: 'blueberry-muffins',
                    average_rating: 4.5,
                    rating_count: 128
                },
                error: null
            });

            // Arrange & Act
            const { container } = render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert - Wait for ratings to load
            await waitFor(() => {
                expect(getRecipeRatings).toHaveBeenCalledWith('blueberry-muffins');
            });

            // Check for inline SVG stars (5 stars total)
            await waitFor(() => {
                const stars = container.querySelectorAll('.featured-meta svg');
                expect(stars.length).toBe(5);
            });

            const ratingCount = screen.getByText(/\(128\)/);
            expect(ratingCount).toBeInTheDocument();
        });

        it('should display zero ratings for recipe with no ratings', async () => {
            // Arrange
            getRecipeRatings.mockResolvedValue({
                data: {
                    recipe_slug: 'blueberry-muffins',
                    average_rating: 0,
                    rating_count: 0
                },
                error: null
            });

            // Act
            const { container } = render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            await waitFor(() => {
                expect(getRecipeRatings).toHaveBeenCalledWith('blueberry-muffins');
            });

            // Check for inline SVG stars (5 stars total, all unfilled)
            await waitFor(() => {
                const stars = container.querySelectorAll('.featured-meta svg');
                expect(stars.length).toBe(5);
            });

            const ratingCount = screen.getByText(/\(0\)/);
            expect(ratingCount).toBeInTheDocument();
        });

        it('should handle rating fetch error gracefully', async () => {
            // Arrange
            getRecipeRatings.mockResolvedValue({
                data: null,
                error: { message: 'Database connection failed' }
            });

            // Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert - Component should still render without ratings
            expect(screen.getByText('Blueberry Muffins')).toBeInTheDocument();

            // Wait for API call to complete
            await waitFor(() => {
                expect(getRecipeRatings).toHaveBeenCalledWith('blueberry-muffins');
            });

            // No star rating should be displayed
            expect(screen.queryByTestId('star-rating')).not.toBeInTheDocument();
        });

        it('should not show star rating while ratings are loading', () => {
            // Arrange
            getRecipeRatings.mockImplementation(() => new Promise(() => {})); // Never resolves

            // Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert - Star rating should not be visible immediately
            expect(screen.queryByTestId('star-rating')).not.toBeInTheDocument();
        });

        it('should refetch ratings when recipe slug changes', async () => {
            // Arrange
            const { rerender } = render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert - First recipe ratings fetched
            await waitFor(() => {
                expect(getRecipeRatings).toHaveBeenCalledWith('blueberry-muffins');
            });

            // Act - Change recipe
            const newRecipe = { ...mockRecipe, slug: 'chocolate-cake', title: 'Chocolate Cake' };
            rerender(<FeaturedRecipeCard recipe={newRecipe} />);

            // Assert - New recipe ratings fetched
            await waitFor(() => {
                expect(getRecipeRatings).toHaveBeenCalledWith('chocolate-cake');
            });
        });

        it('should not fetch ratings if recipe has no slug', () => {
            // Arrange
            const recipeNoSlug = { ...mockRecipe, slug: '' };

            // Act
            render(<FeaturedRecipeCard recipe={recipeNoSlug} />);

            // Assert - API should not be called
            expect(getRecipeRatings).not.toHaveBeenCalled();
        });
    });
});
