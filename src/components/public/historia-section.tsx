"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import HistoryModal from "./history-modal";

interface HistoriaSectionProps {
  history: string;
}

export default function HistoriaSection({ history }: HistoriaSectionProps) {
  const [showModal, setShowModal] = useState(false);

  const summary = `Street Dogs nació en 2016 en las plazas de Rada Tilly, cuando un grupo de amigos decidió transformar su pasión por el básquet en un equipo. Desde aquel primer campeonato, lleno de aprendizajes, hasta hoy, seguimos creciendo con el mismo espíritu: amistad, compromiso, esfuerzo y pasión por el deporte.

Más que un equipo, somos una familia que disfruta competir y compartir cada momento dentro y fuera de la cancha. La historia continúa... y todavía quedan muchos partidos por jugar.`;

  const fullHistory = `Street Dogs nació en 2016, cuando un grupo de amigos empezó a reunirse para jugar al básquet en las plazas de Rada Tilly. Lo que comenzó como una excusa para compartir una pasión, disfrutar del deporte y pasar un buen momento, pronto se transformó en un desafío: animarse a participar en un campeonato amateur.

Nuestro primer torneo fue una verdadera lección de humildad. Perdimos todos los partidos, y por una amplia diferencia. Pero lejos de desanimarnos, esa experiencia nos dejó algo mucho más valioso que una victoria: las ganas de seguir entrenando, aprendiendo y creciendo juntos.

Con el paso de los años, muchos jugadores formaron parte de esta historia. Algunos llegaron por una temporada, otros se quedaron para siempre, pero todos dejaron su huella y ayudaron a construir la identidad de Street Dogs.

Fuimos participando en distintos campeonatos y ligas de la región, representando al equipo en escenarios como Deportivo Ameghino, La Fede, Gimnasia y Esgrima y el CAD de Jerárquicos, enfrentando nuevos desafíos, rivales y experiencias que nos hicieron mejorar dentro y fuera de la cancha.

Hoy somos mucho más que un equipo de básquet. Somos un grupo consolidado de amigos que comparte los mismos valores: compañerismo, compromiso, respeto, esfuerzo y pasión por este deporte. Competimos con el objetivo de dar siempre lo mejor, pero sin perder de vista lo más importante: disfrutar cada entrenamiento, cada partido y cada momento que vivimos juntos.

Porque para nosotros, Street Dogs no se mide por la cantidad de victorias, sino por la historia que seguimos escribiendo desde aquella primera tarde en una plaza de Rada Tilly.

Y esta historia todavía tiene muchos capítulos por jugar.`;

  return (
    <>
      <section id="historia" className="relative py-24 overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 z-10" />
          <Image
            src="/fondos/fondohistoria.png"
            alt="Historia Background"
            fill
            className="object-cover opacity-100 blur-[2px]"
            unoptimized
          />
        </div>
        <div className="relative z-20 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
              <Image
                src="/fondos/historia.png"
                alt="Street Dogs Basketball"
                fill
                className="object-cover filter contrast-125 brightness-90"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="font-bebas text-3xl tracking-[2px] text-white">STREET DOGS</span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-sans text-4xl sm:text-5xl font-black tracking-wide uppercase">
                NUESTRA <span className="text-primary">HISTORIA</span>
              </h2>
              <div className="w-12 h-1 bg-primary" />
              <p className="text-zinc-400 leading-relaxed text-md whitespace-pre-line">
                {summary}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-primary/30 text-white font-bold text-sm tracking-wider uppercase rounded-full hover:bg-primary/10 transition-all"
              >
                Ver historia
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {showModal && <HistoryModal history={fullHistory} onClose={() => setShowModal(false)} />}
    </>
  );
}
