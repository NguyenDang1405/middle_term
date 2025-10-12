'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Ưu tiên NEXT_PUBLIC_CONVEX_URL (cho client/browser). Fallback sang CONVEX_URL khi chạy local.
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || '';

export const convex = new ConvexReactClient(convexUrl);
export { ConvexProvider };
