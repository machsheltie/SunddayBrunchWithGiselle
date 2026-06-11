import { BrowserRouter, MemoryRouter } from 'react-router-dom'

/**
 * Router configuration with v7 future flags enabled
 * Use this in tests to prevent future flag warnings
 */
const routerFutureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
}

/**
 * BrowserRouter with v7 future flags enabled
 * Use this instead of bare BrowserRouter in tests
 */
export function TestBrowserRouter({ children, ...props }) {
    return (
        <BrowserRouter future={routerFutureFlags} {...props}>
            {children}
        </BrowserRouter>
    )
}

/**
 * MemoryRouter with v7 future flags enabled
 * Use this instead of bare MemoryRouter in tests
 */
export function TestMemoryRouter({ children, initialEntries = ['/'], ...props }) {
    return (
        <MemoryRouter future={routerFutureFlags} initialEntries={initialEntries} {...props}>
            {children}
        </MemoryRouter>
    )
}
