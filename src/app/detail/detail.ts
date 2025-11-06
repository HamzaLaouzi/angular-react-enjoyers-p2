import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Player } from '../models/player.model';
import { MatIconModule } from '@angular/material/icon';
import { MediaComponent } from '../media/media';
import { NgIf } from '@angular/common';
import { EditPlayerComponent } from '../players/edit-player/edit-player';

/* Import para el deletePlayer */
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.html',
  styleUrls: ['./detail.css'],
  standalone: true,
  imports: [MatIconModule, MediaComponent, NgIf]
})
export class DetailComponent {
  constructor(
    public dialogRef: MatDialogRef<DetailComponent>,
    private dialog: MatDialog,
    private firestore: Firestore,  // Añadimos Firestore
    @Inject(MAT_DIALOG_DATA) public player: Player
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  abrirEdicion(): void {
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      width: '600px',
      data: { player: this.player } // pasamos los datos del jugador
    });

    // cuando se cierre, podemos refrescar los datos si hace falta
    dialogRef.afterClosed().subscribe((resultado) => {
       // solo si realmente se han hecho cambios
    if (resultado?.updated && resultado.changes) {
      // aplicamos los cambios devueltos sobre el jugador actual
      Object.assign(this.player, resultado.changes);
      }
    });
  }

  async borrarJugador(): Promise<void> {
    const confirmDelete = confirm(`¿Seguro que quieres borrar a "${this.player.nombre}"?`);
    if (!confirmDelete) return;

    try {
      const playerRef = doc(this.firestore, `players/${this.player.id}`);
      await deleteDoc(playerRef);

      alert('Jugador borrado correctamente.');
      this.dialogRef.close(true); // Cierra el diálogo y notifica al padre
    } catch (error) {
      console.error('Error al borrar jugador:', error);
      alert('No se pudo borrar el jugador.');
    }
  }
}
