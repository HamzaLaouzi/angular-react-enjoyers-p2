import { Injectable, inject } from '@angular/core';
import { CollectionReference, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  // Inyectar Firestore usando 'inject' (o en el constructor)
  private firestore: Firestore = inject(Firestore);
  private playersCollection: CollectionReference;

  constructor() {
    // Definir la referencia a la colección
    this.playersCollection = collection(this.firestore, 'players');
  }

  getPlayers(): Observable<Player[]> {
    // Usar 'collectionData' para obtener el Observable. 
    // Añadimos { idField: 'id' } para incluir el ID.
    return collectionData(this.playersCollection, { idField: 'id' }) as Observable<Player[]>;
  }
}