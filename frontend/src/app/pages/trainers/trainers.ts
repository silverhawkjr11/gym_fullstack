import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../models/trainer.model';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './trainers.html',
  styleUrl: './trainers.scss'
})
export class TrainersComponent implements OnInit {
  trainers: Trainer[] = [];
  displayedColumns: string[] = ['username', 'specialization', 'experience', 'available'];

  constructor(private trainerService: TrainerService) {}

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.trainerService.getTrainers().subscribe({
      next: (trainers) => this.trainers = trainers,
      error: (err) => console.error('Error loading trainers:', err)
    });
  }
}
