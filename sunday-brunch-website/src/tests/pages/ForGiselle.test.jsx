import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ForGiselle from '../../pages/ForGiselle'

describe('ForGiselle memorial page', () => {
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

    it('wraps its content in framed cards rather than letting it sit on the bare background', () => {
        const { container } = render(<ForGiselle />)

        // Dedication and memorials are each presented as a framed card.
        expect(container.querySelectorAll('.for-giselle__card').length).toBeGreaterThanOrEqual(2)
    })
})
