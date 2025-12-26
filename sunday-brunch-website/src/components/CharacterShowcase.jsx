import React from 'react'
import { WashiTape } from './illustrations/Decorations'
import './CharacterShowcase.css'

const characters = [
    {
        id: 'stacey',
        name: 'Stacey',
        role: 'The Human / Artist & Baker',
        bio: 'Baking to find meaning in the mess. Stacey navigates life, anxiety, and sourdough starters with an artist’s eye and a baker’s heart. She believes the best recipes are those shared with friends who have four legs and wet noses.',
        quote: "Maybe the dough just needs a nap. Maybe I do too.",
        image: '/images/stacey_portrait.png',
        color: 'var(--stacey-color)'
    },
    {
        id: 'giselle',
        name: 'Giselle',
        role: 'Head of Operations / Sheltie',
        bio: 'Optimistic, chaotic, and governed by cozy logic. Giselle believes every problem can be solved with a head tilt, a well-timed bark, and the unwavering belief that the oven timer is actually a celebration bell.',
        quote: "The sky is awake, so I am awake! Let's bake!",
        image: '/images/recipes/giselle-portrait.png',
        color: 'var(--giselle-color)'
    },
    {
        id: 'phaedra',
        name: 'Phaedra',
        role: 'Resident Dogter / Food Science Nerd',
        bio: 'A shaded sable with a full white collar, perfectly tipped ears, and a mind for precision. Phaedra analyzes the caramelization of sugar and the structural integrity of crusts with the intellectual intensity of a scientist (who definitely wants a sample).',
        quote: "The Maillard reaction is proceeding optimally. I shall continue my observation.",
        image: '/images/recipes/phaedra-portrait.png',
        color: 'var(--phaedra-color)'
    },
    {
        id: 'tiana',
        name: 'Tiana',
        role: 'The Wildcard / Puppy Spirit',
        bio: 'Pure, unadulterated puppy energy. Tiana is a whirlwind of fluffy fur and sharp teeth, currently learning that "drop it" is a suggestion, not a law, and that flour is surprisingly fun to sneeze in.',
        quote: "I found a leaf! I found a sock! I found... oh, another leaf!",
        image: '/images/recipes/tiana-portrait.png',
        color: 'var(--tiana-color)'
    },
    {
        id: 'havok',
        name: 'Havok',
        role: 'Conformation Champion / Security',
        bio: 'A majestic red sable with two perfectly tipped ears and a full white collar. A champion in the ring and at home, Havok takes his perimeter checks as seriously as his treat allocation—which is to say, very seriously.',
        quote: "The perimeter is secure. You may return to the butter creaming.",
        image: '/images/recipes/havok-portrait.png',
        color: 'var(--havok-color)'
    }
]

function CharacterShowcase() {
    return (
        <section className="character-showcase">
            {characters.map(char => (
                <div key={char.id} className="character-card">
                    <WashiTape
                        className="card-washi"
                        color={char.color}
                        style={{
                            position: 'absolute',
                            top: '-15px',
                            left: '50%',
                            transform: `translateX(-50%) rotate(${Math.random() * 6 - 3}deg)`,
                            width: '80px',
                            zIndex: 10
                        }}
                    />
                    <div className="character-avatar-frame">
                        <div className="watercolor-splash" style={{ backgroundColor: char.color }}></div>
                        <img
                            src={char.image}
                            alt={char.name}
                            className="character-avatar-img"
                            onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                        />
                    </div>
                    <h3 className="character-name">{char.name}</h3>
                    <div className="character-role">{char.role}</div>
                    <p className="character-bio">{char.bio}</p>
                    <div className="character-quote">“{char.quote}”</div>
                </div>
            ))}
        </section>
    )
}

export default CharacterShowcase
