import { KPIStrip } from "@/components/KPIStrip";
import { AuctionList } from "@/components/auction/AuctionList";
import { JITLiquidityCard } from "@/components/jit/JITLiquidityCard";
import { CompletedAuctions } from "@/components/CompletedAuctions";

const Index = () => {
  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <KPIStrip />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Dashboard Content */}
        <div className="lg:col-span-3 space-y-6">
          <AuctionList />
          <CompletedAuctions />
        </div>

        {/* Sidebar Content */}
        <div className="lg:col-span-1">
          <JITLiquidityCard />
        </div>
      </div>
    </div>
  );
};

export default Index;
