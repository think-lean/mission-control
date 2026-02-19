"use client";

import { useQuery as useConvexQuery, useMutation as useConvexMutation } from "convex/react";

// Wrapper hooks that provide fallback data during development
// before Convex is fully configured

export function useQuery(query: any, args?: any) {
  try {
    // @ts-ignore
    const result = useConvexQuery(query, args);
    return result;
  } catch (e) {
    // Return empty data if Convex isn't connected yet
    if (query?.includes?.("memories.getStats")) {
      return { total: 0, byCategory: {} };
    }
    return [];
  }
}

export function useMutation(mutation: any) {
  try {
    // @ts-ignore
    return useConvexMutation(mutation);
  } catch (e) {
    // Return a no-op function if Convex isn't connected
    return async () => {
      console.warn("Convex not connected - mutation skipped");
    };
  }
}
