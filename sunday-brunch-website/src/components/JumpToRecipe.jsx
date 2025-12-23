import { useState, useEffect } from 'react'
import './JumpToRecipe.css'

function JumpToRecipe({ targetId = 'jump-to-recipe' }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling 300px
            setIsVisible(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleClick = () => {
        const element = document.getElementById(targetId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    if (!isVisible) return null

    return (
        <button
            className="jump-to-recipe"
            onClick={handleClick}
            aria-label="Jump to recipe"
        >
            <span className="jump-to-recipe__icon">↓</span>
            <span className="jump-to-recipe__text">Jump to Recipe</span>
        </button>
    )
}

export default JumpToRecipe
