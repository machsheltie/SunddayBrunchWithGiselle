import './SheltieTip.css'
import { GiselleAvatar, PhaedraAvatar, TianaAvatar, HavokAvatar } from './illustrations/SheltieAvatars'

function SheltieTip({ character = 'giselle', children }) {
    const characterConfig = {
        giselle: { name: 'Giselle', title: 'The Queen', Avatar: GiselleAvatar },
        phaedra: { name: 'Phaedra', title: 'The Science Dogter', Avatar: PhaedraAvatar },
        tiana: { name: 'Tiana', title: 'The Joyful Taster', Avatar: TianaAvatar },
        havok: { name: 'Havok', title: 'The Kitchen War Correspondent', Avatar: HavokAvatar }
    }

    const { name, title, Avatar } = characterConfig[character] || characterConfig.giselle

    return (
        <div className={`sheltie-tip sheltie-tip--${character}`}>
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
