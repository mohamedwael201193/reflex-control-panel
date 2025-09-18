import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  WifiOff, 
  Wifi,
  Bell,
  Settings,
  Menu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const handleConnect = () => {
    connect(
      { connector: injected() },
      {
        onSuccess: () => {
          toast({
            title: "Wallet Connected",
            description: "Successfully connected to your wallet.",
          });
        },
        onError: (error) => {
          toast({
            title: "Connection Failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <header className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>

        {/* Left side - Title (hidden on mobile) */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-card-foreground">
            Reflex by Somnia
          </h1>
          <p className="text-sm text-muted-foreground">
            JIT Liquidity & MEV Auctions on Somnia
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Network Status */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-2">
              <Wifi className="w-3 h-3" />
              Somnia Testnet
            </Badge>
          </div>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
          </Button>

          {/* Settings */}
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
          </Button>

          {/* Wallet Connection */}
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-card-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <div className="text-xs text-muted-foreground">Connected</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDisconnect}
                className="gap-2"
              >
                <WifiOff className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="gap-2 bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}