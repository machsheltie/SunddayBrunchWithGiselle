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
        // Default mock: recipe has ratings
        getRecipeRatings.mockResolvedValue({
            data: {
                recipe_slug: 'blueberry-muffins',
                average_rating: 4.5,
                rating_count: 128
            },
            error: null
        });
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
            expect(screen.getByText('Breakfast')).toBeInTheDocument();
            expect(screen.queryByTestId('recipe-template')).not.toBeInTheDocument();
        });

        it('should display recipe image, title, category', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            const image = screen.getByAltText('Blueberry Muffins');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/muffins.jpg');
            expect(screen.getByText('Blueberry Muffins')).toHaveClass('featured-recipe-card__title');
            expect(screen.getByText('Breakfast')).toHaveClass('featured-recipe-card__category');
        });

        it('should display meta information (time, yield, skill level)', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            expect(screen.getByText('45 min')).toBeInTheDocument();
            expect(screen.getByText('12 muffins')).toBeInTheDocument();
            expect(screen.getByText('Easy')).toBeInTheDocument();
        });

        it('should display recipe story excerpt', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            expect(screen.getByText('These muffins are perfect for Sunday brunch.')).toBeInTheDocument();
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
        it('should handle recipe with dietary badges', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            const dietaryBadges = screen.getByTestId('dietary-badges');
            expect(dietaryBadges).toBeInTheDocument();
            expect(dietaryBadges).toHaveTextContent('Vegetarian');
            expect(dietaryBadges).toHaveAttribute('data-max-visible', '3');
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
        it('should handle recipe with missing meta fields (times, yield, skill)', () => {
            // Arrange
            const recipeWithoutMeta = {
                ...mockRecipe,
                times: null,
                yield: null,
                skill: null
            };

            // Act
            render(<FeaturedRecipeCard recipe={recipeWithoutMeta} />);

            // Assert - Should display fallback values
            const fallbacks = screen.getAllByText('--');
            expect(fallbacks.length).toBeGreaterThanOrEqual(2); // times.total and yield fallbacks
            expect(screen.getByText('Medium')).toBeInTheDocument(); // skill fallback
        });
    });

    // ==========================================
    // BONUS: BUTTON BEHAVIOR TESTS
    // ==========================================

    describe('Button Behavior', () => {
        it('should render primary button with paw for "View Full Recipe"', () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);
            const buttons = screen.getAllByTestId('whimsical-button');
            const viewButton = buttons.find(btn => btn.textContent === 'View Full Recipe');

            // Assert
            expect(viewButton).toHaveAttribute('data-type', 'primary');
            expect(viewButton).toHaveAttribute('data-show-paw', 'true');
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

        it('should limit dietary badges to maxVisible of 3', () => {
            // Arrange
            const recipeMultipleDietary = {
                ...mockRecipe,
                dietary: ['Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free']
            };

            // Act
            render(<FeaturedRecipeCard recipe={recipeMultipleDietary} />);

            // Assert
            const badges = screen.getByTestId('dietary-badges');
            expect(badges).toHaveAttribute('data-max-visible', '3');
            // Should only show first 3
            expect(badges.textContent).toContain('Vegetarian');
            expect(badges.textContent).toContain('Gluten-Free');
            expect(badges.textContent).toContain('Dairy-Free');
            expect(badges.textContent).not.toContain('Nut-Free');
        });
    });

    // ==========================================
    // RATINGS DISPLAY TESTS
    // ==========================================

    describe('Ratings Display', () => {
        it('should fetch and display recipe ratings', async () => {
            // Arrange & Act
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert - Wait for ratings to load
            await waitFor(() => {
                expect(getRecipeRatings).toHaveBeenCalledWith('blueberry-muffins');
            });

            const starRating = await screen.findByTestId('star-rating');
            expect(starRating).toBeInTheDocument();
            expect(starRating).toHaveAttribute('data-value', '4.5');
            expect(starRating).toHaveAttribute('data-count', '128');
            expect(starRating).toHaveAttribute('data-size', 'medium');
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
            render(<FeaturedRecipeCard recipe={mockRecipe} />);

            // Assert
            await waitFor(() => {
                expect(getRecipeRatings).toHaveBeenCalledWith('blueberry-muffins');
            });

            const starRating = await screen.findByTestId('star-rating');
            expect(starRating).toHaveAttribute('data-value', '0');
            expect(starRating).toHaveAttribute('data-count', '0');
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
            const recipeNoSlug = { ...mockRecipe, slug: null };

            // Act
            render(<FeaturedRecipeCard recipe={recipeNoSlug} />);

            // Assert - API should not be called
            expect(getRecipeRatings).not.toHaveBeenCalled();
        });
    });
});
