export interface Player {
  nombre: string;
  apellidos: string;
  posicion: string;
  edad: number;
  altura: number;
  multimedia: string[];
  youtubeId?: string;
  info: string;
}

// Tipo extendido con ID autogenerado de Firestore
export type PlayerWithId = Player & { id: string };
