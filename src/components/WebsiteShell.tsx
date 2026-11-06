import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/components/account/AccountProvider";
const links = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About Us" },
  { to: "/how-it-works" as const, label: "How It Works" },
  { to: "/school-mode" as const, label: "School Mode" },
  { to: "/independent-learning" as const, label: "Independent Learning" },
  { to: "/contact" as const, label: "Contact" },
];
export function WebsiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user } = useAccount();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        Skip to content
      </a>
      <header className="relative z-20 border-b border-border bg-background">
        <div className="site-container flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src="/elimu-bridge-logo.png" alt="" className="size-10 object-contain" />
            <span className="text-lg font-extrabold text-primary">
              Elimu Bridge
              <span className="mt-0.5 block text-[9px] font-semibold uppercase text-learning-teal">
                Learning. Connected.
              </span>
            </span>
          </Link>
          <nav aria-label="Website navigation" className="hidden items-center gap-5 xl:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-learning-teal font-bold" }}
                className="text-[11px] font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to={user ? "/dashboard" : "/auth"}>{user ? "Dashboard" : "Sign In"}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-learning-teal text-hero-foreground hover:bg-learning-teal/90"
            >
              <Link to={user ? "/dashboard" : "/auth"}>
                Get Started
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav
            aria-label="Mobile website navigation"
            className="site-container grid gap-1 border-t border-border py-4 sm:grid-cols-2 xl:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/auth"
              className="py-3 text-sm font-semibold text-learning-teal"
              onClick={() => setOpen(false)}
            >
              Sign In
              <ArrowRight className="ml-2 inline size-4" />
            </Link>
          </nav>
        )}
      </header>
      <main id="main-content">{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="site-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3 text-xl font-extrabold">
              <img
                src="/elimu-bridge-logo.png"
                alt=""
                className="size-10 rounded-md bg-background p-1"
              />
              Elimu Bridge
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-hero-muted">
              Bridging learning gaps. Making quality education accessible to every learner in Kenya.
            </p>
            <p className="mt-5 text-xs font-semibold text-learning-gold">
              Made for Kenya. Built around you.
            </p>
          </div>
          <nav aria-label="About navigation" className="space-y-4 text-sm">
            <h2 className="mb-5 font-bold">Elimu Bridge</h2>
            <Link className="block text-hero-muted" to="/about">
              About Us
            </Link>
            <Link className="block text-hero-muted" to="/how-it-works">
              How It Works
            </Link>
            <Link className="block text-hero-muted" to="/contact">
              Contact
            </Link>
          </nav>
          <nav aria-label="Learning modes" className="space-y-4 text-sm">
            <h2 className="mb-5 font-bold">Find your path</h2>
            <Link className="block text-hero-muted" to="/school-mode">
              For schools
            </Link>
            <Link className="block text-hero-muted" to="/independent-learning">
              Independent Learning
            </Link>
            <Link className="block text-hero-muted" to="/teachers">
              Teacher resources
            </Link>
            <Link className="block text-hero-muted" to="/app/$view" params={{ view: "tutor" }}>
              Mwalimu AI
            </Link>
          </nav>
          <div>
            <h2 className="mb-5 text-sm font-bold">Stay connected</h2>
            <p className="text-xs leading-7 text-hero-muted">
              Official contact and social links will appear once verified.
            </p>
            <Button asChild variant="link" className="mt-2 px-0 text-learning-gold">
              <Link to="/contact">
                Contact information
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="site-container flex flex-wrap justify-between gap-4 border-t border-hero-muted/20 py-6 text-xs text-hero-muted">
          <span>© 2026 Elimu Bridge · Kenya</span>
          <div className="flex gap-5">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms and Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
