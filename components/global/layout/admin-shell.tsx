"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { AdminUser } from "@/features/auth/domain/admin-user";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/reports", label: "Laporan sampah", icon: "report" },
  { href: "/users", label: "Manajemen user", icon: "users" },
] as const;

function NavigationLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: (typeof navigationItems)[number]["icon"];
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
        active
          ? "bg-[#c3d8b9] text-[#17392d]"
          : "text-[#c4d5c3] hover:bg-[#244c38] hover:text-white"
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
        {icon === "home" && (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor">
            <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="m3 11 9-8 9 8M5.5 10v10h13V10M9 20v-6h6v6" />
          </svg>
        )}
        {icon === "report" && (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor">
            <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M6 3.75h8l4 4V20.25H6zM14 3.75v4h4M9 12h6M9 15.5h6" />
          </svg>
        )}
        {icon === "users" && (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor">
            <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M16 20H4v-1a6 6 0 0 1 12 0zM10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm7-5h4m-2-2v4" />
          </svg>
        )}
      </span>
      {label}
    </Link>
  );
}

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
  const navigationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigating = navigationTarget !== null && navigationTarget !== pathname;

  useEffect(() => {
    function handlePopState() {
      setNavigationTarget(window.location.pathname);
      if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
      navigationTimeout.current = setTimeout(() => {
        setNavigationTarget(null);
        navigationTimeout.current = null;
      }, 15_000);
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
    };
  }, []);

  function handleNavigationClick(event: React.MouseEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a[href]");
    if (
      !(anchor instanceof HTMLAnchorElement) ||
      anchor.target === "_blank" ||
      anchor.hasAttribute("download")
    ) {
      return;
    }

    const destination = new URL(anchor.href);
    if (
      destination.origin !== window.location.origin ||
      destination.pathname === pathname
    ) {
      return;
    }

    setNavigationTarget(destination.pathname);
    if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
    navigationTimeout.current = setTimeout(() => {
      setNavigationTarget(null);
      navigationTimeout.current = null;
    }, 15_000);
  }

  async function logout() {
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        const result: unknown = await response.json();
        const message =
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : "Logout gagal.";
        setLogoutError(message);
      }
    } catch {
      setLogoutError("Tidak dapat menghubungi server untuk logout.");
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen bg-[#f3f6f3] p-0 lg:flex lg:h-screen lg:gap-2 lg:overflow-hidden lg:p-2"
      onClickCapture={handleNavigationClick}
    >
      <aside className="hidden w-[228px] shrink-0 flex-col rounded-xl bg-[#17392d] px-3 py-3 text-[#eef4eb] lg:flex">
        <Link href="/dashboard" className="flex h-12 items-center gap-3 px-3" aria-label="SWMS dashboard">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c3d8b9] text-sm font-bold text-[#17392d]">SW</span>
          <span>
            <span className="block text-base font-bold tracking-tight text-white">SWMS</span>
            <span className="block text-[11px] text-[#b8cdb7]">Smart Waste Admin</span>
          </span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Navigasi utama">
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.href}
              {...item}
              active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
            />
          ))}
        </nav>

        <div className="border-t border-[#547062] px-3 pt-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c3d8b9] text-sm font-semibold text-[#17392d]">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[11px] text-[#b8cdb7]">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 min-h-10 w-full rounded-lg px-3 text-left text-xs font-medium text-[#b8cdb7] transition hover:bg-[#244c38] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c3d8b9]"
          >
            Keluar dari dashboard
          </button>
          {logoutError && <p className="mt-2 text-xs text-rose-200" role="status">{logoutError}</p>}
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-[#f7f8f2] lg:min-h-0 lg:rounded-2xl lg:border lg:border-[#d8e0d5]">
        <div
          aria-hidden="true"
          className={`fixed inset-x-0 top-0 z-50 h-1 origin-left bg-emerald-700 transition-transform duration-200 ${
            isNavigating ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          }`}
        />
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-[#e1e7de] bg-[#f3f6f3] px-4 sm:px-6 lg:border-0 lg:bg-[#f7f8f2] lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-admin-navigation"
              aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" aria-hidden="true">
                {menuOpen ? (
                  <path strokeWidth="1.8" strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
                ) : (
                  <path strokeWidth="1.8" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link href="/dashboard" className="font-bold tracking-tight text-[#17392d] lg:hidden">SWMS</Link>
            <h1 className="hidden truncate text-lg font-semibold tracking-tight text-slate-900 sm:block">
              {navigationItems.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))?.label ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className="hidden text-xs text-slate-500 sm:inline">{user.name}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-700">Online</span>
          </div>
        </header>

        {menuOpen && (
          <nav id="mobile-admin-navigation" className="space-y-1 border-b border-[#d8e0d5] bg-[#17392d] p-3 lg:hidden" aria-label="Navigasi utama">
            {navigationItems.map((item) => (
              <NavigationLink
                key={item.href}
                {...item}
                active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                onNavigate={() => setMenuOpen(false)}
              />
            ))}
            <button
              type="button"
              onClick={logout}
              className="min-h-11 w-full rounded-lg px-3 text-left text-sm font-medium text-[#c4d5c3] hover:bg-[#244c38] hover:text-white"
            >
              Keluar dari dashboard
            </button>
            {logoutError && <p className="px-3 py-2 text-xs text-rose-200" role="status">{logoutError}</p>}
          </nav>
        )}

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
