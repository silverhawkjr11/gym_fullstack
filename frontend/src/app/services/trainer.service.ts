import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trainer, TrainerRequest, TrainerCreateRequest } from '../models/trainer.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) {}

  getTrainers(): Observable<Trainer[]> {
    return this.http.get<PaginatedResponse<Trainer>>(`${this.apiUrl}/trainers/`)
      .pipe(map(response => response.results));
  }

  getTrainer(id: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.apiUrl}/trainers/${id}/`);
  }

  createTrainer(trainer: TrainerCreateRequest): Observable<Trainer> {
    return this.http.post<Trainer>(`${this.apiUrl}/trainers/`, trainer);
  }

  updateTrainer(id: number, trainer: Partial<TrainerRequest>): Observable<Trainer> {
    return this.http.patch<Trainer>(`${this.apiUrl}/trainers/${id}/`, trainer);
  }

  deleteTrainer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/trainers/${id}/`);
  }
}
