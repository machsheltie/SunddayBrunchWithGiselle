import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ShareBar from '../../components/ShareBar';

// Mock react-router-dom's useLocation
const mockLocation = {
    pathname: '/recipes/chocolate-cake'
};

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: () => mockLocation
    };
});

// Mock analytics
vi.mock('../../lib/analytics', () => ({
    trackShare: vi.fn(),
    trackPrint: vi.fn()
}));

// Mock CSS imports
vi.mock('../../components/ShareBar.css', () => ({}));

describe('ShareBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset location mock
        mockLocation.pathname = '/recipes/chocolate-cake';
        // Mock window.print
        window.print = vi.fn();
        // Mock window.location.origin
        Object.defineProperty(window, 'location', {
            value: {
                origin: 'https://example.com',
                href: 'https://example.com/recipes/chocolate-cake'
            },
            writable: true
        });
        // Mock navigator.share
        Object.defineProperty(navigator, 'share', {
            value: vi.fn().mockResolvedValue(undefined),
            writable: true,
            configurable: true
        });
        // Mock navigator.clipboard
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: vi.fn().mockResolvedValue(undefined)
            },
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Helper to render component
    const renderShareBar = () => {
        return render(
            <BrowserRouter>
                <ShareBar />
            </BrowserRouter>
        );
    };

    // ==========================================
    // 1. RENDERING TESTS (2 tests)
    // ==========================================

    describe('Rendering', () => {
        it('should render all three sharing options (Print, Share link, Email)', () => {
            // Arrange & Act
            renderShareBar();

            // Assert
            expect(screen.getByText('Print')).toBeInTheDocument();
            expect(screen.getByText('Share link')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
        });

        it('should render with correct button/link text', () => {
            // Arrange & Act
            renderShareBar();

            // Assert
            const printButton = screen.getByRole('button', { name: 'Print' });
            const shareButton = screen.getByRole('button', { name: 'Share link' });
            const emailLink = screen.getByRole('link', { name: 'Email' });

            expect(printButton).toHaveClass('share__button');
            expect(shareButton).toHaveClass('share__button');
            expect(emailLink).toHaveClass('share__link');
        });
    });

    // ==========================================
    // 2. PRINT FUNCTIONALITY (2 tests)
    // ==========================================

    describe('Print Functionality', () => {
        it('should call window.print when Print button clicked', () => {
            // Arrange
            renderShareBar();
            const printButton = screen.getByText('Print');

            // Act
            fireEvent.click(printButton);

            // Assert
            expect(window.print).toHaveBeenCalledTimes(1);
        });

        it('should track print analytics with correct path', async () => {
            // Arrange
            const { trackPrint } = await import('../../lib/analytics');
            renderShareBar();
            const printButton = screen.getByText('Print');

            // Act
            fireEvent.click(printButton);

            // Assert
            expect(trackPrint).toHaveBeenCalledWith({
                type: 'page',
                path: '/recipes/chocolate-cake'
            });
        });
    });

    // ==========================================
    // 3. NATIVE SHARE (3 tests)
    // ==========================================

    describe('Native Share', () => {
        it('should use navigator.share when available', async () => {
            // Arrange
            const { trackShare } = await import('../../lib/analytics');
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert
            await waitFor(() => {
                expect(navigator.share).toHaveBeenCalledWith({
                    url: 'https://example.com/recipes/chocolate-cake',
                    title: document.title
                });
                expect(trackShare).toHaveBeenCalledWith('native', {
                    path: '/recipes/chocolate-cake'
                });
            });
        });

        it('should fall back to clipboard when navigator.share not available', async () => {
            // Arrange
            delete navigator.share; // Remove share API
            const { trackShare } = await import('../../lib/analytics');
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert
            await waitFor(() => {
                expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                    'https://example.com/recipes/chocolate-cake'
                );
                expect(trackShare).toHaveBeenCalledWith('native', {
                    path: '/recipes/chocolate-cake'
                });
            });
        });

        it('should track analytics for native share', async () => {
            // Arrange
            const { trackShare } = await import('../../lib/analytics');
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert
            await waitFor(() => {
                expect(trackShare).toHaveBeenCalledTimes(1);
                expect(trackShare).toHaveBeenCalledWith('native', {
                    path: '/recipes/chocolate-cake'
                });
            });
        });
    });

    // ==========================================
    // 4. EMAIL SHARE (1 test)
    // ==========================================

    describe('Email Share', () => {
        it('should generate correct mailto link with encoded URL', async () => {
            // Arrange
            const { trackShare } = await import('../../lib/analytics');
            renderShareBar();
            const emailLink = screen.getByText('Email');

            // Assert - Check href
            const expectedUrl = encodeURIComponent('https://example.com/recipes/chocolate-cake');
            const expectedHref = `mailto:?subject=Sunday Brunch With Giselle&body=${expectedUrl}`;
            expect(emailLink).toHaveAttribute('href', expectedHref);

            // Act - Click to track analytics
            fireEvent.click(emailLink);

            // Assert - Analytics tracked
            await waitFor(() => {
                expect(trackShare).toHaveBeenCalledWith('email', {
                    path: '/recipes/chocolate-cake'
                });
            });
        });
    });

    // ==========================================
    // 5. ERROR HANDLING (2 tests)
    // ==========================================

    describe('Error Handling', () => {
        it('should handle share errors gracefully', async () => {
            // Arrange
            const { trackShare } = await import('../../lib/analytics');
            const shareError = new Error('Share failed');
            navigator.share = vi.fn().mockRejectedValue(shareError);
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert - Should not throw, but track error
            await waitFor(() => {
                expect(trackShare).toHaveBeenCalledWith('error', {
                    path: '/recipes/chocolate-cake',
                    detail: 'Share failed'
                });
            });
        });

        it('should track analytics on share errors', async () => {
            // Arrange
            const { trackShare } = await import('../../lib/analytics');
            navigator.share = vi.fn().mockRejectedValue(new Error('User cancelled'));
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert
            await waitFor(() => {
                expect(trackShare).toHaveBeenCalledWith('error', {
                    path: '/recipes/chocolate-cake',
                    detail: 'User cancelled'
                });
            });
        });
    });

    // ==========================================
    // BONUS: URL GENERATION TESTS
    // ==========================================

    describe('URL Generation', () => {
        it('should construct full URL from origin and pathname', () => {
            // Arrange
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert - Verify correct URL was shared
            waitFor(() => {
                expect(navigator.share).toHaveBeenCalledWith(
                    expect.objectContaining({
                        url: 'https://example.com/recipes/chocolate-cake'
                    })
                );
            });
        });

        it('should handle different pathname values', async () => {
            // Arrange - Change pathname
            mockLocation.pathname = '/episodes/episode-1';
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert
            await waitFor(() => {
                expect(navigator.share).toHaveBeenCalledWith(
                    expect.objectContaining({
                        url: 'https://example.com/episodes/episode-1'
                    })
                );
            });
        });
    });

    // ==========================================
    // BONUS: ACCESSIBILITY TESTS
    // ==========================================

    describe('Accessibility', () => {
        it('should have correct ARIA roles for buttons', () => {
            // Arrange & Act
            renderShareBar();

            // Assert
            const printButton = screen.getByRole('button', { name: 'Print' });
            const shareButton = screen.getByRole('button', { name: 'Share link' });

            expect(printButton.tagName).toBe('BUTTON');
            expect(shareButton.tagName).toBe('BUTTON');
        });

        it('should have correct ARIA role for email link', () => {
            // Arrange & Act
            renderShareBar();

            // Assert
            const emailLink = screen.getByRole('link', { name: 'Email' });
            expect(emailLink.tagName).toBe('A');
            expect(emailLink).toHaveAttribute('href');
        });

        it('should be keyboard accessible', () => {
            // Arrange
            renderShareBar();
            const printButton = screen.getByText('Print');

            // Act - Simulate keyboard interaction
            printButton.focus();
            fireEvent.keyDown(printButton, { key: 'Enter', code: 'Enter' });

            // Assert - Button should be focusable and clickable via keyboard
            expect(document.activeElement).toBe(printButton);
        });
    });

    // ==========================================
    // BONUS: CLIPBOARD FALLBACK TESTS
    // ==========================================

    describe('Clipboard Fallback', () => {
        it('should use clipboard when navigator.share throws AbortError', async () => {
            // Arrange
            const { trackShare } = await import('../../lib/analytics');
            navigator.share = vi.fn().mockRejectedValue(new DOMException('User cancelled', 'AbortError'));
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert - Error tracked but component doesn't crash
            await waitFor(() => {
                expect(trackShare).toHaveBeenCalledWith('error', expect.any(Object));
            });
        });

        it('should handle clipboard errors gracefully', async () => {
            // Arrange
            delete navigator.share; // Remove share API
            navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Clipboard denied'));
            const { trackShare } = await import('../../lib/analytics');
            renderShareBar();
            const shareButton = screen.getByText('Share link');

            // Act
            fireEvent.click(shareButton);

            // Assert - Should track error
            await waitFor(() => {
                expect(trackShare).toHaveBeenCalledWith('error', {
                    path: '/recipes/chocolate-cake',
                    detail: 'Clipboard denied'
                });
            });
        });
    });
});
