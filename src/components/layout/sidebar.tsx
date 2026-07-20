"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  UserCheck,
  Trophy,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  BarChart3,
  Shield,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Equipo", href: "/admin/equipo", icon: Users },
  { name: "Jugadores", href: "/admin/jugadores", icon: UserCheck },
  { name: "Rivales", href: "/admin/rivales", icon: Shield },
  { name: "Campeonatos", href: "/admin/campeonatos", icon: Trophy },
  { name: "Partidos", href: "/admin/partidos", icon: Calendar },
  { name: "Noticias", href: "/admin/noticias", icon: Newspaper },
  { name: "Galería", href: "/admin/galeria", icon: ImageIcon },
  { name: "Clasificación", href: "/admin/standings", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <aside className="w-96 bg-[#111111]/50 border-r border-white/10 backdrop-blur-md flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-white block">
          STREET DOGS
        </Link>
        <span className="text-xs text-orange-500 font-semibold uppercase tracking-wider">
          Panel de Control
        </span>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
