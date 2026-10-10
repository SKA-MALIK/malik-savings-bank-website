import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    {
      path: "/",
      label: "Home",
      gradient: "from-vibrant-gold via-vibrant-deep-amber to-chart-1",
    },
    {
      path: "/asset-metrics",
      label: "Asset Metrics",
      gradient: "from-vibrant-gold via-chart-2 to-vibrant-royal-blue",
    },
    {
      path: "/about",
      label: "About",
      gradient: "from-vibrant-deep-amber via-vibrant-maroon to-chart-2",
    },
    {
      path: "/shareholders",
      label: "Shareholders",
      gradient: "from-vibrant-maroon via-vibrant-royal-blue to-chart-3",
    },
    {
      path: "/yearly-savings",
      label: "Yearly Savings",
      gradient: "from-vibrant-royal-blue via-vibrant-gold to-chart-4",
    },
    {
      path: "/contact",
      label: "Contact",
      gradient: "from-chart-4 via-vibrant-deep-amber to-primary",
    },
    {
      path: "/admin",
      label: "Admin",
      gradient: "from-primary via-vibrant-gold to-accent",
    },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80 group"
          >
            <img
              src="/assets/1000075984-removebg-preview-1.png"
              alt="Malik Savings Bank"
              className="h-12 w-auto group-hover:drop-shadow-[0_0_12px_oklch(var(--vibrant-gold)/0.6)] transition-all duration-300"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-base font-bold leading-tight bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-primary bg-clip-text text-transparent animate-gradient-shift">
                Malik Savings Bank
              </span>
              <span className="text-xs text-muted-foreground">Since 2018</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-md px-4 py-2 text-sm font-medium transition-all overflow-hidden group ${
                  isActive(item.path)
                    ? "text-primary-foreground border border-primary/30 shadow-vibrant-glow"
                    : "text-muted-foreground hover:text-primary border border-transparent"
                }`}
              >
                {isActive(item.path) && (
                  <span
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-90 animate-gradient-shift`}
                  />
                )}
                {!isActive(item.path) && (
                  <span
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                {!isActive(item.path) && (
                  <span
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-gradient-to-r hover:from-vibrant-gold/10 hover:to-vibrant-maroon/10 hover:text-primary transition-all duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-primary/20 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative rounded-md px-4 py-3 text-sm font-medium transition-all overflow-hidden ${
                    isActive(item.path)
                      ? "text-primary-foreground border border-primary/30 shadow-vibrant-glow"
                      : "text-muted-foreground hover:text-primary border border-transparent"
                  }`}
                >
                  {isActive(item.path) && (
                    <span
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-90 animate-gradient-shift`}
                    />
                  )}
                  {!isActive(item.path) && (
                    <span
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 hover:opacity-30 transition-opacity duration-300`}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
