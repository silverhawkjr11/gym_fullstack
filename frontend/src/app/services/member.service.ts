import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member, MemberRequest } from '../models/member.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http.get<PaginatedResponse<Member>>(`${this.apiUrl}/members/`)
      .pipe(map(response => response.results));
  }

  getMember(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/members/${id}/`);
  }

  createMember(member: MemberRequest): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/members/`, member);
  }

  updateMember(id: number, member: Partial<MemberRequest>): Observable<Member> {
    return this.http.patch<Member>(`${this.apiUrl}/members/${id}/`, member);
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/members/${id}/`);
  }
}
