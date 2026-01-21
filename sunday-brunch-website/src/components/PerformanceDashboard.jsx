/**
 * PerformanceDashboard Component
 *
 * Visualizes Web Vitals performance metrics with whimsical Sunday Brunch styling.
 * Displays LCP, INP, CLS, FCP, and TTFB with good/needs-improvement/poor indicators.
 *
 * Props: None
 */

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'
import logger from '../lib/logger'
import './PerformanceDashboard.css'

const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  INP: { good: 200, needsImprovement: 500 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 }
}

const METRIC_INFO = {
  LCP: {
    name: 'Largest Contentful Paint',
    description: 'Time until the largest content element is visible',
    unit: 'ms',
    sheltieComment: 'Giselle says: "Timing is everything, darling."'
  },
  INP: {
    name: 'Interaction to Next Paint',
    description: 'Responsiveness to user interactions',
    unit: 'ms',
    sheltieComment: 'Havok says: "I clicked it! DID YOU SEE ME CLICK IT?"'
  },
  CLS: {
    name: 'Cumulative Layout Shift',
    description: 'Visual stability during page load',
    unit: '',
    sheltieComment: 'Phaedra says: "Stable layouts are scientifically superior."'
  },
  FCP: {
    name: 'First Contentful Paint',
    description: 'Time until first content appears',
    unit: 'ms',
    sheltieComment: 'Tiana says: "First impressions are magical moments."'
  },
  TTFB: {
    name: 'Time to First Byte',
    description: 'Server response time',
    unit: 'ms',
    sheltieComment: 'Giselle says: "Speed matters in the royal kitchen."'
  }
}

function getRating(metric, value) {
  const thresholds = THRESHOLDS[metric]
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

function formatValue(value, unit) {
  if (unit === '') return value.toFixed(3)
  return `${Math.round(value)}${unit}`
}

function MetricCard({ metric, value, rating, info }) {
  return (
    <div className={`metric-card metric-card--${rating}`} data-testid={`metric-${metric.toLowerCase()}`}>
      <div className="metric-card__header">
        <h3 className="metric-card__title">{metric}</h3>
        <span className={`metric-card__badge metric-card__badge--${rating}`} data-testid={`rating-${metric.toLowerCase()}`}>
          {rating === 'good' ? '✨ Good' : rating === 'needs-improvement' ? '⚠️ Needs Improvement' : '❌ Poor'}
        </span>
      </div>

      <div className="metric-card__value" data-testid={`value-${metric.toLowerCase()}`}>
        {formatValue(value, info.unit)}
      </div>

      <div className="metric-card__info">
        <p className="metric-card__name">{info.name}</p>
        <p className="metric-card__description">{info.description}</p>
      </div>

      <div className="metric-card__thresholds">
        <div className="threshold threshold--good">
          <span className="threshold__label">Good</span>
          <span className="threshold__value">≤ {formatValue(THRESHOLDS[metric].good, info.unit)}</span>
        </div>
        <div className="threshold threshold--needs-improvement">
          <span className="threshold__label">Needs Improvement</span>
          <span className="threshold__value">≤ {formatValue(THRESHOLDS[metric].needsImprovement, info.unit)}</span>
        </div>
      </div>

      <div className="metric-card__comment" data-testid={`comment-${metric.toLowerCase()}`}>
        {info.sheltieComment}
      </div>
    </div>
  )
}

MetricCard.propTypes = {
  metric: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  rating: PropTypes.oneOf(['good', 'needs-improvement', 'poor']).isRequired,
  info: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    sheltieComment: PropTypes.string.isRequired
  }).isRequired
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    logger.debug('Performance dashboard mounted')

    // Collect Web Vitals metrics
    const handleMetric = (metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric.value
      }))
      logger.debug(`Web Vitals metric collected: ${metric.name} = ${metric.value}`)
    }

    try {
      onCLS(handleMetric)
      onINP(handleMetric)
      onLCP(handleMetric)
      onFCP(handleMetric)
      onTTFB(handleMetric)

      // Mark as loaded after a brief delay to allow metrics to populate
      setTimeout(() => setLoading(false), 1000)
    } catch (error) {
      logger.error('Failed to initialize Web Vitals collection', error)
      setLoading(false)
    }

    return () => {
      logger.debug('Performance dashboard unmounted')
    }
  }, [])

  if (loading) {
    return (
      <div className="performance-dashboard" data-testid="performance-dashboard-loading">
        <div className="performance-dashboard__header">
          <h1 className="performance-dashboard__title">Performance Metrics</h1>
          <p className="performance-dashboard__subtitle">Loading Web Vitals data...</p>
        </div>
        <div className="performance-dashboard__loading">
          <div className="loading-paw">🐾</div>
        </div>
      </div>
    )
  }

  const hasMetrics = Object.keys(metrics).length > 0

  return (
    <div className="performance-dashboard" data-testid="performance-dashboard">
      <div className="performance-dashboard__header">
        <h1 className="performance-dashboard__title">Performance Metrics</h1>
        <p className="performance-dashboard__subtitle">
          Real-time Web Vitals monitoring for Sunday Brunch With Giselle
        </p>
        {!hasMetrics && (
          <p className="performance-dashboard__notice">
            Interact with the page to collect performance data
          </p>
        )}
      </div>

      {hasMetrics ? (
        <div className="metrics-grid" data-testid="metrics-grid">
          {Object.entries(metrics).map(([metric, value]) => (
            <MetricCard
              key={metric}
              metric={metric}
              value={value}
              rating={getRating(metric, value)}
              info={METRIC_INFO[metric]}
            />
          ))}
        </div>
      ) : (
        <div className="performance-dashboard__empty" data-testid="performance-dashboard-empty">
          <div className="empty-state">
            <div className="empty-state__icon">📊</div>
            <h2 className="empty-state__title">No Metrics Yet</h2>
            <p className="empty-state__message">
              Navigate around the site to collect performance data. Metrics will appear here automatically.
            </p>
          </div>
        </div>
      )}

      <div className="performance-dashboard__footer">
        <p className="footer-text">
          <strong>Tip:</strong> These metrics are collected in real-time using the{' '}
          <a
            href="https://web.dev/vitals/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Web Vitals
          </a>{' '}
          library and reflect your actual browsing experience.
        </p>
      </div>
    </div>
  )
}
