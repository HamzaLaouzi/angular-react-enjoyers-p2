import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '../../models/player.model';
import { PLAYERS } from '../../data/players';
import { DetailComponent } from '../detail/detail';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerFilterPipe } from '../../player-filter-pipe';

@Component({
  selector: 'app-players',
  templateUrl: './players.html',
  styleUrls: ['./players.css'],
  imports: [CommonModule, FormsModule, PlayerFilterPipe]
})
export class PlayersComponent {
  players: Player[] = PLAYERS;
  selectedPlayerId: number | null = null;

  constructor(private dialog: MatDialog) { }

  openDialog(player: Player) {
    this.selectedPlayerId = player.id;

    const dialogRef = this.dialog.open(DetailComponent, {
      width: '700px',
      data: player
    });

    dialogRef.afterClosed().subscribe(() => {
      this.selectedPlayerId = null;
    });
  }

  // Variables para filtros
  filterName: string = '';
  filterHeight: number | null = null;
  filterPosition: string = ''; 

  // Mostrar u ocultar lista
  showList = true;
}
