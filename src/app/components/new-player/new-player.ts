import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player-service';

@Component({
  selector: 'app-new-player',
  templateUrl: './new-player.html',
  styleUrls: ['./new-player.css'],
  imports: [ReactiveFormsModule],
})
export class NewPlayerComponent {
  playerForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewPlayerComponent>,
    private fb: FormBuilder,
    private playerService: PlayerService
  ) {
    this.playerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      posicion: ['', Validators.required],
      edad: [null, Validators.required],
      altura: [null, Validators.required],
      multimedia: [''],
      youtubeId: [''],
      info: ['']
    });
  }

  savePlayer() {
    if (this.playerForm.valid) {
      const formValue = this.playerForm.value;

      // Convertir multimedia de string a array
      if (formValue.multimedia) {
        formValue.multimedia = formValue.multimedia.split(',').map((url: string) => url.trim());
      } else {
        formValue.multimedia = [];
      }

      // Guardar en Firestore
      this.playerService.addPlayer(formValue).then(() => {
        this.dialogRef.close(true); // cerrar y devolver "true" para indicar que se agregó
      });
    }
  }
}
