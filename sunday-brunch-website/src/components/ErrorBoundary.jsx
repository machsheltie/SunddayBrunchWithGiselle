import React from 'react'
import './ErrorBoundary.css'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-card">
                        <div className="watercolor-blob" style={{ width: '60px', height: '60px', margin: '0 auto var(--space-4)' }}></div>
                        <h1 className="error-title">Oh dear, a sunken souffle.</h1>
                        <p className="error-message">Something went wrong in the kitchen. Don't worry, even the best bakers have off days.</p>
                        <div className="error-actions">
                            <button className="cta-button" onClick={() => window.location.reload()}>Try Again</button>
                            <a href="/" className="nav__link">Return Home</a>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
