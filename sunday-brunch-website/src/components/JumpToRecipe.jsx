import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MagicWand } from './illustrations/Decorations'
import './JumpToRecipe.css'

function JumpToRecipe({ targetId = 'jump-to-recipe' }) {
    const [isVisible, setIsVisible] = useState(false)
    const buttonRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleClick = (e) => {
        // Create sparkles & flour particles
        const rect = buttonRef.current.getBoundingClientRect()
        const sparklesCount = 12

        for (let i = 0; i < sparklesCount; i++) {
            const particle = document.createElement('div')
            const isFlour = i % 2 === 0
            particle.className = isFlour ? 'flour-particle' : 'sparkle'

            // Random position around click
            const size = isFlour ? Math.random() * 6 + 2 : Math.random() * 10 + 5
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            particle.style.width = `${size}px`
            particle.style.height = `${size}px`
            particle.style.left = `${x}px`
            particle.style.top = `${y}px`

            if (isFlour) {
                // Pinky-peach and pale-yellow
                particle.style.background = i % 4 === 0 ? 'var(--soft-sakura)' : 'var(--light-lemon)'
                particle.style.borderRadius = '50%'
                particle.style.filter = 'blur(1px)'
            } else {
                particle.style.background = 'var(--pastel-lavender)'
                particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }

            // Random drift
            const tx = (Math.random() - 0.5) * 150
            const ty = (Math.random() - 0.5) * 150
            particle.style.setProperty('--tx', `${tx}px`)
            particle.style.setProperty('--ty', `${ty}px`)

            buttonRef.current.appendChild(particle)

            // Cleanup
            setTimeout(() => {
                particle.remove()
            }, 800)
        }

        gsap.to(buttonRef.current, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        })

        // Scroll to recipe
        const element = document.getElementById(targetId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    if (!isVisible) return null

    return (
        <button
            ref={buttonRef}
            className="jump-to-recipe floating-btn"
            onClick={handleClick}
            aria-label="Jump to recipe"
        >
            <div className="btn-label">Jump to Recipe</div>
            <MagicWand className="magic-wand-icon" />
        </button>
    )
}

export default JumpToRecipe
