import { StorageManager } from './storage.js';

export const PersonaEngine = {
    profiles: {
        tech_curious: { tech: 0.6, news: 0.2, finance: 0.1, travel: 0.05, health: 0.05 },
        health_conscious: { health: 0.6, news: 0.2, travel: 0.1, tech: 0.05, finance: 0.05 },
        finance_planner: { finance: 0.6, news: 0.2, tech: 0.1, travel: 0.05, health: 0.05 },
        travel_dreamer: { travel: 0.6, news: 0.2, health: 0.1, finance: 0.05, tech: 0.05 },
        default: { news: 0.4, tech: 0.15, health: 0.15, finance: 0.15, travel: 0.15 }
    },
    
    async getNextCategory() {
        const currentPersona = await StorageManager.get('currentPersona', 'tech_curious');
        const categories = this.profiles[currentPersona] || this.profiles.default;
        
        const rand = Math.random();
        let cumulative = 0;
        for (const [cat, weight] of Object.entries(categories)) {
            cumulative += weight;
            if (rand <= cumulative) {
                return cat;
            }
        }
        return 'news';
    },

    async rotatePersona() {
        const keys = Object.keys(this.profiles).filter(k => k !== 'default');
        const current = await StorageManager.get('currentPersona', 'tech_curious');
        const others = keys.filter(k => k !== current);
        
        const next = others[Math.floor(Math.random() * others.length)];
        console.log(`[PersonaEngine] Rotating persona: ${current} -> ${next}`);
        
        await StorageManager.set('currentPersona', next);
        chrome.runtime.sendMessage({ type: "PERSONA_CHANGED", persona: next }).catch(() => {});
        return next;
    }
};