import React from 'react'
import './WatercolorCanvas.css'

function WatercolorCanvas() {
    return (
        <div className="watercolor-canvas" aria-hidden="true">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
            <div className="blob blob-4"></div>
            {/* Subtle Sheltie Silhouette Blobs */}
            <div className="sheltie-blob sheltie-1"></div>
            <div className="sheltie-blob sheltie-2"></div>
            <div className="petal-layer"></div>
        </div>
    )
}

export default WatercolorCanvas
