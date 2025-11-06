import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '../models/player.model';
// import { PLAYERS } from '../data/players';  /* Comentado para desactivar el enlace a nuestro array local*/
import { PlayerService } from '../players/players.services'; /*Nuevo importar de FireBase*/
import { DetailComponent } from '../detail/detail';
import { AddPlayerComponent } from './add-player/add-player';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerFilterPipe } from '../player-filter-pipe';

/* Nuevos imports para los botones de editar y borrar en la tarjeta del jugador */
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { EditPlayerComponent } from '../players/edit-player/edit-player';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-players',
  templateUrl: './players.html',
  styleUrls: ['./players.css'],
  imports: [CommonModule, FormsModule, PlayerFilterPipe, AddPlayerComponent, MatIconModule]
})
export class PlayersComponent {
  players: Player[] = [];
  selectedPlayerId: string | null = null;
  mostrarFormulario = false;

  constructor(
    private dialog: MatDialog, 
    private playerService: PlayerService,
    private firestore: Firestore,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.playerService.getPlayers().subscribe(data => {
      this.players = data;
    });
  }

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

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  abrirEdicion(player: any) {
    this.dialog.open(EditPlayerComponent, {
      width: '600px',
      data: { player }
    });
  }

  async borrarJugador(player: any) {
    const confirmDelete = confirm(`¿Seguro que quieres borrar a "${player.nombre}"?`);
    if (!confirmDelete) return;

    try {
      const playerRef = doc(this.firestore, `players/${player.id}`);
      await deleteDoc(playerRef);
      this.toastr.success(`Jugador "${player.nombre}" eliminado correctamente`);
    } catch (error) {
      console.error('Error al borrar jugador:', error);
      this.toastr.error('Error al borrar jugador');
    }
}


  // Variables para filtros
  filterName: string = '';
  filterHeight: number | null = null;
  filterPosition: string = '';
  showList = true;
}




// Antiguo contenido con nuestro array local, comentado para desactivar


// export class PlayersComponent {
//   players: Player[] = PLAYERS;
//   selectedPlayerId: number | null = null;

//   constructor(private dialog: MatDialog) { }

//   openDialog(player: Player) {
//     this.selectedPlayerId = player.id;

//     const dialogRef = this.dialog.open(DetailComponent, {
//       width: '700px',
//       data: player
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.selectedPlayerId = null;
//     });
//   }

//   // Variables para filtros
//   filterName: string = '';
//   filterHeight: number | null = null;
//   filterPosition: string = ''; 

//   // Mostrar u ocultar lista
//   showList = true;
// }
