/**
 * Application Architecture
 * 
 * Demonstrates professional React app structure with:
 * - Provider pattern for global state
 * - Type-safe routing
 * - Multiple context providers composition
 * - Clean component hierarchy
 * - Separation of concerns
 * 
 * Technologies: React, Wouter, React Query, Solana
 */

// ============================================
// MAIN ENTRY POINT (main.tsx)
// ============================================

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple, clean entry point
createRoot(document.getElementById("root")!).render(<App />);

// ============================================
// APP COMPONENT (App.tsx)
// ============================================

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import Landing from "@/pages/Landing";
import Preview from "@/pages/Preview";
import NotFound from "@/pages/not-found";

/**
 * Router Component
 * 
 * Defines application routes using Wouter (lightweight React Router alternative)
 * Benefits:
 * - 1KB instead of 20KB (React Router)
 * - Hook-based API
 * - Perfect for SPAs
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/preview" component={Preview} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * App Component
 * 
 * Root component that wraps the entire application with necessary providers.
 * 
 * Provider hierarchy (outside → inside):
 * 1. QueryClientProvider - React Query for server state
 * 2. WalletContextProvider - Solana wallet connectivity
 * 3. TooltipProvider - UI tooltip functionality
 * 4. Toaster - Toast notification system
 * 5. Router - Application routes
 * 
 * This composition pattern ensures:
 * - All components have access to necessary contexts
 * - Clean separation of concerns
 * - Easy to add/remove providers
 * - Type-safe context consumption
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletContextProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Router />
        </TooltipProvider>
      </WalletContextProvider>
    </QueryClientProvider>
  );
}

export default App;

// ============================================
// QUERY CLIENT SETUP (lib/queryClient.ts)
// ============================================

import { QueryClient } from "@tanstack/react-query";

/**
 * React Query configuration
 * 
 * Global settings for data fetching and caching:
 * - Retry logic
 * - Stale time
 * - Cache time
 * - Refetch on window focus
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests up to 3 times
      retry: 3,
      
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Cache persists for 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      
      // Don't refetch on component mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * Architecture Benefits:
 * 
 * 1. **Modularity**
 *    - Each provider handles one concern
 *    - Easy to test in isolation
 *    - Can swap implementations
 * 
 * 2. **Type Safety**
 *    - Full TypeScript support
 *    - IntelliSense in all components
 *    - Compile-time error checking
 * 
 * 3. **Performance**
 *    - React Query handles caching
 *    - Minimal re-renders
 *    - Optimistic updates support
 * 
 * 4. **Developer Experience**
 *    - Hot reload works perfectly
 *    - Clear component hierarchy
 *    - Easy to add new features
 * 
 * 5. **Scalability**
 *    - Easy to add new providers
 *    - Clear separation of concerns
 *    - Maintainable codebase
 * 
 * Example usage in child components:
 * 
 * ```tsx
 * import { useWallet } from '@solana/wallet-adapter-react';
 * import { useQuery } from '@tanstack/react-query';
 * 
 * function MyComponent() {
 *   // Access wallet context
 *   const { publicKey, connected } = useWallet();
 *   
 *   // Use React Query for data fetching
 *   const { data, isLoading } = useQuery({
 *     queryKey: ['myData'],
 *     queryFn: fetchMyData,
 *   });
 *   
 *   return <div>{data}</div>;
 * }
 * ```
 */

