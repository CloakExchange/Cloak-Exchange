/**
 * Solana Wallet Context Provider
 * 
 * Production-ready Solana wallet integration supporting:
 * - Multiple wallet adapters (Phantom, Solflare, Torus, Ledger)
 * - Auto-connect functionality
 * - Network configuration (devnet/mainnet)
 * - Custom RPC endpoints
 * 
 * This provider wraps the entire application to enable wallet
 * connectivity throughout the component tree.
 * 
 * Technologies: React, Solana Web3.js, Wallet Adapter
 */

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import default wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

/**
 * WalletContextProvider
 * 
 * Provides Solana wallet functionality to all child components.
 * Handles wallet selection, connection state, and transaction signing.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <WalletContextProvider>
 *       <YourApp />
 *     </WalletContextProvider>
 *   );
 * }
 * ```
 */
export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // Network configuration - can be 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // Memoized RPC endpoint - prevents unnecessary re-initialization
  // For production, replace with a custom RPC endpoint for better performance
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  /**
   * Wallet adapters configuration
   * 
   * Initializes all supported wallet types. Users can connect with any of these:
   * - Phantom: Most popular Solana wallet
   * - Solflare: Feature-rich web and mobile wallet
   * - Torus: Social login-based wallet
   * - Ledger: Hardware wallet support
   */
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    // Empty dependency array - wallets are initialized once
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect // Automatically reconnect to previously connected wallet
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/**
 * Usage in child components:
 * 
 * ```tsx
 * import { useWallet } from '@solana/wallet-adapter-react';
 * 
 * function MyComponent() {
 *   const { publicKey, connected, disconnect, signTransaction } = useWallet();
 *   
 *   if (!connected) {
 *     return <WalletMultiButton />;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Connected: {publicKey?.toBase58()}</p>
 *       <button onClick={disconnect}>Disconnect</button>
 *     </div>
 *   );
 * }
 * ```
 */

