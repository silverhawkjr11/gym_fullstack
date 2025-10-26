import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingSession, SessionRequest } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:8001/api/training';

  constructor(private http: HttpClient) {}

  getSessions(): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/sessions/`);
  }

  getSession(id: number): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.apiUrl}/sessions/${id}/`);
  }

  createSession(session: SessionRequest): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(`${this.apiUrl}/sessions/`, session);
  }

  updateSession(id: number, session: Partial<SessionRequest>): Observable<TrainingSession> {
    return this.http.patch<TrainingSession>(`${this.apiUrl}/sessions/${id}/`, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${id}/`);
  }
}
