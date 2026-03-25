import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [new URL('https://avatar.vercel.sh/shadcn1'), new URL('https://lede-admin.dailydot.com/wp-content/uploads/sites/69/2024/04/travis-scott-fish-meme-.jpg')],
    },
};

export default nextConfig;
