import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SessionService } from '../../services/session.service';
import { TrainingSession } from '../../models/session.model';
import { SessionDialogComponent } from './session-dialog';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss'
})
export class SessionsComponent implements OnInit {
  sessions: TrainingSession[] = [];
  displayedColumns: string[] = ['trainer', 'member', 'type', 'date', 'duration', 'status', 'price', 'actions'];

  constructor(
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.sessionService.getSessions().subscribe({
      next: (sessions) => this.sessions = sessions,
      error: (err) => console.error('Error loading sessions:', err)
    });
  }

  openDialog(session?: TrainingSession) {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      width: '600px',
      data: session || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (session) {
          // Update existing session
          this.sessionService.updateSession(session.id, result).subscribe({
            next: () => this.loadSessions(),
            error: (err) => console.error('Error updating session:', err)
          });
        } else {
          // Create new session
          this.sessionService.createSession(result).subscribe({
            next: () => this.loadSessions(),
            error: (err) => console.error('Error creating session:', err)
          });
        }
      }
    });
  }

  deleteSession(id: number) {
    if (confirm('Are you sure you want to delete this training session?')) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => this.loadSessions(),
        error: (err) => console.error('Error deleting session:', err)
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'scheduled': return 'status-scheduled';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'personal': return 'type-personal';
      case 'group': return 'type-group';
      case 'class': return 'type-class';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
