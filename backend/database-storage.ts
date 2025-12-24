/**
 * Database Schema and Storage Layer
 * 
 * Demonstrates:
 * - Type-safe database schema with Drizzle ORM
 * - Repository pattern for data access
 * - Clean separation of concerns
 * - Type inference from database schema
 * 
 * Technologies: Drizzle ORM, PostgreSQL, TypeScript
 */

// ============================================
// DATABASE SCHEMA (schema.ts)
// ============================================

import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Subscribers table definition
 * 
 * Drizzle ORM provides type-safe database operations with:
 * - Full TypeScript support
 * - Zero runtime overhead
 * - SQL-like API
 */
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Zod schema for insert operations
 * Generated from the database schema
 */
export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

/**
 * Type exports - automatically inferred from schema
 * These types are guaranteed to match the database structure
 */
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type CreateSubscriberRequest = InsertSubscriber;
export type SubscriberResponse = Subscriber;

// ============================================
// STORAGE LAYER (storage.ts)
// ============================================

import { db } from "./db";
import { eq } from "drizzle-orm";

/**
 * Storage interface
 * Defines the contract for data access operations
 */
export interface IStorage {
  createSubscriber(subscriber: CreateSubscriberRequest): Promise<SubscriberResponse>;
  getSubscriberByEmail(email: string): Promise<SubscriberResponse | undefined>;
}

/**
 * Database Storage Implementation
 * 
 * Implements repository pattern with:
 * - Clean abstraction over database operations
 * - Easy to test (can mock IStorage interface)
 * - Single responsibility principle
 * - Type-safe queries
 */
export class DatabaseStorage implements IStorage {
  /**
   * Get subscriber by email
   * 
   * @param email - Subscriber's email address
   * @returns Subscriber object or undefined if not found
   */
  async getSubscriberByEmail(email: string): Promise<SubscriberResponse | undefined> {
    const [subscriber] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email));
    
    return subscriber;
  }

  /**
   * Create new subscriber
   * 
   * @param insertSubscriber - Subscriber data to insert
   * @returns Created subscriber with generated ID
   */
  async createSubscriber(insertSubscriber: CreateSubscriberRequest): Promise<SubscriberResponse> {
    const [subscriber] = await db
      .insert(subscribers)
      .values(insertSubscriber)
      .returning();
    
    return subscriber;
  }
}

/**
 * Singleton storage instance
 * Export a single instance to be used across the application
 */
export const storage = new DatabaseStorage();

/**
 * Usage example in routes:
 * 
 * ```ts
 * app.post('/api/subscribers', async (req, res) => {
 *   const input = api.subscribers.create.input.parse(req.body);
 *   
 *   const existing = await storage.getSubscriberByEmail(input.email);
 *   if (existing) {
 *     return res.status(409).json({ message: "Email already subscribed" });
 *   }
 * 
 *   const subscriber = await storage.createSubscriber(input);
 *   res.status(201).json(subscriber);
 * });
 * ```
 * 
 * Benefits:
 * - Type-safe database operations
 * - Easy to mock for testing
 * - Clean separation from business logic
 * - Consistent error handling
 * - Flexible to swap implementations
 */

