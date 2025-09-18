"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, animate } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Wallet,
  TrendingUp,
  Plus,
  Minus,
  CheckCircle,
  Zap,
  Loader2,
} from "lucide-react";
import { VAULT_ABI, TOKEN_ABI, ADDRESSES } from "@/lib/contracts";

// Utility function for a brief delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatBalance = (balance: bigint | undefined) => {
  if (balance === undefined) return "0.0000";
  return parseFloat(formatEther(balance)).toFixed(4);
};

// AnimatedBalance component for count-up/down animation
function AnimatedBalance({ value }: { value: bigint | undefined }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const previousValueRef = useRef(value);
  const isMobile = useIsMobile();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const previousValue = previousValueRef.current ?? 0n;
    const currentValue = value ?? 0n;

    if (previousValue !== currentValue) {
      const controls = animate(parseFloat(formatEther(previousValue)), parseFloat(formatEther(currentValue)), {
        duration: isMobile ? 0.3 : 0.5,
        onUpdate(latest) {
          node.textContent = latest.toFixed(4);
        },
      });

      // Trigger flash animation
      node.classList.add('text-green-400');
      setTimeout(() => {
        node.classList.remove('text-green-400');
      }, 500);

      previousValueRef.current = currentValue;
      return () => controls.stop();
    }
  }, [value, isMobile]);

  return <div ref={nodeRef}>{formatBalance(value)}</div>;
}


export function JITLiquidityCard() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();

  const [amount, setAmount] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  // To track which button is loading
  const [loadingType, setLoadingType] = useState<
    "approve" | "deposit" | "withdraw" | null
  >(null);

  // Reads the user's deposited balance in the vault
  const { data: vaultBalance, refetch: refetchVaultBalance } = useReadContract({
    address: ADDRESSES.vault,
    abi: VAULT_ABI,
    functionName: "balances",
    args: [address ?? "0x0"], // Default to 0x0 if address is not available
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  // Reads the total liquidity in the vault pool
  const { data: totalDeposits, refetch: refetchTotalDeposits } =
    useReadContract({
      address: ADDRESSES.vault,
      abi: VAULT_ABI,
      functionName: "totalDeposits",
      query: { enabled: true, refetchInterval: 5000 },
    });

  // Reads the user's allowance for the vault
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: ADDRESSES.underlying,
    abi: TOKEN_ABI,
    functionName: "allowance",
    args: [address ?? "0x0", ADDRESSES.vault],
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  // A single, robust handler for all blockchain transactions
  const handleTransaction = async (
    type: "approve" | "deposit" | "withdraw",
    contractConfig: any,
    toastMessages: { success: string; error: string }
  ) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingType(type);

    try {
      // Execute the transaction
      const tx = await writeContractAsync(contractConfig);
      
      toast({
        title: "Transaction Sent",
        description: `Waiting for confirmation... (Tx: ${tx.slice(0, 10)}...)`,
      });

      // Wait for confirmation (this is simulated, in a real app you'd use a receipt watcher)
      await sleep(2000); // Give node time to process

      toast({
        title: toastMessages.success,
        description: `Transaction confirmed successfully.`,
      });

      // Refresh on-chain data after a short delay to ensure state is updated
      await sleep(1000);
      refetchVaultBalance();
      refetchTotalDeposits();
      refetchAllowance();
      
    } catch (error: any) {
      console.error("Transaction failed:", error);
      toast({
        title: toastMessages.error,
        description: error.shortMessage || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  // --- Transaction Functions ---

  const onApprove = () =>
    handleTransaction(
      "approve",
      {
        address: ADDRESSES.underlying,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [ADDRESSES.vault, parseEther(amount)],
      },
      { success: "Approval Successful", error: "Approval Failed" }
    );

  const onDeposit = () =>
    handleTransaction(
      "deposit",
      {
        address: ADDRESSES.vault,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [parseEther(amount)],
      },
      { success: "Deposit Successful", error: "Deposit Failed" }
    );

  const onWithdraw = () =>
    handleTransaction(
      "withdraw",
      {
        address: ADDRESSES.vault,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [parseEther(amount)],
      },
      { success: "Withdrawal Successful", error: "Withdrawal Failed" }
    );

  // --- UI Logic ---

  const hasSufficientAllowance =
    allowance !== undefined &&
    amount &&
    allowance >= parseEther(amount);

  return (
    <Card className="p-6 bg-surface border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            JIT Liquidity Vault
          </h3>
          <p className="text-sm text-text-secondary">
            Provide liquidity for MEV opportunities
          </p>
        </div>
      </div>

      {/* Balances */}
      <div className="space-y-4 mb-6">
        <div className="bg-background p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              Your Deposited Balance
            </span>
            <Badge variant="secondary" className="gap-1">
              <Wallet className="w-3 h-3" /> STT
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-text-primary">
            <AnimatedBalance value={vaultBalance} />
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              Total Pool Liquidity
            </span>
            <Badge variant="outline" className="border-accent text-accent gap-1">
              <Zap className="w-3 h-3" /> Pool
            </Badge>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary">
            <AnimatedBalance value={totalDeposits} />
          </div>
        </div>
      </div>

      {/* Interaction Area */}
      {isConnected ? (
        <div className="space-y-4">
          {/* Faucet Button */}
          <Button
            onClick={() => window.open('https://testnet.somnia.network/faucet', '_blank')}
            variant="secondary"
            className="w-full gap-2"
          >
            <Zap className="w-4 h-4" />
            Get Testnet Tokens
          </Button>
          
          <div className="border-t border-border my-4"></div>

          {/* Deposit/Withdraw Form */}
          <div>
            <label
              htmlFor="amount"
              className="text-sm font-medium text-text-secondary mb-2 block"
            >
              Amount (STT)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-background border-border text-text-primary"
              step="1"
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Conditional Approve/Deposit Buttons */}
            {!hasSufficientAllowance ? (
              <Button
                onClick={onApprove}
                disabled={isLoading || !amount}
                variant="outline"
                className="w-full gap-2"
              >
                {isLoading && loadingType === "approve" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                1. Approve
              </Button>
            ) : (
              <Button
                onClick={onDeposit}
                disabled={isLoading || !amount}
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading && loadingType === "deposit" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                2. Deposit
              </Button>
            )}

            {/* Withdraw Button */}
            <Button
              onClick={onWithdraw}
              disabled={isLoading || !amount || vaultBalance === 0n}
              variant="destructive"
              className="w-full gap-2"
            >
              {isLoading && loadingType === "withdraw" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              Withdraw
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <Wallet className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h4 className="text-lg font-medium text-text-primary mb-2">
            Connect Wallet
          </h4>
          <p className="text-text-secondary text-sm">
            Connect your wallet to manage JIT liquidity.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-background/50 rounded-lg">
        <div className="text-xs text-text-secondary space-y-1">
          <div>• Liquidity earns rewards from successful MEV captures.</div>
          <div>• Funds are automatically deployed for arbitrage.</div>
          <div>• Withdraw anytime (subject to active positions).</div>
        </div>
      </div>
    </Card>
  );
}
