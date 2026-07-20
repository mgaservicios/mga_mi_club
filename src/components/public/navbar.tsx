"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  logoUrl?: string | null;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["home", "historia", "equipo", "partidos", "galeria", "noticias"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const navLinks = [
    { name: "INICIO", href: "#home", id: "home" },
    { name: "HISTORIA", href: "#historia", id: "historia" },
    { name: "EQUIPO", href: "#equipo", id: "equipo" },
    { name: "PARTIDOS", href: "#partidos", id: "partidos" },
    { name: "GALERÍA", href: "#galeria", id: "galeria" },
    { name: "NOTICIAS", href: "#noticias", id: "noticias" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[88px] z-[100] transition-all duration-300 flex items-center ${
        isScrolled
          ? "bg-[#050505]/90 border-b border-white/8 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          {logoUrl && (
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-black/30 border border-white/10 flex-shrink-0">
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
          )}
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`font-sans text-sm font-bold tracking-wider transition-colors relative py-2 group ${
                  isActive ? "text-primary" : "text-zinc-300 hover:text-primary"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-primary transition-all duration-300 ${
                    isActive ? "w-8" : "w-0 group-hover:w-8"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Socials */}
        <div className="hidden lg:flex items-center gap-6">
          <a
            href="https://www.instagram.com/basketball_street_dogs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-zinc-400 hover:text-primary transition-colors border border-white/10 hover:border-primary/30 px-4 py-2 rounded-full"
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-primary transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[88px] left-0 right-0 bg-[#050505] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-fade-in">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-oswald text-lg tracking-[2px] transition-colors py-2 border-b border-white/5 ${
                  isActive ? "text-primary" : "text-zinc-300 hover:text-primary"
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <Link
            href="/auth/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 font-oswald text-lg tracking-[2px] text-zinc-300 hover:text-primary transition-colors py-2 border-b border-white/5"
          >
            <LogIn className="w-4 h-4" />
            LOGIN
          </Link>
        </div>
      )}
    </header>
  );
}
