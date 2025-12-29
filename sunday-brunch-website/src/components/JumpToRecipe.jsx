import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './JumpToRecipe.css'

function JumpToRecipe({ targetId = 'jump-to-recipe' }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400)
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
        <motion.button
            className="jump-to-recipe alchemist-jump"
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                boxShadow: "0 0 20px rgba(233, 213, 255, 0.6)"
            }}
            aria-label="Jump to recipe"
        >
            <span className="alchemist-jump__icon">📜</span>
            <span className="alchemist-jump__text">Jump to Spell</span>
        </motion.button>
    )
}

export default JumpToRecipe
