/**
 * Type-Safe API Layer (Shared)
 * 
 * This file demonstrates end-to-end type safety between frontend and backend.
 * It's shared between client and server, ensuring compile-time type checking
 * for all API contracts.
 * 
 * Key benefits:
 * - Single source of truth for API contracts
 * - Compile-time errors for type mismatches
 * - Runtime validation with Zod
 * - Auto-completion in IDE
 * - Refactoring safety
 * 
 * Technologies: Zod, TypeScript
 */

import { z } from 'zod';
import { insertSubscriberSchema, subscribers } from './schema';

/**
 * Reusable error schemas for consistent error handling
 */
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

/**
 * API Contract Definition
 * 
 * Each endpoint includes:
 * - HTTP method
 * - Path
 * - Input schema (Zod validation)
 * - Response schemas for each status code
 * 
 * This structure is used by both client and server:
 * - Server: validates requests and responses
 * - Client: type-safe fetch calls with auto-completion
 */
export const api = {
  subscribers: {
    create: {
      method: 'POST' as const,
      path: '/api/subscribers',
      input: insertSubscriberSchema,
      responses: {
        201: z.custom<typeof subscribers.$inferSelect>(),
        400: errorSchemas.validation,
        409: z.object({ message: z.string() }), // Conflict/Duplicate
      },
    },
  },
  // Add more endpoints here following the same pattern
  // Example:
  // swap: {
  //   execute: {
  //     method: 'POST' as const,
  //     path: '/api/swap/execute',
  //     input: swapRequestSchema,
  //     responses: {
  //       200: swapResponseSchema,
  //       400: errorSchemas.validation,
  //       500: errorSchemas.internal,
  //     },
  //   },
  // },
};

/**
 * Utility function to build URLs with dynamic parameters
 * 
 * @example
 * ```ts
 * buildUrl('/api/users/:id', { id: 123 })
 * // Returns: '/api/users/123'
 * ```
 */
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

/**
 * Type exports for consuming code
 * 
 * These types are automatically inferred from the Zod schemas,
 * ensuring they always match the validation rules.
 */
export type CreateSubscriberRequest = z.infer<typeof api.subscribers.create.input>;
export type CreateSubscriberResponse = z.infer<typeof api.subscribers.create.responses[201]>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;

/**
 * Benefits of this approach:
 * 
 * 1. **Type Safety**: Compile-time errors if types don't match
 * 2. **Runtime Validation**: Zod validates at runtime too
 * 3. **Single Source of Truth**: One definition for frontend and backend
 * 4. **Refactoring Safety**: Change once, errors everywhere it's used
 * 5. **IDE Support**: Full auto-completion and inline documentation
 * 6. **API Documentation**: Schema serves as documentation
 */

