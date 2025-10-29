import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlanService } from '../../services/plan.service';
import { Plan } from '../../models/plan.model';
import { PlanDialogComponent } from './plan-dialog';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './plans.html',
  styleUrl: './plans.scss'
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  displayedColumns: string[] = ['trainee', 'description', 'days', 'sets_reps', 'actions'];

  constructor(
    private planService: PlanService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.planService.getPlans().subscribe({
      next: (plans) => this.plans = plans,
      error: (err) => console.error('Error loading plans:', err)
    });
  }

  openDialog(plan?: Plan) {
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      width: '600px',
      data: plan || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (plan) {
          // Update existing plan
          this.planService.updatePlan(plan.id, result).subscribe({
            next: () => this.loadPlans(),
            error: (err) => console.error('Error updating plan:', err)
          });
        } else {
          // Create new plan
          this.planService.createPlan(result).subscribe({
            next: () => this.loadPlans(),
            error: (err) => console.error('Error creating plan:', err)
          });
        }
      }
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
