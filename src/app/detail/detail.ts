import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Player } from '../models/player.model';
import { MatIconModule } from '@angular/material/icon';
import { MediaComponent } from '../media/media';
import { NgIf } from '@angular/common';
import { EditPlayerComponent } from '../players/edit-player/edit-player';

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
      if (resultado) {
        // si el editor devuelve algo (por ejemplo, cambios), actualizamos
        Object.assign(this.player, resultado);
      }
    });
  }
}
