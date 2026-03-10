import { NextRequest } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

/**
 * Get client identifier from request
 * Uses x-forwarded-for (proxy), x-real-ip (nginx), or connection socket
 */
export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  return ip.trim();
}

export interface RateLimitConfig {
  maxRequests?: number;
  windowMs?: number; // milliseconds
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetIn: number; // milliseconds
  retryAfter?: number; // seconds
}

/**
 * Check rate limit for client
 * Default: 60 requests per 60 seconds
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const maxRequests = config.maxRequests || 60;
  const windowMs = config.windowMs || 60 * 1000; // 60 seconds default

  const now = Date.now();
  const clientData = rateLimitStore[key];

  // Initialize or reset if window expired
  if (!clientData || now > clientData.resetTime) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  const data = rateLimitStore[key];
  const isLimited = data.count >= maxRequests;
  const remaining = Math.max(0, maxRequests - data.count - 1);
  const resetIn = Math.max(0, data.resetTime - now);

  // Increment count if not limited
  if (!isLimited) {
    data.count++;
  }

  return {
    limited: isLimited,
    remaining,
    resetIn,
    retryAfter: isLimited ? Math.ceil(resetIn / 1000) : undefined,
  };
}

/**
 * Rate limit middleware for API routes
 * Usage:
 * const { limited } = checkRateLimit(clientId, { maxRequests: 10, windowMs: 60000 })
 * if (limited) return errorResponse("Too many requests", 429)
 */
export function createRateLimitFunction(
  config: RateLimitConfig = {}
) {
  return (key: string) => checkRateLimit(key, config);
}

/**
 * Clean up old entries from rate limit store (call periodically)
 * Removes entries older than 2 hours
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours

  Object.entries(rateLimitStore).forEach(([key, data]) => {
    if (now - data.resetTime > maxAge) {
      delete rateLimitStore[key];
    }
  });
}
