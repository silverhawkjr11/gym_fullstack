import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Plan } from '../../models/plan.model';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-plan-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Workout Plan' : 'Add New Workout Plan' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="planForm" class="plan-form">
        <mat-form-field appearance="outline">
          <mat-label>Trainee</mat-label>
          <mat-select formControlName="trainee_id" required>
            @for (member of members; track member.id) {
              <mat-option [value]="member.user">{{ member.username }} - {{ member.email }}</mat-option>
            }
          </mat-select>
          @if (planForm.get('trainee_id')?.hasError('required') && planForm.get('trainee_id')?.touched) {
            <mat-error>Trainee is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" placeholder="e.g., Upper Body Strength" required>
          @if (planForm.get('description')?.hasError('required') && planForm.get('description')?.touched) {
            <mat-error>Description is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Workout Days</mat-label>
          <input matInput formControlName="days" placeholder="e.g., Monday,Wednesday,Friday" required>
          @if (planForm.get('days')?.hasError('required') && planForm.get('days')?.touched) {
            <mat-error>Days are required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Machine IDs (comma-separated)</mat-label>
          <input matInput formControlName="machines" placeholder="e.g., 1,2,3" required>
          @if (planForm.get('machines')?.hasError('required') && planForm.get('machines')?.touched) {
            <mat-error>Machines are required</mat-error>
          }
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Sets</mat-label>
            <input matInput type="number" formControlName="sets" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Reps</mat-label>
            <input matInput type="number" formControlName="reps" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Duration (minutes)</mat-label>
            <input matInput type="number" formControlName="duration_minutes">
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!planForm.valid">
        {{ data ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .plan-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 500px;
      padding: 20px 0;
    }

    mat-form-field {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
  `]
})
export class PlanDialogComponent implements OnInit {
  planForm: FormGroup;
  members: Member[] = [];

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private dialogRef: MatDialogRef<PlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Plan | null
  ) {
    this.planForm = this.fb.group({
      trainee_id: [data?.trainee?.id || '', Validators.required],
      description: [data?.description || '', Validators.required],
      days: [data?.days || '', Validators.required],
      machines: [data?.machines || '', Validators.required],
      sets: [data?.sets || 3, [Validators.required, Validators.min(1)]],
      reps: [data?.reps || 15, [Validators.required, Validators.min(1)]],
      duration_minutes: [data?.duration_minutes || null]
    });
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (members) => this.members = members,
      error: (err) => console.error('Error loading members:', err)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.planForm.valid) {
      this.dialogRef.close(this.planForm.value);
    }
  }
}
