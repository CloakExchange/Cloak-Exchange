# Cloak Exchange

A decentralized exchange platform for Solana with privacy-first design principles.

## About the Project

Cloak Exchange is a modern web application for trading tokens on the Solana blockchain with a focus on transaction privacy and user experience. The platform provides a clean, intuitive interface for token swaps with advanced privacy features and real-time price calculations.

### Features

- Modern swap interface with real-time price updates
- Solana wallet integration with multiple wallet support
- Privacy-focused transaction routing
- Responsive design optimized for all devices
- Type-safe API layer with full validation
- Real-time updates via WebSocket
- Email subscription system for updates
- Production-ready architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  (React + TypeScript + Vite)                                    │
│  - Swap Interface                                                │
│  - Wallet Integration                                            │
│  - Real-time Updates                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/WebSocket
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Server                                │
│  (Express + TypeScript)                                          │
│  - REST API                                                      │
│  - WebSocket Server                                              │
│  - Request Validation                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Database Queries
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Data Layer                                   │
│  (PostgreSQL + Drizzle ORM)                                      │
│  - User Data                                                     │
│  - Transaction History                                           │
│  - Subscriber Management                                         │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ RPC Connection
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Solana Blockchain                              │
│  (Token Swaps, Wallet Operations)                                │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- React 18.3 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for state management
- Wouter for routing
- Solana Wallet Adapter

### Backend

- Express.js with TypeScript
- WebSocket for real-time communication
- Zod for validation
- Drizzle ORM for database access
- PostgreSQL for data persistence

### Blockchain

- Solana Web3.js
- Multiple wallet adapter support
- Real-time blockchain interaction

## Installation

### Prerequisites

- Node.js 18 or newer
- PostgreSQL 14 or newer
- npm or yarn package manager

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/cloak-exchange.git
   cd cloak-exchange
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your configuration:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/cloak_exchange
   PORT=5000
   NODE_ENV=development
   ```

5. Initialize the database:
   ```bash
   npm run db:push
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Usage

### Starting the Application

#### Development Mode

```bash
npm run dev
```

This starts both the Express server and Vite dev server with hot reload enabled.

#### Production Mode

```bash
npm run build
npm start
```

### Database Management

```bash
# Push database schema changes
npm run db:push

# Generate database migrations
npm run db:generate
```

### Type Checking

```bash
npm run check
```

## Project Structure

```
cloak-exchange/
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   └── index.html          # HTML template
├── server/                  # Backend application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── db.ts               # Database configuration
│   ├── storage.ts          # Data access layer
│   └── vite.ts             # Vite integration
├── shared/                  # Shared code between client and server
│   └── routes.ts           # API route definitions
├── script/                  # Build and utility scripts
└── package.json            # Project configuration
```

## API Reference

### Error Handling

All API endpoints return consistent error responses:

```typescript
{
  "message": "Error description",
  "field": "fieldName"  // Optional, for validation errors
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 409: Conflict
- 500: Internal Server Error

## Code Examples

### Frontend Swap Component

```typescript
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export function SwapInterface() {
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  
  const { publicKey } = useWallet();
  
  const handleSwap = async () => {
    // Implement swap logic
  };
  
  return (
    <div>
      {/* Swap interface */}
    </div>
  );
}
```

### Wallet Integration

```typescript
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export function WalletContextProvider({ children }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = "https://api.mainnet-beta.solana.com";
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

### API Integration with React Query

```typescript
import { useMutation } from "@tanstack/react-query";

export function useCreateSubscriber() {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to subscribe");
      return response.json();
    },
  });
}
```

### Database Schema

```typescript
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## Development

### Adding New Features

1. Define the API route in `shared/routes.ts`
2. Implement the endpoint in `server/routes.ts`
3. Add database schema if needed in `server/db.ts`
4. Create storage methods in `server/storage.ts`
5. Implement frontend components in `client/src/`
6. Add custom hooks in `client/src/hooks/`

### Styling Guidelines

The project uses Tailwind CSS with a custom design system:

- Primary color: Brand-specific color scheme
- Neutral palette: Gray scale for backgrounds and text
- Component styling: Radix UI primitives with custom styling
- Animations: Framer Motion for smooth transitions

### Type Safety

All API routes are type-safe using Zod schemas:

```typescript
import { z } from "zod";

export const createSubscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
});
```

## Deployment

### Production Build

```bash
npm run build
```

This creates optimized production bundles in the `dist/` directory.

### Docker Support

```bash
docker-compose up -d
```

The Docker configuration includes:
- Application container
- PostgreSQL database
- Environment variable management

### Environment Variables

Required environment variables for production:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=5000
NODE_ENV=production
```

## Requirements

- Node.js 18 or newer
- PostgreSQL 14 or newer
- Modern web browser with WebSocket support
- Solana wallet (Phantom, Solflare, etc.)

## Security Considerations

- All API inputs are validated using Zod schemas
- Database queries use parameterized statements via Drizzle ORM
- CORS policies configured for production
- Environment variables for sensitive configuration
- Wallet signatures for transaction verification

## Performance Optimization

- Code splitting with Vite
- React Query for efficient data fetching
- Lazy loading for route components
- Optimized bundle sizes
- Database connection pooling
- Static asset caching

## Changelog

### Version 1.0.0 - December 2025

- Initial release
- Swap interface implementation
- Wallet integration
- Subscriber management
- Production-ready architecture

Last update: 24th of December 2025, 00:00 GMT

## License

The project is distributed under the MIT license. See [LICENSE](LICENSE.md) file for details.

## Community

[Join the Cloak Exchange community](https://x.com/i/communities/2003928085863813567)

## Support

[Documentation](https://cloakexchange.gitbook.io/cloakexchange-docs/api-reference)
