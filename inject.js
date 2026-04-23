try {
    // Spoof Canvas Fingerprinting by adding invisible noise to getImageData/toDataURL
    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function() {
        const ctx = this.getContext('2d');
        if (ctx) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            ctx.fillStyle = `rgba(${r},${g},${b},0.01)`;
            ctx.fillRect(0, 0, 1, 1);
        }
        return origToDataURL.apply(this, arguments);
    };

    const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function() {
        const data = origGetImageData.apply(this, arguments);
        if (data && data.data && data.data.length > 0) {
            // Tweak one random pixel slightly
            const index = Math.floor(Math.random() * (data.data.length / 4)) * 4;
            data.data[index] = data.data[index] + (Math.random() > 0.5 ? 1 : -1);
        }
        return data;
    };

    // Spoof WebGL Vendor/Renderer
    const origGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(param) {
        if (param === 37445) return 'Google Inc. (Apple)'; // UNMASKED_VENDOR_WEBGL
        if (param === 37446) return 'Apple GPU'; // UNMASKED_RENDERER_WEBGL
        return origGetParameter.apply(this, arguments);
    };
    console.log("[DCG] Fingerprint protection active (MAIN world).");
} catch(e) {}
