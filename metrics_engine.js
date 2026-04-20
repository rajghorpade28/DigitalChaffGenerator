import { StorageManager } from './storage.js';

export const MetricsEngine = {
    calculateEntropy(distribution) {
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        if (total === 0) return 0;
        
        let entropy = 0;
        for (const count of Object.values(distribution)) {
            if (count > 0) {
                const p = count / total;
                entropy -= p * Math.log2(p);
            }
        }
        return parseFloat(entropy.toFixed(2));
    },
    
    calculateCertainty(entropy, numCategories) {
        const maxEntropy = Math.log2(numCategories > 1 ? numCategories : 2);
        if (maxEntropy === 0) return 100;
        const normalized = entropy / maxEntropy;
        const certainty = (1 - normalized) * 100;
        return parseFloat(Math.max(0, Math.min(100, certainty)).toFixed(1));
    },

    async updateMetrics(category) {
        const data = await StorageManager.getMultiple(['categoryDistribution', 'sessionsCount']);
        const distribution = data.categoryDistribution || {};
        distribution[category] = (distribution[category] || 0) + 1;
        
        const numCategories = 5; // Base categories count
        const entropy = this.calculateEntropy(distribution);
        const certainty = this.calculateCertainty(entropy, numCategories);
        const count = (data.sessionsCount || 0) + 1;

        await StorageManager.setMultiple({
            categoryDistribution: distribution,
            entropy: entropy,
            certainty: certainty,
            sessionsCount: count
        });
    }
};