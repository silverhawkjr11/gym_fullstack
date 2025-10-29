import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlanService } from '../../services/plan.service';
import { Plan } from '../../models/plan.model';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './plans.html',
  styleUrl: './plans.scss'
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  displayedColumns: string[] = ['trainee', 'description', 'days', 'sets_reps', 'actions'];

  constructor(private planService: PlanService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.planService.getPlans().subscribe({
      next: (plans) => this.plans = plans,
      error: (err) => console.error('Error loading plans:', err)
    });
  }

  deletePlan(id: number) {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.planService.deletePlan(id).subscribe({
        next: () => this.loadPlans(),
        error: (err) => console.error('Error deleting plan:', err)
      });
    }
  }
}
