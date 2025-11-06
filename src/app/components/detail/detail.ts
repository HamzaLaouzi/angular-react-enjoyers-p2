// detail.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Player, PlayerWithId } from '../../models/player.model';
import { MatIconModule } from '@angular/material/icon';
import { MediaComponent } from '../media/media';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerService } from '../../services/player-service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.html',
  styleUrls: ['./detail.css'],
  standalone: true,
  imports: [MatIconModule, MediaComponent, NgIf, ReactiveFormsModule]
})
export class DetailComponent {
  editMode = false;
  form: FormGroup;

  // espero que el data sea PlayerWithId (incluye id)
  constructor(
    public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public player: PlayerWithId,
    private fb: FormBuilder,
    private playerService: PlayerService,
    private toastr: ToastrService
  ) {
    // inicializa el formulario con los datos actuales
    this.form = this.fb.group({
      nombre: [player?.nombre || '', Validators.required],
      apellidos: [player?.apellidos || ''],
      posicion: [player?.posicion || ''],
      edad: [player?.edad || null],
      altura: [player?.altura || null],
      info: [player?.info || ''],
      youtubeId: [player?.youtubeId || ''],
      multimedia0: [(player?.multimedia && player.multimedia[0]) || ''] // manejamos sólo la primera multimedia como ejemplo
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      // cuando entramos en edit aseguramos que el form tenga los valores actuales
      this.form.patchValue({
        nombre: this.player.nombre,
        apellidos: this.player.apellidos,
        posicion: this.player.posicion,
        edad: this.player.edad,
        altura: this.player.altura,
        info: this.player.info,
        youtubeId: this.player.youtubeId,
        multimedia0: this.player.multimedia?.[0] || ''
      });
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;

    // Construimos el objeto parcial para update
    const updatePayload: Partial<Player> = {
      nombre: values.nombre,
      apellidos: values.apellidos,
      posicion: values.posicion,
      edad: values.edad,
      altura: values.altura,
      info: values.info,
      youtubeId: values.youtubeId,
      multimedia: values.multimedia0 ? [values.multimedia0] : []
    };

    try {
      // Actualiza en Firestore
      await this.playerService.updatePlayer(this.player.id, updatePayload);

      // Refresca los datos locales (para que el template muestre lo nuevo)
      Object.assign(this.player, updatePayload);

      // Vuelve al modo vista
      this.editMode = false;

      // 👇 Si el componente Media usa youtubeId, hay que forzar su recarga opcionalmente:
      // Esto se hace reasignando el id para que Angular detecte el cambio
      this.player.youtubeId = updatePayload.youtubeId ?? this.player.youtubeId;

      this.toastr.warning('Jugador actualizado correctamente', 'Actualización');

    } catch (error) {
      console.error('Error actualizando jugador', error);
      // this.toastr.error('No se pudo actualizar el jugador', 'Error');
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.form.reset({
      nombre: this.player.nombre,
      apellidos: this.player.apellidos,
      posicion: this.player.posicion,
      edad: this.player.edad,
      altura: this.player.altura,
      info: this.player.info,
      youtubeId: this.player.youtubeId,
      multimedia0: this.player.multimedia?.[0] || ''
    });
  }
}
