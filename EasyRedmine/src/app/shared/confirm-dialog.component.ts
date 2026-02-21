import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
        <h2 mat-dialog-title>Confirmar</h2>
        <mat-dialog-content>{{ data.mensaje }}</mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button (click)="dialogRef.close(false)">No</button>
            <button mat-raised-button color="primary" (click)="dialogRef.close(true)">Sí</button>
        </mat-dialog-actions>
    `
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
    ) { }
}