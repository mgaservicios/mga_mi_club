import { getTeam } from "@/features/team/actions";
import { getPlayers } from "@/features/players/actions";
import { getMatches, getNextMatch } from "@/features/matches/actions";
import { getGallery } from "@/features/gallery/actions";
import { getAlbums } from "@/features/gallery/album-actions";
import { getPublishedNews } from "@/features/news/actions";
import { getStandings } from "@/features/standings/actions";
import { getChampionships } from "@/features/championships/actions";
import { getRivals } from "@/features/rivals/actions";

import Navbar from "@/components/public/navbar";
import HistoriaSection from "@/components/public/historia-section";
import PublicPageSections from "@/components/public/public-page-sections";

import { Calendar, MapPin, Trophy, ArrowRight, Star, Users, Heart, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const team = await getTeam();

  if (!team) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#050505] text-white font-sans px-6 text-center">
        <h1 className="font-bebas text-6xl tracking-[4px] text-primary mb-4">
          STREET DOGS
        </h1>
        <p className="text-xl text-zinc-400 max-w-md mb-8">
          Básquet +40 Patagonia. Bienvenido al sitio oficial. Para comenzar, configura tu equipo en el panel de administración.
        </p>
        <Link
          href="/admin/equipo"
          className="px-8 py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20"
        >
          CONFIGURAR EQUIPO
        </Link>
      </div>
    );
  }

  const [players, nextMatch, matches, images, albums, news, standings, championships, rivals] = await Promise.all([
    getPlayers(team.id),
    getNextMatch(team.id),
    getMatches(team.id),
    getGallery(team.id),
    getAlbums(team.id),
    getPublishedNews(team.id),
    getStandings(team.id),
    getChampionships(team.id),
    getRivals(team.id),
  ]);

  const championshipMap: Record<string, string> = Object.fromEntries(championships.map((c) => [c.id, c.name]));
  const rivalMap: Record<string, { name: string; logo_url: string | null; location: string | null }> = Object.fromEntries(
    rivals.map((r) => [r.id, { name: r.name, logo_url: r.logo_url, location: r.location }])
  );

  const groupedMatches = matches.reduce<Record<string, typeof matches>>((acc, match) => {
    const key = match.championship_id || "sin-campeonato";
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-primary selection:text-white">
      <Navbar logoUrl={team.logo_url} />

      {/* HERO SECTION */}
      <section id="home" className="relative h-screen flex items-end justify-start overflow-hidden px-6 sm:px-12 lg:px-24 pb-48">
        {/* Background Image with Cinematic Red/Black Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />
          <Image
            src="/fondos/fondohome.png"
            alt="Street Dogs Hero"
            fill
            className="object-cover object-center opacity-100"
            priority
            unoptimized
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-3xl text-left space-y-6 animate-fade-in-up">
          <p className="font-sans text-2xl sm:text-4xl tracking-[3px] font-black uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] animate-digital-text">
            <span className="text-white">MÁS QUE UN EQUIPO, </span>
            <span className="shimmer-text">UNA FAMILIA.</span>
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href="#equipo"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary hover:bg-primary text-white font-bold rounded-full transition-all shadow-[0_0_15px_rgba(200,16,46,0.3)] text-xs tracking-wider uppercase"
            >
              <span>Conocé más</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            {nextMatch && (
              <a
                href="#proximo-partido"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary/10 border-2 border-primary/50 hover:bg-primary hover:border-primary text-white font-bold rounded-full transition-all text-xs tracking-wider uppercase"
              >
                <Calendar className="w-4 h-4" />
                <span>Próxima Fecha</span>
              </a>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-zinc-500 animate-bounce">
          <span className="text-[10px] tracking-[2px] font-bold uppercase">SCROLL</span>
          <div className="w-5 h-8 border-2 border-zinc-500 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-zinc-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative z-30 bg-[#101010]/80 border-y border-white/5 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="font-bebas text-xl tracking-[1px] text-white">+10 AÑOS JUNTOS</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <span className="font-bebas text-xl tracking-[1px] text-white">+20 JUGADORES</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="font-bebas text-xl tracking-[1px] text-white">TORNEOS LOCALES</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-bebas text-xl tracking-[1px] text-white">UNA SOLA PASIÓN</span>
          </div>
        </div>
      </section>

      {/* PRÓXIMO PARTIDO SECTION */}
      {nextMatch && (
        <section id="proximo-partido" className="relative z-20 max-w-5xl mx-auto px-6 mt-6 scroll-mt-24">
          <div className="bg-[#101010]/90 border border-primary/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(200,16,46,0.2)] backdrop-blur-md relative overflow-hidden">
            {/* Red Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />

            {/* Title Tab */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6">
              <Calendar className="w-3.5 h-3.5" />
              <span>PRÓXIMO PARTIDO</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Teams */}
              <div className="lg:col-span-5 flex items-center justify-center gap-8">
                <div className="text-center space-y-2">
                  <div className="relative w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2 overflow-hidden">
                    {team.logo_url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={team.logo_url}
                          alt={team.name}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <span className="font-bebas text-2xl text-white">SD</span>
                    )}
                  </div>
                  <p className="font-bebas text-lg tracking-[1px] text-white">{team.name.toUpperCase()}</p>
                </div>

                <span className="font-bebas text-3xl text-primary italic">VS</span>

                <div className="text-center space-y-2">
                  <div className="relative w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2 overflow-hidden">
                    {nextMatch.rival_id && rivalMap[nextMatch.rival_id]?.logo_url ? (
                      <img
                        src={rivalMap[nextMatch.rival_id].logo_url!}
                        alt={nextMatch.rival}
                        className="w-full h-full object-contain"
                      />
                    ) : nextMatch.image_url ? (
                      <img
                        src={nextMatch.image_url}
                        alt={nextMatch.rival}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="font-bebas text-2xl text-zinc-500">
                        {nextMatch.rival.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="font-bebas text-lg tracking-[1px] text-zinc-400">{nextMatch.rival.toUpperCase()}</p>
                </div>
              </div>

              {/* Match Info */}
              <div className="lg:col-span-4 space-y-3 text-center lg:text-left border-y lg:border-y-0 lg:border-x border-white/10 py-6 lg:py-0 lg:px-8">
                <div className="flex items-center justify-center lg:justify-start gap-3 text-zinc-300">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-sans text-sm font-semibold uppercase tracking-wider">
                    {new Date(nextMatch.date).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "America/Argentina/Buenos_Aires",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 text-zinc-300">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-sans text-sm font-semibold uppercase tracking-wider">
                    {new Date(nextMatch.date).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "America/Argentina/Buenos_Aires",
                    })} HS
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 text-zinc-400">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-sans text-xs font-medium uppercase tracking-wider">
                    {nextMatch.is_home ? "LOCAL" : "VISITANTE"}
                  </span>
                </div>
              </div>

              {/* Countdown & CTA */}
              <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-6">
                <a
                  href="#partidos"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-red-700 text-white font-bold rounded-full transition-all text-xs tracking-wider uppercase"
                >
                  <span>Ver fixture completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* NUESTRA HISTORIA SECTION */}
      <HistoriaSection history={team.history || `Street Dogs nació en 2016 en las plazas de Rada Tilly, cuando un grupo de amigos decidió transformar su pasión por el básquet en un equipo. Desde aquel primer campeonato, lleno de aprendizajes, hasta hoy, seguimos creciendo con el mismo espíritu: amistad, compromiso, esfuerzo y pasión por el deporte.

Más que un equipo, somos una familia que disfruta competir y compartir cada momento dentro y fuera de la cancha. La historia continúa... y todavía quedan muchos partidos por jugar.`} />

      {/* TABLA DE POSICIONES */}
      {standings.length > 0 && (
        <section className="relative py-24 overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-[#050505] z-10" />
            <Image
              src="/fondos/fondopartidos.png"
              alt="Posiciones Background"
              fill
              className="object-cover opacity-10"
              unoptimized
            />
          </div>
          <div className="relative z-20 max-w-4xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="font-sans text-4xl sm:text-5xl font-black tracking-wide uppercase">
                TABLA DE <span className="text-primary">POSICIONES</span>
              </h2>
              <div className="w-12 h-1 bg-primary mx-auto" />
            </div>

            <div className="bg-[#101010] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                      <th className="p-4 text-center w-16">Pos</th>
                      <th className="p-4">Equipo</th>
                      <th className="p-4 text-center w-20">PJ</th>
                      <th className="p-4 text-center w-20">PG</th>
                      <th className="p-4 text-center w-20">PP</th>
                      <th className="p-4 text-center w-24">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {standings.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-white/5 transition-colors ${
                          row.team_name.toLowerCase().includes(team.name.toLowerCase())
                            ? "bg-primary/10 text-white font-bold"
                            : "text-zinc-300"
                        }`}
                      >
                        <td className="p-4 text-center font-bold text-primary">{row.position}</td>
                        <td className="p-4 font-semibold">{row.team_name}</td>
                        <td className="p-4 text-center">{row.played}</td>
                        <td className="p-4 text-center text-green-400">{row.won}</td>
                        <td className="p-4 text-center text-red-400">{row.lost}</td>
                        <td className="p-4 text-center font-bold">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      <PublicPageSections
        teamHistory={team.history || ""}
        players={players}
        groupedMatches={groupedMatches}
        championshipMap={championshipMap}
        rivalMap={rivalMap}
        matches={matches}
        images={images}
        albums={albums}
        news={news}
      />



      {/* FOOTER */}
      <footer className="relative bg-[#050505] border-t border-white/5 py-8 text-center space-y-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black z-10" />
          <Image
            src="/fondos/07-footer.png"
            alt="Footer Background"
            fill
            className="object-cover opacity-20"
            unoptimized
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 flex flex-col items-center space-y-3">
          <Image
            src="/fondos/frase.png"
            alt="Frase Street Dogs"
            width={250}
            height={60}
            className="object-contain"
            unoptimized
          />

          {/* Redes Sociales */}
          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/basketball_street_dogs/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-primary hover:text-white text-zinc-400 rounded-full transition-all border border-white/10"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>

          <p className="text-[10px] text-zinc-600">
            © {new Date().getFullYear()} {team.name}. Todos los derechos reservados.
          </p>
          <a
            href="https://mgadigital.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Image
              src="/logos/mga.png"
              alt="MGA Informática"
              width={24}
              height={24}
              className="rounded-sm"
              unoptimized
            />
            <span>Diseñado por <span className="font-semibold">MGA Informática</span></span>
          </a>
        </div>
      </footer>
    </div>
  );
}
