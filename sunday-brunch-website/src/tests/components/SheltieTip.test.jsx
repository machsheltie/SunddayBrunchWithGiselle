import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SheltieTip from '../../components/SheltieTip';

// Mock CSS import (matches the pattern used in RecipeTemplate.test.jsx)
vi.mock('../../components/SheltieTip.css', () => ({}));

describe('SheltieTip', () => {
    describe('Casual tip mode (no segmentName)', () => {
        it('should render the default Giselle name when no character is given', () => {
            render(<SheltieTip><p>Hello there</p></SheltieTip>);

            expect(screen.getByText('Giselle says...')).toBeInTheDocument();
            expect(screen.getByText('Hello there')).toBeInTheDocument();
        });

        it('should render the casual name for the given character', () => {
            render(<SheltieTip character="havok"><p>Recon active</p></SheltieTip>);

            expect(screen.getByText('Havok barks...')).toBeInTheDocument();
        });

        it('should set the avatar alt text to the dog name without the verb', () => {
            render(<SheltieTip character="tiana"><p>Yum</p></SheltieTip>);

            expect(screen.getByAltText('Tiana')).toBeInTheDocument();
        });
    });

    describe('Named segment mode (segmentName + purpose)', () => {
        it('should render the named segment header with a paw and hide the casual name', () => {
            render(
                <SheltieTip
                    character="havok"
                    segmentName="Havok's Kitchen Recon"
                    purpose="equipment & substitution intel"
                >
                    <p>Gear check.</p>
                </SheltieTip>
            );

            expect(screen.getByText(/Havok's Kitchen Recon/)).toBeInTheDocument();
            expect(screen.getByText('equipment & substitution intel')).toBeInTheDocument();
            expect(screen.queryByText('Havok barks...')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should render as an aside labelled by the segment name when provided', () => {
            const { container } = render(
                <SheltieTip character="phaedra" segmentName="Phaedra's Porch Light">
                    <p>Science!</p>
                </SheltieTip>
            );
            const aside = container.querySelector('aside.sheltie-tip');

            expect(aside).toBeInTheDocument();
            expect(aside).toHaveAttribute('aria-label', "Phaedra's Porch Light");
        });

        it('should fall back to the dog name for the aria-label when no segmentName', () => {
            const { container } = render(
                <SheltieTip character="giselle"><p>Decree.</p></SheltieTip>
            );
            const aside = container.querySelector('aside.sheltie-tip');

            expect(aside).toHaveAttribute('aria-label', 'Giselle');
        });
    });
});
