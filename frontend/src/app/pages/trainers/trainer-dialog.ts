import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-trainer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Trainer</h2>
    <mat-dialog-content>
      <form [formGroup]="trainerForm" class="trainer-form">
        <h3 class="section-title">User Information</h3>

        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" required>
          @if (trainerForm.get('username')?.hasError('required') && trainerForm.get('username')?.touched) {
            <mat-error>Username is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
          @if (trainerForm.get('email')?.hasError('required') && trainerForm.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (trainerForm.get('email')?.hasError('email')) {
            <mat-error>Invalid email format</mat-error>
          }
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="first_name">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="last_name">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required>
          @if (trainerForm.get('password')?.hasError('required') && trainerForm.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
          @if (trainerForm.get('password')?.hasError('minlength')) {
            <mat-error>Password must be at least 4 characters</mat-error>
          }
        </mat-form-field>

        <h3 class="section-title">Professional Information</h3>

        <mat-form-field appearance="outline">
          <mat-label>Specialization</mat-label>
          <input matInput formControlName="specialization" placeholder="e.g., Strength Training, Yoga, Cardio" required>
          @if (trainerForm.get('specialization')?.hasError('required') && trainerForm.get('specialization')?.touched) {
            <mat-error>Specialization is required</mat-error>
          }
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Experience (years)</mat-label>
            <input matInput type="number" formControlName="experience_years" required>
            @if (trainerForm.get('experience_years')?.hasError('required') && trainerForm.get('experience_years')?.touched) {
              <mat-error>Experience is required</mat-error>
            }
            @if (trainerForm.get('experience_years')?.hasError('min')) {
              <mat-error>Experience must be 0 or more</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Hourly Rate ($)</mat-label>
            <input matInput type="number" formControlName="hourly_rate" required>
            @if (trainerForm.get('hourly_rate')?.hasError('required') && trainerForm.get('hourly_rate')?.touched) {
              <mat-error>Hourly rate is required</mat-error>
            }
            @if (trainerForm.get('hourly_rate')?.hasError('min')) {
              <mat-error>Rate must be 0 or more</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Bio</mat-label>
          <textarea matInput formControlName="bio" rows="3" placeholder="Brief professional bio"></textarea>
        </mat-form-field>

        <mat-checkbox formControlName="is_available">Available for Training</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!trainerForm.valid">
        Create Trainer
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .trainer-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 550px;
      padding: 20px 0;
    }

    mat-form-field {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .section-title {
      color: #cdd6f4;
      font-size: 1rem;
      font-weight: 600;
      margin: 8px 0 0 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #45475a;
    }

    mat-checkbox {
      margin-top: 8px;
    }
  `]
})
export class TrainerDialogComponent {
  trainerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TrainerDialogComponent>
  ) {
    this.trainerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      password: ['', [Validators.required, Validators.minLength(4)]],
      specialization: ['', Validators.required],
      experience_years: [0, [Validators.required, Validators.min(0)]],
      hourly_rate: [50, [Validators.required, Validators.min(0)]],
      bio: [''],
      is_available: [true]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.trainerForm.valid) {
      this.dialogRef.close(this.trainerForm.value);
    }
  }
}
