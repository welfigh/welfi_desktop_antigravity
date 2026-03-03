/** @type {import('next').NextConfig} */
const API_BASE = process.env.API_BASE ?? "https://api.welfi.ar";

const nextConfig = {
    output: 'standalone',

    // ── API Proxies (bypass CORS in dev, same-domain routing in prod) ─────────
    async rewrites() {
        return [
            // Auth microservice
            {
                source: '/api/welfi/:path*',
                destination: `${API_BASE}/microservice-auth/api/v01/:path*`,
            },
            // Products microservice
            {
                source: '/api/products/:path*',
                destination: `${API_BASE}/products-microservice/api/v01/:path*`,
            },
            // Engine microservice
            {
                source: '/api/engine/:path*',
                destination: `${API_BASE}/welfi-engine/api/v01/:path*`,
            },
        ];
    },
};

export default nextConfig;
