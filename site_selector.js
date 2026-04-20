export const SiteSelector = {
    sites: {
        tech: ['https://en.wikipedia.org/wiki/Technology', 'https://en.wikipedia.org/wiki/Computer_science', 'https://en.wikipedia.org/wiki/Artificial_intelligence'],
        health: ['https://en.wikipedia.org/wiki/Health', 'https://en.wikipedia.org/wiki/Nutrition', 'https://en.wikipedia.org/wiki/Medicine'],
        finance: ['https://en.wikipedia.org/wiki/Finance', 'https://en.wikipedia.org/wiki/Economics', 'https://en.wikipedia.org/wiki/Investment'],
        travel: ['https://en.wikipedia.org/wiki/Travel', 'https://en.wikipedia.org/wiki/Tourism', 'https://en.wikipedia.org/wiki/Adventure_travel'],
        news: ['https://en.wikipedia.org/wiki/News', 'https://en.wikipedia.org/wiki/Journalism', 'https://en.wikipedia.org/wiki/Mass_media']
    },
    
    getSiteForCategory(category) {
        const urls = this.sites[category] || this.sites['news'];
        const randomIndex = Math.floor(Math.random() * urls.length);
        return urls[randomIndex];
    }
};