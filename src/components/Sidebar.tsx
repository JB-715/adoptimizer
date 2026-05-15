'use client';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  Zap,
  BookOpen,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Ad Performance', href: '/', icon: LayoutDashboard },
  { label: 'Campaign Mgmt', href: '/campaign-management', icon: Megaphone, badge: 3 },
  { label: 'User Manual', href: '/user-manual', icon: BookOpen },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeRoute: string;
}

export default function Sidebar({ collapsed, onToggleCollapse, activeRoute }: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={32} />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-semibold text-sm text-foreground block truncate leading-tight">
                AdOptimizer
              </span>
              <span className="text-xs text-muted-foreground block leading-tight">Pro</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-3 pb-2">
            Analytics
          </p>
        )}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.href;
          return (
            <div key={`nav-${item.href}`} className="relative group">
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="flex-shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-accent/20 text-accent">
                    {item.badge}
                  </span>
                )}
              </Link>
              {/* Collapsed tooltip */}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-secondary text-foreground text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 border border-border">
                  {item.label}
                  {item.badge && <span className="ml-1.5 text-accent">({item.badge})</span>}
                </div>
              )}
            </div>
          );
        })}

        {!collapsed && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-3 pt-4 pb-2">
            System
          </p>
        )}
        {[{ label: 'Settings', href: '#', icon: Settings }].map((item) => {
          const Icon = item.icon;
          return (
            <div key={`sys-${item.href}`} className="relative group">
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 sidebar-item-inactive ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              </Link>
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-secondary text-foreground text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 border border-border">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-3 space-y-2">
        {/* K-means indicator */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-cluster-high animate-pulse" />
            <span className="text-xs text-muted-foreground">K-means active</span>
            <Zap size={10} className="text-accent ml-auto" />
          </div>
        )}

        {/* User */}
        <div
          className={`flex items-center gap-3 px-2 py-2 rounded-lg sidebar-item-inactive cursor-pointer ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Priya Mehta</p>
              <p className="text-xs text-muted-foreground truncate">Marketing Manager</p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg sidebar-item-inactive text-xs transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
