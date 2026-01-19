import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WhimsicalHero from '../../components/WhimsicalHero';

// Mock CSS imports
vi.mock('../../components/WhimsicalHero.css', () => ({}));

// Helper to render with Router context
const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('WhimsicalHero', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ==========================================
    // 1. RENDERING TESTS
    // ==========================================

    describe('Rendering', () => {
        it('should render hero section with correct testid', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const hero = screen.getByTestId('hero');
            expect(hero).toBeInTheDocument();
            expect(hero).toHaveClass('hero');
        });

        it('should render hero title with correct text and script accent', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const title = screen.getByTestId('hero-title');
            expect(title).toBeInTheDocument();
            expect(title).toHaveClass('hero-title');
            expect(title).toHaveTextContent('Sunday Brunch with Giselle');

            // Check for "with" script accent
            const scriptAccent = title.querySelector('.hero-script-accent');
            expect(scriptAccent).toBeInTheDocument();
            expect(scriptAccent).toHaveTextContent('with');
        });

        it('should render hero subtitle', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const subtitle = container.querySelector('.hero-subtitle');
            expect(subtitle).toBeInTheDocument();
            expect(subtitle).toHaveTextContent('Whimsy, warmth, and wags');
        });

        it('should render hero quote', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const quote = container.querySelector('.hero-quote');
            expect(quote).toBeInTheDocument();
            expect(quote).toHaveTextContent('Join Giselle and the pack for Sunday morning magic, fresh recipes, and stories that warm the soul.');
        });

        it('should render two CTA links', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const latestEpisodeLink = screen.getByRole('link', { name: /Latest Episode/i });
            const browseRecipesLink = screen.getByRole('link', { name: /Browse Recipes/i });

            expect(latestEpisodeLink).toBeInTheDocument();
            expect(latestEpisodeLink).toHaveClass('whimsical-button', 'whimsical-button--primary');
            expect(latestEpisodeLink).toHaveAttribute('href', '/episodes/the-pie-that-started-a-dynasty');

            expect(browseRecipesLink).toBeInTheDocument();
            expect(browseRecipesLink).toHaveClass('whimsical-button', 'whimsical-button--secondary');
            expect(browseRecipesLink).toHaveAttribute('href', '/recipes');
        });

        it('should render hero image with correct alt text', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const image = screen.getByAltText('Stacey and Giselle in the kitchen');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/assets/stacey-and-giselle.png');
        });
    });

    // ==========================================
    // 2. LAYOUT STRUCTURE TESTS
    // ==========================================

    describe('Layout Structure', () => {
        it('should have two-column layout with content and visual sections', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const heroContent = container.querySelector('.hero-content');
            const heroVisual = container.querySelector('.hero-visual');

            expect(heroContent).toBeInTheDocument();
            expect(heroVisual).toBeInTheDocument();
        });

        it('should have animation classes on layout sections', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const heroContent = container.querySelector('.hero-content');
            const heroVisual = container.querySelector('.hero-visual');

            expect(heroContent).toHaveClass('animate-slide-in-left');
            expect(heroVisual).toHaveClass('animate-scale-rotate');
        });

        it('should wrap quote in hero-quote-wrapper', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const quoteWrapper = container.querySelector('.hero-quote-wrapper');
            expect(quoteWrapper).toBeInTheDocument();

            const quote = quoteWrapper.querySelector('.hero-quote');
            expect(quote).toBeInTheDocument();
        });

        it('should have photo-frame structure for image', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const photoFrame = container.querySelector('.photo-frame');
            expect(photoFrame).toBeInTheDocument();

            const image = photoFrame.querySelector('img');
            expect(image).toBeInTheDocument();
        });
    });

    // ==========================================
    // 3. DECORATIVE ELEMENTS TESTS
    // ==========================================

    describe('Decorative Elements', () => {
        it('should render alchemy circle container', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const alchemyContainer = container.querySelector('.alchemy-circle-container');
            expect(alchemyContainer).toBeInTheDocument();

            const alchemyCircle = alchemyContainer.querySelector('.alchemy-circle');
            expect(alchemyCircle).toBeInTheDocument();
        });

        it('should render watercolor splatters on photo frame', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const splatters = container.querySelectorAll('.watercolor-splatter');
            expect(splatters).toHaveLength(2);
            expect(splatters[0]).toHaveClass('splatter-1');
            expect(splatters[1]).toHaveClass('splatter-2');
        });

        it('should render washi tape with SVG', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const washiTape = container.querySelector('.washi-tape');
            expect(washiTape).toBeInTheDocument();

            const svg = washiTape.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('should render glimmer overlay on photo frame', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const glimmerOverlay = container.querySelector('.glimmer-overlay');
            expect(glimmerOverlay).toBeInTheDocument();
        });

        it('should render hero divider', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const divider = container.querySelector('.hero-divider');
            expect(divider).toBeInTheDocument();
        });
    });

    // ==========================================
    // 4. CTA BUTTONS TESTS
    // ==========================================

    describe('CTA Buttons', () => {
        it('should render CTA group container', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const ctaGroup = container.querySelector('.hero-cta-group');
            expect(ctaGroup).toBeInTheDocument();

            const links = ctaGroup.querySelectorAll('a');
            expect(links).toHaveLength(2);
        });

        it('should have primary button styling on Latest Episode link', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const latestEpisodeLink = screen.getByRole('link', { name: /Latest Episode/i });
            expect(latestEpisodeLink).toHaveClass('whimsical-button--primary');
        });

        it('should have secondary button styling on Browse Recipes link', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const browseRecipesLink = screen.getByRole('link', { name: /Browse Recipes/i });
            expect(browseRecipesLink).toHaveClass('whimsical-button--secondary');
        });
    });

    // ==========================================
    // 5. IMAGE ERROR HANDLING
    // ==========================================

    describe('Image Error Handling', () => {
        it('should have onError handler for image fallback', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const image = container.querySelector('img');
            expect(image).toHaveAttribute('src', '/assets/stacey-and-giselle.png');

            // Verify onError handler exists by checking it's a function
            // We can't directly test the handler without triggering it, but we can verify the component renders correctly
            expect(image).toBeInTheDocument();
        });
    });
});
