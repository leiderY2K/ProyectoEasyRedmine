import { Component, Input, Output, EventEmitter, OnInit, inject, DestroyRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImputacionesService } from '../../../../core/services/ImputacionesService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-imputation-row',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './imputation-row.html',
  styleUrl: './imputation-row.scss',
})
export class ImputationRow implements OnInit {
  @Input({ required: true }) rowForm!: FormGroup;
  @Input() issues: { id: number; tracker: string; subject: string }[] = [];
  @Output() removeRow = new EventEmitter<void>();

  filteredActivities: { id: number; name: string }[] = [];

  private service = inject(ImputacionesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.rowForm.get('issue')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(issueId => {
        const selectedIssue = this.issues.find(i => i.id === issueId);
        if (!selectedIssue) {
          this.filteredActivities = [];
          return;
        }

        this.service.obtenerActividades(selectedIssue.tracker).subscribe({
          next: (data) => {
            this.filteredActivities = data;
            this.rowForm.get('activityId')?.setValue(null);
          },
          error: (err) => console.error(err)
        });
        
      });
  }
}