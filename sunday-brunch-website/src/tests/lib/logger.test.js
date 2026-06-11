import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createLogger, logger } from '../../lib/logger'

describe('Logger', () => {
    let consoleSpy

    beforeEach(() => {
        // Spy on console methods
        consoleSpy = {
            log: vi.spyOn(console, 'log').mockImplementation(() => {}),
            warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
            error: vi.spyOn(console, 'error').mockImplementation(() => {})
        }
    })

    afterEach(() => {
        // Restore console methods
        consoleSpy.log.mockRestore()
        consoleSpy.warn.mockRestore()
        consoleSpy.error.mockRestore()
    })

    describe('createLogger', () => {
        it('should create a logger with context', () => {
            const testLogger = createLogger('TestContext')
            expect(testLogger).toBeDefined()
            expect(testLogger.context).toBe('TestContext')
        })

        it('should create a logger with default context', () => {
            const testLogger = createLogger()
            expect(testLogger.context).toBe('App')
        })
    })

    describe('Default logger', () => {
        it('should export a default logger instance', () => {
            expect(logger).toBeDefined()
            expect(logger.context).toBe('App')
        })
    })

    describe('Logger methods', () => {
        let testLogger

        beforeEach(() => {
            testLogger = createLogger('Test')
        })

        it('should have debug method', () => {
            expect(typeof testLogger.debug).toBe('function')
        })

        it('should have info method', () => {
            expect(typeof testLogger.info).toBe('function')
        })

        it('should have warn method', () => {
            expect(typeof testLogger.warn).toBe('function')
        })

        it('should have error method', () => {
            expect(typeof testLogger.error).toBe('function')
        })

        it('should have child method', () => {
            expect(typeof testLogger.child).toBe('function')
        })
    })

    describe('Child logger', () => {
        it('should create child logger with nested context', () => {
            const parentLogger = createLogger('Parent')
            const childLogger = parentLogger.child('Child')

            expect(childLogger).toBeDefined()
            expect(childLogger.context).toBe('Parent:Child')
        })

        it('should allow multiple levels of nesting', () => {
            const logger1 = createLogger('Level1')
            const logger2 = logger1.child('Level2')
            const logger3 = logger2.child('Level3')

            expect(logger3.context).toBe('Level1:Level2:Level3')
        })
    })

    describe('Test environment behavior', () => {
        it('should not log in test environment', () => {
            const testLogger = createLogger('Test')

            testLogger.debug('Debug message')
            testLogger.info('Info message')

            // In test environment, these should not call console
            expect(consoleSpy.log).not.toHaveBeenCalled()
        })

        it('should still allow warn and error in test environment to be called if needed', () => {
            const testLogger = createLogger('Test')

            // These methods exist but don't log in test environment
            expect(() => testLogger.warn('Warning')).not.toThrow()
            expect(() => testLogger.error('Error')).not.toThrow()
        })
    })

    describe('API', () => {
        it('should accept message and data', () => {
            const testLogger = createLogger('Test')

            expect(() => {
                testLogger.debug('Message', { key: 'value' })
                testLogger.info('Message', { key: 'value' })
                testLogger.warn('Message', { key: 'value' })
            }).not.toThrow()
        })

        it('should accept message and error', () => {
            const testLogger = createLogger('Test')
            const error = new Error('Test error')

            expect(() => {
                testLogger.error('Error occurred', error)
            }).not.toThrow()
        })

        it('should work with message only', () => {
            const testLogger = createLogger('Test')

            expect(() => {
                testLogger.debug('Debug')
                testLogger.info('Info')
                testLogger.warn('Warn')
                testLogger.error('Error')
            }).not.toThrow()
        })
    })
})
