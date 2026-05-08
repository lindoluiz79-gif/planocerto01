import { Link } from "@tanstack/react-router";
import { Home, Search, Heart, GitCompare } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/buscar", label: "Buscar", icon: Search },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/comparar", label: "Comparar", icon: GitCompare },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-gray-900/95 backdrop-blur border-t border-gray-700">
      <ul className="max-w-2xl mx-auto grid grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeProps={{ className: "text-blue-500" }}
              className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-gray-300 hover:text-blue-500 transition-colors"
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
