import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

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

  recentMembers: any[] = [];
  upcomingClasses: any[] = [];

  ngOnInit() {
    // Mock data - will be replaced with API calls
    this.totalMembers = 142;
    this.totalTrainers = 12;
    this.totalClasses = 8;
    this.todayAttendance = 87;

    this.recentMembers = [
      { id: 1, name: 'John Doe', joinDate: new Date('2025-01-15') },
      { id: 2, name: 'Jane Smith', joinDate: new Date('2025-01-14') },
      { id: 3, name: 'Mike Johnson', joinDate: new Date('2025-01-13') }
    ];

    this.upcomingClasses = [
      { id: 1, name: 'Yoga Flow', time: '10:00 AM', trainer: 'Sarah Wilson' },
      { id: 2, name: 'CrossFit', time: '11:30 AM', trainer: 'Mike Brown' },
      { id: 3, name: 'Pilates', time: '2:00 PM', trainer: 'Emma Davis' }
    ];
  }
}
