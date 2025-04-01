// next.config.mjs
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [
        'covers.openlibrary.org',
        'ia800604.us.archive.org',
        'ia801604.us.archive.org'
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.archive.org',
          pathname: '**',
        },
      ],
    },
  };
  
  // Use ES modules export syntax
  export default nextConfig;