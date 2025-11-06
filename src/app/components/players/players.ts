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
import { ToastrService } from 'ngx-toastr';

type PlayerWithId = Player & { id: string };

@Component({
  selector: 'app-players',
  templateUrl: './players.html',
  styleUrls: ['./players.css'],
  imports: [CommonModule, FormsModule, PlayerFilterPipe]
})
export class PlayersComponent {
  players: PlayerWithId[] = [];
  selectedPlayerId: string | null = null;

  // Variables para filtros
  filterName: string = '';
  filterHeight: number | null = null;
  filterPosition: string = '';

  // Mostrar u ocultar lista
  showList = true;

  constructor(
    private dialog: MatDialog,
    private playersService: PlayerService,
    private firestore: Firestore,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPlayers();
  }

  /** Abre el diálogo de detalle */
  openDialog(player: PlayerWithId) {
    this.selectedPlayerId = player.id;

    const dialogRef = this.dialog.open(DetailComponent, {
      width: '700px',
      data: player
    });

    // 🔹 Aquí añadimos lógica para refrescar datos al cerrar el diálogo
    dialogRef.afterClosed().subscribe((updatedPlayer?: PlayerWithId) => {
      this.selectedPlayerId = null;

      // Si el diálogo devolvió un jugador actualizado, lo reemplazamos en memoria
      if (updatedPlayer) {
        const index = this.players.findIndex(p => p.id === updatedPlayer.id);
        if (index > -1) {
          this.players[index] = updatedPlayer;
        }
      } else {
        // Si no devolvió nada, simplemente refrescamos la lista desde Firestore
        this.getPlayers();
      }
    });
  }

  /** Añadir jugador nuevo */
  addPlayer() {
    const dialogRef = this.dialog.open(NewPlayerComponent, { width: '700px' });

    dialogRef.afterClosed().subscribe((added: boolean) => {
      if (added) {
        this.getPlayers();
        this.toastr.success(
          'El jugador se ha registrado correctamente',
          '¡Nuevo registro!'
        );
      }
    });
  }

  /** Obtener jugadores desde Firestore */
  getPlayers() {
    this.playersService.getPlayers().subscribe((players: PlayerWithId[]) => {
      this.players = players;
    });
  }

  /** Eliminar jugador */
  deletePlayer(player: PlayerWithId, event: Event) {
    event.stopPropagation(); // evita que se abra el diálogo del detalle

    const confirmDelete = window.confirm(
      `¿Eliminar jugador ${player.nombre} ${player.apellidos}?`
    );

    if (confirmDelete) {
      this.playersService.deletePlayer(player.id);
      this.players = this.players.filter(p => p.id !== player.id);
      this.toastr.error(
        'El jugador se ha eliminado correctamente',
        '¡Eliminación!'
      );
    }
  }
}
