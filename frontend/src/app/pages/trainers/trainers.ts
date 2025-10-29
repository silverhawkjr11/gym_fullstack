import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../models/trainer.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TrainerDialogComponent } from './trainer-dialog';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './trainers.html',
  styleUrl: './trainers.scss'
})
export class TrainersComponent implements OnInit {
  trainers: Trainer[] = [];
  displayedColumns: string[] = ['username', 'specialization', 'experience', 'available'];

  constructor(private trainerService: TrainerService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.trainerService.getTrainers().subscribe({
      next: (trainers) => this.trainers = trainers,
      error: (err) => console.error('Error loading trainers:', err)
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TrainerDialogComponent, {
      width: '600px',
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
