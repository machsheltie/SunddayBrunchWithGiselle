/**
 * Formats a decimal quantity into a fraction if appropriate for baking.
 * Example: 0.5 -> 1/2, 0.33 -> 1/3, 1.25 -> 1 1/4
 */
export const formatAlchemicalAmount = (amount) => {
    if (!amount || isNaN(amount)) return amount;

    const tolerance = 0.05;
    const whole = Math.floor(amount);
    const fraction = amount - whole;

    const commonFractions = [
        { val: 0, text: '' },
        { val: 0.25, text: '1/4' },
        { val: 0.33, text: '1/3' },
        { val: 0.5, text: '1/2' },
        { val: 0.66, text: '2/3' },
        { val: 0.75, text: '3/4' },
    ];

    let closest = commonFractions[0];
    let minDiff = Math.abs(fraction - closest.val);

    for (let i = 1; i < commonFractions.length; i++) {
        const diff = Math.abs(fraction - commonFractions[i].val);
        if (diff < minDiff) {
            minDiff = diff;
            closest = commonFractions[i];
        }
    }

    if (minDiff < tolerance) {
        if (whole === 0 && closest.val === 0) return '0';
        if (whole === 0) return closest.text;
        if (closest.val === 0) return whole.toString();
        return `${whole} ${closest.text}`;
    }

    // Fallback for non-standard fractions
    return Number(amount.toFixed(2)).toString();
};

/**
 * Provides a sassy or helpful reaction from the Sheltie pack based on scale.
 */
export const getAlchemistReaction = (scale, character = 'giselle') => {
    const reactions = {
        giselle: [
            { threshold: 0.6, text: "A modest snack... for a commoner." },
            { threshold: 1.1, text: "A sensible portion. Carry on." },
            { threshold: 2.1, text: "Now we're talking! A feast fit for royalty!" },
            { threshold: Infinity, text: "Are we feeding the entire kingdom? Magnificent!" }
        ],
        havok: [
            { threshold: 0.6, text: "Recon mission complete. Small batch detected." },
            { threshold: 1.1, text: "Standard rations. Proceed with baking." },
            { threshold: 2.1, text: "Double rations! The troops will be pleased!" },
            { threshold: Infinity, text: "Massive logistical effort required. I'll guard the oven!" }
        ]
    };

    const charReactions = reactions[character] || reactions.giselle;
    return charReactions.find(r => scale <= r.threshold).text;
};
