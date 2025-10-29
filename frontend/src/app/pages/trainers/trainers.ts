import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../models/trainer.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TrainerDialogComponent } from './trainer-dialog';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './trainers.html',
  styleUrl: './trainers.scss'
})
export class TrainersComponent implements OnInit, OnDestroy {
  trainers: Trainer[] = [];
  displayedColumns: string[] = ['username', 'specialization', 'experience', 'available'];
  isAdmin = false;
  private destroy$ = new Subject<void>();
  private currentUser: User | null = null;

  constructor(
    private trainerService: TrainerService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        const role = (user?.role ?? '').toLowerCase();
        this.isAdmin = role === 'admin';
      });

    this.loadTrainers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTrainers() {
    this.trainerService.getTrainers().subscribe({
      next: (trainers) => this.trainers = trainers,
      error: (err) => console.error('Error loading trainers:', err)
    });
  }

  openDialog(): void {
    if (!this.isAdmin) {
      console.warn('Only admins can create trainers.');
      return;
    }

    const dialogRef = this.dialog.open(TrainerDialogComponent, {
      width: '720px',
      maxWidth: '90vw',
      autoFocus: false,
      panelClass: 'wide-form-dialog',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainerService.createTrainer(result).subscribe({
          next: () => this.loadTrainers(),
          error: (err) => console.error('Error creating trainer:', err)
        });
      }
    });
  }
}
