import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Machine, MachineRequest } from '../models/machine.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private apiUrl = 'http://localhost:8000/api/training';

  constructor(private http: HttpClient) {}

  getMachines(): Observable<Machine[]> {
    return this.http.get<PaginatedResponse<Machine>>(`${this.apiUrl}/machines/`)
      .pipe(map(response => response.results));
  }

  getMachine(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/machines/${id}/`);
  }

  createMachine(machine: MachineRequest): Observable<Machine> {
    return this.http.post<Machine>(`${this.apiUrl}/machines/`, machine);
  }

  updateMachine(id: number, machine: Partial<MachineRequest>): Observable<Machine> {
    return this.http.patch<Machine>(`${this.apiUrl}/machines/${id}/`, machine);
  }

  deleteMachine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/machines/${id}/`);
  }
}
