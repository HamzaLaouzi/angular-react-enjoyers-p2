import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { Player, PlayerWithId } from '../models/player.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  
  private readonly _firestore = inject(Firestore);

  private _getDocRef(id: string){
    return doc(this._firestore, 'players', id);
  }

  addPlayer(player: Player){
    const playerRef = collection(this._firestore, 'players'); //referencia desde firestore indicando la colección
    return addDoc(playerRef, player);
  }

  getPlayers(): Observable<PlayerWithId[]>{
    const playerRef = collection(this._firestore, 'players');
    return collectionData(playerRef, { idField: 'id' }) as Observable<PlayerWithId[]>;
  }

  async getPlayerById(id: string){
    const playerRef = this._getDocRef(id);
    const documentData = await getDoc(playerRef);
    return documentData.data() as Player;
  }

  updatePlayer(id: string, player: Player): void{
    const playerRef = this._getDocRef(id);
    updateDoc(playerRef, { ...player });
  }

  deletePlayer(id: string): void{
    const playerRef = this._getDocRef(id);
    deleteDoc(playerRef);
  }

  // deletePlayer(player: PlayerWithId){
  //   const playerRef = doc(this._firestore, `players/${player.id}`);
  //   return deleteDoc(playerRef);
  // }
}
