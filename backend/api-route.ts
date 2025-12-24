/**
 * Express API Route Handler
 * 
 * Demonstrates professional backend patterns:
 * - Type-safe request/response handling
 * - Input validation with Zod
 * - Proper error handling
 * - HTTP status codes
 * - Separation of concerns
 * 
 * Technologies: Express, Zod, TypeScript
 */

import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

/**
 * Register all API routes
 * 
 * This function sets up all API endpoints and their handlers.
 * It's called during server initialization.
 * 
 * @param httpServer - HTTP server instance
 * @param app - Express application instance
 * @returns Configured HTTP server
 */
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  /**
   * POST /api/subscribers
   * Create a new subscriber
   * 
   * Request body: { email: string }
   * 
   * Responses:
   * - 201: Successfully created subscriber
   * - 400: Validation error (invalid email format)
   * - 409: Conflict (email already exists)
   * - 500: Internal server error
   */
  app.post(api.subscribers.create.path, async (req, res) => {
    try {
      // Step 1: Validate input using shared Zod schema
      // This throws ZodError if validation fails
      const input = api.subscribers.create.input.parse(req.body);
      
      // Step 2: Check if email already exists
      const existing = await storage.getSubscriberByEmail(input.email);
      if (existing) {
        return res.status(409).json({ 
          message: "Email already subscribed" 
        });
      }

      // Step 3: Create new subscriber
      const subscriber = await storage.createSubscriber(input);
      
      // Step 4: Return success response
      res.status(201).json(subscriber);
      
    } catch (err) {
      // Handle Zod validation errors
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      
      // Re-throw unexpected errors to be caught by error middleware
      throw err;
    }
  });

  // Register additional routes here...
  
  return httpServer;
}

/**
 * Benefits of this pattern:
 * 
 * 1. **Type Safety**: Shared types between client and server
 * 2. **Validation**: Automatic input validation with Zod
 * 3. **Error Handling**: Proper HTTP status codes and messages
 * 4. **Separation**: Business logic in storage layer
 * 5. **Testability**: Easy to test with mocked storage
 * 6. **Maintainability**: Clear structure and single responsibility
 * 
 * Example usage with error handling middleware:
 * 
 * ```ts
 * // In server setup
 * app.use(express.json());
 * await registerRoutes(httpServer, app);
 * 
 * // Global error handler
 * app.use((err, req, res, next) => {
 *   console.error(err);
 *   res.status(500).json({ 
 *     message: "Internal server error" 
 *   });
 * });
 * ```
 * 
 * Example client-side usage:
 * 
 * ```ts
 * const response = await fetch('/api/subscribers', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email: 'user@example.com' })
 * });
 * 
 * if (response.ok) {
 *   const subscriber = await response.json();
 *   console.log('Created:', subscriber);
 * } else if (response.status === 409) {
 *   console.log('Email already subscribed');
 * } else if (response.status === 400) {
 *   const error = await response.json();
 *   console.log('Validation error:', error.message);
 * }
 * ```
 */

