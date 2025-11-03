import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '../../models/player.model';
import { DetailComponent } from '../detail/detail';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerFilterPipe } from '../../player-filter-pipe';
import { PlayerService } from '../../services/player-service';
import { Firestore } from '@angular/fire/firestore';
import { NewPlayerComponent } from '../new-player/new-player';

type PlayerWithId = Player & { id: string };

@Component({
  selector: 'app-players',
  templateUrl: './players.html',
  styleUrls: ['./players.css'],
  imports: [CommonModule, FormsModule, PlayerFilterPipe]
})
export class PlayersComponent {
  // players: Player[] = PLAYERS;
  players: PlayerWithId[] = [];
  selectedPlayerId: string | null = null;

  // Variables para filtros
  filterName: string = '';
  filterHeight: number | null = null;
  filterPosition: string = '';

  // Mostrar u ocultar lista
  showList = true;

  constructor(private dialog: MatDialog, private playersService: PlayerService, private firestore: Firestore) { }

  ngOnInit(): void {
    this.getPlayers();
  }

  openDialog(player: PlayerWithId) {
    this.selectedPlayerId = player.id;

    const dialogRef = this.dialog.open(DetailComponent, {
      width: '700px',
      data: player
    });

    dialogRef.afterClosed().subscribe(() => {
      this.selectedPlayerId = null;
    });
  }

addPlayer() {
  const dialogRef = this.dialog.open(NewPlayerComponent, { width: '700px' });

  dialogRef.afterClosed().subscribe((added: boolean) => {
    if (added) {
      this.getPlayers();
    }
  });
}

  getPlayers() {
    this.playersService.getPlayers().subscribe((players: PlayerWithId[]) => {
      this.players = players;
      console.log(players);
    });
  }

  deletePlayer(player: PlayerWithId, event: Event) {
    event.stopPropagation(); // evita que se abra el diálogo del detalle

    const confirmDelete = window.confirm(`¿Eliminar jugador ${player.nombre} ${player.apellidos}?`);

    if (confirmDelete) {
      this.playersService.deletePlayer(player.id);
      this.players = this.players.filter(p => p.id !== player.id);
    }
  }

}
