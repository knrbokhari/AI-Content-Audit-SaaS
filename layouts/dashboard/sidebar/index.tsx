"use client"

/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { clsx } from "clsx";
import {
  Shield,
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  Palette,
  BarChart3,
  Briefcase,
  X,
  Menu,
  CreditCard,
  ChevronDown,
  PencilSparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/components/common/Avatar";

const MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Organizations", icon: Building2, to: "/organizations" },
  { label: "Customers", icon: Briefcase, to: "/customers" },
  { label: "Subscriptions", icon: CreditCard, to: "/subscriptions" },
  { label: "Branding", icon: Palette, to: "/branding" },
  { label: "Team", icon: Users, to: "/users" },
  { label: "Reports", icon: BarChart3, to: "/reports" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

const MenuItem = ({ item, collapsed, isActive }: any) => (
  <Link
    href={item.to}
    className={clsx("sidebar-item", isActive && "active")}
    title={collapsed ? item.label : undefined}
  >
    <item.icon size={17} className="shrink-0" />
    {!collapsed && <span>{item.label}</span>}
  </Link>
);
const useAuth = () => {
  return {};
};
const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: any) => {
  const { user, logout, primaryRole, hasRole }: any = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  const menu = MENU;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={clsx(
          "flex items-center gap-2.5 px-4 py-5 shrink-0",
          collapsed && "justify-center px-3",
        )}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "#4D8EF7" }}
        >
          <PencilSparkles size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p
              className="font-800 text-sm leading-tight"
              style={{ color: "var(--primary)" }}
            >
              ContentPilot AI
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div
        className="mx-3 mb-3"
        style={{ height: 1, background: "var(--border)" }}
      />

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {menu.map((item) => (
          <MenuItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom divider */}
      <div
        className="mx-3 mt-3"
        style={{ height: 1, background: "var(--border)" }}
      />

      {/* Profile */}
      <div className="p-2 mt-2 shrink-0">
        <button
          onClick={() => setShowProfile((v) => !v)}
          className={clsx(
            "w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors hover:bg-(--bg-surface-2) cursor-pointer",
            collapsed && "justify-center",
          )}
        >
          <Avatar name={"user?.fullName"} size="sm" />
          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-600 truncate">Knr Naeem</p>
                <p className="text-xs truncate">naeem@email.com</p>
              </div>
              <ChevronDown size={13} className={clsx('shrink-0 transition-transform', showProfile && 'rotate-180')} />
            </>
          )}
        </button>

        {showProfile && !collapsed && (
          <div className="mt-1 space-y-0.5 animate-fade-in">
            <Link
              href="/profile"
              onClick={() => setShowProfile(false)}
              className="sidebar-item text-xs"
            >
              <Users size={14} />
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="sidebar-item text-xs w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={clsx(
          "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-200 border-r",
          collapsed ? "w-15" : "w-55",
        )}
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-16 z-10 w-7 h-7 rounded-full border shadow-sm flex items-center justify-center transition-colors hover:bg-blue-50"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            color: "var(--primary)",
          }}
        >
          <Menu size={13} />
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <aside
            className="absolute left-0 top-0 h-full w-60 flex flex-col shadow-xl"
            style={{ background: "var(--bg-surface)" }}
          >
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ color: "var(--secondary)" }}
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
