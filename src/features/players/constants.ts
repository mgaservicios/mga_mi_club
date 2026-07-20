import { PlayerRole, Position } from "./types";

export const PLAYER_ROLES: { value: PlayerRole; label: string }[] = [
  { value: "player", label: "Jugador" },
  { value: "head_coach", label: "Entrenador Principal" },
  { value: "assistant_coach", label: "Asistente Técnico" },
];

export const POSITIONS: { value: Position; label: string }[] = [
  { value: "base", label: "Base" },
  { value: "escolta", label: "Escolta" },
  { value: "alero", label: "Alero" },
  { value: "ala_pivot", label: "Ala-Pívot" },
  { value: "pivot", label: "Pívot" },
];

export const ROLE_LABELS: Record<PlayerRole, string> = {
  player: "Jugador",
  head_coach: "Entrenador Principal",
  assistant_coach: "Asistente Técnico",
};

export const POSITION_LABELS: Record<Position, string> = {
  base: "Base",
  escolta: "Escolta",
  alero: "Alero",
  ala_pivot: "Ala-Pívot",
  pivot: "Pívot",
};
