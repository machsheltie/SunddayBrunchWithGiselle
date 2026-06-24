import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ForGiselle from '../../pages/ForGiselle'

describe('ForGiselle memorial page', () => {
    it('opens with a hero that frames Giselle\'s photo with her name beneath it', () => {
        render(<ForGiselle />)

        // The portrait carries descriptive alt text for screen readers.
        const photo = screen.getByAltText(/Giselle.*Sheltie.*agility/i)
        expect(photo).toBeTruthy()
        expect(photo.getAttribute('src')).toMatch(/giselle-hero/)

        // Her name sits beneath the photo, with her years as a plaque line.
        expect(screen.getByRole('heading', { level: 1, name: 'For Giselle' })).toBeTruthy()
        expect(screen.getByText(/2015\s*[–-]\s*2026/)).toBeTruthy()
    })

    it('renders the dedication to Giselle and Stacey\'s signature', () => {
        render(<ForGiselle />)

        expect(screen.getByRole('heading', { level: 1, name: 'For Giselle' })).toBeTruthy()
        expect(screen.getByText(/named after a fourteen-pound dog/i)).toBeTruthy()
        expect(screen.getByText(/love letter/i)).toBeTruthy()
        expect(screen.getByText(/Stacey/)).toBeTruthy()
    })

    it('renders the "Those who came before" memorial for Athena', () => {
        render(<ForGiselle />)

        expect(screen.getByRole('heading', { name: /those who came before/i })).toBeTruthy()
        expect(screen.getByRole('heading', { name: /Athena/i })).toBeTruthy()
        expect(screen.getByText(/the supervisor/i)).toBeTruthy()
        expect(screen.getByText(/the one that placed/i)).toBeTruthy()

        // Athena's portrait sits above her name, with descriptive alt text.
        const athenaPhoto = screen.getByAltText(/Athena.*Sheltie.*agility/i)
        expect(athenaPhoto.getAttribute('src')).toMatch(/athena-memorial/)
    })

    it('offers a collapsed "The Rainbow Bridge" expandable section just under the title', () => {
        render(<ForGiselle />)

        const summary = screen.getByText('The Rainbow Bridge')
        expect(summary).toBeTruthy()

        const details = summary.closest('details')
        expect(details).toBeTruthy()
        // Collapsed by default — the label shows before the story is expanded.
        expect(details.open).toBe(false)
        // The Rainbow Bridge story lives inside the expandable.
        expect(details.textContent).toMatch(/just this side of heaven/i)
    })

    it('signals the Rainbow Bridge label is expandable with a quiet downward cue, not a play-style triangle', () => {
        const { container } = render(<ForGiselle />)

        // The generic rainbow emoji has been removed.
        expect(container.textContent).not.toContain('🌈')

        // The old right-pointing "play button" triangle is gone.
        expect(container.querySelector('.rainbow-bridge__caret')).toBeNull()

        // A downward chevron and a gentle textual invitation make the expandable obvious.
        expect(container.querySelector('.rainbow-bridge__chevron')).toBeTruthy()
        expect(screen.getByText(/unfold the story/i)).toBeTruthy()
    })

    it('wraps its content in framed cards rather than letting it sit on the bare background', () => {
        const { container } = render(<ForGiselle />)

        // Dedication and memorials are each presented as a framed card.
        expect(container.querySelectorAll('.for-giselle__card').length).toBeGreaterThanOrEqual(2)
    })
})
