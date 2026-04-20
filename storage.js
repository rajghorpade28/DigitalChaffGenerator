export const StorageManager = {
    async get(key, defaultVal) {
        const res = await chrome.storage.local.get(key);
        return res[key] !== undefined ? res[key] : defaultVal;
    },
    async set(key, val) {
        return chrome.storage.local.set({ [key]: val });
    },
    async getMultiple(keys) {
        return await chrome.storage.local.get(keys);
    },
    async setMultiple(obj) {
        return await chrome.storage.local.set(obj);
    }
};