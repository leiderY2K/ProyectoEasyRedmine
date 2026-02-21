import { Component, inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, NonNullableFormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImputationRow } from './features/imputaciones/components/imputation-row/imputation-row';
import { ImputacionesService } from './core/services/ImputacionesService';
import { forkJoin } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './shared/confirm-dialog.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        CommonModule,
        ImputationRow,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule
    ],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);
    private service = inject(ImputacionesService);
    formBuilder = inject(NonNullableFormBuilder);

    fechaControl = new FormControl(new Date());

    issues: { id: number; tracker: string; subject: string }[] = [];

    form = this.formBuilder.group({
        imputation: this.formBuilder.array<FormGroup>([])
    });

    ngOnInit(): void {
        forkJoin({
            misPeticiones: this.service.obtenerMisPeticiones(),
            generales: this.service.obtenerPeticionesGenerales()
        }).subscribe({
            next: ({ misPeticiones, generales }) => {
                const todas = [...misPeticiones, ...generales];
                // Elimina duplicados por id
                this.issues = todas.filter(
                    (issue, index, self) => self.findIndex(i => i.id === issue.id) === index
                );
            },
            error: (err) => console.error(err)
        });


    }

    private formatearFecha(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    get fechaImputacion(): string {
        const fecha = this.fechaControl.value;
        return fecha ? this.formatearFecha(fecha) : '';
    }

    get imputationArray(): FormArray {
        return this.form.get('imputation') as FormArray;
    }

    get totalTareas(): number {
        return this.imputationArray.length;
    }

    get totalHoras(): number {
        return this.imputationArray.controls.reduce((acc, control) => {
            const hours = parseFloat(control.get('hours')?.value) || 0;
            return acc + hours;
        }, 0);
    }

    addRow(): void {
        const newRow = this.formBuilder.group({
            imputationDate: [this.fechaImputacion],
            issue: [null],
            hours: [0],
            comment: [''],
            activityId: [null]
        });
        this.imputationArray.push(newRow);
    }

    removeRow(index: number): void {
        this.imputationArray.removeAt(index);
    }

    trackByIndex(index: number) {
        return index;
    }

    addRowsDefault(): void {
        const filasDefault = [
            { issueTracker: 'Tarea de gestión', comment: 'Daily', hours: 0.5, activityId: 26 },
            { issueTracker: 'Tarea no costeable', comment: 'Pausa activa Mañana', hours: 0.25, activityId: 242 },
            { issueTracker: 'Tarea no costeable', comment: 'Pausa activa Tarde', hours: 0.25, activityId: 242 }
        ];

        for (const fila of filasDefault) {
            // Busca la issue que coincida con el tracker
            const issue = this.issues.find(i => i.tracker === fila.issueTracker);

            const newRow = this.formBuilder.group({
                imputationDate: [this.fechaImputacion],
                issue: [issue?.id ?? null],
                hours: [fila.hours],
                comment: [fila.comment],
                activityId: [fila.activityId || 1]
            });

            this.imputationArray.push(newRow);

            setTimeout(() => {
                newRow.get('issue')?.setValue(issue?.id ?? null);
            });
        }
    }

    submit(): void {
        const filas = this.imputationArray.value as {
            imputationDate: string;
            issue: number;
            hours: number;
            comment: string;
            activityId: number;
        }[];

        const erroresValidacion: string[] = [];

        filas.forEach((fila, index) => {
            const erroresFila: string[] = [];
            if (!fila.issue) erroresFila.push('Petición no seleccionada');
            if (!fila.activityId) erroresFila.push('Actividad no puede estar en blanco');
            if (!fila.comment?.trim()) erroresFila.push('Comentario no puede estar en blanco');
            if (!fila.hours || fila.hours <= 0) erroresFila.push('Horas debe ser mayor a 0');

            if (erroresFila.length > 0) {
                erroresValidacion.push(`Fila ${index + 1}: ${erroresFila.join(', ')}`);
            }
        });

        if (erroresValidacion.length > 0) {
            this.snackBar.open(
                `${erroresValidacion.join(' | ')}`,
                'Cerrar',
                { duration: 8000, panelClass: 'snack-warning' }
            );
            return;
        }

        const payload: Record<number, { imputationDate: string; hours: number; comment: string; activityId: number }[]> = {};

        for (const fila of filas) {
            if (!payload[fila.issue]) {
                payload[fila.issue] = [];
            }
            payload[fila.issue].push({
                imputationDate: fila.imputationDate,
                hours: fila.hours,
                comment: fila.comment,
                activityId: fila.activityId
            });
        }

        console.log(payload);
        console.log(this.form.value);

        this.service.enviarImputaciones(payload).subscribe({
            next: (res: any) => {
                const data = res.resultados;
                if (data.success) {
                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                        width: '300px',
                        data: { mensaje: '¿Deseas limpiar las filas imputadas?' }
                    });

                    this.snackBar.open(
                        ` ${Object.keys(payload).length} imputaciones enviadas correctamente`,
                        'Cerrar',
                        { duration: 4000, panelClass: 'snack-success' }
                    );

                    dialogRef.afterClosed().subscribe(confirmo => {
                        if (confirmo) {
                            this.imputationArray.clear();
                        }
                    });
                } else {
                    this.snackBar.open(
                        `Error al enviar imputaciones: ${data.message || 'Error desconocido'}`,
                        'Cerrar',
                        { duration: 8000, panelClass: 'snack-error' }
                    );
                }
            }
        });
    }
    cleanRows(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: { mensaje: '¿Estás seguro de que deseas limpiar todas las filas? Esta acción no se puede deshacer.' }
        });

        dialogRef.afterClosed().subscribe(confirmo => {
            if (confirmo) {
                this.imputationArray.clear();
            }
        });
    }

}