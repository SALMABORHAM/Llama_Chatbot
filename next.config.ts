// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

module.exports = {
  publicRuntimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY,
  },
};
