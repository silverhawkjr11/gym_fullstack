import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { TrainerService } from '../../services/trainer.service';
import { SessionService } from '../../services/session.service';
import { Member } from '../../models/member.model';
import { Trainer } from '../../models/trainer.model';
import { TrainingSession } from '../../models/session.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  totalMembers = 0;
  totalTrainers = 0;
  totalClasses = 0;
  todayAttendance = 0;

  recentMembers: Member[] = [];
  upcomingSessions: TrainingSession[] = [];
  currentUser: any;

  constructor(
    private authService: AuthService,
    private memberService: MemberService,
    private trainerService: TrainerService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData() {
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.totalMembers = members.length;
        this.recentMembers = members.slice(0, 5);
      },
      error: (err) => console.error('Error loading members:', err)
    });

    this.trainerService.getTrainers().subscribe({
      next: (trainers) => {
        this.totalTrainers = trainers.length;
      },
      error: (err) => console.error('Error loading trainers:', err)
    });

    this.sessionService.getSessions().subscribe({
      next: (sessions) => {
        this.totalClasses = sessions.length;
        const today = new Date().toISOString().split('T')[0];
        this.todayAttendance = sessions.filter(s => 
          s.scheduled_date.startsWith(today) && s.status === 'completed'
        ).length;
        this.upcomingSessions = sessions
          .filter(s => s.status === 'scheduled')
          .slice(0, 5);
      },
      error: (err) => console.error('Error loading sessions:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
