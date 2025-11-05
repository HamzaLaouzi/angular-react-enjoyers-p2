// src/app/detail/detail.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Player } from '../models/player.model';
import { MatIconModule } from '@angular/material/icon';
import { MediaComponent } from '../media/media';
import { NgIf, CommonModule } from '@angular/common'; 
// 🔑 Importaciones cruciales de Forms y el Servicio
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlayerService } from '../services/player.service'; 

@Component({
  selector: 'app-detail',
  templateUrl: './detail.html',
  styleUrls: ['./detail.css'],
  standalone: true,
  // ReactiveFormsModule es necesario para [formGroup] y formControlName
  imports: [MatIconModule, MediaComponent, NgIf, ReactiveFormsModule, CommonModule]
})
export class DetailComponent implements OnInit {
  
  public player: Player;
  
  isEditing: boolean = false;
  editForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Player,
    private fb: FormBuilder, // Inyectamos FormBuilder
    private playerService: PlayerService // Inyectamos el servicio de Firebase
  ) {
    this.player = data;
  }
  
  ngOnInit(): void {
      this.initForm();
  }

  // Inicializa el formulario con todos los campos y validaciones
  initForm(): void {
    this.editForm = this.fb.group({
      nombre: [this.player.nombre, Validators.required],
      apellidos: [this.player.apellidos, Validators.required],
      posicion: [this.player.posicion, Validators.required],
      // Validación de edad: requerido y mínimo 1 año (para evitar error de min)
      edad: [this.player.edad, [Validators.required, Validators.min(1)]],
      altura: [this.player.altura, Validators.required],
      multimedia: [this.player.multimedia],
      youtubeId: [this.player.youtubeId],
      info: [this.player.info, Validators.required]
    });
  }

  // --- Lógica de Acciones ---

  startEdit(): void {
    this.isEditing = true;
    this.editForm.reset(this.player); 
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.reset(this.player); 
  }

  // Guarda los cambios llamando al servicio de actualización
  saveChanges(): void {
    this.editForm.markAllAsTouched();
    
    if (this.editForm.valid && this.player.id) {
        const updatedData = this.editForm.value as Partial<Player>;
        
        // 🚨 CORRECCIÓN: Usamos `this.player.id!` para afirmar que es un string (ID de Firebase)
        this.playerService.updatePlayer(this.player.id!, updatedData) 
            .then(() => {
                this.player = { ...this.player, ...updatedData } as Player;
                this.isEditing = false;
                
                this.dialogRef.close({ updated: true });
            })
            .catch((error: any) => {
                console.error("Error al actualizar el jugador:", error);
                alert("❌ Error: No se pudo actualizar el jugador.");
                this.dialogRef.close();
            });
    } else {
         alert('Por favor, rellena todos los campos obligatorios correctamente.');
    }
  }

  // Elimina el jugador llamando al servicio
  deletePlayer(): void {
    if (!this.player.id) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar a ${this.player.nombre} ${this.player.apellidos}? Esta acción es permanente.`)) {
      
      // 🚨 CORRECCIÓN: Usamos `this.player.id!` para afirmar que es un string (ID de Firebase)
      this.playerService.deletePlayer(this.player.id!)
        .then(() => {
          this.dialogRef.close({ deleted: true }); 
        })
        .catch((error: any) => {
          console.error("Error al eliminar el jugador:", error);
          alert("❌ Error: No se pudo eliminar al jugador.");
          this.dialogRef.close();
        });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}