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
  const { writeContractAsync } = useWriteContract();

  const [amount, setAmount] = useState("0.1");
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const { data: vaultBalance, refetch: refetchVaultBalance } = useReadContract({
    address: ADDRESSES.vault as `0x${string}`,
    abi: VAULT_ABI,
    functionName: "balances",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address, refetchInterval: 5000 }
  });

  const { data: totalDeposits, refetch: refetchTotalDeposits } = useReadContract({
    address: ADDRESSES.vault as `0x${string}`,
    abi: VAULT_ABI,
    functionName: "totalDeposits",
    query: { enabled: true, refetchInterval: 5000 }
  });

  const handleTransaction = async (
    setLoading: (loading: boolean) => void,
    contractConfig: any,
    toastMessages: { success: string; error: string; description: string }
  ) => {
    if (!isConnected || !amount) return;

    try {
      setLoading(true);
      await writeContractAsync(contractConfig);
      toast({
        title: toastMessages.success,
        description: toastMessages.description,
      });
      refetchVaultBalance();
      refetchTotalDeposits();
      setAmount("0.1");
    } catch (error: any) {
      toast({
        title: toastMessages.error,
        description: error.shortMessage || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onApprove = () => handleTransaction(
    setIsApproving,
    {
      address: ADDRESSES.underlying as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: "approve",
      args: [ADDRESSES.vault as `0x${string}`, parseEther(amount)],
    },
    { success: "Approval Successful", error: "Approval Failed", description: `Approved ${amount} STT for deposit` }
  );

  const onDeposit = () => handleTransaction(
    setIsDepositing,
    {
      address: ADDRESSES.vault as `0x${string}`,
      abi: VAULT_ABI,
      functionName: "deposit",
      args: [parseEther(amount)],
    },
    { success: "Deposit Successful", error: "Deposit Failed", description: `Deposited ${amount} STT to JIT vault` }
  );

  const onWithdraw = () => handleTransaction(
    setIsWithdrawing,
    {
      address: ADDRESSES.vault as `0x${string}`,
      abi: VAULT_ABI,
      functionName: "withdraw",
      args: [parseEther(amount)],
    },
    { success: "Withdrawal Successful", error: "Withdrawal Failed", description: `Withdrew ${amount} STT from JIT vault` }
  );

  const formatBalance = (balance: bigint | undefined) => {
    if (balance === undefined) return "0.0000";
    return parseFloat(formatEther(balance)).toFixed(4);
  };

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">JIT Liquidity Vault</h3>
          <p className="text-sm text-gray-400">Provide liquidity for MEV opportunities</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Your Deposited Balance</span>
            <Badge variant="secondary" className="gap-1">
              <Wallet className="w-3 h-3" /> STT
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatBalance(vaultBalance)}
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Pool Liquidity</span>
            <Badge variant="outline" className="gap-1">
              <Zap className="w-3 h-3" /> Pool
            </Badge>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totalDeposits !== undefined ? `${formatBalance(totalDeposits)}` : "Loading..."}
          </div>
        </div>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Amount (STT)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-gray-900 border-gray-600 text-white"
              step="0.0001"
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button onClick={onApprove} disabled={isApproving || !amount} variant="outline" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              {isApproving ? "Approving..." : "1. Approve"}
            </Button>
            <Button onClick={onDeposit} disabled={isDepositing || !amount} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              {isDepositing ? "Depositing..." : "2. Deposit"}
            </Button>
            <Button onClick={onWithdraw} disabled={isWithdrawing || !amount} variant="destructive" className="gap-2">
              <Minus className="w-4 h-4" />
              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">Connect Wallet</h4>
          <p className="text-gray-400 text-sm">
            Connect your wallet to manage JIT liquidity
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-800/20 rounded-lg">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Liquidity earns rewards from successful MEV captures</div>
          <div>• Funds are automatically deployed for arbitrage opportunities</div>
          <div>• Withdraw anytime (subject to active positions)</div>
        </div>
      </div>
    </Card>
  );
}