import { useEffect, useState } from "react";
import { loadConfig } from "./config";

interface Capability {
  name: string;
  type: "query" | "update";
  description: string;
  inputs: { name: string; type: string }[];
  output: string;
}

const capabilities: Capability[] = [
  {
    name: "greet",
    type: "query",
    description: "Returns a personalized greeting string for the given name.",
    inputs: [{ name: "name", type: "Text" }],
    output: "Text",
  },
  {
    name: "add",
    type: "query",
    description: "Returns the sum of two natural numbers.",
    inputs: [
      { name: "a", type: "Nat" },
      { name: "b", type: "Nat" },
    ],
    output: "Nat",
  },
  {
    name: "increment",
    type: "update",
    description:
      "Increments a persistent counter by 1 and returns its new value.",
    inputs: [],
    output: "Nat",
  },
  {
    name: "getCount",
    type: "query",
    description: "Returns the current value of the persistent counter.",
    inputs: [],
    output: "Nat",
  },
  {
    name: "echo",
    type: "query",
    description: "Returns the input message unchanged.",
    inputs: [{ name: "message", type: "Text" }],
    output: "Text",
  },
  {
    name: "addNote",
    type: "update",
    description:
      "Stores a note with the given title and body, returns its auto-assigned ID.",
    inputs: [
      { name: "title", type: "Text" },
      { name: "body", type: "Text" },
    ],
    output: "Nat",
  },
  {
    name: "getNotes",
    type: "query",
    description: "Returns all stored notes as an array of objects.",
    inputs: [],
    output: "Vec { id: Nat; title: Text; body: Text }",
  },
];

const navLinks = [
  { label: "Overview", active: false },
  { label: "API Reference", active: true },
  { label: "Methods", active: false },
  { label: "About", active: false },
];

const NavItem = {
  Overview: "nav.overview.link",
  "API Reference": "nav.api_reference.link",
  Methods: "nav.methods.link",
  About: "nav.about.link",
} as Record<string, string>;

function MethodTypeBadge({ type }: { type: "query" | "update" }) {
  if (type === "query") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-query-badge text-query-badge-fg">
        Query
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-update-badge text-update-badge-fg">
      Update
    </span>
  );
}

function CapabilityCard({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  return (
    <article
      data-ocid={`capability.item.${index + 1}`}
      className="bg-card rounded-xl shadow-card p-5 flex flex-col gap-3 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Card header: method name + badge */}
      <div className="flex items-start justify-between gap-2">
        <code className="font-mono font-bold text-code-green text-base leading-snug break-all">
          {capability.name}()
        </code>
        <div className="shrink-0 mt-0.5">
          <MethodTypeBadge type={capability.type} />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {capability.description}
      </p>

      {/* Input Parameters */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Input Parameters
        </span>
        {capability.inputs.length === 0 ? (
          <span className="text-sm font-mono text-muted-foreground italic">
            None
          </span>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {capability.inputs.map((param) => (
              <li key={param.name}>
                <code className="font-mono text-sm text-foreground">
                  <span className="text-foreground">{param.name}</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-foreground">{param.type}</span>
                </code>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Output */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Output
        </span>
        <code className="font-mono text-sm text-foreground break-all">
          {capability.output}
        </code>
      </div>
    </article>
  );
}

export default function App() {
  const [canisterId, setCanisterId] = useState<string>("Loading...");
  const [copied, setCopied] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    loadConfig()
      .then((config) => {
        setCanisterId(config.backend_canister_id || "Not available");
      })
      .catch(() => {
        setCanisterId("Not available");
      });
  }, []);

  const handleCopy = () => {
    if (canisterId === "Loading..." || canisterId === "Not available") return;
    navigator.clipboard.writeText(canisterId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentYear = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <div className="flex min-h-screen bg-background">
      {/* ============ SIDEBAR ============ */}
      <aside className="fixed inset-y-0 left-0 z-30 w-60 bg-sidebar border-r border-sidebar-border flex-col hidden md:flex">
        {/* Brand */}
        <div className="px-6 py-8 border-b border-sidebar-border">
          <div className="font-sans font-bold text-xl leading-tight tracking-widest uppercase text-foreground">
            <div>Capability</div>
            <div>Sandbox</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">v1.0.0</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-4" aria-label="Sidebar navigation">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  data-ocid={NavItem[link.label]}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors text-left ${
                    link.active
                      ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                  }`}
                  aria-current={link.active ? "page" : undefined}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="px-6 py-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground">
            ICP Canister Reference
          </p>
        </div>
      </aside>

      {/* ============ MOBILE HEADER ============ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 bg-sidebar border-b border-border flex items-center justify-between px-4 py-3">
        <div className="font-sans font-bold text-base tracking-widest uppercase text-foreground">
          Capability Sandbox
        </div>
        <button
          type="button"
          data-ocid="nav.mobile_menu.toggle"
          onClick={() => setMobileNavOpen((v) => !v)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle navigation"
        >
          <svg
            role="img"
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>{mobileNavOpen ? "Close menu" : "Open menu"}</title>
            {mobileNavOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
          className="md:hidden fixed inset-0 z-10 bg-black/30"
          onClick={() => setMobileNavOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setMobileNavOpen(false);
          }}
        />
      )}
      {mobileNavOpen && (
        <nav className="md:hidden fixed top-[53px] left-0 right-0 z-20 bg-sidebar border-b border-border shadow-card">
          <ul className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    link.active
                      ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 md:ml-60 min-h-screen flex flex-col">
        <div className="flex-1 px-6 md:px-10 lg:px-16 pt-20 md:pt-12 pb-10">
          {/* ---- Header row ---- */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
            {/* Left: title + version */}
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                API Reference
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-muted text-muted-foreground border border-border">
                v1.0
              </span>
            </div>

            {/* Right: Canister ID */}
            <div
              className="flex items-center gap-3 flex-wrap"
              data-ocid="canister_id.section"
            >
              <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                Canister ID:
              </span>
              <code className="font-mono text-sm bg-canister-chip text-canister-chip-fg px-3 py-1.5 rounded-lg tracking-wide break-all max-w-xs">
                {canisterId}
              </code>
              <button
                type="button"
                data-ocid="canister_id.copy_button"
                onClick={handleCopy}
                disabled={
                  canisterId === "Loading..." || canisterId === "Not available"
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground border border-border bg-card hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Copy canister ID to clipboard"
              >
                {copied ? (
                  <>
                    <svg
                      role="img"
                      aria-label="Copied"
                      className="w-3.5 h-3.5 text-code-green"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Copied</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      role="img"
                      aria-label="Copy"
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Copy</title>
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                        strokeWidth={2}
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                      />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ---- Section heading ---- */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Capabilities
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {capabilities.length} public methods exposed by this canister.
            </p>
          </div>

          {/* ---- Method card grid ---- */}
          <div
            data-ocid="capability.list"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {capabilities.map((cap, i) => (
              <CapabilityCard key={cap.name} capability={cap} index={i} />
            ))}
          </div>
        </div>

        {/* ============ FOOTER ============ */}
        <footer className="border-t border-border bg-sidebar/60 px-6 md:px-10 lg:px-16 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <nav
              className="flex items-center gap-4 flex-wrap"
              aria-label="Footer navigation"
            >
              {["Docs", "GitHub", "Status", "Blog"].map((item) => (
                <button
                  key={item}
                  type="button"
                  data-ocid={`footer.${item.toLowerCase()}.link`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear}. Built with</span>
              <svg
                role="img"
                aria-label="love"
                className="w-4 h-4 text-destructive"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>love</title>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>using</span>
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
                data-ocid="footer.caffeine.link"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
