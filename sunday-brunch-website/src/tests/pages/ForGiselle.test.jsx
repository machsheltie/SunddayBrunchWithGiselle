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
})
