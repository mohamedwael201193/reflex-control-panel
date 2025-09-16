"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  TrendingUp, 
  Plus, 
  Minus,
  CheckCircle,
  Zap
} from "lucide-react";
import { VAULT_ABI, TOKEN_ABI, ADDRESSES } from "@/lib/contracts";

export function JITLiquidityCard() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("0.1");
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  // Read user's vault balance
  const { data: vaultBalance } = useReadContract({
    address: ADDRESSES.vault as `0x${string}`,
    abi: VAULT_ABI,
    functionName: "balances",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address }
  });

  // Read total liquidity in vault
  const { data: totalLiquidity } = useReadContract({
    address: ADDRESSES.vault as `0x${string}`,
    abi: VAULT_ABI,
    functionName: "totalLiquidity",
    query: { enabled: true }
  });

  const { writeContractAsync } = useWriteContract();

  const handleApprove = async () => {
    if (!isConnected || !amount) return;

    try {
      setIsApproving(true);
      await writeContractAsync({
        address: ADDRESSES.underlying as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [ADDRESSES.vault as `0x${string}`, parseEther(amount)],
        chain: undefined,
        account: address
      });

      toast({
        title: "Approval Successful",
        description: `Approved ${amount} STT for deposit`,
      });
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!isConnected || !amount) return;

    try {
      setIsDepositing(true);
      await writeContractAsync({
        address: ADDRESSES.vault as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [parseEther(amount)],
        chain: undefined,
        account: address
      });

      toast({
        title: "Deposit Successful",
        description: `Deposited ${amount} STT to JIT vault`,
      });
      setAmount("");
    } catch (error: any) {
      toast({
        title: "Deposit Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !amount) return;

    try {
      setIsWithdrawing(true);
      await writeContractAsync({
        address: ADDRESSES.vault as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [parseEther(amount)],
        chain: undefined,
        account: address
      });

      toast({
        title: "Withdrawal Successful",
        description: `Withdrew ${amount} STT from JIT vault`,
      });
      setAmount("");
    } catch (error: any) {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    return parseFloat(formatEther(balance)).toFixed(4);
  };

  return (
    <Card className="p-6 bg-gradient-surface border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">JIT Liquidity Vault</h3>
          <p className="text-sm text-muted-foreground">Provide liquidity for MEV opportunities</p>
        </div>
      </div>

      {/* Balance Display */}
      <div className="space-y-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Your Deposited Balance</span>
            <Badge variant="secondary" className="gap-1">
              <Wallet className="w-3 h-3" />
              STT
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-card-foreground">
            {formatBalance(vaultBalance)}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Pool Liquidity</span>
            <Badge variant="outline" className="gap-1">
              <Zap className="w-3 h-3" />
              Pool
            </Badge>
          </div>
          <div className="text-xl font-bold font-mono text-card-foreground">
            {totalLiquidity ? `${formatBalance(totalLiquidity)}` : "Loading..."}
          </div>
        </div>
      </div>

      {/* Action Section */}
      {isConnected ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">
              Amount (STT)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to deposit/withdraw"
              className="bg-input border-border"
              step="0.0001"
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleApprove}
              disabled={isApproving || !amount}
              variant="outline"
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isApproving ? "Approving..." : "1. Approve"}
            </Button>

            <Button
              onClick={handleDeposit}
              disabled={isDepositing || !amount}
              className="gap-2 bg-gradient-accent text-accent-foreground hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              {isDepositing ? "Depositing..." : "2. Deposit"}
            </Button>

            <Button
              onClick={handleWithdraw}
              disabled={isWithdrawing || !amount}
              variant="destructive"
              className="gap-2"
            >
              <Minus className="w-4 h-4" />
              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-card-foreground mb-2">Connect Wallet</h4>
          <p className="text-muted-foreground text-sm">
            Connect your wallet to manage JIT liquidity
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-muted/10 rounded-lg">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Liquidity earns rewards from successful MEV captures</div>
          <div>• Funds are automatically deployed for arbitrage opportunities</div>
          <div>• Withdraw anytime (subject to active positions)</div>
        </div>
      </div>
    </Card>
  );
}