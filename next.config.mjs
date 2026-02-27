/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',

    // ── API Proxies (bypass CORS in dev, same-domain routing in prod) ─────────
    async rewrites() {
        return [
            // Auth microservice: /auth/*, /user/*
            {
                source: '/api/welfi/:path*',
                destination: 'https://api.welfi.ar/microservice-auth/api/v01/:path*',
            },
            // Products microservice: /portfolios, /objectives, /welfi_pesos, etc.
            {
                source: '/api/products/:path*',
                destination: 'https://api.welfi.ar/products-microservice/api/v01/:path*',
            },
            // Engine microservice: /get_panel_for_profile, /get_available_profile, etc.
            {
                source: '/api/engine/:path*',
                destination: 'https://api.welfi.ar/welfi-engine/api/v01/:path*',
            },
        ];
    },
};

export default nextConfig;
