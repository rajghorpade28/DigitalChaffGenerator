(function() {
    if (window.__dcg_running) return;
    window.__dcg_running = true;
    window.__dcg_stop = false;

    console.log("[DCG Simulator] Starting human-like behavior simulation.");

    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    async function simulate() {
        await sleep(randomInt(2000, 4000)); // Initial content loading/reading pause
        
        const viewportHeight = window.innerHeight;
        let attempts = 0;
        
        while (attempts < 20 && !window.__dcg_stop) {
            // Read next block of content (scroll down)
            const step = randomInt(viewportHeight * 0.2, viewportHeight * 0.7);
            window.scrollBy({ top: step, behavior: 'smooth' });
            
            // Human reading pause
            await sleep(randomInt(3000, 6000));
            
            // Sporadically scroll backwards slightly
            if (Math.random() < 0.2) {
                window.scrollBy({ top: -randomInt(50, 200), behavior: 'smooth' });
                await sleep(randomInt(1000, 2500));
            }
            
            // Occasional safe clicks (internal links only)
            if (Math.random() < 0.15) {
                const links = Array.from(document.querySelectorAll('a')).filter(a => {
                    return a.href.startsWith(window.location.origin) && !a.href.includes('#');
                });
                if (links.length > 0) {
                    const randomLink = links[Math.floor(Math.random() * links.length)];
                    console.log("[DCG Simulator] Simulating safe internal click to:", randomLink.href);
                    randomLink.click();
                    break; // After clicking, a new page loads, so this simulation instance closes context
                }
            }
            
            attempts++;
        }
        console.log("[DCG Simulator] Simulation logic block finished.");
    }
    
    simulate();
})();