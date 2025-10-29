import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trainer, TrainerRequest } from '../models/trainer.model';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) {}

  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${this.apiUrl}/trainers/`);
  }

  getTrainer(id: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.apiUrl}/trainers/${id}/`);
  }

  createTrainer(trainer: TrainerRequest): Observable<Trainer> {
    return this.http.post<Trainer>(`${this.apiUrl}/trainers/`, trainer);
  }

  updateTrainer(id: number, trainer: Partial<TrainerRequest>): Observable<Trainer> {
    return this.http.patch<Trainer>(`${this.apiUrl}/trainers/${id}/`, trainer);
  }

  deleteTrainer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/trainers/${id}/`);
  }
}
