import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MemberDialogComponent } from './member-dialog';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './members.html',
  styleUrl: './members.scss'
})
export class MembersComponent implements OnInit, OnDestroy {
  members: Member[] = [];
  displayedColumns: string[] = ['username', 'email', 'membership_type', 'is_active'];
  isAdmin = false;
  private destroy$ = new Subject<void>();
  private currentUser: User | null = null;

  constructor(
    private memberService: MemberService,
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

    this.loadMembers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (members) => this.members = members,
      error: (err) => console.error('Error loading members:', err)
    });
  }

  openDialog(): void {
    if (!this.isAdmin) {
      console.warn('Only admins can create members.');
      return;
    }

    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '720px',
      maxWidth: '90vw',
      autoFocus: false,
      panelClass: 'wide-form-dialog',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberService.createMember(result).subscribe({
          next: () => this.loadMembers(),
          error: (err) => console.error('Error creating member:', err)
        });
      }
    });
  }
}
