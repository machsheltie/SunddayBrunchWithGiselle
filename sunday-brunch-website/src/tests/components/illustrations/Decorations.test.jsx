import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
    PawPrint,
    WashiTape,
    WhiskIcon,
    HandDrawnBorder,
    RollingPin,
    MixingBowl,
    SheltieSilhouette,
    CrystalRating,
    MagicWand
} from '../../../components/illustrations/Decorations';

describe('Decorations - PawPrint Component', () => {
    // ==========================================
    // PawPrint Tests (4 tests)
    // ==========================================

    it('should render with default props', () => {
        // Arrange & Act
        const { container } = render(<PawPrint />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 100 100');

        // Check default opacity on path elements
        const paths = container.querySelectorAll('path, ellipse');
        expect(paths.length).toBeGreaterThan(0);

        // First path should have default opacity 0.6
        expect(paths[0]).toHaveAttribute('opacity', '0.6');
    });

    it('should render with custom color prop', () => {
        // Arrange
        const customColor = '#FF0000';

        // Act
        const { container } = render(<PawPrint color={customColor} />);
        const paths = container.querySelectorAll('path, ellipse');

        // Assert
        expect(paths.length).toBeGreaterThan(0);
        paths.forEach((element) => {
            expect(element).toHaveAttribute('fill', customColor);
        });
    });

    it('should render with custom opacity prop', () => {
        // Arrange
        const customOpacity = 0.9;

        // Act
        const { container } = render(<PawPrint opacity={customOpacity} />);
        const paths = container.querySelectorAll('path');

        // Assert
        expect(paths.length).toBeGreaterThan(0);
        // First path should have custom opacity
        expect(paths[0]).toHaveAttribute('opacity', '0.9');
    });

    it('should render with custom size (width and height props)', () => {
        // Arrange
        const customWidth = 150;
        const customHeight = 150;

        // Act
        const { container } = render(
            <PawPrint width={customWidth} height={customHeight} />
        );
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toHaveAttribute('width', customWidth.toString());
        expect(svg).toHaveAttribute('height', customHeight.toString());
    });

    it('should render with custom className and style', () => {
        // Arrange
        const customClassName = 'custom-paw';
        const customStyle = { position: 'absolute' };

        // Act
        const { container } = render(
            <PawPrint className={customClassName} style={customStyle} />
        );
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toHaveClass(customClassName);
    });
});

describe('Decorations - WashiTape Component', () => {
    // ==========================================
    // WashiTape Tests (4 tests)
    // ==========================================

    it('should render with default props', () => {
        // Arrange & Act
        const { container } = render(<WashiTape />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 100 30');
        expect(svg).toHaveAttribute('preserveAspectRatio', 'none');

        // Check for path elements
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBe(3);
    });

    it('should render with custom color prop', () => {
        // Arrange
        const customColor = '#0000FF';

        // Act
        const { container } = render(<WashiTape color={customColor} />);
        const mainPath = container.querySelector('path[opacity="0.8"]');

        // Assert
        expect(mainPath).toBeInTheDocument();
        expect(mainPath).toHaveAttribute('fill', customColor);
    });

    it('should render with custom className prop', () => {
        // Arrange
        const customClassName = 'washi-tape-custom';

        // Act
        const { container } = render(<WashiTape className={customClassName} />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toHaveClass(customClassName);
    });

    it('should render SVG structure correctly with pattern and rect elements', () => {
        // Arrange & Act
        const { container } = render(<WashiTape />);

        // Assert - Check main tape path
        const mainPath = container.querySelector('path[fill="var(--pastel-lavender)"]');
        expect(mainPath).toBeInTheDocument();
        expect(mainPath).toHaveAttribute('opacity', '0.8');

        // Assert - Check decorative stroke paths
        const strokePaths = container.querySelectorAll('path[stroke]');
        expect(strokePaths.length).toBe(2);

        // Top dashed line (React converts strokeDasharray to stroke-dasharray)
        expect(strokePaths[0]).toHaveAttribute('stroke', 'rgba(255,255,255,0.3)');
        expect(strokePaths[0]).toHaveAttribute('stroke-dasharray', '2,2');

        // Bottom line
        expect(strokePaths[1]).toHaveAttribute('stroke', 'rgba(0,0,0,0.1)');
    });
});

describe('Decorations - WhiskIcon Component', () => {
    // ==========================================
    // WhiskIcon Tests (2 tests)
    // ==========================================

    it('should render with correct SVG structure', () => {
        // Arrange & Act
        const { container } = render(<WhiskIcon />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 50 100');

        // Check for path elements (whisk wires)
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBe(4);

        // Check for handle rect
        const rect = container.querySelector('rect');
        expect(rect).toBeInTheDocument();
    });

    it('should render with custom className', () => {
        // Arrange
        const customClassName = 'custom-whisk';

        // Act
        const { container } = render(<WhiskIcon className={customClassName} />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toHaveClass(customClassName);
    });
});

describe('Decorations - HandDrawnBorder Component', () => {
    // ==========================================
    // HandDrawnBorder Tests (2 tests)
    // ==========================================

    it('should render with correct styling', () => {
        // Arrange & Act
        const { container } = render(<HandDrawnBorder />);
        const border = container.querySelector('div');

        // Assert
        expect(border).toBeInTheDocument();
        expect(border).toHaveStyle({
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            pointerEvents: 'none'
        });
    });

    it('should render with custom className', () => {
        // Arrange
        const customClassName = 'custom-border';

        // Act
        const { container } = render(<HandDrawnBorder className={customClassName} />);
        const border = container.querySelector('div');

        // Assert
        expect(border).toHaveClass(customClassName);
    });
});

describe('Decorations - RollingPin Component', () => {
    // ==========================================
    // RollingPin Tests (3 tests)
    // ==========================================

    it('should render with correct SVG structure', () => {
        // Arrange & Act
        const { container } = render(<RollingPin />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 100 30');

        // Check for title (accessibility)
        const title = container.querySelector('title');
        expect(title).toBeInTheDocument();
        expect(title.textContent).toBe('Rolling Pin');

        // Check for rect elements (3 sections: center + 2 handles)
        const rects = container.querySelectorAll('rect');
        expect(rects.length).toBe(3);
    });

    it('should render with custom className', () => {
        // Arrange
        const customClassName = 'custom-rolling-pin';

        // Act
        const { container } = render(<RollingPin className={customClassName} />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toHaveClass(customClassName);
    });

    it('should have correct color attributes', () => {
        // Arrange & Act
        const { container } = render(<RollingPin />);

        // Assert - Center section
        const mainRect = container.querySelector('rect[x="20"]');
        expect(mainRect).toHaveAttribute('fill', 'var(--soft-sakura)');

        // Assert - Handles
        const handles = container.querySelectorAll('rect[fill="var(--midnight-lavender)"]');
        expect(handles.length).toBe(2);
    });
});

describe('Decorations - MixingBowl Component', () => {
    // ==========================================
    // MixingBowl Tests (3 tests)
    // ==========================================

    it('should render with correct SVG structure', () => {
        // Arrange & Act
        const { container } = render(<MixingBowl />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 100 80');

        // Check for title
        const title = container.querySelector('title');
        expect(title).toBeInTheDocument();
        expect(title.textContent).toBe('Mixing Bowl');
    });

    it('should render with custom className', () => {
        // Arrange
        const customClassName = 'custom-mixing-bowl';

        // Act
        const { container } = render(<MixingBowl className={customClassName} />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toHaveClass(customClassName);
    });

    it('should have bowl structure with rim and spoon', () => {
        // Arrange & Act
        const { container } = render(<MixingBowl />);

        // Assert - Check for paths (bowl, rim) and ellipse
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(2);

        const ellipse = container.querySelector('ellipse');
        expect(ellipse).toBeInTheDocument();
    });
});

describe('Decorations - SheltieSilhouette Component', () => {
    // ==========================================
    // SheltieSilhouette Tests (3 tests)
    // ==========================================

    it('should render with default props', () => {
        // Arrange & Act
        const { container } = render(<SheltieSilhouette />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 100 80');

        // Check for title
        const title = container.querySelector('title');
        expect(title).toBeInTheDocument();
        expect(title.textContent).toBe('Sheltie leading the way');
    });

    it('should render with custom color prop', () => {
        // Arrange
        const customColor = '#8B4513';

        // Act
        const { container } = render(<SheltieSilhouette color={customColor} />);
        const paths = container.querySelectorAll('path');

        // Assert
        paths.forEach((path) => {
            expect(path).toHaveAttribute('fill', customColor);
        });
    });

    it('should render with custom className and style', () => {
        // Arrange
        const customClassName = 'custom-sheltie';
        const customStyle = { opacity: 0.8 };

        // Act
        const { container } = render(
            <SheltieSilhouette className={customClassName} style={customStyle} />
        );
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toHaveClass(customClassName);
    });
});

describe('Decorations - CrystalRating Component', () => {
    // ==========================================
    // CrystalRating Tests (3 tests)
    // ==========================================

    it('should render filled state correctly', () => {
        // Arrange & Act
        const { container } = render(<CrystalRating filled={true} />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toBeInTheDocument();

        // Check main crystal path is filled
        const mainPath = container.querySelector('path[d*="M12 2"]');
        expect(mainPath).toHaveAttribute('fill', '#D6BCFA');

        // Check sparkle lines are present when filled
        const sparklePath = container.querySelector('path[d*="M12 5"]');
        expect(sparklePath).toBeInTheDocument();
    });

    it('should render unfilled state correctly', () => {
        // Arrange & Act
        const { container } = render(<CrystalRating filled={false} />);

        // Assert
        const mainPath = container.querySelector('path[d*="M12 2"]');
        expect(mainPath).toHaveAttribute('fill', 'none');

        // Check sparkle lines are NOT present when unfilled
        const sparklePath = container.querySelector('path[d*="M12 5"]');
        expect(sparklePath).not.toBeInTheDocument();
    });

    it('should render with custom className and fixed size', () => {
        // Arrange
        const customClassName = 'custom-crystal';

        // Act
        const { container } = render(<CrystalRating filled={true} className={customClassName} />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toHaveClass(customClassName);
        expect(svg).toHaveStyle({ width: '1.8rem', height: '1.8rem' });
    });
});

describe('Decorations - MagicWand Component', () => {
    // ==========================================
    // MagicWand Tests (3 tests)
    // ==========================================

    it('should render with default props', () => {
        // Arrange & Act
        const { container } = render(<MagicWand />);
        const svg = container.querySelector('svg');

        // Assert
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');

        // Check for title
        const title = container.querySelector('title');
        expect(title).toBeInTheDocument();
        expect(title.textContent).toBe('Magic Wand');
    });

    it('should render with custom color prop', () => {
        // Arrange
        const customColor = '#FFD700';

        // Act
        const { container } = render(<MagicWand color={customColor} />);

        // Assert - Wand stick
        const wandStick = container.querySelector('path[d*="M3 21"]');
        expect(wandStick).toHaveAttribute('stroke', customColor);

        // Assert - Star
        const star = container.querySelector('path[d*="M17 3"]');
        expect(star).toHaveAttribute('fill', customColor);
    });

    it('should render with sparkle elements', () => {
        // Arrange & Act
        const { container } = render(<MagicWand />);

        // Assert - Check for sparkle circles
        const sparkles = container.querySelectorAll('circle');
        expect(sparkles.length).toBe(3);

        // Check sparkle attributes
        expect(sparkles[0]).toHaveAttribute('cx', '8');
        expect(sparkles[0]).toHaveAttribute('cy', '16');
        expect(sparkles[0]).toHaveAttribute('r', '1');
    });
});

describe('Decorations - Integration & Consistency Tests', () => {
    // ==========================================
    // Additional Integration Tests
    // ==========================================

    it('should render all components without errors', () => {
        // Arrange & Act - Render all components
        const components = [
            <PawPrint key="paw" />,
            <WashiTape key="washi" />,
            <WhiskIcon key="whisk" />,
            <HandDrawnBorder key="border" />,
            <RollingPin key="rolling" />,
            <MixingBowl key="bowl" />,
            <SheltieSilhouette key="sheltie" />,
            <CrystalRating filled={true} key="crystal" />,
            <MagicWand key="wand" />
        ];

        // Assert - None should throw errors
        components.forEach((component) => {
            expect(() => render(component)).not.toThrow();
        });
    });

    it('should maintain consistent SVG namespace', () => {
        // Arrange & Act
        const { container: container1 } = render(<PawPrint />);
        const { container: container2 } = render(<WashiTape />);
        const { container: container3 } = render(<MagicWand />);

        // Assert - All SVGs should have xmlns attribute
        const svg1 = container1.querySelector('svg');
        const svg2 = container2.querySelector('svg');
        const svg3 = container3.querySelector('svg');

        expect(svg1).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
        expect(svg2).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
        expect(svg3).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });
});
