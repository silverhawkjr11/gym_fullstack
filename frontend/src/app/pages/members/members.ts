import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MemberDialogComponent } from './member-dialog';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './members.html',
  styleUrl: './members.scss'
})
export class MembersComponent implements OnInit {
  members: Member[] = [];
  displayedColumns: string[] = ['username', 'email', 'membership_type', 'is_active'];

  constructor(private memberService: MemberService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (members) => this.members = members,
      error: (err) => console.error('Error loading members:', err)
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '600px',
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
