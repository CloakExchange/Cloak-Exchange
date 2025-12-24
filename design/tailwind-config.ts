/**
 * Tailwind CSS Design System Configuration
 * 
 * Demonstrates professional theme configuration:
 * - CSS variables for dynamic theming
 * - HSL color system for easy manipulation
 * - Custom utility classes
 * - Consistent spacing and typography
 * - Professional animation keyframes
 * 
 * Technologies: Tailwind CSS, PostCSS
 */

// ============================================
// TAILWIND CONFIG (tailwind.config.ts)
// ============================================

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Custom border radius values
      borderRadius: {
        lg: ".5625rem", /* 9px */
        md: ".375rem",  /* 6px */
        sm: ".1875rem", /* 3px */
      },
      
      // Color system using CSS variables
      // This allows for easy theme switching and consistency
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        
        // Status colors for UI feedback
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
      },
      
      // Custom font families
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      
      // Animation keyframes
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      
      // Animation utilities
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography")
  ],
} satisfies Config;

// ============================================
// CSS VARIABLES (index.css)
// ============================================

/**
 * Global CSS with design tokens
 * 
 * Benefits of CSS variables:
 * - Runtime theme switching
 * - Easy customization
 * - Consistent color system
 * - Dark mode support
 */

const cssVariables = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Base - Pure White */
  --background: 0 0% 100%;
  --foreground: 221 73% 16%; /* Deep Navy #0B1E46 */

  /* Primary - Deep Navy #0B1E46 */
  --primary: 221 73% 16%;
  --primary-foreground: 0 0% 100%;

  /* Secondary - Soft Gray for UI elements */
  --secondary: 210 20% 96%;
  --secondary-foreground: 221 73% 16%;

  /* Muted - For subtitles */
  --muted: 220 10% 40%;
  --muted-foreground: 220 10% 60%;

  /* Borders */
  --border: 220 15% 90%;
  --input: 220 15% 90%;
  --ring: 221 73% 16%;

  /* Radius */
  --radius: 0.75rem;
}

@layer base {
  body {
    @apply bg-neutral-100 text-foreground font-sans antialiased overflow-hidden min-h-screen flex items-center justify-center selection:bg-primary/10 selection:text-primary;
    
    /* Dot grid background pattern */
    background-image: radial-gradient(circle at center, #E5E7EB 1px, transparent 1px);
    background-size: 24px 24px;
  }
}

@layer utilities {
  /* Glass morphism effect */
  .glass-panel {
    @apply bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl;
  }
  
  /* Professional macOS-style shadow */
  .mac-window-shadow {
    box-shadow: 
      0 0 0 1px rgba(0,0,0,0.03),
      0 30px 60px -12px rgba(0,0,0,0.25),
      0 18px 36px -18px rgba(0,0,0,0.25);
  }
}

/* Custom scrollbar styles */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`;

/**
 * Design System Guidelines:
 * 
 * 1. **Colors**: Use HSL format for easy manipulation
 *    - Primary: Brand color (Deep Navy)
 *    - Secondary: UI elements (Light Gray)
 *    - Muted: Less important text
 * 
 * 2. **Spacing**: Follow 4px grid system
 *    - Use Tailwind's default spacing scale
 *    - Custom values only when necessary
 * 
 * 3. **Typography**: 
 *    - Sans: Inter (body text)
 *    - Mono: JetBrains Mono (code)
 *    - Responsive font sizes
 * 
 * 4. **Shadows**: 
 *    - Use custom utilities for complex shadows
 *    - Keep shadows subtle and professional
 * 
 * 5. **Animations**:
 *    - Subtle and purposeful
 *    - Use Framer Motion for complex animations
 *    - CSS animations for simple transitions
 */

export { cssVariables };

