import { useAuctionStore } from "@/stores/auctionStore";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Target,
  DollarSign,
  Award
} from "lucide-react";

export function KPIStrip() {
  const { kpis } = useAuctionStore();

  const kpiItems = [
    {
      label: "Total Volume",
      value: `$${(kpis.totalVolume / 1000000).toFixed(2)}M`,
      icon: DollarSign,
      change: "+12.4%",
      positive: true
    },
    {
      label: "Active Auctions",
      value: kpis.activeAuctions.toString(),
      icon: Activity,
      change: "+3",
      positive: true
    },
    {
      label: "Avg Gas Price",
      value: `${kpis.avgGasPrice} gwei`,
      icon: Zap,
      change: "-2.1 gwei",
      positive: true
    },
    {
      label: "Success Rate",
      value: `${kpis.successRate}%`,
      icon: Target,
      change: "+0.8%",
      positive: true
    },
    {
      label: "My Liquidity",
      value: `${(kpis.myLiquidity / 1000).toFixed(1)}k STT`,
      icon: TrendingUp,
      change: "+5.2%",
      positive: true
    },
    {
      label: "24h Rewards",
      value: `${kpis.rewards24h.toFixed(2)} STT`,
      icon: Award,
      change: "+24.7 STT",
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {kpiItems.map((kpi, index) => (
        <Card key={index} className="p-4 bg-gradient-surface border-border hover:border-primary/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <kpi.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className={`text-xs font-medium ${kpi.positive ? "text-success" : "text-destructive"}`}>
              {kpi.change}
            </div>
          </div>
          
          <div className="mt-3">
            <div className="text-2xl font-bold text-card-foreground">
              {kpi.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {kpi.label}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}