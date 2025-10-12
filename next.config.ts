import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chỉ nhận diện trang với phần mở rộng ts/tsx để tránh đụng độ Pages Router (js)
  pageExtensions: ["ts", "tsx"],
};

export default nextConfig;
