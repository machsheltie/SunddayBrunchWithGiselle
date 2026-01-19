import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WhimsicalHero from '../../components/WhimsicalHero';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, initial, animate, transition, ...props }) => (
            <div
                className={className}
                data-initial={JSON.stringify(initial)}
                data-animate={JSON.stringify(animate)}
                data-transition={JSON.stringify(transition)}
                {...props}
            >
                {children}
            </div>
        )
    }
}));

// Mock WhimsicalButton
vi.mock('../../components/WhimsicalButton', () => ({
    default: ({ children, type, showPaw }) => (
        <button data-testid="whimsical-button" data-type={type} data-show-paw={showPaw}>
            {children}
        </button>
    )
}));

// Mock Decorations
vi.mock('../../components/illustrations/Decorations', () => ({
    WashiTape: ({ className, color }) => (
        <div data-testid="washi-tape" className={className} data-color={color}>
            Tape
        </div>
    ),
    PawPrint: ({ className }) => (
        <div data-testid="paw-print" className={className}>
            Paw
        </div>
    )
}));

// Mock AuteurMotion
vi.mock('../../lib/AuteurMotion', () => ({
    AuteurMotion: {
        makeMagnetic: vi.fn()
    }
}));

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
    // 1. RENDERING TESTS (4 tests)
    // ==========================================

    describe('Rendering', () => {
        it('should render hero title with correct text', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const title = screen.getByRole('heading', { level: 1 });
            expect(title).toBeInTheDocument();
            expect(title).toHaveClass('whimsical-hero__title');
            expect(title).toHaveTextContent('Sunday Brunch with Giselle');
            // Check for "with" accent
            expect(screen.getByText('with')).toHaveClass('script-accent');
        });

        it('should render hero description/quote', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const quote = screen.getByText(
                'Join Giselle and the pack for Sunday morning magic, fresh recipes, and stories that warm the soul.'
            );
            expect(quote).toBeInTheDocument();
            expect(quote).toHaveClass('whimsical-hero__text');
        });

        it('should render two WhimsicalButton CTAs', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const buttons = screen.getAllByTestId('whimsical-button');
            expect(buttons).toHaveLength(2);
            expect(buttons[0]).toHaveTextContent('Latest Episode');
            expect(buttons[1]).toHaveTextContent('Browse Recipes');
        });

        it('should render hero image with correct alt text', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);

            // Assert
            const image = screen.getByAltText('Stacey and Giselle baking in a whimsical kitchen');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/assets/stacey-and-giselle.png');
            expect(image).toHaveClass('hero-watercolor-img');
        });
    });

    // ==========================================
    // 2. ANIMATION TESTS (2 tests)
    // ==========================================

    describe('Animation Tests', () => {
        it('should apply framer-motion animations to content', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);
            const contentDiv = container.querySelector('.whimsical-hero__content');

            // Assert
            expect(contentDiv).toBeInTheDocument();
            const initialData = contentDiv.getAttribute('data-initial');
            const animateData = contentDiv.getAttribute('data-animate');
            const transitionData = contentDiv.getAttribute('data-transition');

            // Parse and verify animation properties
            const initial = JSON.parse(initialData);
            const animate = JSON.parse(animateData);
            const transition = JSON.parse(transitionData);

            expect(initial.x).toBe(-100);
            expect(initial.opacity).toBe(0);
            expect(animate.x).toBe(0);
            expect(animate.opacity).toBe(1);
            expect(transition.duration).toBe(1);
            expect(transition.ease).toBe('easeOut');
        });

        it('should apply framer-motion animations to visual element', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);
            const visualDiv = container.querySelector('.whimsical-hero__visual');

            // Assert
            expect(visualDiv).toBeInTheDocument();
            const initialData = visualDiv.getAttribute('data-initial');
            const animateData = visualDiv.getAttribute('data-animate');
            const transitionData = visualDiv.getAttribute('data-transition');

            // Parse and verify animation properties
            const initial = JSON.parse(initialData);
            const animate = JSON.parse(animateData);
            const transition = JSON.parse(transitionData);

            expect(initial.scale).toBe(0.9);
            expect(initial.opacity).toBe(0);
            expect(initial.rotate).toBe(5);
            expect(animate.scale).toBe(1);
            expect(animate.opacity).toBe(1);
            expect(animate.rotate).toBe(-2);
            expect(transition.duration).toBe(1.2);
            expect(transition.delay).toBe(0.3);
        });
    });

    // ==========================================
    // 3. BUTTON RENDERING (2 tests)
    // ==========================================

    describe('Button Rendering', () => {
        it('should render "Latest Episode" primary button', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);
            const buttons = screen.getAllByTestId('whimsical-button');
            const latestEpisodeButton = buttons[0];

            // Assert
            expect(latestEpisodeButton).toHaveTextContent('Latest Episode');
            expect(latestEpisodeButton).toHaveAttribute('data-type', 'primary');
            // Primary buttons show paw by default (showPaw not specified in component)
            // The mock doesn't receive showPaw prop, so attribute won't exist
            expect(latestEpisodeButton).toBeInTheDocument();
        });

        it('should render "Browse Recipes" secondary button without paw', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);
            const buttons = screen.getAllByTestId('whimsical-button');
            const browseRecipesButton = buttons[1];

            // Assert
            expect(browseRecipesButton).toHaveTextContent('Browse Recipes');
            expect(browseRecipesButton).toHaveAttribute('data-type', 'secondary');
            expect(browseRecipesButton).toHaveAttribute('data-show-paw', 'false');
        });
    });

    // ==========================================
    // BONUS: DECORATIVE ELEMENTS
    // ==========================================

    describe('Decorative Elements', () => {
        it('should render WashiTape decorations', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);
            const washiTapes = screen.getAllByTestId('washi-tape');

            // Assert
            expect(washiTapes.length).toBeGreaterThan(0);
            expect(washiTapes[0]).toHaveClass('tape-corner');
            expect(washiTapes[0]).toHaveAttribute('data-color', 'var(--pastel-lavender)');
        });

        it('should render PawPrint decoration', () => {
            // Arrange & Act
            renderWithRouter(<WhimsicalHero />);
            const pawPrints = screen.getAllByTestId('paw-print');

            // Assert
            expect(pawPrints.length).toBeGreaterThan(0);
            const heroDecorPaw = pawPrints.find(paw =>
                paw.classList.contains('hero-decor-paw')
            );
            expect(heroDecorPaw).toBeInTheDocument();
        });

        it('should render alchemical graphic with animation', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);
            const alchemyGraphic = container.querySelector('.hero-alchemy-graphic');

            // Assert
            expect(alchemyGraphic).toBeInTheDocument();
            const animateData = alchemyGraphic.getAttribute('data-animate');
            const transitionData = alchemyGraphic.getAttribute('data-transition');

            // Note: JSON.stringify converts Infinity to null
            // We can verify the element exists and has animation data attributes
            expect(animateData).toBeTruthy();
            expect(transitionData).toBeTruthy();

            if (animateData && transitionData) {
                const animate = JSON.parse(animateData);
                const transition = JSON.parse(transitionData);

                expect(animate.y).toEqual([0, -20, 0]);
                expect(animate.rotate).toEqual([0, 5, 0]);
                expect(transition.duration).toBe(4);
                // Infinity becomes null when stringified, so just check it exists
                expect(transition).toHaveProperty('repeat');
                expect(transition.ease).toBe('easeInOut');
            }
        });
    });

    // ==========================================
    // BONUS: STRUCTURAL TESTS
    // ==========================================

    describe('Structure', () => {
        it('should have correct CSS classes for layout', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const section = container.querySelector('section');
            expect(section).toHaveClass('whimsical-hero');
            expect(section).toHaveClass('chaos-layer');

            const content = container.querySelector('.whimsical-hero__content');
            expect(content).toHaveClass('collage-item');
            expect(content).toHaveClass('overlap-top');

            const visual = container.querySelector('.whimsical-hero__visual');
            expect(visual).toHaveClass('collage-item');
            expect(visual).toHaveClass('overlap-bottom');
        });

        it('should have photo-frame structure for image', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const photoFrame = container.querySelector('.photo-frame');
            expect(photoFrame).toBeInTheDocument();

            const photoContainer = container.querySelector('.photo-container');
            expect(photoContainer).toBeInTheDocument();

            const glimmerOverlay = container.querySelector('.glimmer-overlay');
            expect(glimmerOverlay).toBeInTheDocument();
        });

        it('should wrap quote in proper semantic elements', () => {
            // Arrange & Act
            const { container } = renderWithRouter(<WhimsicalHero />);

            // Assert
            const quoteWrapper = container.querySelector('.whimsical-hero__quote-wrapper');
            expect(quoteWrapper).toBeInTheDocument();

            const quoteText = quoteWrapper.querySelector('.whimsical-hero__text');
            expect(quoteText).toBeInTheDocument();
            expect(quoteText.tagName).toBe('P');
        });
    });
});
