/**
 * SimulatedSwap Component
 * 
 * A production-ready swap interface for Solana DEX with:
 * - Real-time price calculations
 * - Token selection with dropdown
 * - Solana wallet integration
 * - Loading states and animations
 * - Responsive design
 * 
 * Technologies: React, TypeScript, Framer Motion, Solana Web3.js
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function SimulatedSwap() {
  const [swapping, setSwapping] = useState(false);
  const [complete, setComplete] = useState(false);
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [isRotating, setIsRotating] = useState(false);
  const [fromAmount, setFromAmount] = useState("42.5");
  const [toAmount, setToAmount] = useState("4200");

  // Real Solana wallet integration
  const { publicKey, disconnect } = useWallet();

  const tokens = ["SOL", "USDC", "BONK", "JUP", "RAY", "ORCA"];
  
  // Simulated exchange rates (relative to USDC)
  const tokenPrices: Record<string, number> = {
    "SOL": 100,
    "USDC": 1,
    "BONK": 0.00001,
    "JUP": 0.85,
    "RAY": 1.5,
    "ORCA": 1.2
  };

  /**
   * Calculate output amount based on token prices
   */
  const calculateToAmount = (amount: string, from: string, to: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return "0";
    
    const fromPrice = tokenPrices[from] || 1;
    const toPrice = tokenPrices[to] || 1;
    const result = (numAmount * fromPrice) / toPrice;
    
    return result.toFixed(result < 1 ? 6 : 2);
  };

  /**
   * Handle swap execution with loading states
   */
  const handleSwap = () => {
    setSwapping(true);
    setTimeout(() => {
      setSwapping(false);
      setComplete(true);
      setTimeout(() => setComplete(false), 3000);
    }, 2000);
  };

  /**
   * Swap tokens with smooth rotation animation
   */
  const handleSwapTokens = () => {
    setIsRotating(true);
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    setTimeout(() => setIsRotating(false), 300);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    const calculated = calculateToAmount(value, fromToken, toToken);
    setToAmount(calculated);
  };

  const handleFromTokenChange = (token: string) => {
    setFromToken(token);
    const calculated = calculateToAmount(fromAmount, token, toToken);
    setToAmount(calculated);
  };

  const handleToTokenChange = (token: string) => {
    setToToken(token);
    const calculated = calculateToAmount(fromAmount, fromToken, token);
    setToAmount(calculated);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-100 max-w-sm mx-auto">
      
      {/* Animated Loading & Success Overlays */}
      <AnimatePresence>
        {swapping && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-white/50"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
          </motion.div>
        )}
        {complete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col gap-2 items-center justify-center bg-primary/95 text-white"
          >
            <ShieldCheck className="w-12 h-12" />
            <span className="font-medium">Swap Complete</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected Wallet Display */}
      {publicKey && (
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-neutral-700">
              {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}
            </span>
          </div>
          <button
            onClick={disconnect}
            className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* From Token Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From</label>
          <div className="flex items-center justify-between gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              placeholder="0.0"
              className="font-mono text-lg text-primary bg-transparent border-none outline-none focus:outline-none w-full"
            />
            <select 
              value={fromToken}
              onChange={(e) => handleFromTokenChange(e.target.value)}
              className="text-sm px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-primary font-medium hover:border-primary/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {tokens.map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Swap Direction Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button 
            onClick={handleSwapTokens}
            className="bg-white p-2 rounded-full border border-neutral-100 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 text-primary transition-transform duration-300 ${isRotating ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* To Token Display */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">To</label>
          <div className="flex items-center justify-between gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <div className="font-mono text-lg text-primary w-full">
              {toAmount} {toToken}
            </div>
            <select 
              value={toToken}
              onChange={(e) => handleToTokenChange(e.target.value)}
              className="text-sm px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-primary font-medium hover:border-primary/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {tokens.map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button or Wallet Connect */}
        {publicKey ? (
          <button
            onClick={handleSwap}
            className="w-full py-4 mt-2 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-px transition-all active:scale-[0.98]"
          >
            Swap
          </button>
        ) : (
          <div className="w-full mt-2 flex">
            <WalletMultiButton 
              style={{ width: '100%' }}
              className="!w-full !py-4 !bg-primary !text-white !rounded-xl !font-semibold" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

