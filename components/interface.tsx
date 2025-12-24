/**
 * MacOS Window Component
 * 
 * A beautiful, animated window component inspired by macOS design.
 * 
 * Features:
 * - Smooth entrance animations with Framer Motion
 * - Authentic macOS window chrome (title bar with traffic lights)
 * - Customizable dimensions and title
 * - Professional shadow effects
 * - Scrollable content area
 * - Responsive design
 * 
 * Technologies: React, Framer Motion, Tailwind CSS
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MacOSWindowProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

/**
 * MacOSWindow Component
 * 
 * Creates a macOS-style window with smooth animations.
 * Perfect for creating landing pages or app previews.
 * 
 * @param children - Content to render inside the window
 * @param className - Additional CSS classes for customization
 * @param title - Optional title to display in the title bar
 * 
 * @example
 * ```tsx
 * <MacOSWindow title="My App">
 *   <div className="p-8">
 *     <h1>Welcome to my app</h1>
 *   </div>
 * </MacOSWindow>
 * ```
 */
export function MacOSWindow({ children, className, title }: MacOSWindowProps) {
  return (
    <motion.div 
      // Entrance animation - fade in and scale up
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for smooth feel
      }}
      className={cn(
        // Base dimensions
        "relative w-[1500px] h-[900px]",
        // Styling
        "bg-white rounded-2xl overflow-hidden flex flex-col",
        // Professional shadow effect
        "mac-window-shadow border border-neutral-200/50",
        className
      )}
    >
      {/* 
        Window Title Bar
        Mimics macOS window chrome with traffic light buttons
      */}
      <div className="h-12 bg-white/90 backdrop-blur-sm border-b border-neutral-100 flex items-center px-5 shrink-0 select-none z-50">
        {/* Traffic Light Buttons */}
        <div className="flex items-center gap-2 group">
          {/* Red - Close button */}
          <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] group-hover:brightness-90 transition-all shadow-sm" />
          
          {/* Yellow - Minimize button */}
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] group-hover:brightness-90 transition-all shadow-sm" />
          
          {/* Green - Maximize button */}
          <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] group-hover:brightness-90 transition-all shadow-sm" />
        </div>
        
        {/* Optional Title - Centered in title bar */}
        {title && (
          <div className="absolute inset-x-0 flex justify-center pointer-events-none">
            <span className="text-xs font-medium text-neutral-400 tracking-wide uppercase">
              {title}
            </span>
          </div>
        )}
      </div>

      {/* 
        Window Content Area
        Scrollable with hidden scrollbar for cleaner look
      */}
      <div className="flex-1 overflow-auto relative scrollbar-hide">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * CSS for custom shadow (add to your global CSS):
 * 
 * ```css
 * .mac-window-shadow {
 *   box-shadow: 
 *     0 0 0 1px rgba(0,0,0,0.03),
 *     0 30px 60px -12px rgba(0,0,0,0.25),
 *     0 18px 36px -18px rgba(0,0,0,0.25);
 * }
 * 
 * .scrollbar-hide {
 *   -ms-overflow-style: none;
 *   scrollbar-width: none;
 * }
 * 
 * .scrollbar-hide::-webkit-scrollbar {
 *   display: none;
 * }
 * ```
 * 
 * Animation breakdown:
 * - opacity: 0 → 1 (fade in)
 * - scale: 0.95 → 1 (subtle zoom)
 * - y: 20 → 0 (slide up)
 * - duration: 0.6s with custom easing
 * 
 * The custom easing [0.16, 1, 0.3, 1] creates a smooth,
 * natural feel that matches modern app animations.
 */

