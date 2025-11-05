// src/app/services/player.service.ts

import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersCollection;

  constructor(private firestore: Firestore) {
    // Referencia a la colección 'players' en tu base de datos de Firebase
    this.playersCollection = collection(this.firestore, 'players');
  }

  // Obtiene todos los jugadores, ordenados por nombre. El idField es crucial
  // para obtener el ID de Firestore.
  getPlayers(): Observable<Player[]> {
    const playersQuery = query(this.playersCollection, orderBy('nombre'));
    return collectionData(playersQuery, { idField: 'id' }) as Observable<Player[]>;
  }

  async createPlayer(player: Omit<Player, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.playersCollection, player);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear jugador:', error);
      throw error;
    }
  }

  // Actualiza parcialmente un jugador (clave para la función de Editar)
  async updatePlayer(playerId: string, player: Partial<Player>): Promise<void> {
    try {
      const playerDoc = doc(this.firestore, `players/${playerId}`);
      await updateDoc(playerDoc, player);
    } catch (error) {
      console.error('Error al actualizar jugador:', error);
      throw error;
    }
  }

  // Elimina un jugador (clave para la función de Eliminar)
  async deletePlayer(playerId: string): Promise<void> {
    try {
      const playerDoc = doc(this.firestore, `players/${playerId}`);
      await deleteDoc(playerDoc);
    } catch (error) {
      console.error('Error al eliminar jugador:', error);
      throw error;
    }
  }
  
  // (Otras funciones auxiliares como getTeamStats y populateInitialData omitidas por brevedad)
  
  // Incluyo las que tenía tu compañero por si las usas, son parte de tu proyecto:
  async getTeamStats(): Promise<any> {
    const players = await this.getPlayers().toPromise();
    if (!players) return { total: 0, promedioEdad: 0, promedioAltura: 0, posiciones: {} };

    const total = players.length;
  
    
    const posiciones: { [key: string]: number } = {};
    players.forEach(p => {
      posiciones[p.posicion] = (posiciones[p.posicion] || 0) + 1;
    });

    return { total, posiciones };
  }
  
  async populateInitialData(localPlayers: any[]): Promise<void> {
      for (const localPlayer of localPlayers) {
        const firestorePlayer = {
          nombre: localPlayer.nombre,
          apellidos: localPlayer.apellidos,
          posicion: localPlayer.posicion,
          edad: localPlayer.edad,
          altura: localPlayer.altura,
          multimedia: localPlayer.multimedia[0] || '',
          youtubeId: localPlayer.youtubeId || '',
          info: localPlayer.info
        };
        await this.createPlayer(firestorePlayer);
      }
    }
}