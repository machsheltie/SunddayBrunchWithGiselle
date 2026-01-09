/**
 * Test suite for culinaryUtils.js
 * Tests formatAlchemicalAmount() and getAlchemistReaction()
 */

import { formatAlchemicalAmount, getAlchemistReaction } from '../../lib/culinaryUtils';

describe('culinaryUtils', () => {
  describe('formatAlchemicalAmount', () => {
    describe('basic fraction conversions', () => {
      it('should convert 0.5 to "1/2"', () => {
        expect(formatAlchemicalAmount(0.5)).toBe('1/2');
      });

      it('should convert 0.25 to "1/4"', () => {
        expect(formatAlchemicalAmount(0.25)).toBe('1/4');
      });

      it('should convert 0.33 to "1/3"', () => {
        expect(formatAlchemicalAmount(0.33)).toBe('1/3');
      });

      it('should convert 0.66 to "2/3"', () => {
        expect(formatAlchemicalAmount(0.66)).toBe('2/3');
      });

      it('should convert 0.75 to "3/4"', () => {
        expect(formatAlchemicalAmount(0.75)).toBe('3/4');
      });
    });

    describe('mixed numbers (whole + fraction)', () => {
      it('should convert 1.25 to "1 1/4"', () => {
        expect(formatAlchemicalAmount(1.25)).toBe('1 1/4');
      });

      it('should convert 2.5 to "2 1/2"', () => {
        expect(formatAlchemicalAmount(2.5)).toBe('2 1/2');
      });

      it('should convert 3.75 to "3 3/4"', () => {
        expect(formatAlchemicalAmount(3.75)).toBe('3 3/4');
      });

      it('should convert 2.33 to "2 1/3"', () => {
        expect(formatAlchemicalAmount(2.33)).toBe('2 1/3');
      });
    });

    describe('whole numbers', () => {
      it('should handle 0 correctly (return 0)', () => {
        // Implementation returns the value itself for 0 (falsy check)
        expect(formatAlchemicalAmount(0)).toBe(0);
      });

      it('should handle whole numbers (return as string)', () => {
        expect(formatAlchemicalAmount(1)).toBe('1');
        expect(formatAlchemicalAmount(2)).toBe('2');
        expect(formatAlchemicalAmount(5)).toBe('5');
      });
    });

    describe('edge cases and tolerance', () => {
      it('should handle null (return null)', () => {
        expect(formatAlchemicalAmount(null)).toBe(null);
      });

      it('should handle undefined (return undefined)', () => {
        expect(formatAlchemicalAmount(undefined)).toBe(undefined);
      });

      it('should handle NaN (return NaN)', () => {
        expect(formatAlchemicalAmount(NaN)).toBe(NaN);
      });

      it('should handle non-standard fractions (fallback to decimal)', () => {
        // 0.4 is not close to any common fraction (tolerance 0.05)
        expect(formatAlchemicalAmount(0.4)).toBe('0.4');

        // 0.6 is not close to any common fraction
        expect(formatAlchemicalAmount(0.6)).toBe('0.6');

        // 0.9 is not close to any common fraction
        expect(formatAlchemicalAmount(0.9)).toBe('0.9');
      });

      it('should handle tolerance matching correctly', () => {
        // 0.48 is within tolerance (0.05) of 0.5
        expect(formatAlchemicalAmount(0.48)).toBe('1/2');

        // 0.52 is within tolerance of 0.5
        expect(formatAlchemicalAmount(0.52)).toBe('1/2');

        // 0.28 is within tolerance of 0.25
        expect(formatAlchemicalAmount(0.28)).toBe('1/4');

        // 0.31 is within tolerance of 0.33
        expect(formatAlchemicalAmount(0.31)).toBe('1/3');
      });

      it('should handle decimal precision correctly', () => {
        // 1.234 fractional part (0.234) is within tolerance of 0.25, so becomes "1 1/4"
        expect(formatAlchemicalAmount(1.234)).toBe('1 1/4');

        // 2.999 fractional part (0.999) is not within tolerance of any common fraction
        // So it falls back to 2 decimal places: 3.00 → "3"
        expect(formatAlchemicalAmount(2.999)).toBe('3');

        // Test a truly non-standard fraction
        expect(formatAlchemicalAmount(1.4)).toBe('1.4');
      });
    });
  });

  describe('getAlchemistReaction', () => {
    describe('giselle reactions', () => {
      it('should return "modest snack" for scale <= 0.6', () => {
        expect(getAlchemistReaction(0.3, 'giselle')).toBe("A modest snack... for a commoner.");
        expect(getAlchemistReaction(0.5, 'giselle')).toBe("A modest snack... for a commoner.");
        expect(getAlchemistReaction(0.6, 'giselle')).toBe("A modest snack... for a commoner.");
      });

      it('should return "sensible portion" for scale 0.61-1.1', () => {
        expect(getAlchemistReaction(0.61, 'giselle')).toBe("A sensible portion. Carry on.");
        expect(getAlchemistReaction(1.0, 'giselle')).toBe("A sensible portion. Carry on.");
        expect(getAlchemistReaction(1.1, 'giselle')).toBe("A sensible portion. Carry on.");
      });

      it('should return "feast" for scale 1.11-2.1', () => {
        expect(getAlchemistReaction(1.11, 'giselle')).toBe("Now we're talking! A feast fit for royalty!");
        expect(getAlchemistReaction(2.0, 'giselle')).toBe("Now we're talking! A feast fit for royalty!");
        expect(getAlchemistReaction(2.1, 'giselle')).toBe("Now we're talking! A feast fit for royalty!");
      });

      it('should return "entire kingdom" for scale > 2.1', () => {
        expect(getAlchemistReaction(2.11, 'giselle')).toBe("Are we feeding the entire kingdom? Magnificent!");
        expect(getAlchemistReaction(5.0, 'giselle')).toBe("Are we feeding the entire kingdom? Magnificent!");
      });
    });

    describe('havok reactions', () => {
      it('should return "small batch" for scale <= 0.6', () => {
        expect(getAlchemistReaction(0.3, 'havok')).toBe("Recon mission complete. Small batch detected.");
        expect(getAlchemistReaction(0.5, 'havok')).toBe("Recon mission complete. Small batch detected.");
        expect(getAlchemistReaction(0.6, 'havok')).toBe("Recon mission complete. Small batch detected.");
      });

      it('should return "standard rations" for scale 0.61-1.1', () => {
        expect(getAlchemistReaction(0.61, 'havok')).toBe("Standard rations. Proceed with baking.");
        expect(getAlchemistReaction(1.0, 'havok')).toBe("Standard rations. Proceed with baking.");
        expect(getAlchemistReaction(1.1, 'havok')).toBe("Standard rations. Proceed with baking.");
      });

      it('should return "double rations" for scale 1.11-2.1', () => {
        expect(getAlchemistReaction(1.11, 'havok')).toBe("Double rations! The troops will be pleased!");
        expect(getAlchemistReaction(2.0, 'havok')).toBe("Double rations! The troops will be pleased!");
        expect(getAlchemistReaction(2.1, 'havok')).toBe("Double rations! The troops will be pleased!");
      });

      it('should return "massive effort" for scale > 2.1', () => {
        expect(getAlchemistReaction(2.11, 'havok')).toBe("Massive logistical effort required. I'll guard the oven!");
        expect(getAlchemistReaction(5.0, 'havok')).toBe("Massive logistical effort required. I'll guard the oven!");
      });
    });

    describe('default character handling', () => {
      it('should default to giselle reactions for unknown character', () => {
        expect(getAlchemistReaction(0.5, 'unknown')).toBe("A modest snack... for a commoner.");
        expect(getAlchemistReaction(1.0, 'invalid')).toBe("A sensible portion. Carry on.");
      });

      it('should default to giselle when no character specified', () => {
        expect(getAlchemistReaction(0.5)).toBe("A modest snack... for a commoner.");
        expect(getAlchemistReaction(1.5)).toBe("Now we're talking! A feast fit for royalty!");
      });
    });

    describe('boundary conditions', () => {
      it('should handle exact threshold values correctly', () => {
        // Test exact boundaries for giselle - thresholds are INCLUSIVE (<=)
        expect(getAlchemistReaction(0.6, 'giselle')).toBe("A modest snack... for a commoner.");
        expect(getAlchemistReaction(1.1, 'giselle')).toBe("A sensible portion. Carry on.");
        expect(getAlchemistReaction(2.1, 'giselle')).toBe("Now we're talking! A feast fit for royalty!");

        // Test exact boundaries for havok
        expect(getAlchemistReaction(0.6, 'havok')).toBe("Recon mission complete. Small batch detected.");
        expect(getAlchemistReaction(1.1, 'havok')).toBe("Standard rations. Proceed with baking.");
        expect(getAlchemistReaction(2.1, 'havok')).toBe("Double rations! The troops will be pleased!");
      });

      it('should handle very small scales', () => {
        expect(getAlchemistReaction(0.01, 'giselle')).toBe("A modest snack... for a commoner.");
        expect(getAlchemistReaction(0.01, 'havok')).toBe("Recon mission complete. Small batch detected.");
      });

      it('should handle very large scales', () => {
        expect(getAlchemistReaction(100, 'giselle')).toBe("Are we feeding the entire kingdom? Magnificent!");
        expect(getAlchemistReaction(100, 'havok')).toBe("Massive logistical effort required. I'll guard the oven!");
      });
    });
  });
});
