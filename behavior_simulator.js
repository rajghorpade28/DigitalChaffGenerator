(function() {
    if (window.__dcg_running) return;
    window.__dcg_running = true;
    window.__dcg_stop    = false;

    console.log('[DCG Simulator] Starting advanced human-like behavior simulation.');

    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const sleep     = (ms)       => new Promise(r => setTimeout(r, ms));

    // Background tabs aggressively throttle setInterval to 1000ms minimum.
    // Instead of smooth high-FPS animation, we use a few discrete steps so it completes in time.
    async function customScrollBy(distance) {
        const steps = randomInt(3, 6);
        const stepDistance = distance / steps;
        
        for (let i = 0; i < steps; i++) {
            if (window.__dcg_stop) return;
            
            // Add some randomness to simulate human imperfection
            const multiplier = randomInt(8, 12) / 10;
            window.scrollBy({ top: stepDistance * multiplier, left: 0, behavior: 'auto' });
            
            simulateMouseMovement();
            
            // This sleep will likely be throttled to 1000ms by Chrome in the background, 
            // which means 5 steps = ~5 seconds per scroll action.
            await sleep(randomInt(50, 150)); 
        }
    }

    // Simulate erratic, human-like mouse movements
    function simulateMouseMovement() {
        if (Math.random() > 0.9) return; // Only skip 10% of the time (increased frequency)

        // Fallbacks in case background tab viewport is 0x0
        const width = window.innerWidth || document.documentElement.clientWidth || 1024;
        const height = window.innerHeight || document.documentElement.clientHeight || 800;

        const x = randomInt(10, width - 10);
        const y = randomInt(10, height - 10);
        
        const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            movementX: randomInt(-5, 5),
            movementY: randomInt(-5, 5)
        });
        document.dispatchEvent(event);
    }

    // Select random text on the page (common human reading habit)
    function simulateTextSelection() {
        try {
            const paragraphs = Array.from(document.querySelectorAll('p, span, div'))
                .filter(el => el.innerText && el.innerText.length > 50 && isElementInViewport(el));
            
            if (paragraphs.length > 0) {
                const target = paragraphs[randomInt(0, paragraphs.length - 1)];
                const selection = window.getSelection();
                const range = document.createRange();
                
                // Select a chunk of text inside the element
                if (target.firstChild && target.firstChild.nodeType === Node.TEXT_NODE) {
                    const textLen = target.firstChild.length;
                    if (textLen > 20) {
                        range.setStart(target.firstChild, randomInt(0, Math.floor(textLen / 3)));
                        range.setEnd(target.firstChild, randomInt(Math.floor(textLen / 2), textLen));
                        selection.removeAllRanges();
                        selection.addRange(range);
                        console.log('[DCG Simulator] Simulated text selection.');
                    }
                }
            }
        } catch (e) {
            // Ignore selection errors
        }
    }

    // Check if element is actually visible to the "user"
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    async function simulate() {
        // Hard timeout: force close after 85 seconds to guarantee no hung tabs
        setTimeout(() => {
            console.log('[DCG Simulator] Hard timeout reached, forcing close.');
            notifyDone();
        }, 85000);

        // Initial pause — let the page fully render
        await sleep(randomInt(2000, 4000));
        simulateMouseMovement();

        const viewportHeight = window.innerHeight;
        let   attempts       = 0;
        const startTime      = Date.now();
        const minRunTime     = 70000; // 70 seconds minimum activity
        const maxScrolls     = randomInt(20, 40); // Increased scroll count

        while ((attempts < maxScrolls || (Date.now() - startTime) < minRunTime) && !window.__dcg_stop) {
            // Scroll down to read the next section
            const step = randomInt(viewportHeight * 0.25, viewportHeight * 0.65);
            await customScrollBy(step);

            // Human reading pause + selection (REDUCED IDLE TIMES)
            simulateMouseMovement();
            if (Math.random() < 0.6) { // Increased selection chance
                simulateTextSelection();
                await sleep(randomInt(400, 1200));
            } else {
                await sleep(randomInt(300, 1000));
            }

            // Occasionally scroll back slightly (re-reading)
            if (Math.random() < 0.2) {
                await customScrollBy(-randomInt(50, 180));
                await sleep(randomInt(300, 1000));
            }

            // Frequently click a safe internal link (70% chance - increased)
            if (Math.random() < 0.70) {
                const links = Array.from(document.querySelectorAll('a')).filter(a =>
                    a.href &&
                    a.href.startsWith(window.location.origin) &&
                    !a.href.includes('#') &&
                    !a.href.includes('javascript') &&
                    isElementInViewport(a) // MUST be visible to click it
                );
                
                if (links.length > 0) {
                    const pick = links[Math.floor(Math.random() * links.length)];
                    console.log('[DCG Simulator] Safe internal click:', pick.href);
                    
                    // Simulate mouse down/up before click
                    const rect = pick.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    
                    pick.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: cx, clientY: cy }));
                    await sleep(randomInt(100, 300));
                    
                    pick.click();
                    notifyDone();
                    return;
                }
            }

            attempts++;
        }

        console.log('[DCG Simulator] Simulation finished neatly after ' + attempts + ' scrolls.');
        notifyDone();
    }

    function notifyDone() {
        if (window.__dcg_notified) return;
        window.__dcg_notified = true;
        try {
            chrome.runtime.sendMessage({ type: 'SIMULATION_DONE' }, () => {
                void chrome.runtime.lastError;
            });
        } catch (e) {
            console.warn('[DCG Simulator] Could not notify background:', e.message);
        }
    }

    simulate();
})();