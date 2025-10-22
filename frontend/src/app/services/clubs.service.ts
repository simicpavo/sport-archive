import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Club, ClubResponse } from '../shared/interfaces/club.interface';

@Injectable({ providedIn: 'root' })
export class ClubsService {
  private readonly apiUrl = `${environment?.apiUrl}/clubs`;
  private readonly http = inject(HttpClient);

  getClubs(): Observable<ClubResponse> {
    return this.http.get<Club[]>(this.apiUrl).pipe(
      map((clubs: Club[]) => ({
        data: clubs,
        meta: {
          total: clubs.length,
          page: 1,
          totalPages: 1,
          take: clubs.length,
        },
      })),
    );
  }

  getClubById(id: string): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${id}`);
  }

  createClub(club: { name: string; sportId: string }): Observable<Club> {
    return this.http.post<Club>(this.apiUrl, club);
  }

  updateClub(id: string, club: { name?: string; sportId?: string }): Observable<Club> {
    return this.http.patch<Club>(`${this.apiUrl}/${id}`, club);
  }

  deleteClub(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
