/**
 * Logger Utility
 * Centralized logging system that:
 * - Disables console logs in production
 * - Adds context and timestamps
 * - Supports different log levels
 * - Makes it easy to add external logging services later (Sentry, LogRocket, etc.)
 */

const isDevelopment = import.meta.env.DEV
const isTest = import.meta.env.MODE === 'test'

// Log levels
const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
}

// Current log level (can be configured via env)
const currentLogLevel = import.meta.env.VITE_LOG_LEVEL
    ? LogLevel[import.meta.env.VITE_LOG_LEVEL]
    : (isDevelopment ? LogLevel.DEBUG : LogLevel.WARN)

/**
 * Format log message with context
 */
function formatMessage(level, context, message, data) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level}] [${context}]`

    if (data) {
        return [prefix, message, data]
    }
    return [prefix, message]
}

/**
 * Should log at this level
 */
function shouldLog(level) {
    return LogLevel[level] >= currentLogLevel
}

/**
 * Logger class with context
 */
class Logger {
    constructor(context = 'App') {
        this.context = context
    }

    /**
     * Debug level logging (only in development)
     * Use for detailed debugging information
     */
    debug(message, data) {
        if (!shouldLog('DEBUG')) return
        if (isDevelopment && !isTest) {
            const args = formatMessage('DEBUG', this.context, message, data)
            console.log(...args)
        }
    }

    /**
     * Info level logging
     * Use for general information (user actions, state changes)
     */
    info(message, data) {
        if (!shouldLog('INFO')) return
        if (isDevelopment && !isTest) {
            const args = formatMessage('INFO', this.context, message, data)
            console.log(...args)
        }
    }

    /**
     * Warning level logging
     * Use for recoverable errors or unexpected situations
     */
    warn(message, data) {
        if (!shouldLog('WARN')) return
        if (!isTest) {
            const args = formatMessage('WARN', this.context, message, data)
            console.warn(...args)

            // In production, send warnings to external service (future enhancement)
            if (!isDevelopment) {
                // Example: Sentry.captureMessage(message, 'warning')
            }
        }
    }

    /**
     * Error level logging
     * Use for errors that need attention
     */
    error(message, error) {
        if (!shouldLog('ERROR')) return
        if (!isTest) {
            const args = formatMessage('ERROR', this.context, message, error)
            console.error(...args)

            // In production, send errors to external service (future enhancement)
            if (!isDevelopment && error) {
                // Example: Sentry.captureException(error)
            }
        }
    }

    /**
     * Create a child logger with additional context
     */
    child(childContext) {
        return new Logger(`${this.context}:${childContext}`)
    }
}

/**
 * Create a logger instance with context
 * @param {string} context - Context name (e.g., 'Analytics', 'Auth', 'RecipeLoader')
 * @returns {Logger} Logger instance
 */
export function createLogger(context = 'App') {
    return new Logger(context)
}

/**
 * Default logger instance
 */
export const logger = createLogger('App')

export default logger
