import { useAuctionStore } from "@/stores/auctionStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  TrendingUp, 
  User, 
  Clock,
  Trophy
} from "lucide-react";

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function CompletedAuctions() {
  const { completed } = useAuctionStore();

  return (
    <Card className="p-6 bg-gradient-surface border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-success/10 rounded-lg">
          <CheckCircle className="w-5 h-5 text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Completed Auctions</h3>
          <p className="text-sm text-muted-foreground">Recent MEV captures and settlements</p>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Opportunity
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Winning Bid (STT)
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Winner
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Completed
        </div>
      </div>

      {/* Completed Auctions */}
      <div className="space-y-3">
        {completed.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-card-foreground mb-2">No Completed Auctions</h4>
            <p className="text-muted-foreground">Completed auctions will appear here</p>
          </div>
        ) : (
          completed.slice(0, 10).map((auction) => (
            <div
              key={auction.bundleId}
              className="grid grid-cols-4 gap-4 items-center p-4 bg-card rounded-lg border border-border"
            >
              <div>
                <div className="font-medium text-card-foreground">{auction.opportunity}</div>
                {auction.volume && (
                  <div className="text-sm text-muted-foreground">
                    Vol: ${(auction.volume / 1000).toFixed(0)}k
                  </div>
                )}
              </div>

              <div>
                <div className="font-mono text-lg font-bold text-success">
                  {auction.topBid.toFixed(4)}
                </div>
                {auction.gasPrice && (
                  <div className="text-sm text-muted-foreground">
                    {auction.gasPrice} gwei
                  </div>
                )}
              </div>

              <div>
                <div className="font-mono text-sm text-card-foreground">
                  {auction.leadingSearcher.slice(0, 6)}...{auction.leadingSearcher.slice(-4)}
                </div>
              </div>

              <div>
                <Badge variant="secondary" className="font-mono">
                  {formatTimestamp(auction.endTime)}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {completed.length > 10 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Showing 10 of {completed.length} completed auctions
          </p>
        </div>
      )}
    </Card>
  );
}