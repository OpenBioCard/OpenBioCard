/**
 * API Configuration
 * Centralized API endpoint configuration
 */

const envBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
const formattedBaseUrl = envBaseUrl.endsWith('/') ? envBaseUrl : `${envBaseUrl}/`

export const API_CONFIG = {
    baseUrl: formattedBaseUrl,
    timeout: 30000,
    getUrl(path) {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path
        return `${this.baseUrl}${cleanPath}`
    }
}

export const API_BASE = API_CONFIG.baseUrl

if (import.meta.env.DEV) {
    console.log('API Config:', API_CONFIG)
}
