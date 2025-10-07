import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NationalTeam, NationalTeamResponse } from '../shared/interfaces/national-team.interface';

@Injectable({ providedIn: 'root' })
export class NationalTeamsService {
  private readonly apiUrl = 'http://localhost:3000/national-teams';
  private readonly http = inject(HttpClient);

  getNationalTeams(): Observable<NationalTeamResponse> {
    return this.http.get<NationalTeam[]>(this.apiUrl).pipe(
      map((nationalTeams: NationalTeam[]) => ({
        data: nationalTeams,
        meta: {
          total: nationalTeams.length,
          page: 1,
          totalPages: 1,
          take: nationalTeams.length,
        },
      })),
    );
  }

  getNationalTeamById(id: string): Observable<NationalTeam> {
    return this.http.get<NationalTeam>(`${this.apiUrl}/${id}`);
  }

  createNationalTeam(nationalTeam: { name: string; sportId: string }): Observable<NationalTeam> {
    return this.http.post<NationalTeam>(this.apiUrl, nationalTeam);
  }

  updateNationalTeam(
    id: string,
    nationalTeam: { name?: string; sportId?: string },
  ): Observable<NationalTeam> {
    return this.http.patch<NationalTeam>(`${this.apiUrl}/${id}`, nationalTeam);
  }

  deleteNationalTeam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
