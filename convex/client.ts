import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Using offline mode.");
}

// Use a dummy URL for offline development
const convex = new ConvexReactClient(convexUrl || "https://offline-mode.convex.cloud");

export default convex;
