"use client";

import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  TrendingUp, 
  User, 
  Activity,
  Eye,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";

function formatTimeRemaining(endTime: number): string {
  const now = Date.now();
  const remaining = Math.max(0, endTime - now);
  const seconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function AuctionList() {
  const { auctions } = useAuctionSocket();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 bg-gradient-surface border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Live Auctions</h3>
            <p className="text-sm text-muted-foreground">Real-time MEV opportunities</p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          {auctions.length} Active
        </Badge>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Opportunity
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Top Bid (STT)
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Leading Searcher
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Time Remaining
        </div>
        <div>Actions</div>
      </div>

      {/* Auctions */}
      <div className="space-y-3">
        {auctions.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-card-foreground mb-2">No Active Auctions</h4>
            <p className="text-muted-foreground">New opportunities will appear here automatically</p>
          </div>
        ) : (
          auctions.map((auction) => {
            const timeRemaining = formatTimeRemaining(auction.endTime);
            const isUrgent = (auction.endTime - currentTime) < 30000; // Less than 30 seconds

            return (
              <div
                key={auction.bundleId}
                className="grid grid-cols-5 gap-4 items-center p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
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
                  <Badge 
                    variant={isUrgent ? "destructive" : "secondary"}
                    className={`font-mono ${isUrgent ? "animate-pulse" : ""}`}
                  >
                    {timeRemaining}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-3 h-3" />
                    Watch
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}