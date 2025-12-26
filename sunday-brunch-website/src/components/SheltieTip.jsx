import React, { useEffect, useRef, useState } from 'react'
import './SheltieTip.css'
import { GiselleAvatar, PhaedraAvatar, TianaAvatar, HavokAvatar } from './illustrations/SheltieAvatars'

function SheltieTip({ character = 'giselle', children }) {
    const [hasWiggled, setHasWiggled] = useState(false);
    const tipRef = useRef(null);

    const characterConfig = {
        giselle: { name: 'Giselle', title: 'The Queen', Avatar: GiselleAvatar },
        phaedra: { name: 'Phaedra', title: 'The Science Dogter', Avatar: PhaedraAvatar },
        tiana: { name: 'Tiana', title: 'The Joyful Taster', Avatar: TianaAvatar },
        havok: { name: 'Havok', title: 'The Kitchen War Correspondent', Avatar: HavokAvatar }
    }

    const { name, title, Avatar } = characterConfig[character] || characterConfig.giselle

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasWiggled) {
                    setHasWiggled(true);
                }
            },
            { threshold: 0.5 }
        );

        if (tipRef.current) {
            observer.observe(tipRef.current);
        }

        return () => observer.disconnect();
    }, [hasWiggled]);

    return (
        <div
            ref={tipRef}
            className={`sheltie-tip sheltie-tip--${character} ${hasWiggled ? 'should-wiggle' : ''}`}
        >
            <div className="sheltie-tip__avatar-wrapper">
                <Avatar className="sheltie-tip__avatar" />
            </div>
            <div className="sheltie-tip__body">
                <div className="sheltie-tip__header">
                    <span className="sheltie-tip__name">{name}</span>
                    <span className="sheltie-tip__title">{title}</span>
                </div>
                <div className="sheltie-tip__content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SheltieTip
