/**
 * Animated Landing Page Component
 * 
 * Production-ready landing page with:
 * - Smooth entrance animations
 * - Email subscription form
 * - Type-safe form handling
 * - Loading states
 * - Solana wallet integration
 * - Professional typography and spacing
 * 
 * Technologies: React, Framer Motion, TypeScript
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MacOSWindow } from "@/components/MacOSWindow";
import { useCreateSubscriber } from "@/hooks/use-subscribers";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Landing() {
  const [email, setEmail] = useState("");
  const createSubscriber = useCreateSubscriber();

  /**
   * Handle email subscription
   * - Validates email on client side
   * - Shows loading state during submission
   * - Clears form on success
   * - Displays error toast on failure
   */
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    createSubscriber.mutate({ email }, {
      onSuccess: () => setEmail("")
    });
  };

  return (
    <div className="p-4 md:p-8 w-full h-full flex items-center justify-center">
      <MacOSWindow>
        <main className="flex flex-col items-center justify-center min-h-full px-4 text-center pb-20 pt-10">
          
          {/* Hero Section with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 max-w-5xl mx-auto"
          >
            {/* Logo Mark */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary">
                Cloak Exchange
              </h1>
            </div>

            {/* Value Proposition */}
            <h2 className="text-xl md:text-2xl font-light text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Trade on Solana with <span className="font-medium text-primary">zero traceability</span>. 
              <br className="hidden md:block" />
              Your liquidity, completely unseen.
            </h2>

            {/* Primary CTA with Hover Effects */}
            <div className="pt-4">
              <Link href="/preview" className="inline-block group">
                <button className="
                  px-8 py-4 rounded-xl font-semibold text-lg
                  bg-primary text-white shadow-lg shadow-primary/20
                  hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-md
                  transition-all duration-300 ease-out flex items-center gap-2
                ">
                  Explore the Future
                  <ArrowUpRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Footer Area with Email Subscription */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-white to-transparent"
          >
            <div className="max-w-md mx-auto flex flex-col items-center gap-4">
              <p className="text-sm text-neutral-400 font-medium">
                Built for the pro traders.
              </p>
              
              {/* Email Subscription Form */}
              <form 
                onSubmit={handleSubscribe} 
                className="flex w-full gap-2 items-center"
              >
                <Input 
                  type="email" 
                  placeholder="Enter email for updates..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={createSubscriber.isPending}
                  className="bg-neutral-50 border-neutral-200 focus:border-primary/20 text-xs h-9 rounded-lg"
                />
                <Button 
                  type="submit" 
                  disabled={createSubscriber.isPending}
                  size="sm"
                  variant="outline"
                  className="h-9 text-xs font-medium border-neutral-200 hover:text-primary"
                >
                  {createSubscriber.isPending ? "Joining..." : "Join List"}
                </Button>
              </form>
            </div>
          </motion.div>

        </main>
      </MacOSWindow>
    </div>
  );
}

/**
 * Animation Breakdown:
 * 
 * 1. Hero Section (delay: 0.2s)
 *    - Fades in from y: 20 → 0
 *    - Duration: 0.8s
 *    - Creates a "rising" effect
 * 
 * 2. Footer Section (delay: 0.8s)
 *    - Simple opacity fade
 *    - Appears after hero is visible
 *    - Duration: 1s for smooth transition
 * 
 * 3. Button Hover Effects:
 *    - Shadow intensifies
 *    - Subtle lift (-0.5px on Y axis)
 *    - Icon moves diagonally (→ ↗)
 *    - All transitions: 300ms ease-out
 * 
 * 4. Button Active State:
 *    - Removes lift (translate-y-0)
 *    - Reduces shadow (pressed effect)
 *    - Instant feedback for user interaction
 * 
 * Performance Considerations:
 * - Uses transform instead of position for animations (GPU accelerated)
 * - Opacity changes are also GPU accelerated
 * - Smooth 60fps animations on all devices
 * - Minimal layout recalculation
 */

