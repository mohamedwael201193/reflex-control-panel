import { KPIStrip } from "@/components/KPIStrip";
import { AuctionList } from "@/components/auction/AuctionList";
import { JITLiquidityCard } from "@/components/jit/JITLiquidityCard";
import { CompletedAuctions } from "@/components/CompletedAuctions";

const Index = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-4 order-2 lg:order-1">
        <KPIStrip />
      </div>
      <div className="lg:col-span-3 order-3 lg:order-2 space-y-6">
        <AuctionList />
        <CompletedAuctions />
      </div>
      <div className="lg:col-span-1 order-1 lg:order-3">
        <JITLiquidityCard />
      </div>
    </div>
  );
};

export default Index;
