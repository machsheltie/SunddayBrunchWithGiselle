import React from 'react'
import { motion } from 'framer-motion'
import './PrismLayer.css'

function PrismLayer() {
    return (
        <div className="prism-layer" aria-hidden="true">
            {/* Fractured Glass Shards */}
            <motion.div
                className="prism-shard shard-1"
                animate={{
                    rotate: [0, 2, 0],
                    x: [0, 10, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="prism-shard shard-2"
                animate={{
                    rotate: [0, -3, 0],
                    x: [0, -15, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Chromatic Aberration Vignette */}
            <div className="prism-vignette"></div>
        </div>
    )
}

export default PrismLayer
