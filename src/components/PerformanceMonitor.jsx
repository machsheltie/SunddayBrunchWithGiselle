import { useEffect, useState } from 'react'
import './PerformanceMonitor.css'

/**
 * Performance Monitor Component
 * Displays real-time performance metrics in development mode
 * Helps identify performance bottlenecks during development
 */
function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    domNodes: 0,
    jsHeap: 0,
    renderTime: 0,
    paintTime: 0
  })

  const [isVisible, setIsVisible] = useState(
    process.env.NODE_ENV === 'development' &&
    localStorage.getItem('showPerfMonitor') !== 'false'
  )

  useEffect(() => {
    if (!isVisible) return

    let frameCount = 0
    let lastTime = performance.now()
    let rafId

    // FPS Counter
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime))
        }))
        frameCount = 0
        lastTime = currentTime
      }

      rafId = requestAnimationFrame(measureFPS)
    }

    // Start FPS monitoring
    rafId = requestAnimationFrame(measureFPS)

    // Performance Observer for paint timing
    let observer
    if ('PerformanceObserver' in window) {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.entryType === 'paint') {
            setMetrics(prev => ({
              ...prev,
              paintTime: Math.round(entry.startTime)
            }))
          } else if (entry.entryType === 'measure') {
            setMetrics(prev => ({
              ...prev,
              renderTime: Math.round(entry.duration)
            }))
          }
        })
      })

      try {
        observer.observe({ entryTypes: ['paint', 'measure'] })
      } catch (e) {
        console.warn('Performance monitoring not fully supported')
      }
    }

    // Memory and DOM monitoring
    const intervalId = setInterval(() => {
      // DOM Nodes count
      const domNodes = document.getElementsByTagName('*').length

      // Memory usage (Chrome only)
      const memoryInfo = performance.memory
      const memory = memoryInfo
        ? Math.round(memoryInfo.usedJSHeapSize / 1048576) // Convert to MB
        : 0

      const jsHeap = memoryInfo
        ? Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100)
        : 0

      setMetrics(prev => ({
        ...prev,
        domNodes,
        memory,
        jsHeap
      }))
    }, 1000)

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(intervalId)
      if (observer) observer.disconnect()
    }
  }, [isVisible])

  // Web Vitals monitoring
  useEffect(() => {
    if (!isVisible) return

    const reportWebVitals = async () => {
      if ('web-vital' in window) return

      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals')

        getCLS(metric => console.log('CLS:', metric.value))
        getFID(metric => console.log('FID:', metric.value))
        getFCP(metric => console.log('FCP:', metric.value))
        getLCP(metric => console.log('LCP:', metric.value))
        getTTFB(metric => console.log('TTFB:', metric.value))
      } catch (e) {
        console.warn('Web Vitals not available')
      }
    }

    reportWebVitals()
  }, [isVisible])

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null
  }

  const getFPSColor = (fps) => {
    if (fps >= 55) return '#10b981' // Green
    if (fps >= 30) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  const getMemoryColor = (memory) => {
    if (memory < 50) return '#10b981' // Green
    if (memory < 100) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  const getDOMColor = (nodes) => {
    if (nodes < 1500) return '#10b981' // Green
    if (nodes < 3000) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  return (
    <div className="perf-monitor">
      <button
        className="perf-monitor__toggle"
        onClick={() => {
          setIsVisible(false)
          localStorage.setItem('showPerfMonitor', 'false')
        }}
        aria-label="Close performance monitor"
      >
        ×
      </button>

      <div className="perf-monitor__grid">
        <div className="perf-monitor__metric">
          <span className="perf-monitor__label">FPS</span>
          <span
            className="perf-monitor__value"
            style={{ color: getFPSColor(metrics.fps) }}
          >
            {metrics.fps}
          </span>
        </div>

        <div className="perf-monitor__metric">
          <span className="perf-monitor__label">Memory</span>
          <span
            className="perf-monitor__value"
            style={{ color: getMemoryColor(metrics.memory) }}
          >
            {metrics.memory}MB
          </span>
        </div>

        <div className="perf-monitor__metric">
          <span className="perf-monitor__label">DOM</span>
          <span
            className="perf-monitor__value"
            style={{ color: getDOMColor(metrics.domNodes) }}
          >
            {metrics.domNodes}
          </span>
        </div>

        <div className="perf-monitor__metric">
          <span className="perf-monitor__label">Heap</span>
          <span
            className="perf-monitor__value"
            style={{ color: metrics.jsHeap > 80 ? '#ef4444' : '#10b981' }}
          >
            {metrics.jsHeap}%
          </span>
        </div>
      </div>

      <div className="perf-monitor__timing">
        {metrics.paintTime > 0 && (
          <div className="perf-monitor__timing-item">
            Paint: {metrics.paintTime}ms
          </div>
        )}
        {metrics.renderTime > 0 && (
          <div className="perf-monitor__timing-item">
            Render: {metrics.renderTime}ms
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMonitor