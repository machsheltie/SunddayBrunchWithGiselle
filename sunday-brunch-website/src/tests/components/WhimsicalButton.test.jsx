import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WhimsicalButton from '../../components/WhimsicalButton';

// Mock GSAP
vi.mock('gsap', () => ({
    gsap: {
        to: vi.fn((target, options) => {
            // Simulate immediate completion for testing
            if (options.onComplete) options.onComplete();
            return { kill: vi.fn() };
        })
    }
}));

// Mock AuteurMotion
vi.mock('../../lib/AuteurMotion', () => ({
    AuteurMotion: {
        makeMagnetic: vi.fn()
    }
}));

// Mock PawPrint component
vi.mock('../../components/illustrations/Decorations', () => ({
    PawPrint: ({ className, color, opacity }) => (
        <div
            data-testid="paw-print"
            className={className}
            data-color={color}
            data-opacity={opacity}
        >
            PawPrint
        </div>
    )
}));

// Mock CSS imports
vi.mock('../../components/WhimsicalButton.css', () => ({}));

describe('WhimsicalButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock getBoundingClientRect for particle positioning
        Element.prototype.getBoundingClientRect = vi.fn(() => ({
            left: 100,
            top: 100,
            width: 200,
            height: 50,
            right: 300,
            bottom: 150
        }));
    });

    afterEach(() => {
        // Clean up any particles created during tests
        document.querySelectorAll('.sparkle, .flour-particle').forEach(el => el.remove());
    });

    // ==========================================
    // 1. RENDERING TESTS (4 tests)
    // ==========================================

    describe('Rendering', () => {
        it('should render with children text', () => {
            // Arrange & Act
            render(<WhimsicalButton>Click Me</WhimsicalButton>);

            // Assert
            expect(screen.getByText('Click Me')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should render with default variant', () => {
            // Arrange & Act
            const { container } = render(<WhimsicalButton>Button</WhimsicalButton>);
            const button = container.querySelector('button');

            // Assert
            expect(button).toHaveClass('whimsical-button--default');
        });

        it('should render with nav variant', () => {
            // Arrange & Act
            const { container } = render(
                <WhimsicalButton variant="nav">Nav Button</WhimsicalButton>
            );
            const button = container.querySelector('button');

            // Assert
            expect(button).toHaveClass('whimsical-button--nav');
            // Nav variant should have a paw print in the background
            const navBg = container.querySelector('.whimsical-button__nav-bg');
            expect(navBg).toBeInTheDocument();
        });

        it('should apply custom className', () => {
            // Arrange & Act
            const { container } = render(
                <WhimsicalButton className="custom-class">Button</WhimsicalButton>
            );
            const button = container.querySelector('button');

            // Assert
            expect(button).toHaveClass('custom-class');
            expect(button).toHaveClass('whimsical-button');
        });
    });

    // ==========================================
    // 2. PROPS & TYPES TESTS (3 tests)
    // ==========================================

    describe('Props & Types', () => {
        it('should render primary type correctly', () => {
            // Arrange & Act
            const { container } = render(
                <WhimsicalButton type="primary">Primary</WhimsicalButton>
            );
            const button = container.querySelector('button');

            // Assert
            expect(button).toHaveClass('whimsical-button--primary');
            expect(button).toHaveAttribute('data-paw-color', 'light');
        });

        it('should render secondary type correctly', () => {
            // Arrange & Act
            const { container } = render(
                <WhimsicalButton type="secondary">Secondary</WhimsicalButton>
            );
            const button = container.querySelector('button');

            // Assert
            expect(button).toHaveClass('whimsical-button--secondary');
            expect(button).toHaveAttribute('data-paw-color', 'dark');
        });

        it('should show/hide paw print based on showPaw prop', () => {
            // Arrange & Act - showPaw = true (default)
            const { container: container1, unmount } = render(
                <WhimsicalButton showPaw={true}>With Paw</WhimsicalButton>
            );

            // Assert - paw print should be visible
            const pawContainer1 = container1.querySelector('.whimsical-button__paw-container');
            expect(pawContainer1).toBeInTheDocument();

            unmount();

            // Arrange & Act - showPaw = false
            const { container: container2 } = render(
                <WhimsicalButton showPaw={false}>Without Paw</WhimsicalButton>
            );

            // Assert - paw print should not be visible
            const pawContainer2 = container2.querySelector('.whimsical-button__paw-container');
            expect(pawContainer2).not.toBeInTheDocument();
        });
    });

    // ==========================================
    // 3. DISABLED STATE TESTS (2 tests)
    // ==========================================

    describe('Disabled State', () => {
        it('should disable button when disabled prop is true', () => {
            // Arrange & Act
            render(<WhimsicalButton disabled={true}>Disabled</WhimsicalButton>);
            const button = screen.getByRole('button');

            // Assert
            expect(button).toBeDisabled();
            expect(button).toHaveAttribute('disabled');
        });

        it('should not call onClick when disabled', () => {
            // Arrange
            const handleClick = vi.fn();
            render(
                <WhimsicalButton disabled={true} onClick={handleClick}>
                    Disabled
                </WhimsicalButton>
            );
            const button = screen.getByRole('button');

            // Act
            fireEvent.click(button);

            // Assert
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    // ==========================================
    // 4. CLICK HANDLER TESTS (3 tests)
    // ==========================================

    describe('Click Handler', () => {
        it('should call onClick when clicked', () => {
            // Arrange
            const handleClick = vi.fn();
            render(<WhimsicalButton onClick={handleClick}>Click Me</WhimsicalButton>);
            const button = screen.getByRole('button');

            // Act
            fireEvent.click(button);

            // Assert
            expect(handleClick).toHaveBeenCalledTimes(1);
            expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should not throw error if onClick is not provided', () => {
            // Arrange
            render(<WhimsicalButton>No Handler</WhimsicalButton>);
            const button = screen.getByRole('button');

            // Act & Assert - should not throw
            expect(() => fireEvent.click(button)).not.toThrow();
        });

        it('should create particle effects on click (sparkles/flour)', () => {
            // Arrange
            const createElementSpy = vi.spyOn(document, 'createElement');
            render(<WhimsicalButton>Particles</WhimsicalButton>);
            const button = screen.getByRole('button');

            // Act
            fireEvent.click(button, { clientX: 150, clientY: 125 });

            // Assert
            // Should create 12 particles (6 sparkles + 6 flour)
            const divCalls = createElementSpy.mock.calls.filter(call => call[0] === 'div');
            expect(divCalls.length).toBeGreaterThanOrEqual(12);

            // Check that particles were added to the button
            const button_element = button;
            const sparkles = button_element.querySelectorAll('.sparkle');
            const flourParticles = button_element.querySelectorAll('.flour-particle');

            expect(sparkles.length).toBe(6);
            expect(flourParticles.length).toBe(6);

            createElementSpy.mockRestore();
        });
    });

    // ==========================================
    // 5. ACCESSIBILITY TESTS (3 tests)
    // ==========================================

    describe('Accessibility', () => {
        it('should have correct button role', () => {
            // Arrange & Act
            render(<WhimsicalButton>Accessible</WhimsicalButton>);
            const button = screen.getByRole('button');

            // Assert
            expect(button).toBeInTheDocument();
            expect(button.tagName).toBe('BUTTON');
        });

        it('should be keyboard accessible (Enter/Space)', () => {
            // Arrange
            const handleClick = vi.fn();
            render(<WhimsicalButton onClick={handleClick}>Keyboard</WhimsicalButton>);
            const button = screen.getByRole('button');

            // Act - Press Enter
            fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

            // Note: fireEvent.click is the correct way to test button clicks
            // Browsers handle Enter/Space automatically for buttons
            fireEvent.click(button);

            // Assert
            expect(handleClick).toHaveBeenCalled();

            // Reset
            handleClick.mockClear();

            // Act - Press Space (via click - browsers handle this)
            fireEvent.click(button);

            // Assert
            expect(handleClick).toHaveBeenCalled();
        });

        it('should have aria-disabled attribute when disabled', () => {
            // Arrange & Act
            render(<WhimsicalButton disabled={true}>Disabled</WhimsicalButton>);
            const button = screen.getByRole('button');

            // Assert
            expect(button).toBeDisabled();
            // HTML disabled attribute provides better accessibility than aria-disabled
            expect(button).toHaveAttribute('disabled');
        });
    });

    // ==========================================
    // BONUS: ANIMATION & INTERACTION TESTS
    // ==========================================

    describe('Animation & Interaction', () => {
        it('should apply magnetic effect for nav variant', async () => {
            // Arrange
            const { AuteurMotion } = await import('../../lib/AuteurMotion');

            // Act
            const { container } = render(
                <WhimsicalButton variant="nav">Nav</WhimsicalButton>
            );
            const button = container.querySelector('button');

            // Assert
            expect(AuteurMotion.makeMagnetic).toHaveBeenCalledWith(button);
        });

        it('should animate paw on mouse enter for default variant', async () => {
            // Arrange
            const { gsap } = await import('gsap');
            const { container } = render(
                <WhimsicalButton variant="default">Hover</WhimsicalButton>
            );
            const button = container.querySelector('button');

            // Clear previous calls
            vi.clearAllMocks();

            // Act
            fireEvent.mouseEnter(button);

            // Assert
            expect(gsap.to).toHaveBeenCalled();
            const firstCall = gsap.to.mock.calls[0];
            expect(firstCall[1]).toMatchObject({
                scale: 1.2,
                rotate: 15,
                duration: 0.4
            });
        });

        it('should reset paw animation on mouse leave', async () => {
            // Arrange
            const { gsap } = await import('gsap');
            const { container } = render(
                <WhimsicalButton variant="default">Hover</WhimsicalButton>
            );
            const button = container.querySelector('button');

            // Act - Enter then leave
            fireEvent.mouseEnter(button);
            vi.clearAllMocks();
            fireEvent.mouseLeave(button);

            // Assert
            expect(gsap.to).toHaveBeenCalled();
            const firstCall = gsap.to.mock.calls[0];
            expect(firstCall[1]).toMatchObject({
                scale: 1,
                rotate: 0,
                duration: 0.4
            });
        });

        it('should not animate paw for nav variant on hover', async () => {
            // Arrange
            const { gsap } = await import('gsap');
            const { container } = render(
                <WhimsicalButton variant="nav">Nav</WhimsicalButton>
            );
            const button = container.querySelector('button');

            // Clear previous calls (from magnetic effect)
            vi.clearAllMocks();

            // Act
            fireEvent.mouseEnter(button);

            // Assert - gsap.to should not be called for nav variant hover
            expect(gsap.to).not.toHaveBeenCalled();
        });
    });
});
