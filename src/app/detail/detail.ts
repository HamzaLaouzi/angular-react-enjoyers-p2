// src/app/detail/detail.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Player } from '../models/player.model';
import { MatIconModule } from '@angular/material/icon';
import { MediaComponent } from '../media/media';
import { NgIf, CommonModule } from '@angular/common'; 
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlayerService } from '../services/player.service'; 

@Component({
  selector: 'app-detail',
  templateUrl: './detail.html',
  styleUrls: ['./detail.css'],
  standalone: true,
  imports: [MatIconModule, MediaComponent, NgIf, ReactiveFormsModule, CommonModule]
})
export class DetailComponent implements OnInit {
  
  public player: Player;
  
  isEditing: boolean = false;
  editForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Player,
    private fb: FormBuilder,
    private playerService: PlayerService
  ) {
    this.player = data;
  }
  
  ngOnInit(): void {
      this.initForm();
      // Si estamos en modo creación (ID es 0 o undefined), iniciamos en edición.
      if (!this.player.id || this.player.id === 0) {
          this.startEdit();
      }
  }

  // Inicializa el formulario con todos los campos y validaciones
  initForm(): void {
    this.editForm = this.fb.group({
      nombre: [this.player.nombre, Validators.required],
      apellidos: [this.player.apellidos, Validators.required],
      posicion: [this.player.posicion, Validators.required],
      edad: [this.player.edad, [Validators.required, Validators.min(1)]],
      altura: [this.player.altura, Validators.required],
      // Unimos el array de multimedia en un string con saltos de línea para el textarea
      multimedia: [this.player.multimedia?.join('\n') || ''], 
      youtubeId: [this.player.youtubeId],
      info: [this.player.info, Validators.required]
    });
  }

  // --- Lógica de Acciones ---

  startEdit(): void {
    this.isEditing = true;
    this.editForm.reset({
        ...this.player, 
        // Aseguramos que el multimedia en el formulario sea el string unido
        multimedia: this.player.multimedia?.join('\n') || '' 
    }); 
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.reset({
        ...this.player, 
        multimedia: this.player.multimedia?.join('\n') || ''
    }); 
  }

  // Función auxiliar para manejar errores y mostrar el mensaje completo
  private handleError(error: any): void {
      console.error("Error de Firebase:", error);
      // Muestra el error en una alerta para que puedas verlo
      alert(`❌ Error: Falló la operación en la base de datos. Mensaje detallado: ${error.message || 'Desconocido'}`);
      this.dialogRef.close();
  }

  // Guarda los cambios llamando al servicio de actualización/creación
  async saveChanges(): Promise<void> {
    this.editForm.markAllAsTouched();
    
    if (!this.editForm.valid) {
         return alert('Por favor, rellena todos los campos obligatorios correctamente.');
    }
    
    const formValues = this.editForm.value;
    
    // 🔑 PASO CLAVE: Reconstruir el objeto de datos que Firebase necesita
    const dataToSave: Omit<Player, 'id'> = {
        nombre: formValues.nombre,
        apellidos: formValues.apellidos,
        posicion: formValues.posicion,
        edad: formValues.edad,
        altura: formValues.altura,
        info: formValues.info,
        youtubeId: formValues.youtubeId,
        // Convertimos el string de multimedia de vuelta a string[]
        multimedia: formValues.multimedia.split('\n').filter((url: string) => url.trim() !== ''),
    };
    
    // 🔑 LÓGICA DE CREACIÓN VS. EDICIÓN
    if (this.player.id) {
        // MODO EDICIÓN: El jugador tiene ID
        // 🚨 Doble aserción para convertir el 'number' del modelo a 'string' (ID de Firestore)
        const firestoreId = this.player.id as unknown as string;
        
        try {
            await this.playerService.updatePlayer(firestoreId, dataToSave);
            this.player = { ...this.player, ...dataToSave } as Player;
            this.isEditing = false;
            this.dialogRef.close({ updated: true });
        } catch (error) {
            this.handleError(error);
        }
        
    } else {
        // MODO CREACIÓN: El jugador NO tiene ID (es nuevo)
        try {
            await this.playerService.createPlayer(dataToSave);
            this.dialogRef.close({ updated: true }); 
        } catch (error) {
            this.handleError(error);
        }
    }
  }

  // Elimina el jugador llamando al servicio
  deletePlayer(): void {
    if (!this.player.id) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar a ${this.player.nombre} ${this.player.apellidos}? Esta acción es permanente.`)) {
      
      // 🚨 Doble aserción para convertir el 'number' a 'string'
      const firestoreId = this.player.id as unknown as string;

      this.playerService.deletePlayer(firestoreId)
        .then(() => {
          this.dialogRef.close({ deleted: true }); 
        })
        .catch(this.handleError);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}