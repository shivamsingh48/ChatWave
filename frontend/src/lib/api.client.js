import { HOST } from '@/utils/contanst'
import axios from 'axios'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'api_cache_';

const apiClient = axios.create({
    baseURL: HOST,
    timeout: 10000, // 10 second timeout
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Cache helper functions
const getCacheKey = (config) => {
    return CACHE_PREFIX + config.method + config.url + JSON.stringify(config.params || {});
};

const getCachedData = (cacheKey) => {
    const cached = sessionStorage.getItem(cacheKey);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
        sessionStorage.removeItem(cacheKey);
        return null;
    }
    return data;
};

const setCachedData = (cacheKey, data) => {
    sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};

// Add request interceptor for caching
apiClient.interceptors.request.use(async (config) => {
    // Skip caching for non-GET requests
    if (config.method !== 'get') {
        config.headers['Cache-Control'] = 'no-cache';
        return config;
    }

    // Check cache first
    const cacheKey = getCacheKey(config);
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
        // Return cached data immediately
        return Promise.reject({
            config,
            response: { data: cachedData }
        });
    }

    // Add cache control headers
    config.headers['Cache-Control'] = 'no-cache';
    return config;
});

// Add response interceptor for caching
apiClient.interceptors.response.use(
    (response) => {
        // Cache successful GET responses
        if (response.config.method === 'get') {
            const cacheKey = getCacheKey(response.config);
            setCachedData(cacheKey, response.data);
        }
        return response;
    },
    (error) => {
        // If this is a cache hit, return the cached data
        if (error.response && error.response.data) {
            return Promise.resolve(error.response);
        }

        // For network errors, try to get cached data
        if (error.config.method === 'get') {
            const cacheKey = getCacheKey(error.config);
            const cachedData = getCachedData(cacheKey);
            if (cachedData) {
                return Promise.resolve({ data: cachedData });
            }
        }

        return Promise.reject(error);
    }
);

export { apiClient };