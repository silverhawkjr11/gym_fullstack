import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MachineService } from '../../services/machine.service';
import { Machine } from '../../models/machine.model';
import { MachineDialogComponent } from './machine-dialog';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './machines.html',
  styleUrl: './machines.scss'
})
export class MachinesComponent implements OnInit {
  machines: Machine[] = [];
  displayedColumns: string[] = ['code', 'name', 'description', 'actions'];

  constructor(
    private machineService: MachineService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadMachines();
  }

  loadMachines() {
    this.machineService.getMachines().subscribe({
      next: (machines) => this.machines = machines,
      error: (err) => console.error('Error loading machines:', err)
    });
  }

  openDialog(machine?: Machine) {
    const dialogRef = this.dialog.open(MachineDialogComponent, {
      width: '500px',
      data: machine || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (machine) {
          // Update existing machine
          this.machineService.updateMachine(machine.id, result).subscribe({
            next: () => this.loadMachines(),
            error: (err) => console.error('Error updating machine:', err)
          });
        } else {
          // Create new machine
          this.machineService.createMachine(result).subscribe({
            next: () => this.loadMachines(),
            error: (err) => console.error('Error creating machine:', err)
          });
        }
      }
    });
  }

  deleteMachine(id: number) {
    if (confirm('Are you sure you want to delete this machine?')) {
      this.machineService.deleteMachine(id).subscribe({
        next: () => this.loadMachines(),
        error: (err) => console.error('Error deleting machine:', err)
      });
    }
  }
}
