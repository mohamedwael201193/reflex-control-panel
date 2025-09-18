import { NavLink } from "react-router-dom";
import { 
  Home, 
  Eye, 
  Activity, 
  Settings, 
  ExternalLink,
  TrendingUp,
  Zap
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Spectator", href: "/spectator", icon: Eye },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "JIT Pool", href: "/pool", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

const externalLinks = [
  { name: "Shannon Explorer", href: "https://shannon-explorer.somnia.network", icon: ExternalLink },
];

export function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <aside className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-sidebar border-r border-sidebar-border flex flex-col`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-x-3">
          <img src="/logo-mark.svg" alt="Reflex by Somnia" className="h-8 w-8" />
          <span className="text-xl font-bold text-text-primary">Reflex</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Trading
          </h3>
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary shadow-mission"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            External
          </h3>
          {externalLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary transition-all duration-200"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <span>Somnia Testnet</span>
            <div className="w-2 h-2 bg-success rounded-full"></div>
          </div>
          <div className="mt-1">Chain ID: 50312</div>
        </div>
      </div>
    </aside>
  );
}