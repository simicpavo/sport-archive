import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateSportDto,
  Sport,
  SportsResponse,
  UpdateSportDto,
} from '../shared/interfaces/sport.interface';

@Injectable({
  providedIn: 'root',
})
export class SportsService {
  private readonly apiUrl = '/sports';
  private readonly http = inject(HttpClient);

  getSports(): Observable<SportsResponse> {
    return this.http.get<Sport[]>(this.apiUrl).pipe(
      map((sports: Sport[]) => ({
        data: sports,
        meta: {
          total: sports.length,
          page: 1,
          totalPages: 1,
          take: sports.length,
        },
      })),
    );
  }

  getSportById(id: string): Observable<Sport> {
    return this.http.get<Sport>(`${this.apiUrl}/${id}`);
  }

  createSport(sport: CreateSportDto): Observable<Sport> {
    return this.http.post<Sport>(this.apiUrl, sport);
  }

  updateSport(id: string, sport: UpdateSportDto): Observable<Sport> {
    return this.http.patch<Sport>(`${this.apiUrl}/${id}`, sport);
  }

  deleteSport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
