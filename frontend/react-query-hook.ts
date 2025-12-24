/**
 * Custom React Query Hook
 * 
 * Demonstrates modern React patterns with:
 * - React Query (TanStack Query) for server state management
 * - Type-safe mutations
 * - Error handling with toast notifications
 * - Automatic loading states
 * - Request/response validation
 * 
 * Technologies: React Query, Zod, TypeScript
 */

import { useMutation } from "@tanstack/react-query";
import { api, type CreateSubscriberRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook for creating subscribers
 * 
 * This hook encapsulates:
 * - API call logic
 * - Loading states
 * - Error handling
 * - Success notifications
 * - Type safety
 * 
 * @returns Mutation object with loading state, error, and mutate function
 * 
 * @example
 * ```tsx
 * function SubscribeForm() {
 *   const [email, setEmail] = useState("");
 *   const createSubscriber = useCreateSubscriber();
 * 
 *   const handleSubmit = (e: React.FormEvent) => {
 *     e.preventDefault();
 *     createSubscriber.mutate({ email }, {
 *       onSuccess: () => setEmail("")
 *     });
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input 
 *         value={email} 
 *         onChange={(e) => setEmail(e.target.value)}
 *         disabled={createSubscriber.isPending}
 *       />
 *       <button disabled={createSubscriber.isPending}>
 *         {createSubscriber.isPending ? "Subscribing..." : "Subscribe"}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useCreateSubscriber() {
  const { toast } = useToast();

  return useMutation({
    /**
     * Mutation function - handles the actual API call
     * 
     * Steps:
     * 1. Validate input with Zod schema
     * 2. Make API request
     * 3. Handle different response status codes
     * 4. Parse and validate response
     */
    mutationFn: async (data: CreateSubscriberRequest) => {
      // Client-side validation before sending request
      const validated = api.subscribers.create.input.parse(data);
      
      // Make API request
      const res = await fetch(api.subscribers.create.path, {
        method: api.subscribers.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      // Handle error responses
      if (!res.ok) {
        // Validation error (400)
        if (res.status === 400) {
          const error = api.subscribers.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        
        // Conflict error (409) - email already exists
        if (res.status === 409) {
          const error = api.subscribers.create.responses[409].parse(await res.json());
          throw new Error(error.message);
        }
        
        // Generic error
        throw new Error('Failed to subscribe');
      }
      
      // Parse and validate successful response
      return api.subscribers.create.responses[201].parse(await res.json());
    },

    /**
     * Success callback
     * Shows success toast notification
     */
    onSuccess: () => {
      toast({
        title: "Subscribed",
        description: "You've been added to our early access list.",
      });
    },

    /**
     * Error callback
     * Shows error toast with detailed message
     */
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Benefits of this pattern:
 * 
 * 1. **Automatic Loading States**: React Query tracks isPending, isError, isSuccess
 * 2. **Error Handling**: Centralized error handling with user feedback
 * 3. **Type Safety**: Full TypeScript support with inferred types
 * 4. **Reusability**: Use this hook anywhere in the app
 * 5. **Testing**: Easy to test in isolation
 * 6. **Caching**: React Query handles caching and refetching
 * 7. **Optimistic Updates**: Can add optimistic updates easily
 * 
 * React Query automatically provides:
 * - isPending: boolean (is the request in progress?)
 * - isError: boolean (did the request fail?)
 * - isSuccess: boolean (did the request succeed?)
 * - error: Error | null (error object if request failed)
 * - data: SubscriberResponse | undefined (response data)
 * - mutate: function (trigger the mutation)
 * - reset: function (reset the mutation state)
 */

