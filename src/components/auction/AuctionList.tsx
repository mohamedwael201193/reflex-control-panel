'use client';

import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { useAuctionStore } from "@/stores/auctionStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, User, Activity, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

function formatTimeRemaining(endTime: number): string {
  const now = Date.now();
  const remaining = Math.max(0, endTime - now);
  const seconds = Math.floor(remaining / 1000);
  return `${seconds}s`;
}

export function AuctionList() {
  useAuctionSocket(); // Connect to the socket
  const auctions = useAuctionStore((state) => state.auctions);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const isMobile = useIsMobile();

  // Update time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const auctionVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0, transition: { duration: isMobile ? 0.2 : 0.4 } },
    exit: { opacity: 0, transition: { duration: isMobile ? 0.1 : 0.2 } },
  };

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
      <div className="hidden md:grid md:grid-cols-4 md:gap-4 text-sm font-medium text-muted-foreground mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Bundle ID
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
      </div>

      {/* Auctions */}
      <div className="space-y-3">
        <AnimatePresence>
          {auctions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-card-foreground mb-2">No Active Auctions</h4>
                <p className="text-muted-foreground">New opportunities will appear here automatically</p>
              </div>
            </motion.div>
          ) : (
            auctions.map((auction) => {
              const timeRemaining = formatTimeRemaining(auction.endTime);
              const isUrgent = (auction.endTime - currentTime) < 1000; // Less than 1 second

              return (
                <motion.div
                  key={auction.bundleId}
                  variants={auctionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-200 grid grid-cols-2 md:grid-cols-4 gap-4 items-center"
                >
                  {/* Bundle ID */}
                  <div className="col-span-2 md:col-span-1">
                      <div className="text-sm text-muted-foreground md:hidden">Bundle ID</div>
                      <div className="font-mono text-sm text-card-foreground">{auction.bundleId.slice(0, 8)}...</div>
                  </div>

                  {/* Top Bid */}
                  <div>
                      <div className="text-sm text-muted-foreground md:hidden">Top Bid</div>
                      <div className="font-mono text-lg font-bold text-success">{auction.topBid}</div>
                  </div>

                  {/* Leading Searcher (Desktop only) */}
                  <div className="hidden md:block">
                      <div className="font-mono text-sm text-card-foreground">{auction.leadingSearcher.slice(0, 6)}...{auction.leadingSearcher.slice(-4)}</div>
                  </div>

                  {/* Time Remaining */}
                  <div>
                      <div className="text-sm text-muted-foreground md:hidden">Time Left</div>
                      <Badge
                        variant={isUrgent ? "destructive" : "secondary"}
                        className={`font-mono ${isUrgent ? "animate-pulse" : ""}`}
                      >
                        {timeRemaining}
                      </Badge>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}