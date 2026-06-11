// Sparkle & flour click explosions — single source of truth.
// Matches preview-magical.html createSparkles (lines 2637-2686): particles are
// appended to document.body with position:fixed at the cursor so the ±150px
// burst is never clipped by a button's overflow:hidden.

export function createSparkles(e) {
    const sparklesCount = 12;

    for (let i = 0; i < sparklesCount; i++) {
        const particle = document.createElement('div');
        const isFlour = i % 2 === 0;
        particle.className = isFlour ? 'flour-particle' : 'sparkle-particle';

        const size = isFlour ? Math.random() * 6 + 2 : Math.random() * 10 + 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.position = 'fixed';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;

        if (isFlour) {
            particle.style.background = i % 4 === 0 ? '#fce1e4' : '#fff3e0';
        }

        const tx = (Math.random() - 0.5) * 150;
        const ty = (Math.random() - 0.5) * 150;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 800);
    }
}
