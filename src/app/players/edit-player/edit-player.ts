import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayerService } from '../players.services';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-player.html',
  styleUrls: ['./edit-player.css']
})
export class EditPlayerComponent implements OnInit {
  player!: Player;
  playerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private dialogRef: MatDialogRef<EditPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // initialize form with empty values (optional validators)
    this.playerForm = this.fb.group({
      nombre: [''],
      apellidos: [''],
      posicion: [''],
      edad: [null],
      altura: [null],
      multimedia0: [''],
      youtubeId: [''],
      info: ['']
    });
  }

  ngOnInit(): void {
    // soporta data.jugador o data (por si lo abres con distintos nombres)
    this.player = this.data?.jugador ?? this.data?.player ?? this.data;

    if (this.player) {
      // patchValue con los valores actuales — pero dejamos los controles en blanco
      // si queremos mostrar los valores actuales como placeholders, usamos patchValue:
      this.playerForm.patchValue({
        nombre: this.player.nombre ?? '',
        apellidos: this.player.apellidos ?? '',
        posicion: this.player.posicion ?? '',
        edad: this.player.edad ?? null,
        altura: this.player.altura ?? null,
        multimedia0: (this.player.multimedia && this.player.multimedia[0]) ? this.player.multimedia[0] : '',
        youtubeId: this.player.youtubeId ?? '',
        info: this.player.info ?? ''
      });

      // Si prefieres que los inputs empiecen vacíos y el formulario solo incluya cambios,
      // comenta la línea anterior y los inputs estarán vacíos para que el usuario solo escriba lo que quiera cambiar.
    }
  }

  // Genera objeto 'cambios' conteniendo solo campos con valor no vacío / no nulo
  private buildChanges(): any {
    const values = this.playerForm.value;

    const cambios: any = {};

    // Si el usuario modificó/introdujo un valor, lo añadimos a 'cambios'.
    if (values.nombre !== '' && values.nombre != null && values.nombre !== this.player.nombre) cambios.nombre = values.nombre;
    if (values.apellidos !== '' && values.apellidos != null && values.apellidos !== this.player.apellidos) cambios.apellidos = values.apellidos;
    if (values.posicion !== '' && values.posicion != null && values.posicion !== this.player.posicion) cambios.posicion = values.posicion;
    if (values.edad !== null && values.edad !== '' && values.edad !== this.player.edad) cambios.edad = values.edad;
    if (values.altura !== null && values.altura !== '' && values.altura !== this.player.altura) cambios.altura = values.altura;
    if (values.multimedia0 !== '' && values.multimedia0 != null) cambios.multimedia = [values.multimedia0];
    if (values.youtubeId !== '' && values.youtubeId != null && values.youtubeId !== this.player.youtubeId) cambios.youtubeId = values.youtubeId;
    if (values.info !== '' && values.info != null && values.info !== this.player.info) cambios.info = values.info;

    return cambios;
  }

  async onSubmit() {
    if (!this.player || !this.player.id) {
      console.error('Jugador inválido o sin id.');
      return;
    }

    const cambios = this.buildChanges();

    // Si no hay cambios, cerramos sin llamar a Firestore
    if (Object.keys(cambios).length === 0) {
      this.dialogRef.close(null); // nada cambiado
      return;
    }

    try {
      await this.playerService.updatePlayer(this.player.id, cambios);
      // opcional: devolver los cambios o el jugador actualizado
      this.dialogRef.close({ updated: true, changes: cambios });
    } catch (err) {
      console.error('Error actualizando jugador:', err);
      // podrías mostrar alerta/Toast aquí
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
