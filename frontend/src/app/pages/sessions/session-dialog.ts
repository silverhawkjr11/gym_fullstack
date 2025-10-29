import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TrainingSession } from '../../models/session.model';
import { MemberService } from '../../services/member.service';
import { TrainerService } from '../../services/trainer.service';
import { Member } from '../../models/member.model';
import { Trainer } from '../../models/trainer.model';

@Component({
  selector: 'app-session-dialog',
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
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Training Session' : 'Register New Training Session' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="sessionForm" class="session-form">
        <mat-form-field appearance="outline">
          <mat-label>Trainer</mat-label>
          <mat-select formControlName="trainer" required>
            @for (trainer of trainers; track trainer.id) {
              <mat-option [value]="trainer.id">{{ trainer.username }} - {{ trainer.specialization }}</mat-option>
            }
          </mat-select>
          @if (sessionForm.get('trainer')?.hasError('required') && sessionForm.get('trainer')?.touched) {
            <mat-error>Trainer is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Member</mat-label>
          <mat-select formControlName="member" required>
            @for (member of members; track member.id) {
              <mat-option [value]="member.id">{{ member.username }} - {{ member.email }}</mat-option>
            }
          </mat-select>
          @if (sessionForm.get('member')?.hasError('required') && sessionForm.get('member')?.touched) {
            <mat-error>Member is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Session Type</mat-label>
          <mat-select formControlName="session_type" required>
            <mat-option value="personal">Personal</mat-option>
            <mat-option value="group">Group</mat-option>
            <mat-option value="class">Class</mat-option>
          </mat-select>
          @if (sessionForm.get('session_type')?.hasError('required') && sessionForm.get('session_type')?.touched) {
            <mat-error>Session type is required</mat-error>
          }
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" required>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            @if (sessionForm.get('date')?.hasError('required') && sessionForm.get('date')?.touched) {
              <mat-error>Date is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Time</mat-label>
            <input matInput type="time" formControlName="time" required>
            @if (sessionForm.get('time')?.hasError('required') && sessionForm.get('time')?.touched) {
              <mat-error>Time is required</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Duration (minutes)</mat-label>
            <input matInput type="number" formControlName="duration_minutes" required>
            @if (sessionForm.get('duration_minutes')?.hasError('required') && sessionForm.get('duration_minutes')?.touched) {
              <mat-error>Duration is required</mat-error>
            }
            @if (sessionForm.get('duration_minutes')?.hasError('min')) {
              <mat-error>Duration must be at least 1 minute</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Price ($)</mat-label>
            <input matInput type="number" formControlName="price" required>
            @if (sessionForm.get('price')?.hasError('required') && sessionForm.get('price')?.touched) {
              <mat-error>Price is required</mat-error>
            }
            @if (sessionForm.get('price')?.hasError('min')) {
              <mat-error>Price must be positive</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="scheduled">Scheduled</mat-option>
            <mat-option value="completed">Completed</mat-option>
            <mat-option value="cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="3" placeholder="Optional session notes"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!sessionForm.valid">
        {{ data ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .session-form {
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
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  `]
})
export class SessionDialogComponent implements OnInit {
  sessionForm: FormGroup;
  members: Member[] = [];
  trainers: Trainer[] = [];

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private trainerService: TrainerService,
    private dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainingSession | null
  ) {
    // Parse existing date if editing
    let date = new Date();
    let time = '09:00';

    if (data?.scheduled_date) {
      const scheduledDate = new Date(data.scheduled_date);
      date = scheduledDate;
      time = scheduledDate.toTimeString().substring(0, 5);
    }

    this.sessionForm = this.fb.group({
      trainer: [data?.trainer || '', Validators.required],
      member: [data?.member || '', Validators.required],
      session_type: [data?.session_type || 'personal', Validators.required],
      date: [date, Validators.required],
      time: [time, Validators.required],
      duration_minutes: [data?.duration_minutes || 60, [Validators.required, Validators.min(1)]],
      status: [data?.status || 'scheduled', Validators.required],
      notes: [data?.notes || ''],
      price: [data?.price ? parseFloat(data.price) : 50, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadMembers();
    this.loadTrainers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (members) => this.members = members,
      error: (err) => console.error('Error loading members:', err)
    });
  }

  loadTrainers() {
    this.trainerService.getTrainers().subscribe({
      next: (trainers) => this.trainers = trainers,
      error: (err) => console.error('Error loading trainers:', err)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.sessionForm.valid) {
      const formValue = this.sessionForm.value;

      // Combine date and time into ISO string
      const date = new Date(formValue.date);
      const [hours, minutes] = formValue.time.split(':');
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const sessionData = {
        trainer: formValue.trainer,
        member: formValue.member,
        session_type: formValue.session_type,
        scheduled_date: date.toISOString(),
        duration_minutes: formValue.duration_minutes,
        status: formValue.status,
        notes: formValue.notes,
        price: formValue.price.toString()
      };

      this.dialogRef.close(sessionData);
    }
  }
}
