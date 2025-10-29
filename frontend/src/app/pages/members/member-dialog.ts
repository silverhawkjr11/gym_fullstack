import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Member</h2>
    <mat-dialog-content>
      <form [formGroup]="memberForm" class="member-form">
        <h3 class="section-title">User Information</h3>

        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" required>
          @if (memberForm.get('username')?.hasError('required') && memberForm.get('username')?.touched) {
            <mat-error>Username is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
          @if (memberForm.get('email')?.hasError('required') && memberForm.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (memberForm.get('email')?.hasError('email')) {
            <mat-error>Invalid email format</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="first_name">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="last_name">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-span">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required>
          @if (memberForm.get('password')?.hasError('required') && memberForm.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
          @if (memberForm.get('password')?.hasError('minlength')) {
            <mat-error>Password must be at least 4 characters</mat-error>
          }
        </mat-form-field>

        <h3 class="section-title">Membership Details</h3>

        <mat-form-field appearance="outline" class="full-span">
          <mat-label>Membership Type</mat-label>
          <mat-select formControlName="membership_type" required>
            <mat-option value="basic">Basic</mat-option>
            <mat-option value="premium">Premium</mat-option>
            <mat-option value="vip">VIP</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="startPicker" formControlName="membership_start_date" required>
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
          @if (memberForm.get('membership_start_date')?.hasError('required') && memberForm.get('membership_start_date')?.touched) {
            <mat-error>Start date is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="endPicker" formControlName="membership_end_date" required>
          <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
          @if (memberForm.get('membership_end_date')?.hasError('required') && memberForm.get('membership_end_date')?.touched) {
            <mat-error>End date is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-span">
          <mat-label>Emergency Contact</mat-label>
          <input matInput formControlName="emergency_contact" placeholder="Phone number or name">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-span">
          <mat-label>Medical Conditions</mat-label>
          <textarea matInput formControlName="medical_conditions" rows="3" placeholder="Any medical conditions or notes"></textarea>
        </mat-form-field>

        <mat-checkbox formControlName="is_active" class="full-span">Active Member</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!memberForm.valid">
        Create Member
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      color: #cdd6f4;
    }

    h2[mat-dialog-title] {
      color: #cdd6f4;
      margin-bottom: 12px;
    }

    mat-dialog-content {
      padding: 0 0 12px;
      max-height: none;
      overflow: visible;
    }

    .member-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      width: min(720px, 100%);
      padding: 0 24px 12px;
    }

    mat-form-field {
      width: 100%;
    }

    .section-title {
      grid-column: 1 / -1;
      color: #cdd6f4;
      font-size: 1rem;
      font-weight: 600;
      margin: 16px 0 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #45475a;
    }

    .full-span {
      grid-column: 1 / -1;
    }

    mat-checkbox {
      margin-top: 8px;
      grid-column: 1 / -1;
      justify-self: flex-start;
    }

    mat-dialog-actions {
      padding: 16px 24px 0;
      margin: 0;
      border-top: 1px solid #45475a;
    }

    @media (max-width: 720px) {
      .member-form {
        padding: 0 16px 12px;
      }
    }

    @media (max-width: 600px) {
      .member-form {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MemberDialogComponent {
  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberDialogComponent>
  ) {
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    this.memberForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      password: ['', [Validators.required, Validators.minLength(4)]],
      membership_type: ['basic', Validators.required],
      membership_start_date: [today, Validators.required],
      membership_end_date: [oneYearLater, Validators.required],
      emergency_contact: [''],
      medical_conditions: [''],
      is_active: [true]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;

      // Format dates as YYYY-MM-DD
      const startDate = new Date(formValue.membership_start_date);
      const endDate = new Date(formValue.membership_end_date);

      const memberData = {
        ...formValue,
        membership_start_date: startDate.toISOString().split('T')[0],
        membership_end_date: endDate.toISOString().split('T')[0]
      };

      this.dialogRef.close(memberData);
    }
  }
}
