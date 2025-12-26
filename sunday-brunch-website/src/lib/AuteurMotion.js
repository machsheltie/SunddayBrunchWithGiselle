import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * AuteurMotion: The nervous system for visceral digital art.
 * Handles kinetic typography, parallax depth, and atmospheric reveals.
 */
export const AuteurMotion = {
    /**
     * Unmasks typography from the 'parchment' background.
     * @param {string|Element} element - Target header/text
     */
    revealText: (element) => {
        gsap.fromTo(element,
            {
                clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
                y: 50,
                opacity: 0,
                filter: 'blur(10px)'
            },
            {
                clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1.8,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    },

    /**
     * Creates a narrative scroll effect (Parallax) with physical weight.
     * @param {string|Element} element - Target visual element
     * @param {number} speed - Rate of movement relative to scroll (e.g., -0.2)
     */
    applyDepth: (element, speed = -0.15) => {
        gsap.to(element, {
            y: (index, target) => {
                return (ScrollTrigger.maxScroll(window) * speed);
            },
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    },

    /**
     * Magnetic interaction for primary call-to-actions.
     * @param {string|Element} element - The interactive button/link
     */
    makeMagnetic: (element) => {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.6,
                ease: 'power3.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }
};
