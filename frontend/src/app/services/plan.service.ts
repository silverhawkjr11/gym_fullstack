import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plan, PlanRequest } from '../models/plan.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://localhost:8000/api/training';

  constructor(private http: HttpClient) {}

  getPlans(traineeId?: number): Observable<Plan[]> {
    const url = traineeId
      ? `${this.apiUrl}/plans/?trainee_id=${traineeId}`
      : `${this.apiUrl}/plans/`;
    return this.http.get<PaginatedResponse<Plan>>(url)
      .pipe(map(response => response.results));
  }

  getPlan(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/plans/${id}/`);
  }

  createPlan(plan: PlanRequest): Observable<Plan> {
    return this.http.post<Plan>(`${this.apiUrl}/plans/`, plan);
  }

  updatePlan(id: number, plan: Partial<PlanRequest>): Observable<Plan> {
    return this.http.patch<Plan>(`${this.apiUrl}/plans/${id}/`, plan);
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/plans/${id}/`);
  }
}
