import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/data_course" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === "production" ? "/data_course" : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
